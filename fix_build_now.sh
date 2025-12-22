#!/bin/bash

# Build Faylini Tuzatish - Hozir
# Bu scriptni serverda ishga tushiring

set -e

echo "=========================================="
echo "Build Faylini Tuzatish - Hozir"
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

echo "4. Source fayl ichidagi kodni ko'rsatish..."
echo "---"
cat src/settings/sip-extension.service.ts | grep -A 15 "getExtensions"
echo "---"

if ! grep -q "allOperators.filter" src/settings/sip-extension.service.ts; then
    echo "❌ XATO: Source fayl noto'g'ri!"
    echo "Git pull qilingan kodni tekshiring"
    exit 1
fi

echo "✅ Source fayl to'g'ri"

echo "5. PM2 ni to'xtatish..."
pm2 delete call-center-backend || true
pm2 kill || true
sleep 3

echo "6. Barcha build va cache fayllarni o'chirish..."
rm -rf dist
rm -rf node_modules/.cache
rm -rf .nest
rm -rf tsconfig.tsbuildinfo
find . -name "*.js.map" -delete 2>/dev/null || true
find . -name "*.d.ts.map" -delete 2>/dev/null || true

echo "7. Database Migration..."
npx prisma db push

echo "8. Prisma Client Generate..."
npx prisma generate

echo "9. Build qilish..."
npm run build

echo "10. Build faylini tekshirish..."
if [ ! -f "dist/src/settings/sip-extension.service.js" ]; then
    echo "❌ Build fayl topilmadi!"
    echo "Build xatosi bo'lishi mumkin. Quyidagilarni tekshiring:"
    echo "  npm run build"
    exit 1
fi

echo "11. Build fayl ichidagi kodni ko'rsatish..."
echo "---"
cat dist/src/settings/sip-extension.service.js | grep -A 15 "getExtensions" | head -20
echo "---"

if ! grep -q "allOperators.filter" dist/src/settings/sip-extension.service.js; then
    echo "❌ XATO: Build fayl noto'g'ri!"
    echo "Build fayl ichida:"
    cat dist/src/settings/sip-extension.service.js | grep -A 20 "getExtensions"
    exit 1
fi

echo "✅ Build fayl to'g'ri"

echo "12. PM2 ni qayta ishga tushirish..."
pm2 start dist/src/main.js --name call-center-backend --update-env

echo "13. PM2 status..."
pm2 status

echo "14. 5 soniya kutish (backend ishga tushishi uchun)..."
sleep 5

echo "15. Error loglarini tekshirish..."
pm2 logs call-center-backend --err --lines 30 --nostream

echo ""
echo "=========================================="
echo "✅ Build fayl tuzatildi!"
echo "=========================================="

