FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY app/backend/app ./app

ENV PYTHONUNBUFFERED=1

EXPOSE 8000

CMD ["python", "-c", "import os; import uvicorn; port = int(os.getenv('PORT', 8000)); uvicorn.run('app.main:app', host='0.0.0.0', port=port)"]