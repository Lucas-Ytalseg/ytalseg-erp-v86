import os
import sys
import uvicorn

# Adicionar o diretório raiz ao path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    try:
        port_str = os.environ.get("PORT", "8000")
        port = int(port_str)
    except (ValueError, TypeError):
        port = 8000
    
    print(f"Starting server on port {port}")
    
    uvicorn.run(
        "app.backend.app.main:app",
        host="0.0.0.0",
        port=port,
        reload=False,
        log_level="info"
    )