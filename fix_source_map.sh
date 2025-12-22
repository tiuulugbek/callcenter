#!/bin/bash

# Source Map Muammosini Hal Qilish
# Bu scriptni serverda ishga tushiring

set -e

echo "=========================================="
echo "Source Map Muammosini Hal Qilish"
echo "=========================================="

cd /var/www/call-center/backend

echo "1. Source faylni tekshirish..."
if [ ! -f "src/settings/sip-extension.service.ts" ]; then
    echo "❌ Source fayl topilmadi!"
    exit 1
fi

echo "2. Source fayl ichidagi kodni ko'rsatish..."
echo "---"
cat src/settings/sip-extension.service.ts | grep -A 15 "getExtensions"
echo "---"

if ! grep -q "allOperators.filter" src/settings/sip-extension.service.ts; then
    echo "❌ XATO: Source fayl noto'g'ri!"
    echo "Git pull qilingan kodni tekshiring"
    exit 1
fi

echo "✅ Source fayl to'g'ri"

echo "3. Build faylni tekshirish..."
if [ ! -f "dist/src/settings/sip-extension.service.js" ]; then
    echo "❌ Build fayl topilmadi!"
    exit 1
fi

if ! grep -q "allOperators.filter" dist/src/settings/sip-extension.service.js; then
    echo "❌ XATO: Build fayl noto'g'ri!"
    exit 1
fi

echo "✅ Build fayl to'g'ri"

echo "4. Source map fayllarni o'chirish..."
find dist -name "*.js.map" -delete 2>/dev/null || true
find dist -name "*.d.ts.map" -delete 2>/dev/null || true

echo "5. tsconfig.json da sourceMap ni o'chirish..."
if grep -q '"sourceMap": true' tsconfig.json; then
    sed -i 's/"sourceMap": true/"sourceMap": false/g' tsconfig.json
    echo "✅ sourceMap o'chirildi"
    
    echo "6. Qayta build qilish..."
    rm -rf dist
    npm run build
    
    echo "7. Build faylni tekshirish..."
    if ! grep -q "allOperators.filter" dist/src/settings/sip-extension.service.js; then
        echo "❌ XATO: Build fayl noto'g'ri!"
        exit 1
    fi
    echo "✅ Build fayl to'g'ri"
else
    echo "✅ sourceMap allaqachon false"
fi

echo "8. PM2 ni to'xtatish..."
pm2 delete call-center-backend || true
pm2 kill || true
sleep 3

echo "9. PM2 cache ni tozalash..."
rm -rf ~/.pm2/logs/call-center-backend-error.log
rm -rf ~/.pm2/logs/call-center-backend-out.log
rm -rf ~/.pm2/pids/*

echo "10. PM2 ni qayta ishga tushirish..."
pm2 start dist/src/main.js --name call-center-backend --update-env

echo "11. PM2 status..."
pm2 status

echo "12. 5 soniya kutish (backend ishga tushishi uchun)..."
sleep 5

echo "13. Error loglarini tekshirish..."
pm2 logs call-center-backend --err --lines 30 --nostream

echo ""
echo "=========================================="
echo "✅ Source map muammosi hal qilindi!"
echo "=========================================="

