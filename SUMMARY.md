# Asterisk Call Center MVP - Yakuniy Hisobot

## Yaratilgan Tizim

To'liq ishlaydigan MVP call center tizimi yaratildi:

### ✅ Asterisk PBX Konfiguratsiyasi
- `ari.conf` - ARI sozlamalari (backend foydalanuvchisi)
- `http.conf` - HTTP server (port 8088)
- `pjsip.conf` - PJSIP sozlamalari (SIP trunk va extensionlar uchun)
- `extensions.conf` - Dialplan (kiruvchi/chiquvchi qo'ng'iroqlar, yozuv)

### ✅ NestJS Backend
- **AsteriskModule** - ARI WebSocket integratsiyasi, eventlar
- **CallsModule** - Qo'ng'iroqlar CRUD, yozuvlar
- **ChatsModule** - Chatlar va xabarlar boshqaruvi
- **OperatorsModule** - Operatorlar boshqaruvi
- **AuthModule** - JWT autentifikatsiya
- **WebSocketModule** - Real-time yangilanishlar

### ✅ Chat Integratsiyalari
- **Telegram** - Bot API, webhook, xabar yuborish
- **Facebook Messenger** - Graph API, webhook
- **Instagram** - Messaging API integratsiyasi

### ✅ React Frontend (Uzbek tilida)
- **Login** sahifasi - Tizimga kirish
- **Dashboard** - Real-time kiruvchi qo'ng'iroqlar popup
- **Qo'ng'iroqlar** - Ro'yxat, filtr, yozuvlarni eshitish
- **Chatlar** - Chatlar ro'yxati, xabarlar, javob yozish

### ✅ Ma'lumotlar Bazasi
- PostgreSQL schema (Prisma)
- Migratsiyalar
- Seed fayl (default admin)

## Xususiyatlar

1. **Qo'ng'iroqlar**
   - Kiruvchi va chiquvchi qo'ng'iroqlar
   - Avtomatik yozib olish
   - Call loglar
   - Real-time yangilanishlar

2. **Chatlar**
   - Telegram, Instagram, Facebook integratsiyasi
   - Xabarlarni saqlash
   - Operator javoblari
   - Real-time yangilanishlar

3. **Operatorlar**
   - Login/logout
   - Status boshqaruvi (onlayn/oflayn)
   - Rollar (operator/admin)

4. **Real-time**
   - WebSocket orqali yangi qo'ng'iroqlar
   - Qo'ng'iroq holati yangilanishlari
   - Yangi xabarlar
   - Operator holati

## O'rnatish

Batafsil qo'llanma: `SETUP.md`
Tezkor boshlash: `QUICK_START.md`

### Asosiy Qadamlar:

1. **Asterisk o'rnatish** (Ubuntu 22.04)
2. **PostgreSQL o'rnatish va sozlash**
3. **Backend o'rnatish** (`npm install`, `.env`, `prisma migrate`)
4. **Frontend o'rnatish** (`npm install`, `.env`)
5. **Telegram/Facebook webhook sozlash**

## Muhim Fayllar

- `README.md` - Umumiy ma'lumot
- `SETUP.md` - Batafsil o'rnatish qo'llanmasi
- `QUICK_START.md` - Tezkor boshlash
- `PROJECT_STRUCTURE.md` - Loyiha strukturasi
- `backend/.env.example` - Backend environment variables
- `frontend/.env.example` - Frontend environment variables

## API Endpointlar

- `POST /auth/login` - Tizimga kirish
- `GET /calls` - Qo'ng'iroqlar ro'yxati
- `GET /calls/:id` - Qo'ng'iroq ma'lumotlari
- `GET /calls/:id/recording` - Yozuvni yuklab olish
- `POST /calls/outbound` - Chiquvchi qo'ng'iroq
- `GET /chats` - Chatlar ro'yxati
- `GET /chats/:id/messages` - Xabarlar
- `POST /chats/:id/send` - Xabar yuborish
- `POST /chats/webhook/telegram` - Telegram webhook
- `POST /chats/webhook/facebook` - Facebook webhook

## WebSocket Events

- `incoming_call` - Yangi kiruvchi qo'ng'iroq
- `call_status` - Qo'ng'iroq holati o'zgardi
- `new_message` - Yangi xabar
- `operator_status` - Operator holati o'zgardi

## Default Login

**Username:** admin
**Password:** admin123

(Seed fayl orqali yaratiladi)

## Keyingi Rivojlantirish

1. SIP trunk sozlash
2. Extensionlar yaratish
3. CRM integratsiyasi
4. Statistika va hisobotlar
5. Qo'shimcha chat platformalari
6. Qo'ng'iroq routing va queue
7. Recording management
8. Export va import funksiyalari

## Texnik Detallar

- **Backend:** NestJS, TypeScript, Prisma, PostgreSQL
- **Frontend:** React, TypeScript, Vite, Socket.io-client
- **PBX:** Asterisk 20 LTS, PJSIP, ARI
- **Real-time:** WebSocket (Socket.io)
- **Auth:** JWT
- **Database:** PostgreSQL

## Xavfsizlik

- JWT autentifikatsiya
- Webhook signature validation
- Environment variables
- Password hashing (bcrypt)
- CORS sozlash

## Yordam

Muammolar bo'lsa:
1. `SETUP.md` ni tekshiring
2. Loglarni ko'rib chiqing
3. Database ulanishini tekshiring
4. Asterisk holatini tekshiring (`sudo asterisk -rvvv`)

