# Prisma Migration Fix

## Xatolik

```
Error: P3005
The database schema is not empty. Read more about how to baseline an existing production database
```

## Sabab

Database allaqachon mavjud va migration fayllari yo'q.

## Yechim

### Variant 1: Baseline Migration (Tavsiya etiladi)

Production database ni baseline qilish:

```bash
cd /var/www/call-center/backend

# 1. Migration fayllarini yaratish (database ni o'zgartirmasdan)
npx prisma migrate dev --create-only --name init

# 2. Migration ni baseline qilish (database da migration history yaratish)
npx prisma migrate resolve --applied init

# 3. Build
npm run build
```

### Variant 2: Prisma DB Push (Development)

Agar development muhitida bo'lsangiz:

```bash
cd /var/www/call-center/backend

# Database schema ni yangilash (migration yaratmasdan)
npx prisma db push

# Build
npm run build
```

### Variant 3: Migration Yaratish va Apply Qilish

Agar database ni to'liq yangilash kerak bo'lsa:

```bash
cd /var/www/call-center/backend

# 1. Migration yaratish
npx prisma migrate dev --name init

# 2. Build
npm run build
```

## Serverda Qilish

```bash
ssh root@152.53.229.176
cd /var/www/call-center/backend

# Baseline migration
npx prisma migrate dev --create-only --name init
npx prisma migrate resolve --applied init

# Yoki DB push (agar development)
npx prisma db push

# Build
npm run build
pm2 restart call-center-backend
```

## Tekshirish

```bash
# Migration holatini ko'rish
npx prisma migrate status

# Database schema ni ko'rish
npx prisma studio
```

