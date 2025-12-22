# Asterisk Call Center MVP System

Bu tizim Asterisk PBX, NestJS backend va React frontend asosida qurilgan to'liq MVP call center tizimidir.

## Tizim Tarkibi

- **Asterisk 20 LTS** - SIP qo'ng'iroqlarni boshqarish
- **NestJS Backend** - API va ARI integratsiyasi
- **React Frontend** - Web dashboard (Uzbek tilida)
- **PostgreSQL** - Ma'lumotlar bazasi
- **Redis** - Cache va real-time ma'lumotlar
- **WebSocket** - Real-time yangilanishlar

## Xususiyatlar

- ✅ Kiruvchi va chiquvchi qo'ng'iroqlar
- ✅ Barcha qo'ng'iroqlarni yozib olish
- ✅ Telegram integratsiyasi
- ✅ Instagram integratsiyasi
- ✅ Facebook Messenger integratsiyasi
- ✅ Real-time dashboard
- ✅ Operator boshqaruvi

## O'rnatish

### Talablar

- Ubuntu 22.04 LTS
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Asterisk 20 LTS

### 1. Asterisk O'rnatish

```bash
# Ubuntu 22.04 da Asterisk 20 o'rnatish
sudo apt update
sudo apt install -y build-essential wget libssl-dev libncurses5-dev libnewt-dev libxml2-dev linux-headers-$(uname -r) libsqlite3-dev uuid-dev libjansson-dev

cd /usr/src
sudo wget http://downloads.asterisk.org/pub/telephony/asterisk/asterisk-20-current.tar.gz
sudo tar xzf asterisk-20-current.tar.gz
cd asterisk-20.*
sudo contrib/scripts/get_mp3_source.sh
sudo ./configure
sudo make menuselect
sudo make
sudo make install
sudo make samples
sudo make config
```

### 2. Asterisk Konfiguratsiyasi

Barcha konfiguratsiya fayllari `asterisk-config/` papkasida.

```bash
sudo cp asterisk-config/*.conf /etc/asterisk/
sudo systemctl restart asterisk
```

### 3. Backend O'rnatish

```bash
cd backend
npm install
cp .env.example .env
# .env faylini tahrirlang
npm run migration:run
npm run start:dev
```

### 4. Frontend O'rnatish

```bash
cd frontend
npm install
cp .env.example .env
# .env faylini tahrirlang
npm run dev
```

## Muhim Fayllar

- `asterisk-config/` - Asterisk konfiguratsiya fayllari
- `backend/` - NestJS backend
- `frontend/` - React frontend
- `SETUP.md` - Batafsil o'rnatish qo'llanmasi
- `QUICK_START.md` - Tezkor boshlash
- `PROJECT_STRUCTURE.md` - Loyiha strukturasi
- `SUMMARY.md` - Yakuniy hisobot

## Tezkor Boshlash

Batafsil qo'llanma uchun `SETUP.md` ni o'qing.

```bash
# 1. Backend
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run migration:run
npm run prisma:seed  # Default admin yaratish (admin/admin123)
npm run start:dev

# 2. Frontend (yangi terminal)
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Default Login

**Username:** admin  
**Password:** admin123

(Seed fayl orqali yaratiladi: `npm run prisma:seed`)

## API Endpointlar

- `POST /auth/login` - Tizimga kirish
- `GET /calls` - Qo'ng'iroqlar ro'yxati
- `GET /calls/:id` - Qo'ng'iroq ma'lumotlari
- `GET /calls/:id/recording` - Yozuvni yuklab olish
- `POST /calls/outbound` - Chiquvchi qo'ng'iroq
- `GET /chats` - Chatlar ro'yxati
- `GET /chats/:id/messages` - Xabarlar
- `POST /chats/:id/send` - Xabar yuborish

## WebSocket Events

- `incoming_call` - Yangi kiruvchi qo'ng'iroq
- `call_status` - Qo'ng'iroq holati o'zgardi
- `new_message` - Yangi xabar
- `operator_status` - Operator holati o'zgardi

