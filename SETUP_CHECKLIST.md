# To'liq PBX Setup Checklist

## ✅ 1. Backend Sozlash

### Environment Variables (.env)

```bash
cd /var/www/call-center/backend
nano .env
```

**Majburiy o'zgaruvchilar:**
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/callcenter"

# Server
PORT=4000
FRONTEND_URL=http://crm24.soundz.uz:4001

# JWT
JWT_SECRET=your_secret_key_here

# Kerio Operator API
KERIO_PBX_HOST=90.156.199.92
KERIO_API_USERNAME=your_kerio_api_username
KERIO_API_PASSWORD=your_kerio_api_password
KERIO_SYNC_INTERVAL=5
KERIO_POLL_INTERVAL=2

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_WEBHOOK_URL=https://crm24.soundz.uz/api/chats/webhook/telegram

# Facebook/Instagram (Ixtiyoriy)
FACEBOOK_PAGE_ACCESS_TOKEN=your_facebook_token
FACEBOOK_APP_SECRET=your_facebook_secret
FACEBOOK_VERIFY_TOKEN=your_verify_token
```

### Backend ni ishga tushirish

```bash
cd /var/www/call-center/backend

# Dependencies
npm install

# Database migration
npx prisma migrate deploy

# Build
npm run build

# PM2 da ishga tushirish
pm2 start ecosystem.config.js --only call-center-backend
# Yoki
pm2 start dist/main.js --name call-center-backend

# Loglar
pm2 logs call-center-backend
```

## ✅ 2. Frontend Sozlash

### Environment Variables (.env)

```bash
cd /var/www/call-center/frontend
nano .env
```

```env
VITE_API_URL=http://crm24.soundz.uz:4000
VITE_WS_URL=ws://crm24.soundz.uz:4000
```

### Frontend ni ishga tushirish

```bash
cd /var/www/call-center/frontend

# Dependencies
npm install

# Build
npm run build

# PM2 da ishga tushirish
pm2 start npx --name call-center-frontend -- vite preview --host 0.0.0.0 --port 4001

# Loglar
pm2 logs call-center-frontend
```

## ✅ 3. Kerio Operator Sozlash

### IP Telefonlar uchun Extensionlar

**Kerio Operator da:**
1. Admin panelga kiring
2. Extensions bo'limiga o'ting
3. Har bir operator uchun extension yarating:
   - Extension: 1001, 1002, 1003, ...
   - Username: Extension raqami
   - Password: Xavfsiz parol
   - SIP Server: 90.156.199.92

### Backend da Extensionlar

1. Frontend da Settings → SIP Extensionlar ga kiring
2. Operator tanlang
3. Extension raqami va parol kiriting
4. Yaratish tugmasini bosing

**Eslatma:** Bu faqat database ga saqlaydi. IP telefonlar to'g'ridan-to'g'ri Kerio Operator ga ulanadi.

## ✅ 4. IP Telefon Sozlash

### MicroSIP (Windows)

1. MicroSIP ni oching
2. Account → Add
3. Quyidagi ma'lumotlarni kiriting:
   ```
   Domain: 90.156.199.92
   Username: 1001
   Password: your_password
   Proxy: 90.156.199.92
   Port: 5060
   Transport: UDP
   Register: ✅ Enable
   ```

### Linphone (iOS/Android)

1. Settings → SIP Accounts → Add Account
2. Quyidagi ma'lumotlarni kiriting:
   ```
   Username: 1001
   Password: your_password
   Domain: 90.156.199.92
   Transport: UDP
   Port: 5060
   ```

### Zoiper

1. Add Account → SIP Account
2. Quyidagi ma'lumotlarni kiriting:
   ```
   Username: 1001
   Password: your_password
   Domain: 90.156.199.92
   ```

## ✅ 5. Telegram Bot Sozlash

### Bot Token

1. Telegram da @BotFather ga murojaat qiling
2. `/newbot` buyrug'ini yuboring
3. Bot nomini va username ni kiriting
4. Bot tokenini oling

### Backend da Sozlash

1. Frontend da Settings → Telegram ga kiring
2. Bot tokenini kiriting
3. Saqlash tugmasini bosing

**Webhook avtomatik o'rnatiladi:**
```
https://crm24.soundz.uz/api/chats/webhook/telegram
```

### Tekshirish

1. Botga xabar yuboring
2. Frontend da Chats sahifasida ko'ring
3. Javob yuborishni sinab ko'ring

## ✅ 6. Facebook/Instagram Sozlash

### Facebook App Yaratish

1. Facebook Developers (developers.facebook.com) ga kiring
2. Yangi app yaratish
3. Messenger va Instagram Messaging API ni qo'shish
4. Page Access Token olish

### Backend da Sozlash

1. Frontend da Settings → Facebook/Instagram ga kiring
2. Quyidagi ma'lumotlarni kiriting:
   - Page Access Token
   - App Secret
   - Verify Token
3. Saqlash tugmasini bosing

**Webhook URL:**
```
https://crm24.soundz.uz/api/chats/webhook/facebook
```

### Webhook O'rnatish

Facebook Developer Console da:
1. Webhooks bo'limiga o'ting
2. Callback URL: `https://crm24.soundz.uz/api/chats/webhook/facebook`
3. Verify Token: Backend da kiritilgan verify token
4. Subscribe to: `messages`, `messaging_postbacks`

