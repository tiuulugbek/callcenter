# Production Server Sozlash

## Serverga Deploy Qilgandan Keyin

### ✅ Telegram Webhook

**Serverda HTTPS va domain bo'lsa, tunnel kerak emas!**

1. **Settings sahifasida:**
   - Bot Token: @BotFather dan olingan token
   - Webhook URL: `https://your-domain.com/chats/webhook/telegram`
   - "Saqlash" tugmasini bosing

2. **Yoki API orqali:**
   ```bash
   curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
     -d "url=https://your-domain.com/chats/webhook/telegram"
   ```

### ✅ Facebook/Instagram Webhook

1. **Facebook Developers:**
   - Webhook URL: `https://your-domain.com/chats/webhook/facebook`
   - Verify Token: Settings sahifasida kiritilgan token

2. **Settings sahifasida:**
   - Page Access Token
   - App Secret
   - Verify Token
   - "Saqlash" tugmasini bosing

### ✅ SIP Trunk

1. **Settings → SIP Trunk tab:**
   - Provayder ma'lumotlarini kiriting
   - "Trunk Yaratish" tugmasini bosing
   - Asterisk ni qayta ishga tushiring

### ✅ SIP Extensionlar

1. **Settings → SIP Extensionlar tab:**
   - Operator tanlash
   - Extension va parol kiriting
   - "Yaratish" tugmasini bosing

## Muhim Eslatmalar

1. **HTTPS:** Production uchun HTTPS majburiy (Telegram va Facebook talabi)
2. **Domain:** Public domain bo'lishi kerak
3. **Firewall:** 80 va 443 portlar ochiq bo'lishi kerak
4. **Backend .env:** Production ma'lumotlarini kiriting
5. **Database:** Xavfsiz parol va remote access ni cheklash

## Tezkor Deploy

Batafsil qo'llanma: `DEPLOYMENT.md` faylida.

