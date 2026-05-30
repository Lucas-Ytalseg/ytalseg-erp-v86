FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app/backend ./app/backend

ENV PYTHONUNBUFFERED=1
EXPOSE 8000

CMD gunicorn -w 4 -b 0.0.0.0:8000 --timeout 120 app.backend.app.main:app