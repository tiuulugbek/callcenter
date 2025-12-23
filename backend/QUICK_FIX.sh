#!/bin/bash

# Quick Fix Script

cd /var/www/call-center/backend

echo "=========================================="
echo "Quick Fix"
echo "=========================================="

# 1. Git stash (local changes)
echo "1. Git stash..."
git stash

# 2. Git pull
echo "2. Git pull..."
git pull origin main

# 3. Clean
echo "3. Clean..."
rm -rf dist
rm -f tsconfig.tsbuildinfo

# 4. TypeScript compile (to'g'ridan-to'g'ri)
echo "4. TypeScript compile..."
npx tsc

# 5. Tekshirish
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

