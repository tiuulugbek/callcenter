# Ngrok Authtoken Sozlash

## 1. Account Yaratish

1. https://dashboard.ngrok.com/signup ga kirish
2. Email va parol bilan ro'yxatdan o'tish
3. Email tasdiqlash

## 2. Authtoken Olish

1. https://dashboard.ngrok.com/get-started/your-authtoken ga kirish
2. Authtoken ni ko'chirish

## 3. Authtoken O'rnatish

```bash
ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
```

## 4. Ngrok Ishga Tushirish

```bash
ngrok http 4000
```

## Alternativ: Localtunnel (Authtoken Talab Qilmaydi)

Agar ngrok account yaratishni xohlamasangiz, localtunnel ishlatishingiz mumkin:

```bash
# Localtunnel o'rnatish
npm install -g localtunnel

# Ishga tushirish
lt --port 4000
```

Bu quyidagicha URL beradi:
```
https://abc123.loca.lt
```

Webhook URL: `https://abc123.loca.lt/chats/webhook/telegram`

