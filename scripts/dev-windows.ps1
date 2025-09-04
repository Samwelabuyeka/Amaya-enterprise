<#
  scripts/dev-windows.ps1

  Safe dev runner for Windows PowerShell. It:
    - finds and switches to the project root (first package.json)
    - sets ExecutionPolicy for this session
    - installs npm dependencies via npm.cmd to avoid npm.ps1 blocking
    - runs optional scripts/replace-imports.js if present
    - starts the dev server using npm run dev

  Usage (from any folder):
    # If running inside PowerShell (recommended):
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force; .\scripts\dev-windows.ps1

    # Or run from cmd to avoid policy issues:
    powershell -ExecutionPolicy Bypass -File .\\scripts\\dev-windows.ps1
#>

try {
  # Resolve script directory and assume repo root is the script's parent folder
  $scriptPath = $MyInvocation.MyCommand.Path
  if (-not $scriptPath) { $scriptPath = $PSScriptRoot }
  $scriptDir = Split-Path -Path $scriptPath -Parent
  $repoRoot = Resolve-Path (Join-Path $scriptDir '..')
  Set-Location $repoRoot
  Write-Host "Running from repo root (resolved from script location):" (Get-Location).Path

  # ensure node npm shim is used to avoid npm.ps1 execution policy issues
  $npmCmd = Join-Path $env:ProgramFiles "nodejs\npm.cmd"
  if (-not (Test-Path $npmCmd)) {
    # fallback: try common locations or use 'npm' on PATH
    $npmCmd = "npm"
  }

  Write-Host "Setting ExecutionPolicy for this session..."
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force | Out-Null

  Write-Host "Installing npm packages (this may take a minute)..."
  & $npmCmd install

  # run optional replace script if present
  $replace = Join-Path (Get-Location) "scripts\replace-imports.js"
  if (Test-Path $replace) {
    Write-Host "Running scripts\replace-imports.js to normalize imports..."
    node $replace
  } else { Write-Host "No scripts\replace-imports.js found; skipping." }

  Write-Host "Starting dev server (npm run dev)..."
  & $npmCmd run dev

} catch {
  Write-Error "Error while running dev helper: $_"
  exit 1
}
