Neuron Manager (software neuron simulation)

Overview
--------
This microservice simulates a neuron/module manager. It is a development scaffold for:
- creating small adapter modules (tiny MLPs)
- loading a local HF-compatible model for generation
- performing simple operations like prune/regrow/self-distill

It is NOT a real biological neuron system or nanite cluster. It is a software analog you can extend.

Run locally (venv)
-------------------
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python neurons_service.py

Run with Docker
---------------
docker build -t neuron-manager .
docker run -p 8001:8001 -e HF_TOKEN=your_token -v ./models:/app/models neuron-manager

Endpoints
---------
- GET /health
- POST /load_model { model_name }
- POST /create_module { name, in_dim, hidden, out_dim }
- GET /list_modules
- POST /prune_module?module_id={id}
- POST /regrow_module?module_id={id}
- POST /self_distill [module_ids]
- POST /route { input_text, modules }
