#!/bin/bash
set -e

PORT=${PORT:-8000}
echo "Starting on port $PORT"

exec gunicorn \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:$PORT \
  --timeout 120 \
  app.backend.app.main:app