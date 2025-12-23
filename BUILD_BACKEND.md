# Backend Build Qo'llanmasi

## Xatolik

```
[PM2][ERROR] Error: Script not found: /var/www/call-center/backend/dist/main.js
```

## Sabab

Backend build qilinmagan yoki `dist` papkasi yo'q.

## Yechim

### 1. Backend ni Build Qilish

```bash
ssh root@152.53.229.176
cd /var/www/call-center/backend

# Dependencies tekshirish
npm install

# Prisma migration (agar kerak bo'lsa)
npx prisma migrate deploy
# Yoki
npx prisma migrate resolve --applied 20250101000000_init

# Build
npm run build

# Build muvaffaqiyatli bo'lganini tekshirish
ls -la dist/main.js
```

### 2. PM2 da Ishga Tushirish

```bash
cd /var/www/call-center

# Ecosystem config orqali
pm2 start ecosystem.config.js

# Yoki to'g'ridan-to'g'ri
pm2 start backend/dist/main.js --name call-center-backend

# PM2 ni saqlash
pm2 save
```

### 3. Tekshirish

```bash
# Processlar holati
pm2 list

# Backend loglarini ko'rish
pm2 logs call-center-backend

# Backend ishlayaptimi?
curl http://localhost:4000/api/health
```

## To'liq Build va Deploy

```bash
ssh root@152.53.229.176
cd /var/www/call-center

# Git pull
git pull origin main

# Backend build
cd backend
npm install
npx prisma migrate deploy
npm run build

# Frontend build
cd ../frontend
npm install
npm run build

# PM2 da ishga tushirish
cd ..
pm2 start ecosystem.config.js
pm2 save
```

## Xatoliklar

### Build xatolik

```bash
# TypeScript xatoliklarni ko'rish
cd backend
npm run build

# Yoki
npx tsc --noEmit
```

### Prisma xatolik

```bash
# Prisma migration
npx prisma migrate deploy

# Yoki baseline
npx prisma migrate resolve --applied 20250101000000_init
```

### Port band

```bash
# Port 4000 band bo'lsa
lsof -i :4000
kill -9 <PID>

# Yoki boshqa port ishlatish
PORT=4002 pm2 start backend/dist/main.js --name call-center-backend
```

