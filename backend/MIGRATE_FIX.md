# Shadow Database Muammosini Hal Qilish

## Muammo

```
Error: P3014
Prisma Migrate could not create the shadow database. Please make sure the database user has permission to create databases.
```

## Yechim 1: Shadow Database ni O'chirish (Tavsiya etiladi)

`.env` faylida `shadowDatabaseUrl` ni qo'shing:

```env
DATABASE_URL="postgresql://callcenter_user:CallCenter2025@localhost:5432/callcenter?schema=public"
SHADOW_DATABASE_URL="postgresql://callcenter_user:CallCenter2025@localhost:5432/callcenter?schema=public"
```

Yoki `schema.prisma` da `shadowDatabaseUrl` ni qo'shing (allaqachon qo'shildi).

Keyin:

```bash
npx prisma migrate dev --name init
```

## Yechim 2: Database Yaratish Ruxsatini Berish

PostgreSQL ga kirish:
```bash
psql postgres
```

Quyidagi buyruqlarni bajaring:

```sql
-- Superuser ruxsatini berish (ehtiyot bo'ling!)
ALTER USER callcenter_user CREATEDB;

-- Yoki yangi superuser yaratish
CREATE USER callcenter_admin WITH PASSWORD 'password' SUPERUSER;
```

Keyin `.env` faylida yangi foydalanuvchi ishlating.

## Yechim 3: Migrate Deploy Ishlatish (Production)

Shadow database talab qilmaydi:

```bash
# Avval migratsiya faylini yaratish
npx prisma migrate dev --create-only --name init

# Keyin deploy qilish
npx prisma migrate deploy
```

## Tezkor Yechim

```bash
cd /Users/tiuulugbek/asterisk-call-center/backend

# .env faylini yangilash
echo 'SHADOW_DATABASE_URL="postgresql://callcenter_user:CallCenter2025@localhost:5432/callcenter?schema=public"' >> .env

# Migratsiya yaratish
npx prisma migrate dev --name init

# Seed ishga tushirish
npm run prisma:seed
```

