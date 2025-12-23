#!/bin/bash

# Serverga deploy qilish scripti

echo "🚀 Serverga deploy qilish..."

# Git pull
echo "📥 Git pull qilish..."
git pull origin main

# Backend dependencies
echo "📦 Backend dependencies o'rnatish..."
cd backend
npm install

# Prisma generate
echo "🗄️ Prisma Client generatsiya qilish..."
npx prisma generate

# Backend build
echo "🔨 Backend build qilish..."
npm run build

# Frontend dependencies
echo "📦 Frontend dependencies o'rnatish..."
cd ../frontend
npm install

# Frontend build
echo "🔨 Frontend build qilish..."
npm run build

# PM2 restart
echo "🔄 PM2 restart qilish..."
cd ..
pm2 restart ecosystem.config.js

echo ""
echo "✅ Deploy muvaffaqiyatli yakunlandi!"
echo ""
echo "📊 PM2 status:"
pm2 list

