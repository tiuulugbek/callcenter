# Backend ni 4000 Port Bilan Ishga Tushirish

## Tezkor Boshlash

Backend endi **4000 port**da ishlaydi.

### 1. Backend Ishga Tushirish

```bash
cd backend

# Agar .env fayli yo'q bo'lsa
cp .env.example .env

# .env faylida PORT=4000 ekanligini tekshiring
# Yoki quyidagicha qo'shing:
echo "PORT=4000" >> .env

# Paketlar o'rnatish (agar o'rnatilmagan bo'lsa)
npm install

# Prisma client yaratish
npm run prisma:generate

# Backend ni ishga tushirish
npm run start:dev
```

Yoki skript orqali:

```bash
./START_BACKEND.sh
```

### 2. Frontend Sozlash

Frontend `.env` faylida:

```env
VITE_API_URL=http://localhost:4000
VITE_WS_URL=http://localhost:4000
```

### 3. Tekshirish

Backend ishga tushgandan keyin:

- Backend API: http://localhost:4000
- Frontend: http://localhost:3000

## Port O'zgartirish

Agar portni o'zgartirmoqchi bo'lsangiz:

1. `.env` faylida `PORT=4000` ni o'zgartiring
2. Frontend `.env` faylida `VITE_API_URL` va `VITE_WS_URL` ni yangilang
3. Backend ni qayta ishga tushiring

## Muammolarni Hal Qilish

### Port band
```bash
# 4000 portni kim ishlatayotganini ko'rish
lsof -i :4000

# Yoki boshqa port ishlating
PORT=5000 npm run start:dev
```

### Database ulanishi yo'q
- `.env` faylida `DATABASE_URL` ni tekshiring
- PostgreSQL ishlayaptimi: `sudo systemctl status postgresql`

### Prisma xatolari
```bash
npm run prisma:generate
npm run migration:run
```

