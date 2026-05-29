Write-Host "YTALSEG Relatórios V80 - Gerar EXE" -ForegroundColor Green
Set-Location -Path "$PSScriptRoot"
npm run build
Write-Host ""
Write-Host "Se terminar sem erro, o instalador fica em: frontend\release" -ForegroundColor Cyan
