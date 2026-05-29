@echo off
chcp 65001 >nul
title YTALSEG ERP V86 MOBILE COMPLETO
echo ===============================================
echo   YTALSEG ERP V86 - MOBILE COMPLETO
echo ===============================================
echo.
echo Este arquivo inicia o BACKEND e o FRONTEND para acesso no celular.
echo Mantenha as duas janelas abertas.
echo.
echo 1) Iniciando BACKEND em http://0.0.0.0:8000 ...
start "YTALSEG BACKEND MOBILE" cmd /k "cd /d %~dp0app\backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000"
timeout /t 3 >nul
echo 2) Iniciando FRONTEND em http://0.0.0.0:5173 ...
start "YTALSEG FRONTEND MOBILE" cmd /k "cd /d %~dp0 && npm run mobile"
echo.
echo Descubra o IP do PC com: ipconfig
echo No celular abra: http://SEU-IP:5173
echo Exemplo: http://192.168.15.170:5173
echo.
pause
