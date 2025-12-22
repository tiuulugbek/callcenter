# Prisma Client Yangilash

## Muammo
- Database jadvallar yaratilgan ✅
- Webhook sozlangan ✅
- Lekin backend hali eski Prisma Client ni ishlatmoqda ❌

## Yechim

### 1. Prisma Client ni Yangilash

```bash
cd /var/www/call-center/backend

# Prisma Client ni yangilash
npm run prisma:generate

# Yoki
npx prisma generate
```

### 2. Backend ni Qayta Build va Restart

```bash
cd /var/www/call-center/backend

# Build
npm run build

# PM2 da restart
pm2 restart call-center-backend --update-env

# Loglar
pm2 logs call-center-backend --lines 50
```

### 3. Database Tekshirish

```bash
# Database jadvallar mavjudmi?
sudo -u postgres psql -d callcenter -c "\dt"

# Operator jadvali mavjudmi?
sudo -u postgres psql -d callcenter -c "SELECT id, username FROM \"Operator\";"

# Chat va Message jadvallar mavjudmi?
sudo -u postgres psql -d callcenter -c "SELECT * FROM chats LIMIT 5;"
sudo -u postgres psql -d callcenter -c "SELECT * FROM messages LIMIT 5;"
```

## To'liq Qadamlar

```bash
cd /var/www/call-center/backend

# 1. Prisma Client yangilash
npm run prisma:generate

# 2. Build
npm run build

# 3. PM2 restart
pm2 restart call-center-backend --update-env

# 4. Loglar
pm2 logs call-center-backend --lines 50

# 5. Bot ga xabar yuborib test qilish
```

## Webhook Test

```bash
# Backend loglar (real-time)
pm2 logs call-center-backend

# Bot ga xabar yuboring va loglarni ko'ring
```

## Muammolar

### Prisma Client Eski

```bash
# Prisma Client ni tozalash va qayta yaratish
rm -rf node_modules/.prisma
npm run prisma:generate
npm run build
pm2 restart call-center-backend --update-env
```

### Database Connection Error

```bash
# .env faylini tekshirish
cat .env | grep DATABASE_URL

# Database connection test
sudo -u postgres psql -d callcenter -c "SELECT 1;"
```

