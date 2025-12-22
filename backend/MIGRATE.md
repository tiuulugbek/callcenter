# Migratsiya Yaratish va Ishga Tushirish

## Muammo

Agar "No migration found" xatosi bo'lsa, migratsiyani yaratish kerak.

## Yechim

### 1. Migratsiya Yaratish

```bash
cd backend
npx prisma migrate dev --name init
```

Bu buyruq:
- Migratsiya fayllarini yaratadi
- Database ga migratsiyalarni qo'llaydi
- Prisma Client ni yangilaydi

### 2. Yoki Migratsiyani Qo'lda Yaratish

```bash
cd backend
npx prisma migrate dev --create-only --name init
npx prisma migrate deploy
```

### 3. Seed Ishga Tushirish

Migratsiya muvaffaqiyatli bo'lgandan keyin:

```bash
npm run prisma:seed
```

## Tezkor Yechim

```bash
cd /Users/tiuulugbek/asterisk-call-center/backend

# Migratsiya yaratish va ishga tushirish
npx prisma migrate dev --name init

# Seed ishga tushirish
npm run prisma:seed
```

## Muammolarni Hal Qilish

### Database ulanishi yo'q
`.env` faylida `DATABASE_URL` ni tekshiring:
```env
DATABASE_URL="postgresql://callcenter_user:CallCenter2025@localhost:5432/callcenter?schema=public"
```

### Migratsiya xatosi
```bash
# Database ni tozalash (ehtiyot bo'ling!)
npx prisma migrate reset

# Yoki yangi migratsiya yaratish
npx prisma migrate dev --name init
```

