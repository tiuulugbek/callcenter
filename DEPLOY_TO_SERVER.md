# Serverga Deploy Qilish Qo'llanmasi

## Server Ma'lumotlari

- **Domain:** crm24.soundz.uz
- **IP:** 152.53.229.176
- **SSH:** root@152.53.229.176

## 1-qadam: GitHub ga Yuklash (Tavsiya etiladi)

### GitHub Repository Yaratish

```bash
cd /Users/tiuulugbek/asterisk-call-center

# Git init (agar yo'q bo'lsa)
git init
git add .
git commit -m "Initial commit: Asterisk Call Center MVP"

# GitHub da yangi repository yarating
# Keyin:
git remote add origin https://github.com/your-username/asterisk-call-center.git
git branch -M main
git push -u origin main
```

### Yoki To'g'ridan-to'g'ri Serverga Yuklash

Agar GitHub ishlatmasangiz, to'g'ridan-to'g'ri serverga yuklashingiz mumkin.

## 2-qadam: Server Sozlash

### Serverga Kirish

```bash
ssh root@152.53.229.176
```

### Kerakli Paketlarni O'rnatish

```bash
# Update
apt update && apt upgrade -y

# Node.js 18+ o'rnatish
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# PostgreSQL o'rnatish
apt install -y postgresql postgresql-contrib

# Nginx o'rnatish
apt install -y nginx

# PM2 o'rnatish (process manager)
npm install -g pm2

# Git o'rnatish (agar GitHub dan clone qilmoqchi bo'lsangiz)
apt install -y git

# Build tools
apt install -y build-essential
```

### Database Yaratish

```bash
sudo -u postgres psql
```

PostgreSQL CLI da:
```sql
CREATE DATABASE callcenter;
CREATE USER callcenter_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE callcenter TO callcenter_user;
ALTER DATABASE callcenter OWNER TO callcenter_user;
\q
```

## 3-qadam: Kodni Yuklab Olish

### Variant 1: GitHub dan Clone

```bash
cd /var/www
git clone https://github.com/your-username/asterisk-call-center.git
cd asterisk-call-center
```

### Variant 2: To'g'ridan-to'g'ri Yuklash

Local mashinada:
```bash
cd /Users/tiuulugbek/asterisk-call-center
tar -czf call-center.tar.gz --exclude='node_modules' --exclude='.git' .
scp call-center.tar.gz root@152.53.229.176:/var/www/
```

Serverda:
```bash
cd /var/www
tar -xzf call-center.tar.gz
mv asterisk-call-center call-center
cd call-center
```

## 4-qadam: Backend Sozlash

```bash
cd /var/www/call-center/backend

# Paketlarni o'rnatish
npm install

# Environment sozlash
nano .env
```

`.env` fayli:
```env
DATABASE_URL="postgresql://callcenter_user:your_secure_password@localhost:5432/callcenter?schema=public"
PORT=4000
FRONTEND_URL=https://crm24.soundz.uz
JWT_SECRET=your-super-secret-production-key-change-this

# Asterisk ARI
ASTERISK_ARI_URL=http://localhost:8088/ari
ASTERISK_ARI_WS_URL=ws://localhost:8088/ari/events
ASTERISK_ARI_USERNAME=backend
ASTERISK_ARI_PASSWORD=secure_password

# Telegram
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_WEBHOOK_URL=https://crm24.soundz.uz/chats/webhook/telegram

# Facebook/Instagram
FACEBOOK_PAGE_ACCESS_TOKEN=your-facebook-page-access-token
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_VERIFY_TOKEN=verify_token
```

```bash
# Prisma client yaratish
npm run prisma:generate

# Database migratsiyalari
npm run prisma db push

# Seed (default admin)
npm run prisma:seed

# Build
npm run build

# PM2 da ishga tushirish
pm2 start dist/main.js --name call-center-backend
pm2 save
pm2 startup
```

## 5-qadam: Frontend Sozlash

```bash
cd /var/www/call-center/frontend

# Paketlarni o'rnatish
npm install

# Environment sozlash
nano .env
```

`.env` fayli:
```env
VITE_API_URL=https://crm24.soundz.uz
VITE_WS_URL=https://crm24.soundz.uz
```

```bash
# Build
npm run build

# Nginx ga ko'chirish
sudo mkdir -p /var/www/crm24
sudo cp -r dist/* /var/www/crm24/
```

## 6-qadam: Nginx Sozlash

```bash
sudo nano /etc/nginx/sites-available/crm24.soundz.uz
```

```nginx
# HTTP dan HTTPS ga redirect
server {
    listen 80;
    server_name crm24.soundz.uz;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name crm24.soundz.uz;

    # SSL sertifikat (Let's Encrypt keyin o'rnatiladi)
    # ssl_certificate /etc/letsencrypt/live/crm24.soundz.uz/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/crm24.soundz.uz/privkey.pem;

    # Frontend
    root /var/www/crm24;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:4000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket
    location /socket.io/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Backend endpoints (webhook va boshqalar)
    location ~ ^/(auth|calls|chats|operators|settings) {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Symlink yaratish
sudo ln -s /etc/nginx/sites-available/crm24.soundz.uz /etc/nginx/sites-enabled/

# Nginx ni tekshirish
sudo nginx -t

# Nginx ni qayta ishga tushirish
sudo systemctl restart nginx
```

## 7-qadam: SSL Sertifikat (Let's Encrypt)

```bash
# Certbot o'rnatish
apt install -y certbot python3-certbot-nginx

# SSL sertifikat olish
sudo certbot --nginx -d crm24.soundz.uz

# Avtomatik yangilanish
sudo certbot renew --dry-run
```

## 8-qadam: Firewall Sozlash

```bash
# UFW o'rnatish
apt install -y ufw

# Portlarni ochish
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS

# Firewall ni faollashtirish
ufw enable
```

## 9-qadam: Telegram Webhook Sozlash

Server deploy qilingandan keyin:

1. **Settings sahifasiga kirish:** https://crm24.soundz.uz/settings
2. **Telegram tab:**
   - Bot Token: @BotFather dan olingan token
   - Webhook URL: `https://crm24.soundz.uz/chats/webhook/telegram`
   - "Saqlash" tugmasini bosing

## 10-qadam: Tekshirish

```bash
# Backend ishlayaptimi?
pm2 status
pm2 logs call-center-backend

# Nginx ishlayaptimi?
sudo systemctl status nginx

# Database ulanishi?
sudo -u postgres psql -d callcenter -U callcenter_user
```

## Tezkor Deploy Skripti

Batafsil qo'llanma: `DEPLOY_TO_SERVER.md` faylida.

