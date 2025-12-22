# Build File Check - Eski Kod Build Faylida

## 🐛 Muammo

Error logda 188 qator ko'rsatilmoqda, lekin source faylda to'g'ri kod bor. Bu shuni anglatadiki, build faylida hali ham eski kod bor.

## ✅ Yechim

Build faylini tekshirib, qayta build qilish.

## 🔧 Qadamlari

```bash
# Serverda
cd /var/www/call-center/backend

# 1. Build faylini tekshirish
grep -A 10 "getExtensions" dist/src/settings/sip-extension.service.js

# 2. Agar eski kod bo'lsa, to'liq rebuild
rm -rf dist
rm -rf node_modules/.cache
npm run build

# 3. Build faylini qayta tekshirish
grep -A 10 "getExtensions" dist/src/settings/sip-extension.service.js

# 4. PM2 restart
pm2 delete call-center-backend
pm2 start dist/src/main.js --name call-center-backend --update-env

# 5. Tekshirish
pm2 logs call-center-backend --err --lines 30
```

## 🔍 Build Faylini Tekshirish

```bash
# Build faylida to'g'ri kod bo'lishi kerak
grep -A 10 "getExtensions" dist/src/settings/sip-extension.service.js

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

## ✅ Agar Hali Ham Xatolik Bo'lsa

```bash
# TypeScript cache ni to'liq tozalash
rm -rf dist
rm -rf node_modules/.cache
rm -rf .nest
rm -rf tsconfig.tsbuildinfo

# Qayta build
npm run build

# PM2 restart
pm2 delete call-center-backend
pm2 start dist/src/main.js --name call-center-backend --update-env

# Tekshirish
pm2 logs call-center-backend --err --lines 30
```

