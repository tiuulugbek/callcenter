#!/bin/bash

# Force Build Script

set -e

cd /var/www/call-center/backend

echo "=========================================="
echo "Force Build"
echo "=========================================="

# 1. To'liq clean
echo "1. To'liq clean..."
rm -rf dist
rm -rf node_modules/.cache
rm -f tsconfig.tsbuildinfo

# 2. Dependencies
echo "2. Dependencies..."
npm install

# 3. Prisma
echo "3. Prisma generate..."
npx prisma generate

# 4. NestJS build (verbose)
echo "4. NestJS build (verbose)..."
npx nest build --verbose 2>&1 | tee build-verbose.log

# 5. Tekshirish
echo "5. Tekshirish..."
if [ -f "dist/main.js" ]; then
    echo "✅ Build muvaffaqiyatli!"
    ls -lh dist/main.js
    echo ""
    echo "Dist papka ichida:"
    ls -la dist/
else
    echo "❌ Build muvaffaqiyatsiz!"
    echo ""
    echo "Build log:"
    cat build-verbose.log | tail -50
    echo ""
    echo "Dist papka ichida:"
    ls -la dist/ 2>/dev/null || echo "Dist papka yo'q"
    exit 1
fi

echo "=========================================="

