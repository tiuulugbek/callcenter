# Login Xatosi - Muammoni Hal Qilish

## Tekshirish Qadamlari

### 1. Backend Loglar (MUHIM!)

```bash
# PM2 loglar
pm2 logs call-center-backend --lines 100

# Yoki real-time
pm2 logs call-center-backend
```

### 2. Login Endpoint ni Test Qilish

```bash
# Backend ni to'g'ridan-to'g'ri test qilish
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Yoki
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

### 3. Database Tekshirish

```bash
# Database connection test
cd /var/www/call-center/backend
cat .env | grep DATABASE_URL

# PostgreSQL ishlayaptimi?
sudo systemctl status postgresql

# Database da operator mavjudmi?
sudo -u postgres psql -d callcenter -c "SELECT id, username FROM \"Operator\";"
```

### 4. Database Seed Tekshirish

```bash
# Seed qilinganmi?
cd /var/www/call-center/backend
npm run prisma:seed

# Yoki qo'lda seed
sudo -u postgres psql -d callcenter -c "SELECT id, username FROM \"Operator\";"
```

## Umumiy Muammolar

### Muammo 1: Database Connection Error

```bash
# .env faylini tekshirish
cd /var/www/call-center/backend
cat .env | grep DATABASE_URL

# PostgreSQL ishlayaptimi?
sudo systemctl status postgresql

# Database mavjudmi?
sudo -u postgres psql -l | grep callcenter
```

### Muammo 2: Operator Topilmadi

```bash
# Database da operator mavjudmi?
sudo -u postgres psql -d callcenter -c "SELECT id, username FROM \"Operator\";"

# Agar yo'q bo'lsa, seed qilish
cd /var/www/call-center/backend
npm run prisma:seed
```

### Muammo 3: Password Hash Muammosi

```bash
# Database da password hash ni ko'rish
sudo -u postgres psql -d callcenter -c "SELECT id, username, password FROM \"Operator\";"

# Agar password hash noto'g'ri bo'lsa, qayta seed qilish
cd /var/www/call-center/backend
npm run prisma:seed
```

### Muammo 4: JWT Secret Muammosi

```bash
# .env faylida JWT_SECRET mavjudmi?
cd /var/www/call-center/backend
cat .env | grep JWT_SECRET

# Agar yo'q bo'lsa, qo'shish
nano .env
```

## To'liq Tekshirish va Yechim

```bash
# 1. Backend loglar
pm2 logs call-center-backend --lines 100

# 2. Database connection
cd /var/www/call-center/backend
cat .env | grep DATABASE_URL

# 3. Database da operator
sudo -u postgres psql -d callcenter -c "SELECT id, username FROM \"Operator\";"

# 4. Agar operator yo'q bo'lsa
npm run prisma:seed

# 5. Backend ni restart
pm2 restart call-center-backend

# 6. Login test
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## Default Login Ma'lumotlari

Seed faylida (prisma/seed.ts) quyidagilar bo'lishi kerak:
- Username: `admin`
- Password: `admin123` yoki `admin`

## Database Seed Qilish

```bash
cd /var/www/call-center/backend

# Database schema ni tekshirish
npx prisma db push

# Seed qilish
npm run prisma:seed

# Tekshirish
sudo -u postgres psql -d callcenter -c "SELECT id, username FROM \"Operator\";"
```

## Backend ni Qayta Ishga Tushirish

```bash
# PM2 da restart
pm2 restart call-center-backend

# Yoki qayta ishga tushirish
pm2 delete call-center-backend
cd /var/www/call-center/backend
pm2 start dist/src/main.js --name call-center-backend --update-env
pm2 save
```

