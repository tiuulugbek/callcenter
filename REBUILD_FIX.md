# Rebuild Fix - Fayl Yangilangan, Lekin Xatolik Bor

## 🐛 Muammo

Fayl yangilangan, lekin hali ham xatolik bor. Bu shuni anglatadiki:
- Build qilinmagan
- Yoki PM2 restart qilinmagan
- Yoki TypeScript cache muammosi

## ✅ To'liq Rebuild Qadamlari

```bash
# Serverda
cd /var/www/call-center/backend

# 1. Faylni tekshirish (yangilanganligini)
cat src/settings/sip-extension.service.ts | grep -A 10 "getExtensions"

# 2. TypeScript cache ni tozalash
rm -rf dist
rm -rf node_modules/.cache

# 3. To'liq rebuild
npm run build

# 4. PM2 ni to'liq restart (delete va start)
pm2 delete call-center-backend
pm2 start dist/src/main.js --name call-center-backend
# yoki
pm2 start dist/main.js --name call-center-backend

# 5. Tekshirish
pm2 logs call-center-backend --err --lines 20
```

## 🔍 Faylni Tekshirish

```bash
# Fayl to'g'ri yangilanganligini tekshiring
cat src/settings/sip-extension.service.ts | grep -A 15 "async getExtensions"

# Ko'rinishi kerak:
# async getExtensions() {
#   const allOperators = await this.prisma.operator.findMany({
#     select: {
#       id: true,
#       ...
#     },
#   });
#   return allOperators.filter(op => op.extension !== null && op.extension !== '');
# }
```

## 🎯 Agar Hali Ham Xatolik Bo'lsa

### 1. Faylni Qayta Tekshirish

```bash
nano src/settings/sip-extension.service.ts
```

188-200 qatorlarni tekshiring. Quyidagicha bo'lishi kerak:

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

### 2. To'liq Clean Build

```bash
cd /var/www/call-center/backend

# Barcha cache va build fayllarni o'chirish
rm -rf dist
rm -rf node_modules/.cache
rm -rf .nest

# Build
npm run build

# PM2 ni to'liq restart
pm2 delete call-center-backend
pm2 start dist/src/main.js --name call-center-backend --update-env
# yoki
pm2 start dist/main.js --name call-center-backend --update-env

# Tekshirish
pm2 logs call-center-backend --err --lines 30
```

## ✅ Tekshirish

```bash
# Error loglarida xatolik yo'qligini tekshiring
pm2 logs call-center-backend --err --lines 30

# Agar xatolik bo'lmasa, muvaffaqiyatli!
```

