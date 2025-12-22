# Source Map Muammosini Hal Qilish

## 🔍 Muammo

Build fayl to'g'ri (`allOperators.filter` ko'rinmoqda), lekin error logda hali ham eski kod ko'rsatilmoqda. Bu source map muammosi.

## ✅ Yechim

### Serverda Quyidagilarni Bajaring:

```bash
ssh root@152.53.229.176

cd /var/www/call-center/backend

# Source faylni tekshirish
cat src/settings/sip-extension.service.ts | grep -A 15 "getExtensions"

# Build faylni tekshirish
cat dist/src/settings/sip-extension.service.js | grep -A 15 "getExtensions"

# Source map fayllarni o'chirish
find dist -name "*.js.map" -delete
find dist -name "*.d.ts.map" -delete

# tsconfig.json da sourceMap ni o'chirish
nano tsconfig.json
# "sourceMap": false, qiling

# Qayta build qilish
rm -rf dist
npm run build

# PM2 ni to'xtatish
pm2 delete call-center-backend
pm2 kill
sleep 3

# PM2 cache ni tozalash
rm -rf ~/.pm2/logs/call-center-backend-error.log
rm -rf ~/.pm2/logs/call-center-backend-out.log

# PM2 ni qayta ishga tushirish
pm2 start dist/src/main.js --name call-center-backend --update-env

# Loglar
pm2 logs call-center-backend --err --lines 30
```

### Yoki Script Orqali:

```bash
cd /var/www/call-center
git pull origin main
cd backend
chmod +x fix_source_map.sh
./fix_source_map.sh
```

## ✅ Tekshirish

### 1. Source Fayl

```bash
cat src/settings/sip-extension.service.ts | grep -A 15 "getExtensions"
```

### 2. Build Fayl

```bash
cat dist/src/settings/sip-extension.service.js | grep -A 15 "getExtensions"
```

### 3. Source Map Fayllar

```bash
find dist -name "*.js.map"
```

Agar hech qanday fayl topilmasa, yaxshi.

### 4. Error Loglar

```bash
pm2 logs call-center-backend --err --lines 50
```

Xatolik bo'lmasa, hech qanday xatolik ko'rsatilmaydi.

## 🔧 Agar Hali Ham Xatolik Bo'lsa

### PM2 ni To'liq Tozalash

```bash
pm2 kill
rm -rf ~/.pm2
pm2 start dist/src/main.js --name call-center-backend
```

### tsconfig.json ni To'liq Tekshirish

```bash
cat tsconfig.json | grep sourceMap
```

Agar `"sourceMap": true` bo'lsa, `false` qiling.

## 📋 Checklist

- [ ] Source fayl to'g'ri
- [ ] Build fayl to'g'ri
- [ ] Source map fayllar o'chirildi
- [ ] tsconfig.json da sourceMap false
- [ ] Qayta build qilindi
- [ ] PM2 cache tozalandi
- [ ] PM2 qayta ishga tushirildi
- [ ] Error loglarida xatolik yo'q

