#!/bin/bash

# Backend ni 4000 port bilan ishga tushirish

cd backend

# .env faylini tekshirish
if [ ! -f .env ]; then
    echo ".env fayli topilmadi. .env.example dan nusxa olinmoqda..."
    cp .env.example .env
    echo "PORT=4000" >> .env
    echo ".env fayli yaratildi. Iltimos, boshqa sozlamalarni tahrirlang."
fi

# Paketlar o'rnatilganligini tekshirish
if [ ! -d "node_modules" ]; then
    echo "Paketlar o'rnatilmoqda..."
    npm install
fi

# Prisma client yaratish
echo "Prisma client yaratilmoqda..."
npm run prisma:generate

# Backend ni ishga tushirish
echo "Backend 4000 portda ishga tushmoqda..."
npm run start:dev

