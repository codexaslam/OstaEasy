# Environment Configuration Guide

This project automatically detects and configures itself for different environments.

## Environment Files

### `.env` (Base Configuration)

- Contains default/fallback values
- Used when no environment-specific file is found
- **Committed to git**

### `.env.local` (Local Development)

- Used during local development (`npm run dev`)
- Configures API to use `http://localhost:8000`
- **Not committed to git** (ignored by .gitignore)

### `.env.production` (Production)

- Used for production builds (`npm run build`)
- Configures API to use `https://ostaeasy.onrender.com`
- **Committed to git**

## Available Scripts

### Development

```bash
# Local development (uses .env.local)
npm run dev

# Development with explicit mode
npm run dev:local

# Development with production API
npm run dev:prod
```

### Production

```bash
# Production build (uses .env.production)
npm run build

# Development build
npm run build:dev

# Production build (explicit)
npm run build:prod
```

## How It Works

1. **Auto-Detection**: The app automatically detects the environment using Vite's built-in `import.meta.env.DEV` and `import.meta.env.PROD`

2. **Environment Variables**:

   - `VITE_API_BASE_URL` - Backend API URL
   - `VITE_ENVIRONMENT` - Current environment name
   - `VITE_DEBUG` - Enable debug logging

3. **Fallback Logic**:
   - If `VITE_API_BASE_URL` is set → use that value
   - If in development mode → use `http://localhost:8000`
   - If in production mode → use `https://ostaeasy.onrender.com`

## Debug Information

In development mode with `VITE_DEBUG=true`, the app logs environment information to the console:

```javascript
🔧 Environment Info: {
  mode: "development",
  isDevelopment: true,
  isProduction: false,
  environment: "development",
  apiBaseUrl: "http://localhost:8000",
  viteApiUrl: "http://localhost:8000"
}
```

## Setup for New Developers

1. **Clone the repository**
2. **Copy environment file**:
   ```bash
   cp .env .env.local
   ```
3. **Edit `.env.local`** if needed (it's already configured for local development)
4. **Run the development server**:
   ```bash
   npm run dev
   ```

The app will automatically use your local backend at `http://localhost:8000`!

## Deployment

For production deployment (like Render), the build process automatically uses `.env.production` which points to the live backend URL.

No additional configuration needed! 🚀
