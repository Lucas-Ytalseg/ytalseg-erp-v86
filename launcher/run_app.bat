@echo off
cd /d C:\Users\lucas\OneDrive\Documentos\Geoambiental-Relatorios\app\backend
start cmd /k python -m uvicorn app.main:app --reload

timeout /t 3 >nul

start http://127.0.0.1:8000/docs
start http://127.0.0.1:5173

exit