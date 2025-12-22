# Final Rebuild - To'liq Clean Build

## 🐛 Muammo

Xatolik hali ham ko'rsatilmoqda. Source faylni qayta tekshirib, to'liq rebuild qilish kerak.

## ✅ Yechim

Source faylni qayta tekshirib, to'liq clean build qilish.

## 🔧 Qadamlari

```bash
# Serverda
cd /var/www/call-center/backend

# 1. Source faylni tekshirish
cat src/settings/sip-extension.service.ts | grep -A 15 "async getExtensions"

# 2. Agar noto'g'ri bo'lsa, qo'lda yangilash
nano src/settings/sip-extension.service.ts

# 3. To'liq clean build
rm -rf dist
rm -rf node_modules/.cache
rm -rf .nest
rm -rf tsconfig.tsbuildinfo

# 4. Build
npm run build

# 5. Build faylini tekshirish
grep -A 10 "getExtensions" dist/src/settings/sip-extension.service.js

# 6. PM2 ni to'liq restart
pm2 delete call-center-backend
pm2 kill
sleep 2
pm2 start dist/src/main.js --name call-center-backend --update-env

# 7. Tekshirish
pm2 logs call-center-backend --err --lines 30
```

## 📝 Source Faylni Qo'lda Yangilash

```bash
nano src/settings/sip-extension.service.ts
```

`getExtensions` funksiyasini quyidagicha yangilang:

```typescript
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
```

**Muhim:** Fayl oxirida `}` bo'lishi kerak.

## ✅ Tekshirish

```bash
# Source fayl
cat src/settings/sip-extension.service.ts | grep -A 15 "async getExtensions"

# Build fayl
grep -A 10 "getExtensions" dist/src/settings/sip-extension.service.js

# Error loglar
pm2 logs call-center-backend --err --lines 30
```

