#!/bin/bash

# Build Faylini Tekshirish va Tuzatish Script
# Bu scriptni serverda ishga tushiring

set -e

echo "=========================================="
echo "Build Faylini Tekshirish va Tuzatish"
echo "=========================================="

cd /var/www/call-center/backend

echo "1. Source faylni tekshirish..."
if grep -q "allOperators.filter" src/settings/sip-extension.service.ts; then
    echo "✅ Source fayl to'g'ri"
else
    echo "❌ XATO: Source fayl noto'g'ri!"
    exit 1
fi

echo "2. Build faylini tekshirish..."
if [ ! -f "dist/src/settings/sip-extension.service.js" ]; then
    echo "❌ Build fayl topilmadi! Build qiling..."
    npm run build
fi

echo "3. Build fayl ichidagi kodni tekshirish..."
if grep -q "allOperators.filter" dist/src/settings/sip-extension.service.js; then
    echo "✅ Build fayl to'g'ri"
else
    echo "❌ XATO: Build fayl noto'g'ri! Qayta build qilish..."
    
    # To'liq clean
    rm -rf dist
    rm -rf node_modules/.cache
    rm -rf .nest
    rm -rf tsconfig.tsbuildinfo
    
    # Build
    npm run build
    
    # Yana tekshirish
    if grep -q "allOperators.filter" dist/src/settings/sip-extension.service.js; then
        echo "✅ Build fayl to'g'ri (qayta build qilgandan keyin)"
    else
        echo "❌ XATO: Build fayl hali ham noto'g'ri!"
        echo "Build fayl ichida:"
        grep -A 15 "getExtensions" dist/src/settings/sip-extension.service.js || true
        exit 1
    fi
fi

echo "4. Build fayl ichidagi kodni ko'rsatish..."
echo "---"
grep -A 15 "getExtensions" dist/src/settings/sip-extension.service.js | head -20
echo "---"

echo "5. PM2 ni to'liq restart..."
pm2 delete call-center-backend || true
pm2 kill || true
sleep 5

echo "6. PM2 ni qayta ishga tushirish..."
pm2 start dist/src/main.js --name call-center-backend --update-env

echo "7. PM2 status..."
pm2 status

echo "8. 5 soniya kutish (backend ishga tushishi uchun)..."
sleep 5

echo "9. Error loglarini tekshirish..."
pm2 logs call-center-backend --err --lines 20 --nostream

echo ""
echo "=========================================="
echo "✅ Tekshirish yakunlandi!"
echo "=========================================="

