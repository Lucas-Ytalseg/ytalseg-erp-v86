Write-Host "YTALSEG ERP V77 - Teste" -ForegroundColor Green
Set-Location -Path "$PSScriptRoot\frontend"
if (!(Test-Path "node_modules")) {
  Write-Host "Instalando dependencias..." -ForegroundColor Yellow
  npm install
}
npm run desktop
