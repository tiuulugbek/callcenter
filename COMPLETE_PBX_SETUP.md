# To'liq PBX Integratsiyasi - Qo'llanma

## 🎯 Maqsad

Bu sistema **Kerio Operator PBX** bilan to'liq integratsiya qilingan call center tizimi. IP telefonlar Kerio Operator ga ulanadi, sistema esa call events ni olish va ko'rsatish uchun ishlatiladi.

## 📋 Tizim Arxitektura

```
┌─────────────────┐
│  IP Telefonlar  │ ← MicroSIP, Linphone, Zoiper
│  (SIP Clients)  │
└────────┬────────┘
         │ SIP
         │
         ▼
┌─────────────────┐
│ Kerio Operator  │ ← PBX (Qo'ng'iroqlarni boshqaradi)
│      PBX        │ ← IP telefonlar bu yerga ulanadi
└────────┬────────┘
         │ API (REST/SOAP)
         │
         ▼
┌─────────────────┐
│  Backend API    │ ← Call events ni olish
│  (NestJS)       │ ← CDR sync
│  Port: 4000     │ ← WebSocket events
└────────┬────────┘
         │ HTTP/WebSocket
         │
         ▼
┌─────────────────┐
│  Frontend UI    │ ← Real-time call display
│   (React)       │ ← Call history
│  Port: 4001     │ ← Settings
└─────────────────┘
```

## 🔧 1. Kerio Operator Sozlash

### IP Telefonlar uchun SIP Extensionlar

**Kerio Operator da:**
1. Extension yaratish (masalan: 1001, 1002, 1003)
2. Har bir extension uchun:
   - Username: Extension raqami (1001)
   - Password: Parol
   - SIP Server: Kerio Operator IP (90.156.199.92)

### MicroSIP Sozlash (Windows)

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

### Linphone Sozlash (iOS/Android)

1. Settings → SIP Accounts → Add Account
2. Quyidagi ma'lumotlarni kiriting:
   ```
   Username: 1001
   Password: your_password
   Domain: 90.156.199.92
   Transport: UDP
   Port: 5060
   ```

### Zoiper Sozlash

1. Add Account → SIP Account
2. Quyidagi ma'lumotlarni kiriting:
   ```
   Username: 1001
   Password: your_password
   Domain: 90.156.199.92
   ```

## 🔧 2. Backend Sozlash

### Environment Variables (.env)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/callcenter"

# Server
PORT=4000
FRONTEND_URL=http://crm24.soundz.uz:4001

# JWT
JWT_SECRET=your_secret_key

# Kerio Operator API
KERIO_PBX_HOST=90.156.199.92
KERIO_API_USERNAME=your_api_username
KERIO_API_PASSWORD=your_api_password
KERIO_SYNC_INTERVAL=5
KERIO_POLL_INTERVAL=2

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_WEBHOOK_URL=https://crm24.soundz.uz/api/chats/webhook/telegram

# Facebook/Instagram
FACEBOOK_PAGE_ACCESS_TOKEN=your_page_token
FACEBOOK_APP_SECRET=your_app_secret
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
```

## 🔧 3. Frontend Sozlash

### Environment Variables (.env)

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
```

## 🔧 4. Nginx Sozlash (Ixtiyoriy)

Agar Nginx ishlatmoqchi bo'lsangiz:

```nginx
# Backend
server {
    listen 80;
    server_name crm24.soundz.uz;

    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Frontend
    location / {
        root /var/www/call-center/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

## 📱 5. IP Telefonlar bilan Ulanish

### Extensionlar ro'yxatini ko'rish

1. Frontend da Settings → SIP Extensionlar
2. Operatorlar ro'yxatini ko'ring
3. Har bir operator uchun extension yarating

### IP Telefon sozlash

Har bir IP telefon uchun:
- **SIP Server:** 90.156.199.92 (Kerio Operator IP)
- **Username:** Extension raqami (masalan: 1001)
- **Password:** Yaratilgan parol
- **Domain:** 90.156.199.92
- **Port:** 5060
- **Transport:** UDP

## 📞 6. Qo'ng'iroqlarni Ko'rish

### Real-time Call Display

1. Dashboard da kiruvchi qo'ng'iroqlar ko'rinadi
2. WebSocket orqali real-time yangilanadi
3. Call state: `kelyapti` → `suhbatda` → `yakunlandi`

### Call History

1. Calls sahifasida barcha qo'ng'iroqlar ko'rinadi
2. Filtrlar: sana, extension, status
3. Yozuvni eshitish mumkin

## 💬 7. Telegram Bot Sozlash

### Bot Token

1. @BotFather ga murojaat qiling
2. `/newbot` buyrug'ini yuboring
3. Bot tokenini oling
4. Settings → Telegram da kiriting

### Webhook

Webhook avtomatik o'rnatiladi:
```
https://crm24.soundz.uz/api/chats/webhook/telegram
```

## 📱 8. Facebook/Instagram Sozlash

### Facebook App Yaratish

1. Facebook Developers (developers.facebook.com)
2. Yangi app yaratish
3. Messenger va Instagram Messaging API ni qo'shish
4. Page Access Token olish

### Webhook URL

```
https://crm24.soundz.uz/api/chats/webhook/facebook
```

## 🔍 9. Tekshirish

### Backend

```bash
# Backend ishlayaptimi?
curl http://localhost:4000/api/health

# Kerio Operator ulanganmi?
curl http://localhost:4000/api/kerio/auth/verify
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

## ⚠️ 10. Xatoliklar va Yechimlar

### IP Telefon ulanmayapti

**Sabab:**
- Noto'g'ri SIP credentials
- Firewall 5060 port ochiq emas
- Kerio Operator da extension yaratilmagan

**Yechim:**
- SIP credentials ni tekshiring
- Firewall ni tekshiring
- Kerio Operator da extension yaratilganligini tekshiring

### Qo'ng'iroqlar ko'rinmayapti

**Sabab:**
- Kerio Operator API ulanmagan
- Polling ishlamayapti
- Database da calllar saqlanmayapti

**Yechim:**
- Backend loglarini tekshiring: `pm2 logs call-center-backend`
- Kerio Operator API credentials ni tekshiring
- Database connection ni tekshiring

### Telegram Bot ishlamayapti

**Sabab:**
- Bot token noto'g'ri
- Webhook o'rnatilmagan
- Backend ishlamayapti

**Yechim:**
- Bot token ni tekshiring
- Webhook URL ni tekshiring
- Backend loglarini tekshiring

## 📊 11. PM2 Buyruqlar

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

## 🎯 12. To'liq Ishlash Jarayoni

1. **Kerio Operator PBX** ishlayapti
2. **IP Telefonlar** Kerio Operator ga ulanadi
3. **Backend** Kerio Operator API dan call events ni oladi
4. **Frontend** real-time call display ko'rsatadi
5. **Telegram Bot** xabarlarni qabul qiladi va yuboradi
6. **Facebook/Instagram** xabarlarni qabul qiladi va yuboradi

## 📝 Eslatmalar

1. **Bu sistema qo'ng'iroqlarni javob bermaydi** - IP telefonlar javob beradi
2. **Bu sistema qo'ng'iroqlarni boshqarmaydi** - Kerio Operator boshqaradi
3. **Bu sistema faqat monitoring va logging** - call events ni olish va ko'rsatish
4. **IP telefonlar to'g'ridan-to'g'ri Kerio Operator ga ulanadi** - sistema orqali emas

