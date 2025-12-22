# Database Schema Yaratish

## Muammo
```
The table `public.Operator` does not exist in the current database.
```

Database jadvali yaratilmagan.

## Yechim

### 1. Database Schema ni Yaratish

```bash
cd /var/www/call-center/backend

# Prisma schema ni database ga yaratish
npx prisma db push

# Yoki migration yaratish
npx prisma migrate dev --name init
```

### 2. Database Seed Qilish

```bash
cd /var/www/call-center/backend

# Seed qilish
npm run prisma:seed
```

### 3. Tekshirish

```bash
# Database da jadval mavjudmi?
sudo -u postgres psql -d callcenter -c "\dt"

# Operator jadvali mavjudmi?
sudo -u postgres psql -d callcenter -c "SELECT id, username FROM \"Operator\";"
```

### 4. Backend ni Restart

```bash
# PM2 da restart
pm2 restart call-center-backend

# Loglar
pm2 logs call-center-backend --lines 20
```

## To'liq Qadamlar

```bash
cd /var/www/call-center/backend

# 1. Database schema yaratish
npx prisma db push

# 2. Database seed qilish
npm run prisma:seed

# 3. Tekshirish
sudo -u postgres psql -d callcenter -c "SELECT id, username FROM \"Operator\";"

# 4. Backend restart
pm2 restart call-center-backend

# 5. Login test
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
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

