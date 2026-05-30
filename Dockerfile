FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt uvicorn

COPY . .

ENV PYTHONUNBUFFERED=1

RUN chmod +x entrypoint.sh

EXPOSE 8000

CMD ["./entrypoint.sh"]