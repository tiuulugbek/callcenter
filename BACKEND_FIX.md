# Backend Muammolarni Hal Qilish

## Muammolar

1. `npm run prisma` script topilmadi
2. Database jadvali yaratilmagan
3. PM2 fayl topilmadi

## Yechimlar

### 1. Database Migration

```bash
cd /var/www/call-center/backend

# Prisma client generate (allaqachon qilingan)
npm run prisma:generate

# Database schema ni yaratish
npx prisma db push

# Yoki migration yaratish
npx prisma migrate dev --name init

# Database seed
npm run prisma:seed
```

### 2. Build va PM2

```bash
cd /var/www/call-center/backend

# Build
npm run build

# Build muvaffaqiyatli bo'lganini tekshirish
ls -la dist/

# PM2 da ishga tushirish
pm2 start dist/main.js --name call-center-backend

# PM2 status
pm2 status

# PM2 loglar
pm2 logs call-center-backend
```

### 3. Agar Migration Muammosi Bo'lsa

```bash
cd /var/www/call-center/backend

# Database ni tozalash (ehtiyot bo'ling!)
npx prisma migrate reset

# Yoki faqat schema ni push qilish
npx prisma db push --accept-data-loss
```

### 4. To'liq Qadamlar

```bash
cd /var/www/call-center/backend

# 1. Prisma generate
npm run prisma:generate

# 2. Database schema yaratish
npx prisma db push

# 3. Database seed
npm run prisma:seed

# 4. Build
npm run build

# 5. Build tekshirish
ls -la dist/main.js

# 6. PM2 da ishga tushirish
pm2 start dist/main.js --name call-center-backend

# 7. PM2 save
pm2 save

# 8. PM2 startup
pm2 startup
```

### 5. Tekshirish

```bash
# PM2 status
pm2 status

# PM2 loglar
pm2 logs call-center-backend

# Backend ishlayaptimi?
curl http://localhost:4000/auth/login
```

## Muammolar

### Database Connection Error

```bash
# .env faylini tekshirish
cat .env | grep DATABASE_URL

# PostgreSQL ishlayaptimi?
sudo systemctl status postgresql

# Database mavjudmi?
sudo -u postgres psql -l | grep callcenter
```

### Prisma Migration Error

```bash
# Prisma schema ni tekshirish
cat prisma/schema.prisma

# Database ni reset qilish (ehtiyot bo'ling!)
npx prisma migrate reset --force
npx prisma db push
npm run prisma:seed
```

