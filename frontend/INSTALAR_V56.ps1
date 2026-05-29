$ErrorActionPreference = "Stop"

$frontend = Get-Location
$electron = Join-Path $frontend "electron"

if (!(Test-Path $electron)) {
  New-Item -ItemType Directory -Path $electron | Out-Null
}

Copy-Item -Force ".\electron\main.cjs" (Join-Path $electron "main.cjs")
Copy-Item -Force ".\electron\preload.js" (Join-Path $electron "preload.js")

Write-Host ""
Write-Host "V56 instalado com sucesso."
Write-Host ""
Write-Host "Verificando primeira linha do main.cjs:"
Get-Content (Join-Path $electron "main.cjs") -TotalCount 3
Write-Host ""
Write-Host "Agora rode:"
Write-Host "rmdir /s /q release"
Write-Host "npm run dist"
