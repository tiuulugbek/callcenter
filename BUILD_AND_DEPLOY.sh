#!/bin/bash

# Backend va Frontend Build va Deploy Script

set -e  # Xatolik bo'lsa to'xtatish

echo "=========================================="
echo "Build va Deploy boshlandi..."
echo "=========================================="

# Git pull
echo "Git pull..."
cd /var/www/call-center
git pull origin main

# Backend build
echo "Backend build..."
cd backend

# Dependencies
echo "Backend dependencies o'rnatilmoqda..."
npm install

# Prisma migration
echo "Prisma migration..."
npx prisma migrate deploy || npx prisma migrate resolve --applied 20250101000000_init || echo "Migration xatolik, lekin davom etamiz..."

# Build
echo "Backend build..."
npm run build

# Build tekshirish
if [ ! -f "dist/main.js" ]; then
    echo "ERROR: Backend build muvaffaqiyatsiz! dist/main.js topilmadi"
    exit 1
fi

echo "Backend build muvaffaqiyatli!"

# Frontend build
echo "Frontend build..."
cd ../frontend

# Dependencies
echo "Frontend dependencies o'rnatilmoqda..."
npm install

# Build
echo "Frontend build..."
npm run build

# Build tekshirish
if [ ! -d "dist" ]; then
    echo "ERROR: Frontend build muvaffaqiyatsiz! dist papkasi topilmadi"
    exit 1
fi

echo "Frontend build muvaffaqiyatli!"

# PM2 da ishga tushirish
echo "PM2 da ishga tushirish..."
cd ..

# Barcha processlarni to'xtatish
pm2 stop all || true

# Ecosystem config orqali ishga tushirish
pm2 start ecosystem.config.js

# PM2 ni saqlash
pm2 save

# Processlar holati
echo "=========================================="
echo "Processlar holati:"
pm2 list

echo "=========================================="
echo "Build va Deploy tugadi!"
echo "=========================================="

