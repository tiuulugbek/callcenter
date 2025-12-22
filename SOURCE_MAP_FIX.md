# Source Map Fix - Error Logda Eski Kod

## 🐛 Muammo

Source va build fayllar to'g'ri, lekin error logda hali ham eski kod ko'rsatilmoqda. Bu source map muammosini anglatadi.

## ✅ Yechim

Source map fayllarni o'chirib, qayta build qilish.

## 🔧 Qadamlari

```bash
# Serverda
cd /var/www/call-center/backend

# 1. Barcha source map fayllarni o'chirish
find dist -name "*.map" -delete

# 2. To'liq clean build
rm -rf dist
rm -rf node_modules/.cache
rm -rf .nest
rm -rf tsconfig.tsbuildinfo

# 3. Build (source map o'chirish)
npm run build

# 4. PM2 ni to'liq restart
pm2 delete call-center-backend
pm2 kill
sleep 2
pm2 start dist/src/main.js --name call-center-backend --update-env

# 5. Tekshirish
pm2 logs call-center-backend --err --lines 30
```

## 🔍 Yoki tsconfig.json da Source Map O'chirish

```bash
# tsconfig.json ni tekshirish
cat tsconfig.json | grep sourceMap

# Agar sourceMap: true bo'lsa, o'chirish
nano tsconfig.json
# sourceMap: false qiling
```

Keyin rebuild qiling.

## ✅ Tekshirish

```bash
# Error loglarida xatolik yo'qligini tekshiring
pm2 logs call-center-backend --err --lines 30

# Agar xatolik bo'lmasa, muvaffaqiyatli!

# Yoki API ni test qiling
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:4000/settings/sip-extensions
```

## 🎯 Natija

- ✅ Source map tozalandi
- ✅ Yangi build fayl ishlatilmoqda
- ✅ Xatolik hal qilindi

