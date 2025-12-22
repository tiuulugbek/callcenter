#!/bin/bash

# Serverga Deploy Qilish Skripti

SERVER_IP="152.53.229.176"
SERVER_USER="root"
DOMAIN="crm24.soundz.uz"
PROJECT_DIR="/var/www/call-center"

echo "=========================================="
echo "Call Center Deploy Script"
echo "=========================================="
echo "Server: $SERVER_USER@$SERVER_IP"
echo "Domain: $DOMAIN"
echo ""

# 1. Local build
echo "1. Local build qilinmoqda..."
cd backend
npm run build
cd ../frontend
npm run build
cd ..

# 2. Archive yaratish
echo "2. Archive yaratilmoqda..."
tar -czf call-center-deploy.tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='*.log' \
  --exclude='.env' \
  backend frontend asterisk-config *.md

# 3. Serverga yuklash
echo "3. Serverga yuklanmoqda..."
scp call-center-deploy.tar.gz $SERVER_USER@$SERVER_IP:/tmp/

# 4. Serverda deploy
echo "4. Serverda deploy qilinmoqda..."
ssh $SERVER_USER@$SERVER_IP << 'ENDSSH'
cd /var/www
mkdir -p call-center
cd call-center
tar -xzf /tmp/call-center-deploy.tar.gz
rm /tmp/call-center-deploy.tar.gz

# Backend
cd backend
npm install --production
npm run prisma:generate
npm run build
pm2 restart call-center-backend || pm2 start dist/main.js --name call-center-backend

# Frontend
cd ../frontend
npm install
npm run build
cp -r dist/* /var/www/crm24/

echo "Deploy muvaffaqiyatli!"
ENDSSH

echo ""
echo "=========================================="
echo "Deploy yakunlandi!"
echo "=========================================="
echo "Frontend: https://$DOMAIN"
echo "Backend API: https://$DOMAIN/api"
echo ""

