# Database Schema Yaratish - To'liq Qo'llanma

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

# Natijani ko'rish
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

### 5. Login Test

```bash
# Login endpoint test
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## To'liq Qadamlar (Bitta Qatorda)

```bash
cd /var/www/call-center/backend && npx prisma db push && npm run prisma:seed && pm2 restart call-center-backend && pm2 logs call-center-backend --lines 20
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

### Permission Error

```bash
# Database user huquqlarini tekshirish
sudo -u postgres psql -c "\du callcenter_user"

# Agar kerak bo'lsa, huquqlarni qayta berish
sudo -u postgres psql -d callcenter -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO callcenter_user;"
sudo -u postgres psql -d callcenter -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO callcenter_user;"
```

