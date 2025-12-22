# Source Map Fix Scriptni Ishga Tushirish

## 🔍 Muammo

Script root papkasida (`/var/www/call-center/fix_source_map.sh`), lekin backend papkasiga o'tib ketgan.

## ✅ Yechim

### Serverda Quyidagilarni Bajaring:

```bash
# Root papkasiga qaytish
cd /var/www/call-center

# Scriptni tekshirish
ls -la fix_source_map.sh

# Scriptni ishga tushirish
chmod +x fix_source_map.sh
./fix_source_map.sh
```

Yoki backend papkasida:

```bash
cd /var/www/call-center/backend

# Root papkasidagi scriptni ishga tushirish
chmod +x ../fix_source_map.sh
../fix_source_map.sh
```

Yoki qo'lda:

```bash
cd /var/www/call-center/backend

# Source map fayllarni o'chirish
find dist -name "*.js.map" -delete
find dist -name "*.d.ts.map" -delete

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

