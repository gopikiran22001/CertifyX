#!/bin/bash

# CertifyX Deployment Script

echo "🚀 Starting CertifyX deployment..."

# Check prerequisites
command -v aptos >/dev/null 2>&1 || { echo "❌ Aptos CLI required but not installed. Aborting." >&2; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js required but not installed. Aborting." >&2; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ Docker required but not installed. Aborting." >&2; exit 1; }

# Deploy smart contracts
echo "📝 Deploying smart contracts..."
cd move
aptos move compile
aptos move publish --profile testnet --assume-yes

# Get deployed address
MODULE_ADDRESS=$(aptos account list --profile testnet | grep "account" | cut -d'"' -f4)
echo "✅ Smart contracts deployed at: $MODULE_ADDRESS"

# Update configuration
echo "⚙️ Updating configuration..."
cd ../src/utils
sed -i "s/export const MODULE_ADDRESS = \".*\"/export const MODULE_ADDRESS = \"$MODULE_ADDRESS\"/" aptos.js

# Install dependencies
echo "📦 Installing dependencies..."
cd ../../
npm install
cd backend
npm install

# Setup environment
echo "🔧 Setting up environment..."
cd ../
cp backend/.env.example backend/.env
echo "MODULE_ADDRESS=$MODULE_ADDRESS" >> backend/.env

# Start services
echo "🐳 Starting services with Docker..."
docker-compose up -d

echo "✅ CertifyX deployed successfully!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔗 Backend API: http://localhost:5000"
echo "📄 Smart Contract: $MODULE_ADDRESS"