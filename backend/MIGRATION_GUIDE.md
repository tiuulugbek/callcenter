# Migratsiya Qo'llanmasi

## Birinchi Migratsiya Yaratish

```bash
cd backend
npm run prisma:generate
npm run migration:generate init
```

Bu buyruq `prisma/migrations/` papkasida yangi migratsiya yaratadi.

## Migratsiyalarni Ishga Tushirish

```bash
npm run migration:run
```

Bu buyruq barcha migratsiyalarni ishga tushiradi.

## Seed (Default Ma'lumotlar)

Default admin operator yaratish:

```bash
npm run prisma:seed
```

Bu quyidagi ma'lumotlarni yaratadi:
- **Username:** admin
- **Password:** admin123
- **Role:** admin
- **Status:** onlayn

## Prisma Studio

Ma'lumotlar bazasini ko'rish va tahrirlash:

```bash
npm run prisma:studio
```

Bu `http://localhost:5555` da Prisma Studio ni ochadi.

## Schema O'zgartirish

1. `prisma/schema.prisma` faylini tahrirlang
2. Migratsiya yarating: `npm run migration:generate migration_name`
3. Migratsiyani ishga tushiring: `npm run migration:run`
4. Prisma client yangilang: `npm run prisma:generate`

## Muammolarni Hal Qilish

### Migratsiya xatosi
```bash
# Migratsiyalarni qayta yaratish
rm -rf prisma/migrations
npm run migration:generate init
npm run migration:run
```

### Database ulanishi yo'q
- `.env` faylida `DATABASE_URL` ni tekshiring
- PostgreSQL ishlayaptimi: `sudo systemctl status postgresql`

### Prisma client eskirgan
```bash
npm run prisma:generate
```

