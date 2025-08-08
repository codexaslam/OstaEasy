#!/usr/bin/env bash
# Build script for Render deployment

set -o errexit  # exit on error

# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --noinput

# Run database migrations
python manage.py migrate