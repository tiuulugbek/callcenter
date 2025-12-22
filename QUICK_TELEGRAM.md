# Telegram Webhook Tezkor Sozlash

## Yechim 1: Ngrok (Tavsiya etiladi)

### 1. Account Yaratish
- https://dashboard.ngrok.com/signup
- Email va parol bilan ro'yxatdan o'tish

### 2. Authtoken Olish
- https://dashboard.ngrok.com/get-started/your-authtoken
- Authtoken ni ko'chirish

### 3. Authtoken O'rnatish
```bash
ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
```

### 4. Ngrok Ishga Tushirish
```bash
ngrok http 4000
```

### 5. URL ni Olish
Forwarding qatoridan HTTPS URL ni oling:
```
https://abc123-def456.ngrok-free.app
```

### 6. Settings Sahifasida
- Webhook URL: `https://abc123-def456.ngrok-free.app/chats/webhook/telegram`
- "Saqlash" tugmasini bosing

---

## Yechim 2: Localtunnel (Account Talab Qilmaydi)

### 1. Localtunnel O'rnatish
```bash
npm install -g localtunnel
```

### 2. Ishga Tushirish
```bash
lt --port 4000
```

### 3. URL ni Olish
Quyidagicha URL beradi:
```
https://abc123.loca.lt
```

### 4. Settings Sahifasida
- Webhook URL: `https://abc123.loca.lt/chats/webhook/telegram`
- "Saqlash" tugmasini bosing

---

## Yechim 3: Cloudflare Tunnel (Agar Cloudflare Account Bo'lsa)

```bash
# Cloudflared o'rnatish
brew install cloudflare/cloudflare/cloudflared

# Tunnel yaratish
cloudflared tunnel --url http://localhost:4000
```

---

## Test Qilish

1. Telegram da bot ga xabar yuboring
2. Backend loglarida "Telegram webhook received" ko'rinishi kerak
3. Frontend da Chats sahifasida xabar ko'rinishi kerak

## Muhim

- Development uchun ngrok yoki localtunnel ishlatish tavsiya etiladi
- Production uchun HTTPS sertifikat va domain kerak
- Webhook URL HTTPS bo'lishi kerak (Telegram talabi)

