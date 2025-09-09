from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np

app = FastAPI(title="FAISS Service (prototype)")

class UpsertReq(BaseModel):
    id: str
    vector: list

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/upsert")
async def upsert(req: UpsertReq):
    # Prototype: accept vectors and pretend to store them
    return {"status": "stored", "id": req.id}

@app.post("/query")
async def query(vec: list):
    # Prototype: return fake nearest ids
    rng = np.random.RandomState(int(sum(vec)) % 2**32)
    ids = [f"doc-{int(rng.randint(1,10000))}" for _ in range(5)]
    return {"results": ids}
