#!/bin/bash

# Server Pull va Fix Script
# Bu scriptni serverda ishga tushiring

set -e

echo "=========================================="
echo "Server Pull va Fix Script"
echo "=========================================="

# Project papkasiga o'tish
cd /var/www/call-center

echo "1. Git pull qilish..."
git pull origin main

echo "2. Backend papkasiga o'tish..."
cd backend

echo "3. Database Migration..."
npx prisma db push

echo "4. Prisma Client Generate..."
npx prisma generate

echo "5. To'liq clean build..."
rm -rf dist
rm -rf node_modules/.cache
rm -rf .nest
rm -rf tsconfig.tsbuildinfo
rm -rf src/**/*.js.map

echo "6. Build qilish..."
npm run build

echo "7. Build fayllarni tekshirish..."
if [ ! -f "dist/src/settings/sip-extension.service.js" ]; then
    echo "ERROR: Build fayl topilmadi!"
    exit 1
fi

echo "8. Build fayl ichidagi kodni tekshirish..."
if grep -q "allOperators.filter" dist/src/settings/sip-extension.service.js; then
    echo "✅ To'g'ri kod build qilingan"
else
    echo "❌ XATO: Eski kod build qilingan!"
    echo "Build fayl ichida:"
    grep -A 5 "getExtensions" dist/src/settings/sip-extension.service.js || true
    exit 1
fi

echo "9. PM2 ni to'liq restart..."
pm2 delete call-center-backend || true
pm2 kill || true
sleep 3
pm2 start dist/src/main.js --name call-center-backend --update-env

echo "10. PM2 status..."
pm2 status

echo "11. Backend loglar (30 qator)..."
sleep 2
pm2 logs call-center-backend --err --lines 30 --nostream

echo ""
echo "=========================================="
echo "✅ Barcha jarayonlar yakunlandi!"
echo "=========================================="
echo ""
echo "Tekshirish uchun:"
echo "  pm2 logs call-center-backend --err --lines 50"
echo "  curl http://localhost:4000/settings/sip-extensions"

