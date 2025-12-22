# Telegram Webhook Sozlash

## ✅ Webhook Muvaffaqiyatli O'rnatildi!

Webhook URL: `https://crm24.soundz.uz/chats/webhook/telegram`

## Backend .env Faylida Sozlash

### 1. Telegram Bot Token ni Olish

Telegram Bot Token ni @BotFather dan oling:
- Telegram da @BotFather ga yozing
- `/mybots` → Botingizni tanlang → `API Token`

### 2. Backend .env Faylini Yangilash

```bash
cd /var/www/call-center/backend
nano .env
```

Quyidagilarni qo'shing/yangilang:
```env
# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_WEBHOOK_URL=https://crm24.soundz.uz/chats/webhook/telegram
```

### 3. Backend ni Restart

```bash
# PM2 da restart
pm2 restart call-center-backend

# Yoki qayta ishga tushirish
pm2 delete call-center-backend
pm2 start dist/src/main.js --name call-center-backend --update-env
pm2 save
```

### 4. Tekshirish

```bash
# PM2 loglar
pm2 logs call-center-backend --lines 50

# Backend ishlayaptimi?
pm2 status

# Webhook test (bot ga xabar yuborish)
# Telegram da bot ga xabar yuboring va backend loglarni ko'ring
```

## To'liq Qadamlar

```bash
# 1. Backend .env faylini yangilash
cd /var/www/call-center/backend
nano .env

# 2. TELEGRAM_BOT_TOKEN ni qo'shing/yangilang
# TELEGRAM_BOT_TOKEN=your_bot_token_here
# TELEGRAM_WEBHOOK_URL=https://crm24.soundz.uz/chats/webhook/telegram

# 3. Backend ni restart
pm2 restart call-center-backend

# 4. Loglar
pm2 logs call-center-backend --lines 20
```

## Webhook Test

1. Telegram da bot ga xabar yuboring
2. Backend loglarni ko'ring:
   ```bash
   pm2 logs call-center-backend
   ```
3. Database da chat va message yaratilganini tekshiring:
   ```bash
   sudo -u postgres psql -d callcenter -c "SELECT * FROM \"Chat\";"
   sudo -u postgres psql -d callcenter -c "SELECT * FROM \"Message\";"
   ```

## Muammolar

### Webhook Xatolari

```bash
# Backend loglar
pm2 logs call-center-backend --lines 100

# Nginx error loglar
sudo tail -f /var/log/nginx/error.log
```

### Bot Token Noto'g'ri

```bash
# .env faylini tekshirish
cat .env | grep TELEGRAM_BOT_TOKEN

# Backend ni restart qilish
pm2 restart call-center-backend
```

