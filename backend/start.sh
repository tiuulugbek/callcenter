#!/bin/bash

# Backend ni 4000 port bilan ishga tushirish

cd "$(dirname "$0")"

# .env faylini tekshirish
if [ ! -f .env ]; then
    echo ".env fayli topilmadi. .env.example dan nusxa olinmoqda..."
    if [ -f .env.example ]; then
        cp .env.example .env
    else
        cat > .env << 'ENVEOF'
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/callcenter?schema=public"

# Server
PORT=4000
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Asterisk ARI
ASTERISK_ARI_URL=http://localhost:8088/ari
ASTERISK_ARI_WS_URL=ws://localhost:8088/ari/events
ASTERISK_ARI_USERNAME=backend
ASTERISK_ARI_PASSWORD=secure_password

# Telegram
TELEGRAM_BOT_TOKEN=your-telegram-bot-token

# Facebook/Instagram
FACEBOOK_PAGE_ACCESS_TOKEN=your-facebook-page-access-token
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_VERIFY_TOKEN=verify_token
ENVEOF
    fi
    echo ".env fayli yaratildi. Iltimos, DATABASE_URL va boshqa sozlamalarni tahrirlang."
fi

# Paketlar o'rnatilganligini tekshirish
if [ ! -d "node_modules" ]; then
    echo "Paketlar o'rnatilmoqda..."
    npm install
fi

# Prisma client yaratish
echo "Prisma client yaratilmoqda..."
npm run prisma:generate 2>/dev/null || echo "Prisma generate xatosi (ehtimol prisma o'rnatilmagan)"

# Backend ni ishga tushirish
echo "Backend 4000 portda ishga tushmoqda..."
npm run start:dev

