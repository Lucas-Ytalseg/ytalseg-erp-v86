FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app/backend ./app/backend
COPY run.py .
COPY start.sh .
RUN chmod +x start.sh

ENV PYTHONUNBUFFERED=1
EXPOSE 8000

CMD ["./start.sh"]