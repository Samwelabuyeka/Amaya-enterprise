Local development and running multi-service GPU-enabled stack

Windows PowerShell notes:
- PowerShell may block execution of scripts (npx.ps1/npm.ps1). Use the provided helper to run with a relaxed ExecutionPolicy for the session.

Quick start (Windows PowerShell):

```powershell
# Run dev helper which sets ExecutionPolicy for the session and starts dev server
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force; .\scripts\dev-windows.ps1

# Or run the docker-compose stack (requires Docker + NVIDIA Container Toolkit for GPU)
docker compose up --build
```

If `npx` is blocked, use `npx.cmd` or run from cmd.exe to avoid the PowerShell shim.

Docker GPU tips:
- Install NVIDIA drivers and the NVIDIA Container Toolkit: https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html
- Use `docker compose` with `device_requests` as in `docker-compose.yml` to allow GPU access.

Security notes:
- Never store private keys in repository or in cleartext GitHub Actions artifacts. Use a KMS (Google KMS, AWS KMS) or HashiCorp Vault for signing keys.
- The current CI signing workflow is a prototype and must be hardened before production use.
