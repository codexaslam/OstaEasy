#!/usr/bin/env bash
# Start script for Render deployment

# Navigate to backend directory
cd backend

# Start the application with Gunicorn
gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT