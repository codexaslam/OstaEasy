#!/bin/bash
# Frontend Development Setup Script

echo "🚀 Setting up React Frontend for Local Development"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
else
    echo "✅ Dependencies already installed"
fi

# Set up environment file
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.local.template .env.local
    echo "✅ Please edit .env.local with your local settings"
else
    echo "✅ .env.local already exists"
fi

echo "✅ Frontend setup complete!"
echo ""
echo "🔄 To start development server:"
echo "   cd frontend"
echo "   pnpm dev"
