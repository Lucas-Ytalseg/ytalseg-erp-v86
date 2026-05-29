$ErrorActionPreference = "Stop"
Write-Host "YTALSEG ERP V66 - Gerando instalador .exe" -ForegroundColor Green
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontend = Join-Path $root "frontend"
if (!(Test-Path $frontend)) { throw "Pasta frontend não encontrada." }
Set-Location $frontend
npm install
npm run dist
Write-Host "Pronto. Verifique a pasta frontend\release" -ForegroundColor Green
