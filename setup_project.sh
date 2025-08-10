#!/bin/bash
# Complete Project Setup Script

echo "🚀 Setting up AA-Webshop for Local Development"
echo "==============================================="

# Setup Backend
echo ""
echo "🔧 Setting up Backend..."
cd backend
chmod +x setup_local.sh
./setup_local.sh
cd ..

# Setup Frontend
echo ""
echo "🎨 Setting up Frontend..."
cd frontend
chmod +x setup_local.sh
./setup_local.sh
cd ..

echo ""
echo "🎉 Complete setup finished!"
echo ""
echo "📋 Next Steps:"
echo "1. Edit backend/.env.local with your database and API keys"
echo "2. Edit frontend/.env.local with your configuration"
echo "3. Start the backend: cd backend && source venv/bin/activate && python manage.py runserver"
echo "4. Start the frontend: cd frontend && pnpm dev"
echo ""
echo "📖 For deployment instructions, see DEPLOYMENT_GUIDE.md"
