#!/bin/bash

# Backend Build Debug Script

set -e

echo "=========================================="
echo "Backend Build Debug boshlandi..."
echo "=========================================="

cd /var/www/call-center/backend

# 1. Dependencies tekshirish
echo "1. Dependencies tekshirilmoqda..."
if [ ! -d "node_modules" ]; then
    echo "Dependencies o'rnatilmoqda..."
    npm install
else
    echo "Dependencies mavjud"
fi

# 2. Prisma generate
echo "2. Prisma generate..."
npx prisma generate || echo "Prisma generate xatolik, lekin davom etamiz..."

# 3. Eski build fayllarni o'chirish
echo "3. Eski build fayllarni o'chirish..."
rm -rf dist
rm -rf node_modules/.cache

# 4. TypeScript check
echo "4. TypeScript check..."
npx tsc --noEmit 2>&1 | tee typescript-errors.log || echo "TypeScript xatoliklar bor, lekin davom etamiz..."

# 5. Build
echo "5. Build..."
npm run build 2>&1 | tee build.log

# 6. Build tekshirish
echo "6. Build tekshirish..."
if [ -f "dist/main.js" ]; then
    echo "✅ Build muvaffaqiyatli! dist/main.js topildi"
    ls -lh dist/main.js
else
    echo "❌ Build muvaffaqiyatsiz! dist/main.js topilmadi"
    echo "Build log:"
    cat build.log | tail -50
    echo ""
    echo "TypeScript xatoliklar:"
    cat typescript-errors.log | tail -50
    exit 1
fi

echo "=========================================="
echo "Backend Build Debug tugadi!"
echo "=========================================="

