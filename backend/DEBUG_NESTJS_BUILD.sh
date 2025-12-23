#!/bin/bash

# NestJS Build Debug Script

set -e

cd /var/www/call-center/backend

echo "=========================================="
echo "NestJS Build Debug"
echo "=========================================="

# 1. Entry point tekshirish
echo "1. Entry point tekshirish..."
if [ -f "src/main.ts" ]; then
    echo "✅ src/main.ts mavjud"
    head -5 src/main.ts
else
    echo "❌ src/main.ts topilmadi!"
    exit 1
fi

echo ""

# 2. NestJS CLI versiyasi
echo "2. NestJS CLI versiyasi..."
npx nest --version || echo "NestJS CLI topilmadi"

echo ""

# 3. TypeScript compilation
echo "3. TypeScript compilation..."
npx tsc --noEmit 2>&1 | head -20 || echo "TypeScript check tugadi"

echo ""

# 4. Clean
echo "4. Clean..."
rm -rf dist
rm -f tsconfig.tsbuildinfo

echo ""

# 5. NestJS build (batafsil)
echo "5. NestJS build..."
npx nest build 2>&1 | tee nest-build.log

echo ""

# 6. Tekshirish
echo "6. Tekshirish..."
if [ -f "dist/main.js" ]; then
    echo "✅ Build muvaffaqiyatli! dist/main.js topildi"
    ls -lh dist/main.js
else
    echo "❌ Build muvaffaqiyatsiz!"
    echo ""
    echo "NestJS build log:"
    cat nest-build.log
    echo ""
    echo "Dist papka ichida:"
    ls -la dist/ 2>/dev/null || echo "Dist papka yo'q"
    echo ""
    echo "TypeScript compilation sinab ko'ramiz..."
    npx tsc
    if [ -f "dist/main.js" ]; then
        echo "✅ TypeScript compilation muvaffaqiyatli!"
    else
        echo "❌ TypeScript compilation ham muvaffaqiyatsiz!"
    fi
    exit 1
fi

echo "=========================================="

