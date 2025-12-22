# Telegram Webhook Debug - Xabar Kelmayapti

## Tekshirish Qadamlari

### 1. Backend Loglar (MUHIM!)

```bash
# Real-time loglar
pm2 logs call-center-backend

# Yoki oxirgi 100 qator
pm2 logs call-center-backend --lines 100
```

Bot ga xabar yuborib, loglarni ko'ring.

### 2. Webhook Endpoint ni Test Qilish

```bash
# Webhook endpoint ni test qilish
curl -X POST https://crm24.soundz.uz/chats/webhook/telegram \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "message_id": 1,
      "from": {
        "id": 123456789,
        "first_name": "Test",
        "username": "testuser"
      },
      "chat": {
        "id": 123456789,
        "type": "private"
      },
      "date": 1234567890,
      "text": "Test message"
    }
  }'
```

### 3. Nginx Loglar

```bash
# Nginx error loglar
sudo tail -f /var/log/nginx/error.log

# Nginx access loglar
sudo tail -f /var/log/nginx/access.log
```

### 4. Telegram Webhook Status

```bash
# Backend .env faylida bot token ni tekshirish
cd /var/www/call-center/backend
cat .env | grep TELEGRAM_BOT_TOKEN

# Telegram webhook status ni ko'rish (bot token bilan)
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
```

### 5. Database Tekshirish

```bash
# Chat va message yaratilganini tekshirish
sudo -u postgres psql -d callcenter -c "SELECT * FROM \"Chat\";"
sudo -u postgres psql -d callcenter -c "SELECT * FROM \"Message\";"
```

## Umumiy Muammolar va Yechimlar

### Muammo 1: Webhook URL Noto'g'ri

```bash
# Backend .env faylini tekshirish
cd /var/www/call-center/backend
cat .env | grep TELEGRAM_WEBHOOK_URL

# To'g'ri URL bo'lishi kerak:
# TELEGRAM_WEBHOOK_URL=https://crm24.soundz.uz/chats/webhook/telegram
```

### Muammo 2: Nginx Proxy Xatosi

```bash
# Nginx konfiguratsiyasini tekshirish
sudo cat /etc/nginx/sites-available/crm24.soundz.uz | grep -A 10 "chats/webhook"

# Nginx ni reload qilish
sudo systemctl reload nginx
```

### Muammo 3: Backend Webhook Handler Xatosi

```bash
# Backend loglar
pm2 logs call-center-backend --lines 100

# Backend kodini tekshirish
cat src/chats/chats.controller.ts | grep -A 10 "telegramWebhook"
```

### Muammo 4: SSL Sertifikat Muammosi

```bash
# SSL sertifikat tekshirish
sudo certbot certificates

# Yoki
curl -I https://crm24.soundz.uz/chats/webhook/telegram
```

### Muammo 5: Bot Token Noto'g'ri

```bash
# Backend .env faylida bot token
cd /var/www/call-center/backend
cat .env | grep TELEGRAM_BOT_TOKEN

# Bot token ni test qilish
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getMe"
```

## To'liq Tekshirish

```bash
# 1. Backend loglar (real-time)
pm2 logs call-center-backend

# 2. Nginx error loglar
sudo tail -f /var/log/nginx/error.log

# 3. Webhook endpoint test
curl -X POST https://crm24.soundz.uz/chats/webhook/telegram \
  -H "Content-Type: application/json" \
  -d '{"message":{"message_id":1,"from":{"id":123456789,"first_name":"Test"},"chat":{"id":123456789},"date":1234567890,"text":"Test"}}'

# 4. Telegram webhook status
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"

# 5. Database tekshirish
sudo -u postgres psql -d callcenter -c "SELECT * FROM \"Chat\";"
```

## Webhook ni Qayta Sozlash

```bash
# Settings sahifasida yoki qo'lda
cd /var/www/call-center/backend

# Telegram service ni ishlatib webhook ni sozlash
# Yoki Settings API orqali
curl -X POST https://crm24.soundz.uz/settings/telegram \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "botToken": "<YOUR_BOT_TOKEN>",
    "webhookUrl": "https://crm24.soundz.uz/chats/webhook/telegram"
  }'
```

## Tezkor Yechim

```bash
# 1. Backend loglar
pm2 logs call-center-backend

# 2. Nginx reload
sudo systemctl reload nginx

# 3. Backend restart
pm2 restart call-center-backend

# 4. Webhook test
# Bot ga xabar yuborib, loglarni ko'ring
```

