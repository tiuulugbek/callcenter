# PM2 Processlarni Tozalash

## Eski Processlarni O'chirish

```bash
# PM2 da barcha processlarni ko'rish
pm2 list

# Eski processlarni o'chirish
pm2 delete acoustic-backend
pm2 delete acoustic-frontend

# Yoki barchasini o'chirish
pm2 delete all

# PM2 save
pm2 save
```

## Build Muammosini Hal Qilish

Build ishlayapti lekin `dist/main.js` yaratilmayapti. Bu TypeScript konfiguratsiyasi muammosi bo'lishi mumkin.

### Tekshirish

```bash
cd /var/www/call-center/backend

# dist papkasini ko'rish
ls -la dist/

# TypeScript konfiguratsiyasini tekshirish
cat tsconfig.json

# nest-cli.json tekshirish
cat nest-cli.json
```

### Yechim

```bash
cd /var/www/call-center/backend

# dist papkasini tozalash
rm -rf dist/

# Qayta build
npm run build

# Build tekshirish
ls -la dist/
ls -la dist/main.js
```

## To'liq Qadamlar

```bash
# 1. Eski PM2 processlarni o'chirish
pm2 delete acoustic-backend
pm2 delete acoustic-frontend
pm2 save

# 2. Backend build
cd /var/www/call-center/backend
rm -rf dist/
npm run build
ls -la dist/main.js

# 3. PM2 da yangi backend ni ishga tushirish
pm2 start dist/main.js --name call-center-backend --update-env
pm2 save

# 4. PM2 status
pm2 status
```