## ✅ 7. Tekshirish

### Backend

```bash
# Backend ishlayaptimi?
curl http://localhost:4000/api/health

# Kerio Operator ulanganmi?
curl http://localhost:4000/api/kerio/auth/verify

# Telegram webhook ishlayaptimi?
curl http://localhost:4000/api/chats/webhook/telegram
```

### Frontend

```bash
# Frontend ishlayaptimi?
curl http://localhost:4001

# Browser da
http://crm24.soundz.uz:4001
```

### IP Telefon

1. IP telefonni sozlang
2. Register qiling
3. Qo'ng'iroq qiling
4. Dashboard da ko'ring

### Telegram Bot

1. Botga xabar yuboring
2. Frontend da Chats sahifasida ko'ring
3. Javob yuborishni sinab ko'ring

## ✅ 8. PM2 Buyruqlar

```bash
# Barcha processlarni ko'rish
pm2 list

# Backend ni qayta ishga tushirish
pm2 restart call-center-backend

# Frontend ni qayta ishga tushirish
pm2 restart call-center-frontend

# Loglar
pm2 logs call-center-backend
pm2 logs call-center-frontend

# PM2 ni saqlash
pm2 save
pm2 startup
```

## ⚠️ Xatoliklar

### Backend ishlamayapti

```bash
# Loglar
pm2 logs call-center-backend

# Qayta ishga tushirish
pm2 restart call-center-backend

# .env faylini tekshiring
cat /var/www/call-center/backend/.env
```

### Frontend ishlamayapti

```bash
# Loglar
pm2 logs call-center-frontend

# Qayta ishga tushirish
pm2 restart call-center-frontend

# Build qilingan fayllarni tekshiring
ls -la /var/www/call-center/frontend/dist
```

### IP Telefon ulanmayapti

1. Kerio Operator da extension yaratilganligini tekshiring
2. SIP credentials ni tekshiring
3. Firewall 5060 port ochiqligini tekshiring
4. Network connectivity ni tekshiring

### Qo'ng'iroqlar ko'rinmayapti

1. Backend loglarini tekshiring: `pm2 logs call-center-backend`
2. Kerio Operator API credentials ni tekshiring
3. Database connection ni tekshiring
4. WebSocket connection ni tekshiring

### Telegram Bot ishlamayapti

1. Bot token ni tekshiring
2. Webhook URL ni tekshiring
3. Backend loglarini tekshiring
4. Telegram API connectivity ni tekshiring

## 📝 Eslatmalar

1. **IP telefonlar to'g'ridan-to'g'ri Kerio Operator ga ulanadi** - sistema orqali emas
2. **Bu sistema qo'ng'iroqlarni javob bermaydi** - IP telefonlar javob beradi
3. **Bu sistema qo'ng'iroqlarni boshqarmaydi** - Kerio Operator boshqaradi
4. **Bu sistema faqat monitoring va logging** - call events ni olish va ko'rsatish

