# Telegram Bot Xabar Kelmayapti - Muammoni Hal Qilish

## Muammo
- Test webhook ishlayapti ✅
- Haqiqiy botdan xabar kelmayapti ❌
- Database jadvallar yaratilmagan (Chat, Message)

## Yechim

### 1. Database Schema ni To'liq Yaratish

```bash
cd /var/www/call-center/backend

# Database schema ni yaratish
npx prisma db push

# Tekshirish
sudo -u postgres psql -d callcenter -c "\dt"
```

### 2. Telegram Webhook Status ni Tekshirish

```bash
# Backend .env faylida bot token ni olish
cd /var/www/call-center/backend
cat .env | grep TELEGRAM_BOT_TOKEN

# Telegram webhook status ni ko'rish
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
```

### 3. Webhook ni Qayta Sozlash

```bash
# Settings API orqali webhook ni sozlash
# Yoki qo'lda Telegram API orqali

# Webhook ni o'rnatish
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://crm24.soundz.uz/chats/webhook/telegram"
  }'

# Webhook status ni tekshirish
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
```

### 4. Backend ni Restart

```bash
# PM2 da restart
pm2 restart call-center-backend --update-env

# Loglar
pm2 logs call-center-backend
```

### 5. Database Tekshirish

```bash
# Database jadvallar mavjudmi?
sudo -u postgres psql -d callcenter -c "\dt"

# Chat va Message jadvallar mavjudmi?
sudo -u postgres psql -d callcenter -c "SELECT * FROM \"Chat\";"
sudo -u postgres psql -d callcenter -c "SELECT * FROM \"Message\";"
```

## To'liq Qadamlar

```bash
# 1. Database schema yaratish
cd /var/www/call-center/backend
npx prisma db push

# 2. Telegram webhook status
BOT_TOKEN=$(cat .env | grep TELEGRAM_BOT_TOKEN | cut -d '=' -f2)
curl "https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo"

# 3. Webhook ni qayta sozlash
curl -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://crm24.soundz.uz/chats/webhook/telegram"}'

# 4. Backend restart
pm2 restart call-center-backend --update-env

# 5. Loglar
pm2 logs call-center-backend
```

## Muammolar

### Database Jadvallar Yaratilmagan

```bash
# Prisma schema ni tekshirish
cat prisma/schema.prisma

# Database schema yaratish
npx prisma db push

# Tekshirish
sudo -u postgres psql -d callcenter -c "\dt"
```

### Webhook Noto'g'ri Sozlangan

```bash
# Webhook status
BOT_TOKEN=$(cat .env | grep TELEGRAM_BOT_TOKEN | cut -d '=' -f2)
curl "https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo"

# Webhook ni qayta sozlash
curl -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://crm24.soundz.uz/chats/webhook/telegram"}'
```

### SSL Sertifikat Muammosi

```bash
# SSL sertifikat tekshirish
curl -I https://crm24.soundz.uz/chats/webhook/telegram

# Certbot tekshirish
sudo certbot certificates
```

## Test

1. Database schema yaratilganini tekshiring
2. Webhook status ni tekshiring
3. Bot ga xabar yuboring
4. Backend loglarni ko'ring:
   ```bash
   pm2 logs call-center-backend
   ```

