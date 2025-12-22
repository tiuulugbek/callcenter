# Build Muammosi

## Muammo
```
ls: cannot access 'dist/main.js': No such file or directory
```

Bu shuni anglatadiki, build qilinmagan yoki xato bo'lgan.

## Yechim

### 1. Build Qilish

```bash
cd /var/www/call-center/backend

# Build
npm run build

# Build tekshirish
ls -la dist/
ls -la dist/main.js
```

### 2. Agar Build Xatosi Bo'lsa

```bash
# TypeScript xatolarini ko'rish
npm run build 2>&1 | tee build.log

# Yoki
npm run build
```

### 3. Umumiy Xatolar

#### Database Connection Error
```bash
# .env faylini tekshirish
cat .env | grep DATABASE_URL

# PostgreSQL ishlayaptimi?
sudo systemctl status postgresql
```

#### TypeScript Xatolari
```bash
# TypeScript versiyasini tekshirish
npx tsc --version

# TypeScript config tekshirish
cat tsconfig.json
```

#### Missing Dependencies
```bash
# Paketlarni qayta o'rnatish
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 4. Build Muvaffaqiyatli Bo'lgandan Keyin

```bash
# Build tekshirish
ls -la dist/main.js

# PM2 da ishga tushirish
pm2 start dist/main.js --name call-center-backend --update-env

# PM2 status
pm2 status

# PM2 loglar
pm2 logs call-center-backend
```

## To'liq Qadamlar

```bash
cd /var/www/call-center/backend

# 1. Paketlar o'rnatilganini tekshirish
ls -la node_modules/

# 2. Build
npm run build

# 3. Build tekshirish
ls -la dist/main.js

# 4. PM2 da ishga tushirish
pm2 start dist/main.js --name call-center-backend --update-env

# 5. PM2 status
pm2 status
```

