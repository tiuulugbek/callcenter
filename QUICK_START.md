# Quick Start - To'liq PBX Setup

## 🚀 Tezkor Boshlash

### 1. Backend

```bash
cd /var/www/call-center/backend

# .env faylini yaratish/yangilash
nano .env

# Dependencies va build
npm install
npx prisma migrate deploy
npm run build

# PM2 da ishga tushirish
pm2 start dist/main.js --name call-center-backend
pm2 save
```

### 2. Frontend

```bash
cd /var/www/call-center/frontend

# .env faylini yaratish/yangilash
nano .env
# VITE_API_URL=http://crm24.soundz.uz:4000

# Build
npm install
npm run build

# PM2 da ishga tushirish
pm2 start npx --name call-center-frontend -- vite preview --host 0.0.0.0 --port 4001
pm2 save
```

### 3. Kerio Operator Sozlash

**Backend .env:**
```env
KERIO_PBX_HOST=90.156.199.92
KERIO_API_USERNAME=your_username
KERIO_API_PASSWORD=your_password
```

**Frontend da:**
1. Settings → Kerio Operator
2. Ulanishni tekshirish
3. Qo'ng'iroqlarni sync qilish

### 4. IP Telefon Sozlash

**MicroSIP:**
- Domain: `90.156.199.92`
- Username: `1001` (extension)
- Password: `your_password`
- Port: `5060`

### 5. Telegram Bot

**Frontend da:**
1. Settings → Telegram
2. Bot token kiriting
3. Saqlash

## ✅ Tekshirish

```bash
# Backend
curl http://localhost:4000/api/kerio/auth/verify

# Frontend
curl http://localhost:4001

# PM2
pm2 list
pm2 logs
```

## 📚 Batafsil Qo'llanma

- `COMPLETE_PBX_SETUP.md` - To'liq qo'llanma
- `SETUP_CHECKLIST.md` - Checklist
- `KERIO_CTI_INTEGRATION.md` - Kerio integratsiyasi
