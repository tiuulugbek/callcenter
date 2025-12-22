#!/bin/bash

# Serverda To'liq Fix Script
# Bu scriptni serverda ishga tushiring

set -e

echo "=========================================="
echo "Serverda To'liq Fix Script"
echo "=========================================="

cd /var/www/call-center

echo "1. Git pull..."
git pull origin main

echo "2. Backend papkasiga o'tish..."
cd backend

echo "3. Source faylni tekshirish..."
if [ ! -f "src/settings/sip-extension.service.ts" ]; then
    echo "❌ Source fayl topilmadi!"
    exit 1
fi

echo "4. Source fayl ichidagi kodni tekshirish..."
if grep -q "allOperators.filter" src/settings/sip-extension.service.ts; then
    echo "✅ Source fayl to'g'ri"
else
    echo "❌ XATO: Source fayl noto'g'ri!"
    cat src/settings/sip-extension.service.ts | grep -A 15 "getExtensions"
    exit 1
fi

echo "5. Database Migration..."
npx prisma db push

echo "6. Prisma Client Generate..."
npx prisma generate

echo "7. To'liq clean build..."
rm -rf dist
rm -rf node_modules/.cache
rm -rf .nest
rm -rf tsconfig.tsbuildinfo

echo "8. Build qilish..."
npm run build

echo "9. Build faylini tekshirish..."
if [ ! -f "dist/src/settings/sip-extension.service.js" ]; then
    echo "❌ Build fayl topilmadi!"
    exit 1
fi

echo "10. Build fayl ichidagi kodni tekshirish..."
if grep -q "allOperators.filter" dist/src/settings/sip-extension.service.js; then
    echo "✅ Build fayl to'g'ri"
else
    echo "❌ XATO: Build fayl noto'g'ri!"
    echo "Build fayl ichida:"
    cat dist/src/settings/sip-extension.service.js | grep -A 15 "getExtensions"
    exit 1
fi

echo "11. Build fayl ichidagi kodni ko'rsatish..."
echo "---"
cat dist/src/settings/sip-extension.service.js | grep -A 15 "getExtensions" | head -20
echo "---"

echo "12. PM2 ni to'liq restart..."
pm2 delete call-center-backend || true
pm2 kill || true
sleep 5

echo "13. PM2 ni qayta ishga tushirish..."
pm2 start dist/src/main.js --name call-center-backend --update-env

echo "14. PM2 status..."
pm2 status

echo "15. 5 soniya kutish (backend ishga tushishi uchun)..."
sleep 5

echo "16. Error loglarini tekshirish..."
pm2 logs call-center-backend --err --lines 30 --nostream

echo ""
echo "=========================================="
echo "✅ Barcha jarayonlar yakunlandi!"
echo "=========================================="
echo ""
echo "Tekshirish uchun:"
echo "  pm2 logs call-center-backend --err --lines 50"
echo "  curl http://localhost:4000/settings/sip-extensions"

