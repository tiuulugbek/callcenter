#!/bin/bash

# Quick Fix Script - Serverda ishga tushirish

FILE="/var/www/call-center/backend/src/settings/sip-extension.service.ts"

echo "=== Quick Fix Script ==="
echo "Fayl: $FILE"

# Backup
cp "$FILE" "${FILE}.backup.$(date +%Y%m%d_%H%M%S)"
echo "Backup yaratildi"

# Yangi kod
cat > /tmp/new_getExtensions.txt << 'EOF'
  async getExtensions() {
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

    // Extension mavjud bo'lgan operatorlarni qaytarish
    return allOperators.filter(op => op.extension !== null && op.extension !== '');
  }
EOF

# Eski funksiyani yangilash
sed -i '/async getExtensions() {/,/^  }/{
  /async getExtensions() {/r /tmp/new_getExtensions.txt
  /async getExtensions() {/,/^  }/d
}' "$FILE"

echo "Fayl yangilandi"

# Build
cd /var/www/call-center/backend
echo "Build qilinmoqda..."
npm run build

# Restart
echo "PM2 restart qilinmoqda..."
pm2 restart call-center-backend --update-env

echo "=== Tugadi ==="
echo "Tekshirish: pm2 logs call-center-backend --err --lines 20"

