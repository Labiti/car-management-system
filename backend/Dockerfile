# Backend Dockerfile
FROM python:3.12-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    libjpeg-dev \
    libpng-dev \
    libtiff-dev \
    libfreetype6-dev \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn whitenoise setuptools

# Copy project
COPY . .

# Create media and static directories
RUN mkdir -p /app/media /app/staticfiles

# Expose port
EXPOSE 8000

# Run with gunicorn
CMD ["gunicorn", "car_management.wsgi:application", "--bind", "0.0.0.0:8000"]