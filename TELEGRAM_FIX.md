# Telegram Sozlash Muammosini Hal Qilish

## Muammo

- Bot ulandi deb ko'rsatiladi, lekin sozlamalar saqlanmaydi
- Xabar kelmayapti

## Yechim

### 1. Backend .env Faylini Yangilash

Settings sahifasida bot token kiritgandan keyin, backend `.env` faylini yangilang:

```bash
cd /Users/tiuulugbek/asterisk-call-center/backend
nano .env
```

Quyidagilarni qo'shing yoki yangilang:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_WEBHOOK_URL=http://localhost:4000/chats/webhook/telegram
```

### 2. Backend ni Qayta Ishga Tushirish

```bash
npm run start:dev
```

### 3. Webhook URL Tekshirish

**Development uchun:**
- Webhook URL: `http://localhost:4000/chats/webhook/telegram`
- Lekin bu faqat localhost da ishlaydi

**Production uchun:**
- Webhook URL HTTPS bo'lishi kerak
- Masalan: `https://your-domain.com/chats/webhook/telegram`
- Yoki ngrok ishlatish: `ngrok http 4000`

### 4. Ngrok Ishlatish (Development)

```bash
# Ngrok o'rnatish
brew install ngrok  # Mac
# yoki
# https://ngrok.com/download

# Ngrok ishga tushirish
ngrok http 4000
```

Ngrok URL ni oling (masalan: `https://abc123.ngrok.io`) va Settings sahifasida Webhook URL ga kiriting:

```
https://abc123.ngrok.io/chats/webhook/telegram
```

### 5. Webhook Holatini Tekshirish

```bash
curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
```

### 6. Telegram Bot ga Xabar Yuborish

Bot ga to'g'ridan-to'g'ri xabar yuborib ko'ring. Agar webhook to'g'ri sozlangan bo'lsa, xabar backend ga kelishi kerak.

## Muammolarni Hal Qilish

### Webhook Kelmayapti

1. **Ngrok ishlatish (development):**
   ```bash
   ngrok http 4000
   ```

2. **Webhook URL ni to'g'ri kiriting:**
   - HTTPS bo'lishi kerak (ngrok yoki production)
   - To'liq URL: `https://domain.com/chats/webhook/telegram`

3. **Backend loglarini tekshiring:**
   ```bash
   # Backend terminalda
   # "Telegram webhook received" xabari ko'rinishi kerak
   ```

### Bot Token Noto'g'ri

1. @BotFather dan yangi token oling
2. `.env` faylini yangilang
3. Backend ni qayta ishga tushiring

### Xabar Saqlanmayapti

1. Database ulanishini tekshiring
2. Backend loglarini tekshiring
3. ChatsService ishlayaptimi tekshiring

## Tezkor Test

1. **Ngrok ishga tushirish:**
   ```bash
   ngrok http 4000
   ```

2. **Ngrok URL ni olish** (masalan: `https://abc123.ngrok.io`)

3. **Settings sahifasida:**
   - Bot Token: @BotFather dan olingan token
   - Webhook URL: `https://abc123.ngrok.io/chats/webhook/telegram`
   - "Saqlash" tugmasini bosing

4. **Bot ga xabar yuborish:**
   - Telegram da bot ga xabar yuboring
   - Backend loglarida "Telegram webhook received" ko'rinishi kerak
   - Frontend da Chats sahifasida xabar ko'rinishi kerak

