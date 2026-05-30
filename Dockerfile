FROM node:18-alpine as frontend-builder

WORKDIR /app/frontend

COPY frontend/package.json ./

RUN npm install --legacy-peer-deps

COPY frontend/ .

RUN npm run build

FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY app/backend/app ./app

COPY --from=frontend-builder /app/frontend/dist ./app/static

ENV PYTHONUNBUFFERED=1
ENV PORT=8000

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]