#!/bin/bash

# Call Center Deployment Script
# Usage: ./deploy.sh

set -e  # Exit on error

echo "=== Call Center Deployment Script ==="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo -e "${RED}Error: This script must be run from the project root directory${NC}"
    exit 1
fi

# Git pull
echo -e "${YELLOW}1. Git pull...${NC}"
git pull origin main || {
    echo -e "${RED}Error: Git pull failed${NC}"
    exit 1
}
echo -e "${GREEN}✓ Git pull successful${NC}"
echo ""

# Backend
echo -e "${YELLOW}2. Backend yangilanishlar...${NC}"
cd backend

# Install dependencies
echo "   Installing dependencies..."
npm install || {
    echo -e "${RED}Error: npm install failed${NC}"
    exit 1
}

# Prisma generate (if schema changed)
echo "   Generating Prisma client..."
npm run prisma:generate || {
    echo -e "${YELLOW}Warning: Prisma generate failed (might be OK)${NC}"
}

# Build
echo "   Building..."
npm run build || {
    echo -e "${RED}Error: Build failed${NC}"
    exit 1
}

# Restart PM2
echo "   Restarting PM2..."
pm2 restart call-center-backend || {
    echo -e "${YELLOW}Warning: PM2 restart failed (might not be running)${NC}"
    pm2 start dist/main.js --name call-center-backend || {
        echo -e "${RED}Error: PM2 start failed${NC}"
        exit 1
    }
}

cd ..
echo -e "${GREEN}✓ Backend updated${NC}"
echo ""

# Frontend
echo -e "${YELLOW}3. Frontend yangilanishlar...${NC}"
cd frontend

# Install dependencies
echo "   Installing dependencies..."
npm install || {
    echo -e "${RED}Error: npm install failed${NC}"
    exit 1
}

# Build
echo "   Building..."
npm run build || {
    echo -e "${RED}Error: Build failed${NC}"
    exit 1
}

# Copy to nginx directory
echo "   Copying files..."
mkdir -p /var/www/crm24
cp -r dist/* /var/www/crm24/ || {
    echo -e "${RED}Error: Copy failed${NC}"
    exit 1
}

# Set permissions
chown -R www-data:www-data /var/www/crm24

cd ..
echo -e "${GREEN}✓ Frontend updated${NC}"
echo ""

# Summary
echo -e "${GREEN}=== Deployment Tugadi ===${NC}"
echo ""
echo "PM2 Status:"
pm2 status
echo ""
echo "Backend logs: pm2 logs call-center-backend"
echo "Frontend: https://crm24.soundz.uz"
