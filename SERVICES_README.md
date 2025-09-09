This repository now includes prototype multi-service Docker scaffolding for local development.

Services:
- neuron-manager: FastAPI service that returns prototype embeddings and accepts inference requests.
- faiss: FastAPI service that accepts vector upserts and queries (prototype).

Running locally with Docker (GPU-capable):

Prerequisites:
- Docker Engine with NVIDIA Container Toolkit installed for GPU support.
- docker-compose v2+.

Start all services:

```sh
# On Windows PowerShell, ensure you use npm.cmd where needed and run with admin if required
docker compose up --build
```

Notes:
- The compose file includes device_requests for GPU. On systems without GPUs the services will still run on CPU but GPU features are disabled.
- These services are prototypes. Replace the model code in `services/neuron-manager/app.py` with your model loading code (transformers, vLLM, etc.) and adjust `requirements.txt` accordingly.
- For production, use orchestration (Kubernetes) with device plugins and GPU node pools, secure secrets via Vault/KMS, and enable mTLS between services.

*** End Patch
