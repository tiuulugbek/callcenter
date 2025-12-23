# Prisma Migration Fix - Serverda Qilish

## Xatolik

```
Error: P3005
The database schema is not empty. Read more about how to baseline an existing production database
```

## Yechim

### Variant 1: Baseline Migration (Tavsiya etiladi)

```bash
ssh root@152.53.229.176
cd /var/www/call-center/backend

# 1. Migration fayllarini yuklash (git pull)
git pull origin main

# 2. Migration ni baseline qilish (database da migration history yaratish)
npx prisma migrate resolve --applied 20250101000000_init

# 3. Build
npm run build
pm2 restart call-center-backend
```

### Variant 2: Prisma DB Push (Agar migration ishlamasa)

```bash
ssh root@152.53.229.176
cd /var/www/call-center/backend

# Database schema ni yangilash (migration yaratmasdan)
npx prisma db push

# Build
npm run build
pm2 restart call-center-backend
```

### Variant 3: Migration Yaratish va Apply Qilish

```bash
ssh root@152.53.229.176
cd /var/www/call-center/backend

# 1. Migration yaratish
npx prisma migrate dev --name init

# 2. Build
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

## Eslatma

Agar database allaqachon mavjud bo'lsa va migration fayllari yo'q bo'lsa, baseline migration qilish kerak. Bu database ni o'zgartirmaydi, faqat migration history yaratadi.

