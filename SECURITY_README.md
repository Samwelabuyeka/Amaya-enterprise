Security & Operations notes

This document summarizes prototype integrations added by the developer assistant.

Vault
- The repository includes a minimal `vaultClient` wrapper at `src/lib/vault/vaultClient.ts`.
- Set `VAULT_ADDR` and `VAULT_TOKEN` in environment for Vault-backed secrets.
- For production use, prefer official HashiCorp Vault SDKs and secure authentication methods.

TPM
- `src/lib/security/tpm.ts` is a local stub to simulate attestation and key sealing.
- Use platform TPM libraries (tss2) and hardware attestation in production.

Signed CI
- A prototype GitHub Actions workflow `.github/workflows/signed-build.yml` signs build artifacts using a private key.
- The private key should be stored in GitHub Secrets (e.g., `BUILD_PRIVATE_KEY`) or, preferably, a KMS/HSM.

Forensic ledger
- The forensic ledger prototype stores per-ledger RSA keypairs in Firestore for simplicity; this is insecure and only for prototyping.
- In production, use a KMS/HSM and hardware-backed signing.

WARNING
- Many modules added here are prototypes or scaffolds and are NOT production-ready cryptographic implementations.
- Do not store private keys in Firestore in production.

If you want, I can:
- Integrate Vault with GitHub Actions for secret retrieval.
- Add KMS integration for signing (recommended) instead of storing keys in Firestore.
- Add CI verifications that validate artifact signatures during deployment.
