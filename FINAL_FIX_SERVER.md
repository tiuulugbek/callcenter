# Final Fix - Serverda Build Faylini Tuzatish

## 🔍 Muammo

Error logda hali ham eski kod ko'rsatilmoqda. Bu source map muammosi yoki build cache muammosi bo'lishi mumkin.

## ✅ Yechim

### 1. Build Faylini Tekshirish

Serverda quyidagilarni bajaring:

```bash
cd /var/www/call-center/backend

# Source faylni tekshirish
cat src/settings/sip-extension.service.ts | grep -A 10 "getExtensions"

# Build faylni tekshirish
cat dist/src/settings/sip-extension.service.js | grep -A 10 "getExtensions"
```

### 2. Agar Build Fayl Noto'g'ri Bo'lsa

```bash
cd /var/www/call-center/backend

# To'liq clean
rm -rf dist
rm -rf node_modules/.cache
rm -rf .nest
rm -rf tsconfig.tsbuildinfo

# Source map ni o'chirish (tsconfig.json da)
# "sourceMap": false, qiling
nano tsconfig.json

# Build
npm run build

# Build faylni tekshirish
cat dist/src/settings/sip-extension.service.js | grep -A 15 "getExtensions"
```

### 3. PM2 ni To'liq Restart

```bash
# PM2 ni to'liq o'chirish
pm2 delete call-center-backend
pm2 kill
rm -rf ~/.pm2

# 5 soniya kutish
sleep 5

# Qayta ishga tushirish
cd /var/www/call-center/backend
pm2 start dist/src/main.js --name call-center-backend --update-env

# Loglar
pm2 logs call-center-backend --err --lines 30
```

### 4. Script Orqali (Tavsiya)

```bash
cd /var/www/call-center
git pull origin main
chmod +x check_and_fix_build.sh
./check_and_fix_build.sh
```

## 🔧 Qo'lda Tuzatish

Agar build fayl hali ham noto'g'ri bo'lsa, JavaScript faylni to'g'ridan-to'g'ri tuzatish:

```bash
cd /var/www/call-center/backend

# Build faylni backup qilish
cp dist/src/settings/sip-extension.service.js dist/src/settings/sip-extension.service.js.backup

# Build faylni tahrirlash
nano dist/src/settings/sip-extension.service.js

# getExtensions metodini toping va quyidagiga o'zgartiring:
# 
# async getExtensions() {
#     const allOperators = await this.prisma.operator.findMany({
#         select: {
#             id: true,
#             name: true,
#             extension: true,
#             status: true,
#         },
#     });
#     return allOperators.filter(op => op.extension !== null && op.extension !== '');
# }

# PM2 restart
pm2 restart call-center-backend
```

## ✅ Tekshirish

```bash
# Error loglarida xatolik yo'qligini tekshiring
pm2 logs call-center-backend --err --lines 50

# API test
curl http://localhost:4000/settings/sip-extensions
```

## 📋 Checklist

- [ ] Source fayl to'g'ri
- [ ] Build fayl to'g'ri
- [ ] Source map o'chirildi (yoki to'g'ri)
- [ ] PM2 to'liq restart qilindi
- [ ] Error loglarida xatolik yo'q
- [ ] API ishlayapti

