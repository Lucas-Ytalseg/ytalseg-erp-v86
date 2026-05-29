@echo off
title YTALSEG - Iniciar Backend + App
echo ============================================
echo  YTALSEG ERP - MODO TESTE RAPIDO
echo ============================================
echo.

set FRONTEND_DIR=%~dp0
set BACKEND_DIR=C:\Users\lucas\OneDrive\Documentos\YTALSEG-ERP\app\backend\app
set APP_EXE=%FRONTEND_DIR%release\YTALSEG Setup 10.13.0.exe

echo Verificando Python...
python --version
if errorlevel 1 (
  echo.
  echo ERRO: Python nao encontrado.
  echo Instale Python e marque "Add Python to PATH".
  pause
  exit /b
)

echo.
echo Verificando pasta backend...
if not exist "%BACKEND_DIR%\main.py" (
  echo ERRO: Nao encontrei:
  echo %BACKEND_DIR%\main.py
  echo.
  echo Coloque a pasta backend dentro da pasta frontend ou edite este BAT.
  pause
  exit /b
)

echo.
echo Instalando/verificando dependencias do backend...
cd /d "%BACKEND_DIR%"
python -m pip install fastapi uvicorn python-multipart pymupdf pydantic

echo.
echo Iniciando backend FastAPI na porta 8000...
start "YTALSEG BACKEND" cmd /k "cd /d %BACKEND_DIR% && python -m uvicorn main:app --host 127.0.0.1 --port 8000"

echo.
echo Aguardando backend iniciar...
timeout /t 4 /nobreak > nul

echo.
echo Abrindo app...
if exist "%APP_EXE%" (
  start "" "%APP_EXE%"
) else (
  echo Instalador nao encontrado em:
  echo %APP_EXE%
  echo.
  echo Abra manualmente o app instalado pelo menu iniciar ou execute o .exe em release.
)

echo.
echo Pronto. Se aparecer SQLite conectado, esta funcionando.
pause
