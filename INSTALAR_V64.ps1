$ErrorActionPreference = "Stop"

$root = Get-Location
$src = Join-Path $root "payload"

$frontend = Join-Path $root "frontend"
if (!(Test-Path $frontend) -and (Test-Path (Join-Path $root "src"))) {
  $frontend = $root
  $root = Split-Path $frontend -Parent
}

$modules = Join-Path $frontend "src\modules"
$appsrc = Join-Path $frontend "src"
$backend = Join-Path $root "app\backend\app"

if (!(Test-Path $modules)) { New-Item -ItemType Directory -Path $modules -Force | Out-Null }
if (!(Test-Path $backend)) { New-Item -ItemType Directory -Path $backend -Force | Out-Null }

Copy-Item -Force (Join-Path $src "frontend\src\App.tsx") (Join-Path $appsrc "App.tsx")
Copy-Item -Force (Join-Path $src "frontend\src\modules\Relatorios.tsx") (Join-Path $modules "Relatorios.tsx")
Copy-Item -Force (Join-Path $src "frontend\src\modules\LoginSistema.tsx") (Join-Path $modules "LoginSistema.tsx")
Copy-Item -Force (Join-Path $src "frontend\src\modules\Clientes.tsx") (Join-Path $modules "Clientes.tsx")
Copy-Item -Force (Join-Path $src "app\backend\app\main.py") (Join-Path $backend "main.py")

Write-Host ""
Write-Host "V64 instalado com sucesso."
Write-Host "Agora rode:"
Write-Host "cd frontend"
Write-Host "npm run dev"
