# ✅ Settings Sahifasi Yaratildi!

## Yaratilgan Funksiyalar

### 1. SIP Extensionlar Boshqaruvi
- ✅ Operatorlar ro'yxati
- ✅ Yangi extension yaratish
- ✅ Extension va parol sozlash
- ✅ Mavjud extensionlar ro'yxati

### 2. Telegram Bot Sozlash
- ✅ Bot token kirish
- ✅ Webhook URL sozlash
- ✅ Ulanishni tekshirish
- ✅ Webhook o'rnatish

### 3. Facebook/Instagram Sozlash
- ✅ Page Access Token
- ✅ App Secret
- ✅ Verify Token
- ✅ Sozlamalarni saqlash

## Qanday Ishlatish

### 1. Settings Sahifasiga Kirish

1. Frontend da login qiling: http://localhost:4001
2. Navbar da "Sozlamalar" tugmasini bosing
3. Yoki to'g'ridan-to'g'ri: http://localhost:4001/settings

### 2. SIP Extension Yaratish

1. "SIP Extensionlar" tab ni tanlang
2. Operator ni tanlang
3. Extension raqamini kiriting (masalan: 1001)
4. Parol kiriting
5. "Yaratish" tugmasini bosing

**Telefon Sozlash:**
- SIP Server: Asterisk server IP
- Username: Extension raqami
- Password: Yaratilgan parol
- Port: 5060

### 3. Telegram Bot Sozlash

1. "Telegram" tab ni tanlang
2. @BotFather dan bot token oling
3. Token ni kiriting
4. "Ulanishni Tekshirish" tugmasini bosing
5. Webhook URL kiriting (production uchun)
6. "Saqlash" tugmasini bosing

### 4. Facebook/Instagram Sozlash

1. "Facebook/Instagram" tab ni tanlang
2. Facebook Developers dan tokenlar oling
3. Ma'lumotlarni kiriting
4. "Saqlash" tugmasini bosing
5. Backend `.env` faylini yangilang

## Backend API

- `GET /settings` - Sozlamalarni olish
- `POST /settings/telegram` - Telegram sozlash
- `POST /settings/telegram/test` - Telegram test
- `POST /settings/facebook` - Facebook sozlash
- `GET /settings/sip-extensions` - Extensionlar ro'yxati
- `POST /settings/sip-extensions` - Extension yaratish

## Keyingi Qadamlar

1. **Asterisk PJSIP Konfiguratsiyasi:**
   - Extension yaratgandan keyin `pjsip.conf` ni yangilash
   - Yoki avtomatik yaratish funksiyasini qo'shish

2. **Environment Variables:**
   - Telegram va Facebook sozlamalarini `.env` ga saqlash
   - Backend ni qayta ishga tushirish

3. **Webhook Sozlash:**
   - Production server sozlash
   - HTTPS sertifikat o'rnatish
   - Webhook URL larni sozlash

Batafsil qo'llanma: `SETTINGS_GUIDE.md`

