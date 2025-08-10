#!/bin/bash
# Backend Development Setup Script

echo "🚀 Setting up Django Backend for Local Development"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Set up environment file
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.local.template .env.local
    echo "✅ Please edit .env.local with your local settings"
else
    echo "✅ .env.local already exists"
fi

# Database setup
echo "🗄️  Setting up database..."
python manage.py makemigrations
python manage.py migrate

# Create superuser if needed
echo "👤 Creating superuser (optional)..."
python manage.py createsuperuser --noinput --username admin --email admin@example.com || echo "Superuser already exists or skipped"

echo "✅ Backend setup complete!"
echo ""
echo "🔄 To start development server:"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   python manage.py runserver"
