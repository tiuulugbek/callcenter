# Serverga Deploy Qilish Qo'llanmasi

## Production Sozlash

Serverga deploy qilgandan keyin Telegram webhook ishlashi uchun:

### 1. Server Talablari

- ✅ Public IP yoki Domain
- ✅ HTTPS sertifikat (Let's Encrypt yoki boshqa)
- ✅ Firewall da 4000 port ochiq (yoki reverse proxy)
- ✅ Node.js 18+
- ✅ PostgreSQL
- ✅ Asterisk (agar kerak bo'lsa)

### 2. Telegram Webhook Production

Serverda HTTPS va domain bo'lsa, tunnel kerak emas!

**Webhook URL:**
```
https://your-domain.com/chats/webhook/telegram
```

### 3. Backend Deploy

```bash
# Serverga kirish
ssh user@your-server.com

# Kodni yuklab olish
git clone your-repo
cd asterisk-call-center/backend

# Paketlarni o'rnatish
npm install

# Production build
npm run build

# Environment sozlash
nano .env
```

`.env` fayli:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/callcenter?schema=public"
PORT=4000
FRONTEND_URL=https://your-domain.com
JWT_SECRET=your-production-secret-key

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_WEBHOOK_URL=https://your-domain.com/chats/webhook/telegram

# Asterisk
ASTERISK_ARI_URL=http://localhost:8088/ari
ASTERISK_ARI_WS_URL=ws://localhost:8088/ari/events
ASTERISK_ARI_USERNAME=backend
ASTERISK_ARI_PASSWORD=secure_password
```

### 4. PM2 yoki Systemd

**PM2 (Tavsiya etiladi):**
```bash
npm install -g pm2
pm2 start dist/main.js --name call-center-backend
pm2 save
pm2 startup
```

**Systemd:**
```bash
sudo nano /etc/systemd/system/call-center-backend.service
```

```ini
[Unit]
Description=Call Center Backend
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/backend
ExecStart=/usr/bin/node dist/main.js
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable call-center-backend
sudo systemctl start call-center-backend
```

### 5. Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /socket.io/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

### 6. Frontend Deploy

```bash
cd frontend
npm install
npm run build

# Nginx da static fayllarni serve qilish
sudo cp -r dist/* /var/www/html/
```

Yoki frontend ni ham backend bilan birga serve qilish:

```nginx
location / {
    try_files $uri $uri/ /index.html;
    root /path/to/frontend/dist;
}
```

### 7. Telegram Webhook Sozlash

Server deploy qilingandan keyin:

1. Settings sahifasiga kirish: `https://your-domain.com/settings`
2. Telegram tab
3. Bot Token kiriting
4. Webhook URL: `https://your-domain.com/chats/webhook/telegram`
5. "Saqlash" tugmasini bosing

Yoki to'g'ridan-to'g'ri API orqali:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-domain.com/chats/webhook/telegram"
```

### 8. Tekshirish

```bash
# Webhook holatini tekshirish
curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo

# Backend loglarini tekshirish
pm2 logs call-center-backend
# yoki
sudo journalctl -u call-center-backend -f
```

## Xavfsizlik

1. **Firewall:**
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

2. **HTTPS:** Let's Encrypt ishlatish
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

3. **Environment Variables:** `.env` faylini xavfsiz saqlash

4. **Database:** Strong password va remote access ni cheklash

## Muammolarni Hal Qilish

### Webhook Kelmayapti
- HTTPS sertifikat to'g'rimi?
- Domain to'g'ri sozlanganmi?
- Firewall ochiqmi?
- Backend ishlayaptimi?

### Backend Ishlamayapti
- PM2 yoki systemd ishlayaptimi?
- Port band emasmi?
- Database ulanishi to'g'rimi?

### Frontend Ko'rinmayapti
- Build qilinganmi?
- Nginx to'g'ri sozlanganmi?
- Static fayllar mavjudmi?

