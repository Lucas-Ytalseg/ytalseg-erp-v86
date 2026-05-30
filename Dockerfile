FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONUNBUFFERED=1

EXPOSE 8000

# Railway injeta a porta em $PORT. O `sh -c` expande a variável.
# ${PORT:-8000} usa 8000 como fallback ao rodar localmente.
CMD ["sh", "-c", "uvicorn app.backend.app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
