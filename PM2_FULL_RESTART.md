# PM2 Full Restart - Eski Build Fayl Ishlatilmoqda

## 🐛 Muammo

Fayl to'g'ri yangilangan, lekin PM2 hali ham eski build faylini ishlatmoqda.

## ✅ Yechim

To'liq rebuild va PM2 ni to'liq restart qilish.

## 🔧 Qadamlari

```bash
# Serverda
cd /var/www/call-center/backend

# 1. PM2 ni to'xtatish va o'chirish
pm2 delete call-center-backend

# 2. Eski build fayllarni o'chirish
rm -rf dist
rm -rf node_modules/.cache

# 3. To'liq rebuild
npm run build

# 4. Build muvaffaqiyatli bo'lganligini tekshirish
ls -la dist/src/main.js dist/main.js

# 5. PM2 ni yangi build bilan ishga tushirish
if [ -f "dist/src/main.js" ]; then
    pm2 start dist/src/main.js --name call-center-backend --update-env
elif [ -f "dist/main.js" ]; then
    pm2 start dist/main.js --name call-center-backend --update-env
else
    echo "Build fayl topilmadi!"
    exit 1
fi

# 6. Tekshirish
pm2 status
pm2 logs call-center-backend --err --lines 30
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

- ✅ PM2 to'liq restart qilindi
- ✅ Yangi build fayl ishlatilmoqda
- ✅ Xatolik hal qilindi

