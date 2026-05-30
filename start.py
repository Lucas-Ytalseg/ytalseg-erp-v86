#!/usr/bin/env python3
import os
import sys
import uvicorn

# Forçar conversão segura de PORT
port = int(os.environ.get('PORT', '8000'))
print(f"[START] Server starting on port {port}")
print(f"[START] Python version: {sys.version}")

try:
    uvicorn.run(
        "app.backend.app.main:app",
        host="0.0.0.0",
        port=port,
        log_level="info"
    )
except Exception as e:
    print(f"[ERROR] {type(e).__name__}: {e}")
    sys.exit(1)