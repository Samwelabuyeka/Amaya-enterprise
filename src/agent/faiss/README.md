FAISS Vector Store Service

Run locally (venv):
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python faiss_service.py

Index: POST /index { embeddings: [[...]], ids: ['id1','id2'] }
Search: POST /search { query: [...], k: 10 }
