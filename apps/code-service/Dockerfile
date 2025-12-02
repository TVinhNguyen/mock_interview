FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (Node.js for JavaScript execution)
RUN apt-get update && \
    apt-get install -y nodejs npm && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 8006

# Run application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8006", "--reload"]
