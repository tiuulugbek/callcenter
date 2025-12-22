# Tezkor Migratsiya Yechimi

## Muammo Hal Qilindi

Shadow database muammosini hal qilish uchun quyidagi yechimlardan birini ishlating:

## Yechim 1: CREATEDB Ruxsatini Berish (Eng Oson)

```bash
# PostgreSQL ga kirish
psql postgres

# Ruxsatni berish
ALTER USER callcenter_user CREATEDB;
\q

# Migratsiya yaratish
cd /Users/tiuulugbek/asterisk-call-center/backend
npx prisma migrate dev --name init

# Seed
npm run prisma:seed
```

## Yechim 2: Migrate Deploy Ishlatish (Shadow Database Talab Qilmaydi)

```bash
cd /Users/tiuulugbek/asterisk-call-center/backend

# 1. Migratsiya faylini yaratish (database ga qo'llamaydi)
npx prisma migrate dev --create-only --name init

# 2. Migratsiyani qo'llash
npx prisma migrate deploy

# 3. Seed
npm run prisma:seed
```

## Yechim 3: Prisma DB Push (Development uchun)

```bash
cd /Users/tiuulugbek/asterisk-call-center/backend

# Schema ni to'g'ridan-to'g'ri database ga push qilish
npx prisma db push

# Seed
npm run prisma:seed
```

## Tavsiya

**Development uchun:** Yechim 1 yoki Yechim 3
**Production uchun:** Yechim 2

