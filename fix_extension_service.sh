#!/bin/bash

# SIP Extension Service Build Faylini Tuzatish
# Bu scriptni serverda ishga tushiring

set -e

echo "=========================================="
echo "SIP Extension Service Build Faylini Tuzatish"
echo "=========================================="

cd /var/www/call-center/backend

echo "1. Build faylini backup qilish..."
BACKUP_FILE="dist/src/settings/sip-extension.service.js.backup.$(date +%s)"
cp dist/src/settings/sip-extension.service.js "$BACKUP_FILE"
echo "✅ Backup yaratildi: $BACKUP_FILE"

echo "2. Build faylni tuzatish..."

# Node.js orqali tuzatish
node << 'NODE_SCRIPT'
const fs = require('fs');
const filePath = '/var/www/call-center/backend/dist/src/settings/sip-extension.service.js';

let content = fs.readFileSync(filePath, 'utf8');

// Eski kod pattern (where clause bilan)
const oldPattern1 = /async getExtensions\(\)\s*\{[\s\S]*?const operators = await this\.prisma\.operator\.findMany\(\{[\s\S]*?where:\s*\{[\s\S]*?extension:\s*\{[\s\S]*?not:[\s\S]*?\}[\s\S]*?\}[\s\S]*?\}[\s\S]*?\}\)[\s\S]*?return operators[\s\S]*?\}/;

// Yangi kod
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

// Pattern topilgan bo'lsa, almashtirish
if (oldPattern1.test(content)) {
    content = content.replace(oldPattern1, newCode);
    console.log('✅ Pattern 1 topildi va tuzatildi');
} else {
    // Boshqa pattern - qatorlar orasida qidirish
    const lines = content.split('\n');
    let newLines = [];
    let skipUntilReturn = false;
    let inGetExtensions = false;
    let braceCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // getExtensions metodini topish
        if (line.includes('async getExtensions') || line.includes('getExtensions()')) {
            inGetExtensions = true;
            braceCount = 0;
            newLines.push('    async getExtensions() {');
            newLines.push('        // Database dan extensionlarni olish');
            newLines.push('        // Barcha operatorlarni olish va keyin filter qilish');
            newLines.push('        const allOperators = await this.prisma.operator.findMany({');
            newLines.push('            select: {');
            newLines.push('                id: true,');
            newLines.push('                name: true,');
            newLines.push('                extension: true,');
            newLines.push('                status: true,');
            newLines.push('            },');
            newLines.push('        });');
            newLines.push('        // Extension mavjud bo\'lgan operatorlarni qaytarish');
            newLines.push('        return allOperators.filter(op => op.extension !== null && op.extension !== \'\');');
            newLines.push('    }');
            skipUntilReturn = true;
            continue;
        }
        
        if (skipUntilReturn) {
            // Metod ichidagi qatorlarni o'tkazib yuborish
            braceCount += (line.match(/\{/g) || []).length;
            braceCount -= (line.match(/\}/g) || []).length;
            
            if (braceCount < 0 || (braceCount === 0 && line.trim() === '}')) {
                skipUntilReturn = false;
                inGetExtensions = false;
            }
            continue;
        }
        
        newLines.push(line);
    }
    
    content = newLines.join('\n');
    console.log('✅ Pattern 2 ishlatildi va tuzatildi');
}

// Faylni saqlash
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Build fayl yangilandi');
NODE_SCRIPT

echo "3. Tuzatilgan kodni tekshirish..."
if grep -q "allOperators.filter" dist/src/settings/sip-extension.service.js; then
    echo "✅ Build fayl to'g'ri tuzatildi"
else
    echo "❌ XATO: Build fayl tuzatilmadi!"
    echo "Qo'lda tuzatish kerak"
    exit 1
fi

echo "4. Tuzatilgan kodni ko'rsatish..."
echo "---"
grep -A 15 "async getExtensions" dist/src/settings/sip-extension.service.js | head -20
echo "---"

echo "5. PM2 ni restart..."
pm2 restart call-center-backend

echo "6. 5 soniya kutish..."
sleep 5

echo "7. Error loglarini tekshirish..."
pm2 logs call-center-backend --err --lines 30 --nostream

echo ""
echo "=========================================="
echo "✅ Tuzatish yakunlandi!"
echo "=========================================="
echo ""
echo "Agar hali ham xatolik bo'lsa, quyidagilarni bajaring:"
echo "  pm2 delete call-center-backend"
echo "  pm2 kill"
echo "  pm2 start dist/src/main.js --name call-center-backend"

