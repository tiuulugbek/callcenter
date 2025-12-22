# Build va Restart - Fayl To'g'ri Yangilangan

## ✅ Fayl To'g'ri Yangilangan

Fayl to'g'ri yangilangan. Endi build va restart qilish kerak.

## 🔧 Qadamlari

```bash
# Serverda
cd /var/www/call-center/backend

# 1. TypeScript cache ni tozalash
rm -rf dist
rm -rf node_modules/.cache

# 2. Build
npm run build

# 3. Build faylini topish
ls -la dist/main.js dist/src/main.js

# 4. PM2 ni to'liq restart
pm2 delete call-center-backend

# To'g'ri faylni ishga tushirish
if [ -f "dist/src/main.js" ]; then
    pm2 start dist/src/main.js --name call-center-backend --update-env
elif [ -f "dist/main.js" ]; then
    pm2 start dist/main.js --name call-center-backend --update-env
else
    echo "Build fayl topilmadi!"
    exit 1
fi

# 5. Tekshirish
pm2 logs call-center-backend --err --lines 30
pm2 status
```

## ✅ Tekshirish

```bash
# Error loglarida xatolik yo'qligini tekshiring
pm2 logs call-center-backend --err --lines 30

# Agar xatolik bo'lmasa, muvaffaqiyatli!

# Settings API test qiling
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:4000/settings/sip-extensions
```

## 🎯 Natija

- ✅ Fayl yangilandi
- ✅ Build qilindi
- ✅ PM2 restart qilindi
- ✅ Xatolik hal qilindi

