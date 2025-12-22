# Account Talab Qilmaydigan Tunnel Xizmatlari

## 1. Localtunnel (Tavsiya etiladi)

Account talab qilmaydi, tez va oson.

```bash
# O'rnatish
npm install -g localtunnel

# Ishga tushirish
lt --port 4000
```

URL: `https://abc123.loca.lt`

---

## 2. Serveo (SSH orqali)

Account talab qilmaydi, SSH orqali ishlaydi.

```bash
ssh -R 80:localhost:4000 serveo.net
```

URL: `https://abc123.serveo.net`

---

## 3. Localhost.run

Account talab qilmaydi, SSH orqali.

```bash
ssh -R 80:localhost:4000 ssh.localhost.run
```

URL: `http://abc123.localhost.run`

---

## 4. Cloudflare Tunnel (Agar Cloudflare Account Bo'lsa)

```bash
brew install cloudflare/cloudflare/cloudflared
cloudflared tunnel --url http://localhost:4000
```

---

## Eng Oson: Localtunnel

```bash
# 1. O'rnatish
npm install -g localtunnel

# 2. Ishga tushirish (yangi terminal)
lt --port 4000

# 3. URL ni olish va Settings sahifasiga kiriting
# Masalan: https://abc123.loca.lt/chats/webhook/telegram
```

