import uvicorn
from pathlib import Path

# Certificados SSL
cert_file = Path(__file__).parent / "certs" / "cert.pem"
key_file = Path(__file__).parent / "certs" / "key.pem"

if cert_file.exists() and key_file.exists():
    print("🔒 Rodando com HTTPS")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        ssl_certfile=str(cert_file),
        ssl_keyfile=str(key_file),
        reload=False
    )
else:
    print("❌ Certificados SSL não encontrados!")
    print("Execute: python run_https.py")
    import sys
    sys.exit(1)
