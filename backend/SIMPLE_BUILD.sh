#!/bin/bash

# Oddiy Build Script (Xatoliklarni ko'rsatadi)

set -e

cd /var/www/call-center/backend

echo "=========================================="
echo "Backend Build"
echo "=========================================="

# Clean
echo "1. Clean..."
rm -rf dist

# Dependencies
echo "2. Dependencies..."
npm install

# Prisma
echo "3. Prisma generate..."
npx prisma generate

# Build (xatoliklarni ko'rsatadi)
echo "4. Build..."
npm run build

# Tekshirish
echo "5. Tekshirish..."
if [ -f "dist/main.js" ]; then
    echo "✅ Build muvaffaqiyatli!"
    ls -lh dist/main.js
else
    echo "❌ Build muvaffaqiyatsiz!"
    echo "Dist papka ichida:"
    ls -la dist/ 2>/dev/null || echo "Dist papka yo'q"
    exit 1
fi

echo "=========================================="

