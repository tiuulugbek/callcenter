#!/bin/bash

# Build Xatoliklarni Tekshirish Script

cd /var/www/call-center/backend

echo "=========================================="
echo "Build Xatoliklarni Tekshirish"
echo "=========================================="

# 1. Build logni ko'rish
echo "1. Build log:"
if [ -f "build.log" ]; then
    echo "--- Build Log (oxirgi 100 qator) ---"
    tail -100 build.log
else
    echo "Build log topilmadi. Build qilish..."
    npm run build 2>&1 | tee build.log
    echo "--- Build Log ---"
    tail -100 build.log
fi

echo ""
echo "=========================================="

# 2. TypeScript xatoliklarni ko'rish
echo "2. TypeScript xatoliklar:"
if [ -f "typescript-errors.log" ]; then
    echo "--- TypeScript Errors ---"
    cat typescript-errors.log
else
    echo "TypeScript check qilish..."
    npx tsc --noEmit 2>&1 | tee typescript-errors.log
    echo "--- TypeScript Errors ---"
    cat typescript-errors.log
fi

echo ""
echo "=========================================="

# 3. Dependencies tekshirish
echo "3. Dependencies tekshirish:"
if [ ! -d "node_modules" ]; then
    echo "Dependencies yo'q! O'rnatilmoqda..."
    npm install
else
    echo "Dependencies mavjud"
fi

echo ""
echo "=========================================="

# 4. Prisma tekshirish
echo "4. Prisma tekshirish:"
if [ ! -d "node_modules/.prisma" ]; then
    echo "Prisma generate qilish..."
    npx prisma generate
else
    echo "Prisma mavjud"
fi

echo ""
echo "=========================================="

# 5. Dist papka tekshirish
echo "5. Dist papka tekshirish:"
if [ -d "dist" ]; then
    echo "Dist papka mavjud:"
    ls -la dist/ | head -20
else
    echo "Dist papka yo'q!"
fi

echo ""
echo "=========================================="

# 6. Xatoliklarni qidirish
echo "6. Xatoliklarni qidirish:"
if [ -f "build.log" ]; then
    echo "--- Error qatorlar ---"
    grep -i "error" build.log | head -20
    echo ""
    echo "--- Warning qatorlar ---"
    grep -i "warning" build.log | head -20
fi

echo ""
echo "=========================================="
echo "Tekshirish tugadi!"
echo "=========================================="

