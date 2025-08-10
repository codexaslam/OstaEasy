#!/bin/bash

# Complete Environment Setup Script
# This script sets up the entire application for different environments

echo "🚀 ostaeasy Environment Setup"
echo "=============================="

# Function to setup backend environment
setup_backend() {
    echo "📦 Setting up Backend Environment..."
    
    cd backend
    
    # Create .env.local if it doesn't exist
    if [ ! -f .env.local ]; then
        echo "Creating backend .env.local..."
        cp .env .env.local
        echo "✅ Backend .env.local created"
    else
        echo "✅ Backend .env.local already exists"
    fi
    
    # Install Python dependencies
    if [ -f "../venv/bin/activate" ]; then
        echo "📥 Installing Python dependencies..."
        source ../venv/bin/activate
        pip install -r requirements.txt > /dev/null 2>&1
        echo "✅ Python dependencies installed"
    fi
    
    cd ..
}

# Function to setup frontend environment
setup_frontend() {
    echo "🎨 Setting up Frontend Environment..."
    
    cd frontend
    
    # Create .env.local if it doesn't exist
    if [ ! -f .env.local ]; then
        echo "Creating frontend .env.local..."
        cp .env .env.local
        echo "✅ Frontend .env.local created"
    else
        echo "✅ Frontend .env.local already exists"
    fi
    
    # Install Node dependencies
    if [ -f "package.json" ]; then
        echo "📥 Installing Node.js dependencies..."
        npm install > /dev/null 2>&1
        echo "✅ Node.js dependencies installed"
    fi
    
    cd ..
}

# Function to check environment
check_environment() {
    echo "🔍 Environment Check"
    echo "==================="
    
    # Check Python/Django
    echo "Backend (Django):"
    if [ -f "venv/bin/activate" ]; then
        source venv/bin/activate
        cd backend
        python manage.py check --deploy > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            echo "  ✅ Django configuration OK"
        else
            echo "  ❌ Django configuration has issues"
        fi
        cd ..
        deactivate
    else
        echo "  ⚠️  Virtual environment not found"
    fi
    
    # Check Node/Vite
    echo "Frontend (Vite):"
    cd frontend
    if [ -f "package.json" ]; then
        npm run build > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            echo "  ✅ Frontend build OK"
        else
            echo "  ❌ Frontend build has issues"
        fi
    else
        echo "  ❌ package.json not found"
    fi
    cd ..
}

# Function to show environment info
show_env_info() {
    echo ""
    echo "📋 Environment Information"
    echo "=========================="
    
    echo "🔧 Local Development:"
    echo "  Frontend: http://localhost:5173"
    echo "  Backend:  http://localhost:8000"
    echo "  Database: SQLite (local)"
    echo ""
    
    echo "🌐 Production:"
    echo "  Frontend: https://ostaeasy.netlify.app"
    echo "  Backend:  https://ostaeasy.onrender.com"
    echo "  Database: PostgreSQL (Render)"
    echo ""
    
    echo "🚀 Available Commands:"
    echo "  Local Development:"
    echo "    Frontend: cd frontend && npm run dev"
    echo "    Backend:  cd backend && source ../venv/bin/activate && python manage.py runserver"
    echo ""
    echo "  Production Build:"
    echo "    Frontend: cd frontend && npm run build"
    echo "    Backend:  Auto-deployed via Render"
}

# Main execution
case "$1" in
    "backend")
        setup_backend
        ;;
    "frontend")
        setup_frontend
        ;;
    "check")
        check_environment
        ;;
    "info")
        show_env_info
        ;;
    *)
        echo "Usage: $0 {backend|frontend|check|info|all}"
        echo ""
        echo "Commands:"
        echo "  backend   - Setup backend environment"
        echo "  frontend  - Setup frontend environment"
        echo "  check     - Check environment configuration"
        echo "  info      - Show environment information"
        echo "  all       - Setup everything"
        echo ""
        
        if [ "$1" = "all" ] || [ "$1" = "" ]; then
            setup_backend
            setup_frontend
            check_environment
            show_env_info
        fi
        ;;
esac

echo ""
echo "✨ Setup complete! Your environment is ready."
