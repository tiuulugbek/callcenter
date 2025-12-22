# Source Map Fix - To'g'ri Buyruqlar

## 🔍 Muammo

Root papkasida `package.json` topilmadi. Backend papkasiga o'tish kerak.

## ✅ Yechim

### Serverda Quyidagilarni Bajaring:

```bash
# Backend papkasiga o'tish (MUHIM!)
cd /var/www/call-center/backend

# Source map fayllarni o'chirish
find dist -name "*.js.map" -delete 2>/dev/null || true
find dist -name "*.d.ts.map" -delete 2>/dev/null || true

# tsconfig.json da sourceMap ni o'chirish
sed -i 's/"sourceMap": true/"sourceMap": false/g' tsconfig.json

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

### Yoki Root Papkasidagi Scriptni Ishga Tushirish:

```bash
# Root papkasiga qaytish
cd /var/www/call-center

# Scriptni tekshirish
ls -la fix_source_map.sh

# Scriptni ishga tushirish (u o'zi backend papkasiga o'tadi)
chmod +x fix_source_map.sh
./fix_source_map.sh
```

## ✅ Tekshirish

```bash
cd /var/www/call-center/backend

# Source map fayllar o'chirilganligini tekshiring
find dist -name "*.js.map"

# tsconfig.json da sourceMap false bo'lishi kerak
cat tsconfig.json | grep sourceMap

# Build fayl to'g'ri ekanligini tekshiring
cat dist/src/settings/sip-extension.service.js | grep -A 15 "getExtensions"

# Error loglarida xatolik yo'qligini tekshiring
pm2 logs call-center-backend --err --lines 50
```

## 📋 Checklist

- [ ] Backend papkasiga o'tildi (`cd backend`)
- [ ] Source map fayllar o'chirildi
- [ ] tsconfig.json da sourceMap false
- [ ] Qayta build qilindi
- [ ] PM2 cache tozalandi
- [ ] PM2 qayta ishga tushirildi
- [ ] Error loglarida xatolik yo'q

