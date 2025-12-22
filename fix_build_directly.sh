#!/bin/bash

# Build Faylini To'g'ridan-to'g'ri Tuzatish Script
# Bu scriptni serverda ishga tushiring

set -e

echo "=========================================="
echo "Build Faylini To'g'ridan-to'g'ri Tuzatish"
echo "=========================================="

cd /var/www/call-center/backend

echo "1. Build faylini backup qilish..."
cp dist/src/settings/sip-extension.service.js dist/src/settings/sip-extension.service.js.backup.$(date +%s)

echo "2. Build fayl ichidagi getExtensions metodini topish..."
if grep -q "getExtensions" dist/src/settings/sip-extension.service.js; then
    echo "✅ getExtensions metodi topildi"
else
    echo "❌ getExtensions metodi topilmadi!"
    exit 1
fi

echo "3. Hozirgi kodni ko'rsatish..."
echo "---"
grep -A 20 "async getExtensions" dist/src/settings/sip-extension.service.js | head -25
echo "---"

echo "4. Build faylni tuzatish..."

# Temporary fayl yaratish
TEMP_FILE=$(mktemp)

# Build faylni o'qish va tuzatish
node << 'EOF'
const fs = require('fs');
const path = require('path');

const filePath = '/var/www/call-center/backend/dist/src/settings/sip-extension.service.js';
let content = fs.readFileSync(filePath, 'utf8');

// Eski kodni topish va yangilash
const oldPattern = /async getExtensions\(\)\s*\{[\s\S]*?const operators = await this\.prisma\.operator\.findMany\(\{[\s\S]*?where:\s*\{[\s\S]*?extension:\s*\{[\s\S]*?not:[\s\S]*?\}[\s\S]*?\}[\s\S]*?\}[\s\S]*?\}\)[\s\S]*?return operators[\s\S]*?\}/;

const newCode = `async getExtensions() {
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
}`;

if (oldPattern.test(content)) {
    content = content.replace(oldPattern, newCode);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ Build fayl tuzatildi');
} else {
    // Agar pattern topilmasa, boshqa usul bilan tuzatish
    const lines = content.split('\n');
    let inGetExtensions = false;
    let braceCount = 0;
    let startLine = -1;
    let endLine = -1;
    
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('async getExtensions')) {
            inGetExtensions = true;
            startLine = i;
            braceCount = 0;
        }
        
        if (inGetExtensions) {
            braceCount += (lines[i].match(/\{/g) || []).length;
            braceCount -= (lines[i].match(/\}/g) || []).length;
            
            if (braceCount === 0 && startLine !== -1 && i > startLine) {
                endLine = i;
                break;
            }
        }
    }
    
    if (startLine !== -1 && endLine !== -1) {
        const before = lines.slice(0, startLine).join('\n');
        const after = lines.slice(endLine + 1).join('\n');
        const fixed = before + '\n' + newCode + '\n' + after;
        fs.writeFileSync(filePath, fixed, 'utf8');
        console.log('✅ Build fayl tuzatildi (alternativ usul)');
    } else {
        console.log('❌ getExtensions metodini topib bo\'lmadi');
        process.exit(1);
    }
}
EOF

echo "5. Tuzatilgan kodni tekshirish..."
if grep -q "allOperators.filter" dist/src/settings/sip-extension.service.js; then
    echo "✅ Build fayl to'g'ri tuzatildi"
else
    echo "❌ XATO: Build fayl tuzatilmadi!"
    echo "Qo'lda tuzatish kerak"
    exit 1
fi

echo "6. Tuzatilgan kodni ko'rsatish..."
echo "---"
grep -A 15 "async getExtensions" dist/src/settings/sip-extension.service.js | head -20
echo "---"

echo "7. PM2 ni restart..."
pm2 restart call-center-backend

echo "8. 5 soniya kutish..."
sleep 5

echo "9. Error loglarini tekshirish..."
pm2 logs call-center-backend --err --lines 20 --nostream

echo ""
echo "=========================================="
echo "✅ Tuzatish yakunlandi!"
echo "=========================================="

