#!/bin/bash

# Bu script serverga yangi o'zgarishlarni deploy qilish uchun

set -e

echo "=== Call Center - Simplified Deployment ==="
echo ""

# Git pull
echo "1. Git dan yangi o'zgarishlarni olish..."
git pull origin main

# Backend dependencies
echo ""
echo "2. Backend dependencies ni o'rnatish..."
cd backend
npm install

# Prisma generate
echo ""
echo "3. Prisma Client ni generate qilish..."
npx prisma generate

# Backend build
echo ""
echo "4. Backend ni build qilish..."
npm run build

# Frontend dependencies
echo ""
echo "5. Frontend dependencies ni o'rnatish..."
cd ../frontend
npm install

# Frontend build
echo ""
echo "6. Frontend ni build qilish..."
npm run build

# PM2 restart
echo ""
echo "7. PM2 da application larni restart qilish..."
cd ..
pm2 restart call-center-backend
pm2 restart call-center-frontend

echo ""
echo "=== Deployment muvaffaqiyatli yakunlandi ==="
echo ""
echo "PM2 holatini tekshirish:"
pm2 status

echo ""
echo "Loglarni ko'rish:"
echo "  Backend: pm2 logs call-center-backend"
echo "  Frontend: pm2 logs call-center-frontend"

