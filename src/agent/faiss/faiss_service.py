from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import faiss
import numpy as np
import os
import pickle
from typing import List
from pathlib import Path

app = FastAPI(title='FAISS Service')
IDX_DIR = Path(os.environ.get('FAISS_DIR', './faiss'))
IDX_DIR.mkdir(parents=True, exist_ok=True)

INDEX_PATH = IDX_DIR / 'index.faiss'
META_PATH = IDX_DIR / 'meta.pkl'

INDEX = None
META = []

class IndexRequest(BaseModel):
    embeddings: List[List[float]]
    ids: List[str]

class SearchRequest(BaseModel):
    query: List[float]
    k: int = 10

def save_index():
    if INDEX is not None:
        faiss.write_index(INDEX, str(INDEX_PATH))
        with open(META_PATH, 'wb') as f:
            pickle.dump(META, f)

def load_index():
    global INDEX, META
    if INDEX_PATH.exists():
        INDEX = faiss.read_index(str(INDEX_PATH))
    if META_PATH.exists():
        with open(META_PATH, 'rb') as f:
            META = pickle.load(f)

@app.on_event('startup')
def startup():
    load_index()

@app.post('/index')
def index(req: IndexRequest):
    global INDEX, META
    arr = np.array(req.embeddings).astype('float32')
    n, d = arr.shape
    if INDEX is None:
        INDEX = faiss.IndexFlatL2(d)
    INDEX.add(arr)
    META.extend(req.ids)
    save_index()
    return {'ok': True, 'count': len(META)}

@app.post('/search')
def search(req: SearchRequest):
    if INDEX is None:
        raise HTTPException(status_code=400, detail='index empty')
    q = np.array([req.query]).astype('float32')
    D, I = INDEX.search(q, req.k)
    results = []
    for idx, dist in zip(I[0], D[0]):
        if idx < 0 or idx >= len(META):
            continue
        results.append({ 'id': META[idx], 'score': float(dist) })
    return {'results': results}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=int(os.environ.get('PORT', 8002)))
