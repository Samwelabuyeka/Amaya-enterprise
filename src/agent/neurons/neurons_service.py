"""
Neuron Manager microservice (FastAPI)

Features (software simulation):
- Load a local HF-compatible model for generation.
- Manage a small pool of adapter "modules" (simple MLPs) that can be created, listed, pruned, regrown.
- Expose endpoints for health, load_model, create_module, list_modules, prune_module, regrow_module, self_distill, and route (run input through model + modules).

Notes:
- This is a research/dev scaffold. It uses small models by default. For production, run on GPU-enabled host and use large models.
- You must supply a HuggingFace token if pulling private models.
"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import os
import torch
import torch.nn as nn
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
import uuid

app = FastAPI(title="Neuron Manager")

MODEL_DIR = os.environ.get('NEURON_MODEL_DIR', './models')
MODULE_DIR = os.environ.get('NEURON_MODULE_DIR', './modules')
os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(MODULE_DIR, exist_ok=True)

# In-memory registry for modules (also saved to disk)
MODULE_REGISTRY: Dict[str, Dict[str, Any]] = {}

# Simple module: tiny MLP adapter
class TinyAdapter(nn.Module):
    def __init__(self, in_dim=768, hidden=256, out_dim=768):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(in_dim, hidden),
            nn.ReLU(),
            nn.Linear(hidden, out_dim),
        )
    def forward(self, x):
        return self.net(x)

class LoadModelRequest(BaseModel):
    model_name: str

class CreateModuleRequest(BaseModel):
    name: str
    in_dim: int = 768
    hidden: int = 256
    out_dim: int = 768

class RouteRequest(BaseModel):
    input_text: str
    modules: List[str] = []

_GEN_PIPE = None

def save_module(mid: str, module: nn.Module):
    path = os.path.join(MODULE_DIR, f"{mid}.pt")
    torch.save(module.state_dict(), path)

def load_module(mid: str, in_dim=768, hidden=256, out_dim=768):
    path = os.path.join(MODULE_DIR, f"{mid}.pt")
    m = TinyAdapter(in_dim, hidden, out_dim)
    if os.path.exists(path):
        m.load_state_dict(torch.load(path, map_location='cpu'))
    return m

@app.get('/health')
def health():
    return {"ok": True}

@app.post('/load_model')
def load_model(req: LoadModelRequest):
    global _GEN_PIPE
    try:
        tok = os.environ.get('HF_TOKEN')
        # allow selecting a small default model if none provided
        model_name = req.model_name or 'gpt2'
        # load into models dir (transformers will cache)
        _GEN_PIPE = pipeline('text-generation', model=model_name, device=0 if torch.cuda.is_available() else -1, use_auth_token=tok)
        return {"ok": True, "model": model_name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/create_module')
def create_module(req: CreateModuleRequest):
    mid = str(uuid.uuid4())
    mod = TinyAdapter(req.in_dim, req.hidden, req.out_dim)
    save_module(mid, mod)
    MODULE_REGISTRY[mid] = {"id": mid, "name": req.name, "in_dim": req.in_dim, "hidden": req.hidden, "out_dim": req.out_dim}
    return {"ok": True, "module": MODULE_REGISTRY[mid]}

@app.get('/list_modules')
def list_modules():
    return {"modules": list(MODULE_REGISTRY.values())}

@app.post('/prune_module')
def prune_module(module_id: str):
    # simulated prune: reinitialize small fraction of weights to zero
    if module_id not in MODULE_REGISTRY:
        raise HTTPException(status_code=404, detail='module not found')
    m = load_module(module_id, MODULE_REGISTRY[module_id]['in_dim'], MODULE_REGISTRY[module_id]['hidden'], MODULE_REGISTRY[module_id]['out_dim'])
    with torch.no_grad():
        for p in m.parameters():
            mask = (torch.rand_like(p) > 0.8).float()
            p.mul_(mask)
    save_module(module_id, m)
    return {"ok": True, "module": MODULE_REGISTRY[module_id]}

@app.post('/regrow_module')
def regrow_module(module_id: str):
    # simulated regrow: reinitialize small random weights
    if module_id not in MODULE_REGISTRY:
        raise HTTPException(status_code=404, detail='module not found')
    m = load_module(module_id, MODULE_REGISTRY[module_id]['in_dim'], MODULE_REGISTRY[module_id]['hidden'], MODULE_REGISTRY[module_id]['out_dim'])
    with torch.no_grad():
        for p in m.parameters():
            p.add_(torch.randn_like(p) * 0.01)
    save_module(module_id, m)
    return {"ok": True, "module": MODULE_REGISTRY[module_id]}

@app.post('/self_distill')
def self_distill(module_ids: List[str]):
    # placeholder: in practice you'd run teacher->student distillation loop
    # here we just return acknowledgement
    return {"ok": True, "distilled": module_ids}

@app.post('/hebbian')
def hebbian_update(module_id: str, pre_activity: List[float], post_activity: List[float], lr: float = 0.01):
    """
    Simulate a Hebbian update for a module. This is a lightweight toy update that
    computes outer product of pre/post activities, scales by lr, and returns a trace object.
    """
    if module_id not in MODULE_REGISTRY:
        raise HTTPException(status_code=404, detail='module not found')
    # compute simple outer product magnitude and pretend to update weights
    strength = float(sum([abs(p * q) for p, q in zip(pre_activity, post_activity)]))
    delta = lr * strength
    trace = {
        'module_id': module_id,
        'pre_mean': float(sum(pre_activity) / max(1, len(pre_activity))),
        'post_mean': float(sum(post_activity) / max(1, len(post_activity))),
        'delta': delta,
        'timestamp': __import__('time').time(),
    }
    # persist module simulated state by touching the saved file (no real weight change here)
    path = os.path.join(MODULE_DIR, f"{module_id}.pt")
    if os.path.exists(path):
        try:
            # just update mtime to simulate change
            os.utime(path, None)
        except Exception:
            pass
    return {"ok": True, "trace": trace}

@app.post('/consolidate')
def consolidate(module_ids: List[str]):
    """
    Simulate consolidation: snapshot modules and return a summary. Intended to be called periodically.
    """
    snapshots = []
    for mid in module_ids:
        if mid in MODULE_REGISTRY:
            snapshots.append({"id": mid, "name": MODULE_REGISTRY[mid]['name']})
    return {"ok": True, "snapshots": snapshots, 'timestamp': __import__('time').time()}

@app.post('/route')
def route(req: RouteRequest):
    global _GEN_PIPE
    if _GEN_PIPE is None:
        raise HTTPException(status_code=500, detail='model not loaded')
    # generate seed text
    gen = _GEN_PIPE(req.input_text, max_length=200, do_sample=False)
    text = gen[0]['generated_text']
    # basic pipeline: for each module, load and apply a tiny transform on a sentence embedding
    # embedding is simulated via simple token counts for lightweight ops
    emb = torch.tensor([float(len(text))])
    # apply modules (if any)
    for mid in req.modules:
        if mid not in MODULE_REGISTRY:
            continue
        m = load_module(mid, MODULE_REGISTRY[mid]['in_dim'], MODULE_REGISTRY[mid]['hidden'], MODULE_REGISTRY[mid]['out_dim'])
        # adapt emb to expected dim (toy)
        try:
            out = m(emb.repeat(1, MODULE_REGISTRY[mid]['in_dim']).float())
            # ignore output for now, optionally use for re-ranking
        except Exception:
            pass
    return {"ok": True, "text": text}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=int(os.environ.get('PORT', 8001)))
