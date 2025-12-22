#!/bin/bash

# Serverda To'liq Clean va Rebuild Script
# Bu scriptni serverda ishga tushiring

set -e

echo "=========================================="
echo "Serverda To'liq Clean va Rebuild"
echo "=========================================="

cd /var/www/call-center

echo "1. PM2 ni to'xtatish..."
pm2 delete call-center-backend || true
pm2 kill || true
sleep 3

echo "2. Backend papkasiga o'tish..."
cd backend

echo "3. Barcha build va cache fayllarni o'chirish..."
rm -rf dist
rm -rf node_modules/.cache
rm -rf .nest
rm -rf tsconfig.tsbuildinfo
rm -rf src/**/*.js
rm -rf src/**/*.js.map
find . -name "*.js.map" -delete
find . -name "*.d.ts.map" -delete

echo "4. Git pull (kodni yangilash)..."
cd ..
git pull origin main

echo "5. Backend papkasiga qaytish..."
cd backend

echo "6. Source faylni tekshirish..."
if [ ! -f "src/settings/sip-extension.service.ts" ]; then
    echo "❌ Source fayl topilmadi!"
    exit 1
fi

echo "7. Source fayl ichidagi kodni ko'rsatish..."
echo "---"
cat src/settings/sip-extension.service.ts | grep -A 15 "getExtensions"
echo "---"

if grep -q "allOperators.filter" src/settings/sip-extension.service.ts; then
    echo "✅ Source fayl to'g'ri"
else
    echo "❌ XATO: Source fayl noto'g'ri!"
    echo "Git pull qilingan kodni tekshiring"
    exit 1
fi

echo "8. Database Migration..."
npx prisma db push

echo "9. Prisma Client Generate..."
npx prisma generate

echo "10. Node modules cache ni tozalash..."
rm -rf node_modules/.cache
npm cache clean --force

echo "11. Build qilish..."
npm run build

echo "12. Build faylini tekshirish..."
if [ ! -f "dist/src/settings/sip-extension.service.js" ]; then
    echo "❌ Build fayl topilmadi!"
    exit 1
fi

echo "13. Build fayl ichidagi kodni ko'rsatish..."
echo "---"
cat dist/src/settings/sip-extension.service.js | grep -A 15 "getExtensions" | head -20
echo "---"

if grep -q "allOperators.filter" dist/src/settings/sip-extension.service.js; then
    echo "✅ Build fayl to'g'ri"
else
    echo "❌ XATO: Build fayl noto'g'ri!"
    echo "Build fayl ichida:"
    cat dist/src/settings/sip-extension.service.js | grep -A 20 "getExtensions"
    exit 1
fi

echo "14. PM2 ni qayta ishga tushirish..."
pm2 start dist/src/main.js --name call-center-backend --update-env

echo "15. PM2 status..."
pm2 status

echo "16. 5 soniya kutish (backend ishga tushishi uchun)..."
sleep 5

echo "17. Error loglarini tekshirish..."
pm2 logs call-center-backend --err --lines 30 --nostream

echo ""
echo "=========================================="
echo "✅ To'liq clean va rebuild yakunlandi!"
echo "=========================================="
echo ""
echo "Tekshirish uchun:"
echo "  pm2 logs call-center-backend --err --lines 50"
echo "  curl http://localhost:4000/settings/sip-extensions"

