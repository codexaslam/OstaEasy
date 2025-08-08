# 🚀 OstaEasy Deployment Guide for Render.com

## Prerequisites

- GitHub account with your code pushed
- Render.com account (free)
- Your Stripe API keys (for payment processing)

## 📁 Files Added for Deployment

The following files have been created to support Render deployment:

✅ `build.sh` - Build script for installing dependencies and running migrations  
✅ `start.sh` - Start script for running the application with Gunicorn  
✅ `render.yaml` - Render configuration file  
✅ Updated `requirements.txt` - Added production dependencies  
✅ Updated `settings.py` - Added production database and security settings

## 🔧 Step-by-Step Deployment

### 1. Push Your Code to GitHub

First, commit and push all the new files:

```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### 2. Create Render Account and Connect Repository

1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Select your `aa-webshop` repository

### 3. Configure Your Web Service

Use these settings in Render:

- **Name**: `ostaeasy-backend` (or your preferred name)
- **Runtime**: `Python 3`
- **Build Command**: `./build.sh`
- **Start Command**: `./start.sh`
- **Plan**: `Free` (for testing)

### 4. Add Database

1. In Render dashboard, click "New +"
2. Select "PostgreSQL"
3. Name it `ostaeasy-db`
4. Choose the "Free" plan
5. After creation, copy the "External Database URL"

### 5. Configure Environment Variables

In your web service settings, add these environment variables:

#### Required Variables:

```
DEBUG=false
DJANGO_SECRET_KEY=<generate-new-secret-key>
DATABASE_URL=<your-postgresql-external-url>
CORS_ALLOW_ALL_ORIGINS=false
```

#### Stripe Configuration:

```
STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
STRIPE_SECRET_KEY=<your-stripe-secret-key>
```

#### Frontend URL (when you deploy frontend):

```
FRONTEND_URL=<your-frontend-domain>
```

### 6. Generate Django Secret Key

You need a secure secret key for production. Generate one using:

**Option 1 - Python:**

```python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

**Option 2 - Online Generator:**
Visit: https://djecrety.ir/

### 7. Deploy

1. Click "Deploy Latest Commit" in your Render dashboard
2. Monitor the deployment logs
3. Once successful, your API will be available at: `https://your-service-name.onrender.com`

## 🔍 Troubleshooting

### Common Issues:

1. **Build fails with dependency errors:**

   - Check that all requirements are in `requirements.txt`
   - Ensure Python version compatibility

2. **Database connection errors:**

   - Verify `DATABASE_URL` is correctly set
   - Ensure the PostgreSQL database is created and running

3. **Static files not loading:**

   - Check that `collectstatic` runs in the build script
   - Verify `STATIC_ROOT` and `STATIC_URL` settings

4. **CORS errors when connecting frontend:**
   - Add your frontend domain to `FRONTEND_URL`
   - Set `CORS_ALLOW_ALL_ORIGINS=false` in production

## 📋 Environment Variables Checklist

Copy this checklist for your Render environment variables:

- [ ] `DEBUG=false`
- [ ] `DJANGO_SECRET_KEY=<generated-secret>`
- [ ] `DATABASE_URL=<postgresql-url>`
- [ ] `CORS_ALLOW_ALL_ORIGINS=false`
- [ ] `STRIPE_PUBLISHABLE_KEY=<your-stripe-key>`
- [ ] `STRIPE_SECRET_KEY=<your-stripe-secret>`
- [ ] `FRONTEND_URL=<your-frontend-url>` (when frontend is deployed)

## 🎯 Next Steps

After successful backend deployment:

1. **Test your API endpoints** using the Render URL
2. **Deploy your frontend** (if separate)
3. **Configure custom domain** (optional)
4. **Set up monitoring** and logging
5. **Switch to paid plan** for production use

## 🔗 Useful Links

- [Render Documentation](https://render.com/docs)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/)
- [Stripe API Keys](https://dashboard.stripe.com/apikeys)

---

Your OstaEasy backend should now be ready for deployment! 🎉
