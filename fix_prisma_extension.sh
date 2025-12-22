#!/bin/bash

# Prisma Extension Query Fix Script
# Serverda ishga tushirish uchun

echo "=== Prisma Extension Query Fix ==="

# Fayl manzili
FILE="/var/www/call-center/backend/src/settings/sip-extension.service.ts"

# Backup yaratish
echo "Backup yaratilmoqda..."
cp "$FILE" "${FILE}.backup.$(date +%Y%m%d_%H%M%S)"

# Yangi kod
NEW_CODE='  async getExtensions() {
    // Database dan extensionlarni olish
    // Barcha operatorlarni olish va keyin filter qilish
    const allOperators = await this.prisma.operator.findMany({
      select: {
        id: true,
        name: true,
        extension: true,
        status: true,
      },
    });

    // Extension mavjud bo\'lgan operatorlarni qaytarish
    return allOperators.filter(op => op.extension !== null && op.extension !== \'\');
  }'

# Eski kodni topish va yangilash
echo "Fayl yangilanmoqda..."
sed -i '/async getExtensions() {/,/^  }/c\'"$NEW_CODE" "$FILE"

# Build va restart
echo "Build qilinmoqda..."
cd /var/www/call-center/backend
npm run build

echo "PM2 restart qilinmoqda..."
pm2 restart call-center-backend --update-env

echo "=== Tugadi ==="
echo "Error loglarni tekshiring: pm2 logs call-center-backend --err --lines 50"

