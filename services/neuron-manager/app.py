from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np

app = FastAPI(title="Neuron Manager (prototype)")

class WorkRequest(BaseModel):
    model: str
    input: str

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/infer")
async def infer(req: WorkRequest):
    # Prototype local inference orchestration. Replace with real model loading.
    # This returns a deterministic fake embedding for now.
    seed = sum(bytearray(req.input.encode('utf-8')))
    rng = np.random.RandomState(seed % 2**32)
    vec = rng.rand(256).tolist()
    return {"model": req.model, "embedding": vec}
