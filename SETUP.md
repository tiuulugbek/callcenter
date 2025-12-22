# O'rnatish Qo'llanmasi

Bu qo'llanma Asterisk Call Center MVP tizimini o'rnatish va ishga tushirish uchun.

## Talablar

- Ubuntu 22.04 LTS
- Node.js 18+ (nvm yoki nvm orqali o'rnatish tavsiya etiladi)
- PostgreSQL 14+
- Redis 6+ (ixtiyoriy)
- Asterisk 20 LTS

## 1-qadam: Asterisk O'rnatish

```bash
# Paketlar ro'yxatini yangilash
sudo apt update

# Kerakli paketlarni o'rnatish
sudo apt install -y build-essential wget libssl-dev libncurses5-dev \
  libnewt-dev libxml2-dev linux-headers-$(uname -r) libsqlite3-dev \
  uuid-dev libjansson-dev

# Asterisk 20 manbalarini yuklab olish
cd /usr/src
sudo wget http://downloads.asterisk.org/pub/telephony/asterisk/asterisk-20-current.tar.gz
sudo tar xzf asterisk-20-current.tar.gz
cd asterisk-20.*

# MP3 qo'llab-quvvatlash
sudo contrib/scripts/get_mp3_source.sh

# Konfiguratsiya
sudo ./configure

# Menuselect (PJSIP va HTTP serverni tanlash)
sudo make menuselect

# Kompilatsiya va o'rnatish
sudo make
sudo make install
sudo make samples
sudo make config

# Asterisk xizmatini ishga tushirish
sudo systemctl enable asterisk
sudo systemctl start asterisk
```

## 2-qadam: Asterisk Konfiguratsiyasi

```bash
# Konfiguratsiya fayllarini nusxalash
sudo cp asterisk-config/*.conf /etc/asterisk/

# Recording papkasini yaratish
sudo mkdir -p /var/spool/asterisk/recordings
sudo chown asterisk:asterisk /var/spool/asterisk/recordings

# Asterisk xizmatini qayta ishga tushirish
sudo systemctl restart asterisk

# Asterisk holatini tekshirish
sudo asterisk -rvvv
```

Asterisk CLI da quyidagi buyruqlarni bajarishingiz mumkin:
- `ari show status` - ARI holatini ko'rish
- `pjsip show endpoints` - PJSIP endpointlarni ko'rish
- `core show channels` - Faol kanallarni ko'rish

## 3-qadam: PostgreSQL O'rnatish va Sozlash

```bash
# PostgreSQL o'rnatish
sudo apt install -y postgresql postgresql-contrib

# PostgreSQL xizmatini ishga tushirish
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Ma'lumotlar bazasini yaratish
sudo -u postgres psql
```

PostgreSQL CLI da:
```sql
CREATE DATABASE callcenter;
CREATE USER callcenter_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE callcenter TO callcenter_user;
\q
```

## 4-qadam: Backend O'rnatish

```bash
cd backend

# Paketlarni o'rnatish
npm install

# Environment faylini yaratish
cp .env.example .env

# .env faylini tahrirlash
nano .env
```

`.env` faylida quyidagilarni o'zgartiring:
- `DATABASE_URL` - PostgreSQL ulanish stringi
- `JWT_SECRET` - Xavfsiz secret key
- `ASTERISK_ARI_*` - Asterisk ARI sozlamalari
- `TELEGRAM_BOT_TOKEN` - Telegram bot tokeni
- `FACEBOOK_*` - Facebook/Instagram sozlamalari

```bash
# Prisma client yaratish
npm run prisma:generate

# Migratsiyalarni ishga tushirish
npm run migration:run

# Backend serverini ishga tushirish
npm run start:dev
```

## 5-qadam: Frontend O'rnatish

```bash
cd frontend

# Paketlarni o'rnatish
npm install

# Environment faylini yaratish
cp .env.example .env

# Frontend serverini ishga tushirish
npm run dev
```

## 6-qadam: Telegram Bot Sozlash

1. Telegram da @BotFather ga murojaat qiling
2. Yangi bot yarating: `/newbot`
3. Bot tokenini oling
4. `.env` fayliga `TELEGRAM_BOT_TOKEN` ni qo'shing
5. Webhook o'rnatish:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-domain.com/api/chats/webhook/telegram"
```

## 7-qadam: Facebook/Instagram Sozlash

1. Facebook Developers (developers.facebook.com) ga kirish
2. Yangi app yarating
3. Messenger va Instagram Messaging API ni qo'shing
4. Page Access Token oling
5. Webhook URL: `https://your-domain.com/api/chats/webhook/facebook`
6. Verify Token ni `.env` fayliga qo'shing

## Test Qilish

1. Backend: `http://localhost:3001` - API ishlayaptimi tekshiring
2. Frontend: `http://localhost:3000` - Dashboard ochilayaptimi tekshiring
3. Login: Default operator yaratish kerak (migratsiyada yoki qo'lda)

## Default Operator Yaratish

PostgreSQL da:
```sql
INSERT INTO operators (id, name, extension, username, password, role, status)
VALUES (
  gen_random_uuid(),
  'Admin',
  '1001',
  'admin',
  '$2b$10$...', -- bcrypt hash of password
  'admin',
  'onlayn'
);
```

Yoki backend kodida:
```typescript
// operators.service.ts da create metodini ishlatish
```

## Muammolarni Hal Qilish

### Asterisk ishlamayapti
```bash
sudo systemctl status asterisk
sudo journalctl -u asterisk -n 50
```

### ARI ulanishi yo'q
- `http.conf` va `ari.conf` fayllarini tekshiring
- Firewall portlarni oching: `sudo ufw allow 8088`

### Database ulanishi yo'q
- PostgreSQL ishlayaptimi: `sudo systemctl status postgresql`
- Connection string to'g'rimi tekshiring

### WebSocket ishlamayapti
- Backend va frontend URL larni tekshiring
- CORS sozlamalarini tekshiring

## Xavfsizlik

1. Production da `.env` faylini xavfsiz saqlang
2. JWT_SECRET ni kuchli qiling
3. Database parollarini xavfsiz qiling
4. HTTPS ishlatish tavsiya etiladi
5. Firewall sozlang

## Keyingi Qadamlar

- SIP trunk sozlash
- Extensionlar yaratish
- Operatorlar yaratish
- Chat integratsiyalarini test qilish

