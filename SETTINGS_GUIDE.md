# Sozlamalar Qo'llanmasi

## Settings Sahifasi

Settings sahifasi 3 ta bo'limdan iborat:

### 1. SIP Extensionlar

Operatorlar uchun SIP extensionlar yaratish va boshqarish.

#### Qanday Ishlaydi:

1. **Operator Tanlash:** Ro'yxatdan operatorni tanlang
2. **Extension Raqami:** SIP extension raqamini kiriting (masalan: 1001)
3. **Parol:** SIP parolini kiriting
4. **Yaratish:** Extension yaratish tugmasini bosing

#### Telefon Sozlash:

Telefoningizda quyidagilarni sozlang:

- **SIP Server:** Asterisk server IP manzili (masalan: `192.168.1.100`)
- **Username:** Extension raqami (masalan: `1001`)
- **Password:** Yaratilgan parol
- **Domain:** Asterisk server IP yoki domain
- **Port:** 5060 (default)

#### Asterisk PJSIP Konfiguratsiyasi:

Settings sahifasida extension yaratgandan keyin, Asterisk `pjsip.conf` faylini yangilash kerak:

```ini
[1001]
type = aor
contact = sip/1001

[1001]
type = endpoint
context = from-internal
disallow = all
allow = ulaw
allow = alaw
auth = 1001-auth
aors = 1001

[1001-auth]
type = auth
auth_type = userpass
username = 1001
password = your_password
```

### 2. Telegram Bot

Telegram bot yaratish va webhook o'rnatish.

#### Qadamlari:

1. **Bot Yaratish:**
   - Telegram da @BotFather ga murojaat qiling
   - `/newbot` buyrug'ini yuboring
   - Bot nomini va username ni kiriting
   - Bot tokenini oling

2. **Token Kiriting:**
   - Settings sahifasida bot tokenini kiriting
   - "Ulanishni Tekshirish" tugmasini bosing
   - Agar muvaffaqiyatli bo'lsa, bot ma'lumotlari ko'rsatiladi

3. **Webhook O'rnatish:**
   - Production uchun webhook URL kiriting
   - Format: `https://your-domain.com/api/chats/webhook/telegram`
   - "Saqlash" tugmasini bosing

#### Webhook URL:

- **Development:** `http://localhost:4000/chats/webhook/telegram`
- **Production:** `https://your-domain.com/chats/webhook/telegram`

### 3. Facebook/Instagram

Facebook Messenger va Instagram Messaging API sozlash.

#### Qadamlari:

1. **Facebook App Yaratish:**
   - Facebook Developers (developers.facebook.com) ga kirish
   - Yangi app yaratish
   - Messenger va Instagram Messaging API ni qo'shish

2. **Page Access Token:**
   - Page ni tanlash
   - Page Access Token olish
   - Token ni Settings sahifasiga kiriting

3. **App Secret:**
   - App Settings → Basic
   - App Secret ni olish va kiriting

4. **Verify Token:**
   - Webhook verification uchun token kiriting
   - Bu token webhook sozlaganda ishlatiladi

5. **Webhook URL:**
   - `https://your-domain.com/chats/webhook/facebook`
   - Verify Token ni kiriting
   - Webhook ni faollashtirish

#### Eslatma:

Facebook sozlamalarini saqlagandan keyin:
1. Backend `.env` faylini yangilang
2. Backend serverni qayta ishga tushiring

## API Endpointlar

### Settings
- `GET /settings` - Barcha sozlamalarni olish
- `POST /settings/telegram` - Telegram sozlamalarini yangilash
- `POST /settings/telegram/test` - Telegram ulanishini tekshirish
- `POST /settings/facebook` - Facebook sozlamalarini yangilash
- `GET /settings/sip-extensions` - SIP extensionlar ro'yxati
- `POST /settings/sip-extensions` - Yangi SIP extension yaratish

## Muammolarni Hal Qilish

### SIP Extension Ishlamayapti
- Asterisk `pjsip.conf` faylini tekshiring
- Extension yaratilganligini tekshiring
- Asterisk ni qayta ishga tushiring: `sudo systemctl restart asterisk`

### Telegram Bot Ishlamayapti
- Bot token to'g'riligini tekshiring
- Webhook URL to'g'riligini tekshiring
- Backend loglarini tekshiring

### Facebook Webhook Ishlamayapti
- Verify Token to'g'riligini tekshiring
- Webhook URL public bo'lishi kerak (HTTPS)
- Facebook App sozlamalarini tekshiring

