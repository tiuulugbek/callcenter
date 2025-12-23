# Login Muammosini Tuzatish

## Muammo

"Noto'g'ri foydalanuvchi nomi yoki parol" xatolik chiqmoqda.
Login: admin
Password: admin123

## Sabab

Database da admin foydalanuvchisi mavjud emas yoki seed script ishlamagan.

## Yechim

### Variant 1: Seed Script (Tavsiya etiladi)

```bash
ssh root@152.53.229.176
cd /var/www/call-center/backend

# Seed scriptni ishga tushirish
npx ts-node prisma/seed.ts

# Yoki
npm run prisma:seed
```

### Variant 2: CREATE_ADMIN.js Script

```bash
ssh root@152.53.229.176
cd /var/www/call-center/backend

# Scriptni ishga tushirish
node CREATE_ADMIN.js
```

### Variant 3: Prisma Studio

```bash
ssh root@152.53.229.176
cd /var/www/call-center/backend

# Prisma Studio ni ochish
npx prisma studio

# Browser da http://localhost:5555 ochiladi
# Operators table ga kiring
# Yangi operator yarating:
# - name: Admin
# - extension: 1001
# - username: admin
# - password: (hash qilingan parol)
# - role: admin
```

### Variant 4: PostgreSQL To'g'ridan-to'g'ri

```bash
ssh root@152.53.229.176

# PostgreSQL ga kirish
psql -U postgres -d callcenter

# Parol hash qilish (Node.js da)
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('admin123', 10).then(h => console.log(h));"

# Hash qilingan parolni oling va quyidagi SQL ni ishlating:
INSERT INTO operators (id, name, extension, username, password, role, status, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Admin',
  '1001',
  'admin',
  '$2b$10$...', -- Hash qilingan parol
  'admin',
  'onlayn',
  NOW(),
  NOW()
);
```

## Tekshirish

### 1. Database da Admin Mavjudligini Tekshirish

```bash
cd /var/www/call-center/backend

# Prisma Studio
npx prisma studio

# Yoki PostgreSQL
psql -U postgres -d callcenter
SELECT * FROM operators WHERE username = 'admin';
```

### 2. Login Qilish

1. Browser da `/login` sahifasiga kiring
2. Username: `admin`
3. Password: `admin123`
4. Login qiling

## Xatoliklar

### Seed Script ishlamayapti

**Yechim:**
```bash
# Dependencies tekshirish
npm install

# Prisma generate
npx prisma generate

# Seed scriptni qayta ishga tushirish
npx ts-node prisma/seed.ts
```

### Parol Hash Noto'g'ri

**Yechim:**
- CREATE_ADMIN.js script ishlatish
- Yoki qo'lda hash qilish va database ga yozish

### Database Connection Xatolik

**Yechim:**
- .env faylida DATABASE_URL ni tekshirish
- PostgreSQL ishlayaptimi tekshirish

