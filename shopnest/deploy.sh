#!/bin/bash

# ======================================================================
# 🚀 ShopNest Deployment Script
# Run this script to deploy everything with Docker
# ======================================================================

set -e  # Exit on error

echo "========================================="
echo "🚀 Starting ShopNest Deployment"
echo "========================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ ERROR: .env file not found!"
    echo "Please create .env file from .env.example"
    exit 1
fi

# Load environment variables
source .env

# Display configuration
echo "📋 Deployment Configuration:"
echo "   Public URL: $PUBLIC_URL"
echo "   Frontend Port: $FRONTEND_PORT"
echo "   Network: $DOCKER_NETWORK"
echo ""

# Build and start all services
echo "🐳 Building Docker images..."
docker-compose build

echo "🚀 Starting all services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check service health
echo "🏥 Checking service health..."
services=("product-service" "user-service" "cart-service" "frontend")
for service in "${services[@]}"; do
    if docker ps | grep -q "$service"; then
        echo "✅ $service is running"
    else
        echo "❌ $service failed to start"
    fi
done

# Display access information
echo ""
echo "========================================="
echo "🎉 Deployment Complete!"
echo "========================================="
echo ""
echo "📦 Services Status:"
echo "   Frontend:      $PUBLIC_URL"
echo "   Product API:   http://localhost:4001/api/products"
echo "   User API:      http://localhost:4002/api/docs"
echo "   Cart API:      http://localhost:4003/health"
echo ""
echo "📊 Docker Containers:"
docker-compose ps
echo ""
echo "📝 Logs:"
echo "   View logs:     docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart:       docker-compose restart"
echo ""
echo "========================================="
