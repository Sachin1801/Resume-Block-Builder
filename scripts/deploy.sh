#!/bin/bash

# Resume Builder Deployment Script
# Usage: ./scripts/deploy.sh [dev|prod]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if environment argument is provided
ENVIRONMENT=${1:-dev}

print_status "Starting deployment for environment: $ENVIRONMENT"

# Check if required commands exist
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed or not in PATH"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed or not in PATH"
        exit 1
    fi
    
    print_success "All dependencies are available"
}

# Development deployment
deploy_dev() {
    print_status "Starting development deployment with Docker Compose..."
    
    # Stop existing containers
    print_status "Stopping existing containers..."
    docker-compose down
    
    # Build and start containers
    print_status "Building and starting containers..."
    docker-compose up --build -d
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 10
    
    # Test backend health
    print_status "Testing backend health..."
    if curl -f http://localhost:3001/health &> /dev/null; then
        print_success "Backend is healthy"
    else
        print_warning "Backend health check failed"
    fi
    
    # Test frontend
    print_status "Testing frontend..."
    if curl -f http://localhost:5173 &> /dev/null; then
        print_success "Frontend is accessible"
    else
        print_warning "Frontend accessibility check failed"
    fi
    
    print_success "Development deployment completed!"
    print_status "Frontend: http://localhost:5173"
    print_status "Backend: http://localhost:3001"
    print_status "Backend Health: http://localhost:3001/health"
}

# Production deployment instructions
deploy_prod() {
    print_status "Production deployment requires manual setup on Railway and Vercel"
    print_status "Please follow these steps:"
    echo
    print_status "1. Backend (Railway):"
    echo "   - Go to https://railway.app"
    echo "   - Connect this GitHub repository"
    echo "   - Set root directory to 'server'"
    echo "   - Configure environment variables:"
    echo "     * NODE_ENV=production"
    echo "     * FRONTEND_URL=https://your-vercel-app.vercel.app"
    echo
    print_status "2. Frontend (Vercel):"
    echo "   - Go to https://vercel.com"
    echo "   - Import this GitHub repository"
    echo "   - Set root directory to 'client'"
    echo "   - Configure environment variables:"
    echo "     * VITE_SUPABASE_URL=your_supabase_url"
    echo "     * VITE_SUPABASE_ANON_KEY=your_supabase_key"
    echo "     * VITE_API_URL=https://your-railway-app.railway.app"
    echo
    print_status "3. Update CORS:"
    echo "   - After Vercel deployment, update Railway FRONTEND_URL"
    echo "   - Restart Railway service"
    echo
    print_status "See DEPLOYMENT.md for detailed instructions"
}

# Cleanup function
cleanup() {
    print_status "Cleaning up..."
    docker-compose down
    docker system prune -f
    print_success "Cleanup completed"
}

# Main deployment logic
case $ENVIRONMENT in
    dev|development)
        check_dependencies
        deploy_dev
        ;;
    prod|production)
        deploy_prod
        ;;
    clean|cleanup)
        cleanup
        ;;
    *)
        print_error "Invalid environment: $ENVIRONMENT"
        print_status "Usage: $0 [dev|prod|clean]"
        exit 1
        ;;
esac
