$ErrorActionPreference = "Stop"

$root = Get-Location
$src = Join-Path $root "payload"
$frontend = Join-Path $root "frontend"

if (!(Test-Path $frontend) -and (Test-Path (Join-Path $root "src"))) {
  $frontend = $root
}

$modules = Join-Path $frontend "src\modules"
if (!(Test-Path $modules)) { New-Item -ItemType Directory -Path $modules -Force | Out-Null }

Copy-Item -Force (Join-Path $src "frontend\src\modules\LoginSistema.tsx") (Join-Path $modules "LoginSistema.tsx")

Write-Host "V65 login instalado. Agora rode: cd frontend ; npm run dev"
