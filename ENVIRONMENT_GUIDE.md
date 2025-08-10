# 🌍 Complete Environment Configuration Guide

This project is configured to work seamlessly across **local development** and **production** environments with automatic detection and switching.

## 📋 Environment Overview

| Component       | Local Development       | Production                      |
| --------------- | ----------------------- | ------------------------------- |
| **Frontend**    | `http://localhost:5173` | `https://ostaeasy.netlify.app`  |
| **Backend**     | `http://localhost:8000` | `https://ostaeasy.onrender.com` |
| **Database**    | SQLite (local file)     | PostgreSQL (Render)             |
| **Environment** | Development mode        | Production mode                 |

## 🔧 Backend Configuration

### Environment Files

- **`.env`** - Base configuration with defaults
- **`.env.local`** - Local development (SQLite, debug mode)
- **`.env.production`** - Production settings (PostgreSQL, secure mode)

### Key Settings

```bash
# Local Development
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
FRONTEND_URL=http://localhost:5173
CORS_ALLOW_ALL_ORIGINS=True

# Production
DEBUG=False
DATABASE_URL=postgresql://... (from Render)
FRONTEND_URL=https://ostaeasy.netlify.app
CORS_ALLOW_ALL_ORIGINS=False
```

### CORS Configuration

The backend automatically allows:

- **Local**: `localhost:5173`, `127.0.0.1:5173`, `localhost:3000`
- **Production**: `https://ostaeasy.netlify.app`

## 🎨 Frontend Configuration

### Environment Files

- **`.env`** - Base configuration with fallbacks
- **`.env.local`** - Local development (localhost backend)
- **`.env.production`** - Production (live backend)

### Auto-Detection Logic

```javascript
// Smart environment detection
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// API URL selection
if (VITE_API_BASE_URL) {
  return VITE_API_BASE_URL;
} else if (isDevelopment) {
  return "http://localhost:8000";
} else {
  return "https://ostaeasy.onrender.com";
}
```

## 🗄️ Database Configuration

### Local Development

- **Type**: SQLite
- **File**: `backend/db.sqlite3`
- **Migrations**: Applied automatically
- **Data**: Persistent between runs

### Production

- **Type**: PostgreSQL
- **Host**: Managed by Render
- **Connection**: Via `DATABASE_URL` environment variable
- **Migrations**: Applied during deployment

## 🚀 Deployment Configuration

### Frontend (Netlify)

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  VITE_API_BASE_URL = "https://ostaeasy.onrender.com"
```

### Backend (Render)

```yaml
# render.yaml
services:
  - type: web
    name: ostaeasy-backend
    env: python
    buildCommand: "pip install -r requirements.txt"
    startCommand: "gunicorn backend.wsgi:application"
    envVars:
      - key: DEBUG
        value: "False"
      - key: FRONTEND_URL
        value: "https://ostaeasy.netlify.app"
```

## 🔄 Development Workflow

### 1. Local Development Setup

```bash
# Clone and setup
git clone <repository>
cd aa-webshop

# Setup environments
chmod +x setup-env.sh
./setup-env.sh all

# Start development servers
# Terminal 1: Backend
cd backend && source ../venv/bin/activate && python manage.py runserver

# Terminal 2: Frontend
cd frontend && npm run dev
```

### 2. Environment Variables

#### Backend (.env.local)

```bash
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
FRONTEND_URL=http://localhost:5173
CORS_ALLOW_ALL_ORIGINS=True
SECRET_KEY=your-local-secret-key
STRIPE_SECRET_KEY=sk_test_your_test_key
```

#### Frontend (.env.local)

```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_DEBUG=true
VITE_ENVIRONMENT=development
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key
```

### 3. Production Deployment

#### Automatic Environment Switching

- **Frontend**: Netlify automatically uses `.env.production`
- **Backend**: Render uses environment variables from dashboard
- **Database**: Render provides PostgreSQL `DATABASE_URL`

## 📊 Environment Detection & Debugging

### Frontend Debug Console

In development mode, check browser console for:

```javascript
🔧 Environment Info: {
  mode: "development",
  isDevelopment: true,
  isProduction: false,
  environment: "development",
  apiBaseUrl: "http://localhost:8000",
  frontendUrl: "http://localhost:5173"
}
```

### Backend Environment Check

```bash
# Check Django configuration
cd backend && python manage.py check --deploy

# View current environment
python manage.py shell -c "
from django.conf import settings
print(f'DEBUG: {settings.DEBUG}')
print(f'DATABASE: {settings.DATABASES}')
print(f'CORS: {settings.CORS_ALLOWED_ORIGINS}')
"
```

## 🔧 Available Scripts

### Frontend Scripts

```bash
npm run dev          # Local development
npm run dev:local    # Explicit local mode
npm run dev:prod     # Dev server with production API
npm run build        # Production build
npm run build:dev    # Development build
npm run preview      # Preview production build
```

### Backend Scripts

```bash
python manage.py runserver              # Local development
python manage.py runserver --settings=backend.settings.production  # Production settings
python manage.py migrate               # Apply migrations
python manage.py collectstatic         # Collect static files
```

### Environment Scripts

```bash
./setup-env.sh all       # Complete setup
./setup-env.sh backend   # Backend only
./setup-env.sh frontend  # Frontend only
./setup-env.sh check     # Environment check
./setup-env.sh info      # Show environment info
```

## 🔐 Security Configuration

### CORS Settings

- **Development**: Allows all origins for easier testing
- **Production**: Restricted to specific domains

### Environment Variables

- **Local**: Stored in `.env.local` files (not committed)
- **Production**: Set via deployment platform dashboards

### Secret Management

- **Local**: Test keys in `.env.local`
- **Production**: Live keys in platform environment variables

## 🚦 Environment Status Check

### Health Endpoints

- **Backend**: `https://ostaeasy.onrender.com/admin/`
- **Frontend**: `https://ostaeasy.netlify.app/`

### Monitoring

- **Backend Logs**: Render dashboard
- **Frontend Logs**: Netlify deploy logs
- **Database**: Render PostgreSQL dashboard

## 🆘 Troubleshooting

### Common Issues

#### CORS Errors

```bash
# Check CORS settings
echo $FRONTEND_URL
# Should match your frontend URL
```

#### Database Connection

```bash
# Check database URL
echo $DATABASE_URL
# Should be properly formatted PostgreSQL URL
```

#### Environment Variables Not Loading

```bash
# Restart development servers after changing .env files
# Redeploy after changing production environment variables
```

### Debug Commands

```bash
# Backend environment check
python manage.py diffsettings

# Frontend environment check
npm run dev -- --debug

# Full environment test
./setup-env.sh check
```

Your application is now fully configured for seamless local development and production deployment! 🎉
