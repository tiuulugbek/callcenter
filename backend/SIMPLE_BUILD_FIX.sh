#!/bin/bash

# Oddiy Build Script (Xatoliksiz)

set -e

cd /var/www/call-center/backend

echo "=========================================="
echo "Backend Build"
echo "=========================================="

# 1. Clean
echo "1. Clean..."
rm -rf dist
rm -rf node_modules/.cache
rm -f tsconfig.tsbuildinfo

# 2. Dependencies
echo "2. Dependencies..."
npm install

# 3. Prisma
echo "3. Prisma generate..."
npx prisma generate

# 4. Build
echo "4. Build..."
npm run build 2>&1 | tee build.log

# 5. Tekshirish
echo "5. Tekshirish..."
if [ -f "dist/main.js" ]; then
    echo "✅ Build muvaffaqiyatli!"
    ls -lh dist/main.js
    echo ""
    echo "Dist papka ichida:"
    ls -la dist/ | head -20
else
    echo "❌ Build muvaffaqiyatsiz!"
    echo ""
    echo "Build log:"
    cat build.log | tail -50
    echo ""
    if [ -d "dist" ]; then
        echo "Dist papka ichida:"
        ls -la dist/
    else
        echo "Dist papka yo'q"
    fi
    exit 1
fi

echo "=========================================="
echo "Build tugadi!"
echo "=========================================="

