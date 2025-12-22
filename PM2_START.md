# PM2 da Backend Ishga Tushirish

## Muammo
```
[PM2][ERROR] Process or Namespace call-center-backend not found
```

Bu shuni anglatadiki, PM2 da process hali ishga tushirilmagan.

## Yechim

### 1. Build Tekshirish

```bash
cd /var/www/call-center/backend

# Build muvaffaqiyatli bo'lganini tekshirish
ls -la dist/main.js

# Agar build bo'lmasa
npm run build
```

### 2. PM2 da Ishga Tushirish

```bash
cd /var/www/call-center/backend

# PM2 da ishga tushirish
pm2 start dist/main.js --name call-center-backend

# Yoki .env fayl bilan
pm2 start dist/main.js --name call-center-backend --update-env

# PM2 status
pm2 status

# PM2 loglar
pm2 logs call-center-backend
```

### 3. PM2 Save va Startup

```bash
# PM2 ni saqlash
pm2 save

# PM2 startup (server qayta ishga tushganda avtomatik ishga tushishi uchun)
pm2 startup
```

### 4. Tekshirish

```bash
# PM2 status
pm2 status

# PM2 loglar
pm2 logs call-center-backend

# Backend ishlayaptimi?
curl http://localhost:4000/auth/login

# Yoki
curl http://localhost:4000
```

## To'liq Qadamlar

```bash
cd /var/www/call-center/backend

# 1. Build
npm run build

# 2. Build tekshirish
ls -la dist/main.js

# 3. PM2 da ishga tushirish
pm2 start dist/main.js --name call-center-backend --update-env

# 4. PM2 status
pm2 status

# 5. PM2 save
pm2 save

# 6. PM2 startup
pm2 startup

# 7. Loglar
pm2 logs call-center-backend
```

## Muammolar

### Build Xatosi

```bash
# TypeScript xatolari
npm run build

# Agar xatolar bo'lsa, loglarni ko'rish
npm run build 2>&1 | tee build.log
```

### PM2 Start Xatosi

```bash
# .env fayl mavjudmi?
ls -la .env

# .env faylini tekshirish
cat .env | grep -v PASSWORD

# Port 4000 bandmi?
netstat -tlnp | grep 4000
# Yoki
ss -tlnp | grep 4000
```

### Backend Ishlamayapti

```bash
# PM2 loglar
pm2 logs call-center-backend --lines 50

# Qo'lda ishga tushirish (test)
cd /var/www/call-center/backend
node dist/main.js

# Xatolarni ko'rish
```

## PM2 Buyruqlar

```bash
# Barcha processlar
pm2 list

# Process ni to'xtatish
pm2 stop call-center-backend

# Process ni qayta ishga tushirish
pm2 restart call-center-backend

# Process ni o'chirish
pm2 delete call-center-backend

# Barcha loglar
pm2 logs

# Monitoring
pm2 monit
```

