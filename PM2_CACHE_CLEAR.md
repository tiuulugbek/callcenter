# PM2 Cache Clear - Eski Kod Hali Ham Kelyapti

## 🐛 Muammo

Build faylida to'g'ri kod bor, lekin PM2 hali ham eski kodni ishlatmoqda. Bu PM2 cache muammosini anglatadi.

## ✅ Yechim

PM2 cache ni tozalash va to'liq restart qilish.

## 🔧 Qadamlari

```bash
# Serverda
cd /var/www/call-center/backend

# 1. PM2 ni to'liq o'chirish
pm2 delete call-center-backend
pm2 kill  # Barcha PM2 processlarni to'xtatish

# 2. PM2 cache ni tozalash
pm2 flush

# 3. Bir necha soniya kutish
sleep 2

# 4. PM2 ni qayta ishga tushirish
pm2 start dist/src/main.js --name call-center-backend --update-env

# 5. Tekshirish
pm2 status
pm2 logs call-center-backend --err --lines 30
```

## 🔍 Yoki To'liq Clean Restart

```bash
# 1. PM2 ni to'xtatish
pm2 delete all
pm2 kill

# 2. Bir necha soniya kutish
sleep 3

# 3. PM2 ni qayta ishga tushirish
cd /var/www/call-center/backend
pm2 start dist/src/main.js --name call-center-backend --update-env

# 4. Tekshirish
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

- ✅ PM2 cache tozalandi
- ✅ Yangi build fayl ishlatilmoqda
- ✅ Xatolik hal qilindi

