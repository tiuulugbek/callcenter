# Serverga Deploy Qilish - Qadamlar

## ✅ 1. GitHub ga Push Qilindi
Repository: https://github.com/tiuulugbek/callcenter

## 2. Serverga Kirish

```bash
ssh root@152.53.229.176
```

## 3. Server Sozlash (Birinchi Marta)

```bash
# Update
apt update && apt upgrade -y

# Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# PostgreSQL
apt install -y postgresql postgresql-contrib
systemctl start postgresql
systemctl enable postgresql

# Nginx
apt install -y nginx
systemctl start nginx
systemctl enable nginx

# PM2
npm install -g pm2

# Git
apt install -y git

# Build tools
apt install -y build-essential

# SSL (Let's Encrypt)
apt install -y certbot python3-certbot-nginx

# Firewall
apt install -y ufw
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
```

## 4. Database Yaratish

```bash
sudo -u postgres psql
```

PostgreSQL da:
```sql
CREATE DATABASE callcenter;
CREATE USER callcenter_user WITH PASSWORD 'o_z_parolni_kiriting';
GRANT ALL PRIVILEGES ON DATABASE callcenter TO callcenter_user;
ALTER DATABASE callcenter OWNER TO callcenter_user;
\q
```

## 5. Kodni Yuklab Olish

```bash
cd /var/www
git clone https://github.com/tiuulugbek/callcenter.git call-center
cd call-center
```

## 6. Backend Sozlash

```bash
cd /var/www/call-center/backend

# Paketlarni o'rnatish
npm install

# Environment sozlash
nano .env
```

`.env` fayli:
```env
DATABASE_URL="postgresql://callcenter_user:o_z_parolni_kiriting@localhost:5432/callcenter?schema=public"
PORT=4000
FRONTEND_URL=https://crm24.soundz.uz
JWT_SECRET=o_z_juda_maxfiy_key_yarating_va_uni_saqlang

# Telegram (keyinroq sozlanadi)
TELEGRAM_BOT_TOKEN=
TELEGRAM_WEBHOOK_URL=https://crm24.soundz.uz/chats/webhook/telegram

# Asterisk ARI (keyinroq sozlanadi)
ASTERISK_ARI_URL=http://localhost:8088/ari
ASTERISK_ARI_WS_URL=ws://localhost:8088/ari/events
ASTERISK_ARI_USERNAME=backend
ASTERISK_ARI_PASSWORD=secure_password

# Facebook/Instagram (keyinroq sozlanadi)
FACEBOOK_PAGE_ACCESS_TOKEN=
FACEBOOK_APP_SECRET=
FACEBOOK_VERIFY_TOKEN=verify_token
```

```bash
# Prisma
npm run prisma:generate
npm run prisma db push
npm run prisma:seed

# Build
npm run build

# PM2 da ishga tushirish
pm2 start dist/main.js --name call-center-backend
pm2 save
pm2 startup
```

## 7. Frontend Sozlash

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
mkdir -p /var/www/crm24
cp -r dist/* /var/www/crm24/
chown -R www-data:www-data /var/www/crm24
```

## 8. Nginx Sozlash

```bash
sudo nano /etc/nginx/sites-available/crm24.soundz.uz
```

Quyidagi konfiguratsiyani kiriting:
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

    # Backend API va Webhooks
    location ~ ^/(auth|calls|chats|operators|settings|socket.io) {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
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

## 9. SSL Sertifikat (Let's Encrypt)

```bash
sudo certbot --nginx -d crm24.soundz.uz
```

Bu avtomatik ravishda Nginx konfiguratsiyasini yangilaydi va SSL sertifikatni o'rnatadi.

## 10. Tekshirish

```bash
# Backend ishlayaptimi?
pm2 status
pm2 logs call-center-backend

# Nginx ishlayaptimi?
sudo systemctl status nginx

# Frontend ochilayaptimi?
curl https://crm24.soundz.uz
```

## 11. Telegram Webhook Sozlash

1. **Saytga kirish:** https://crm24.soundz.uz
2. **Login qilish:** admin / admin (yoki seed.ts da belgilangan)
3. **Settings sahifasiga kirish**
4. **Telegram tab:**
   - Bot Token: @BotFather dan olingan token
   - Webhook URL: `https://crm24.soundz.uz/chats/webhook/telegram`
   - "Saqlash" tugmasini bosing

## Keyingi Yangilanishlar

```bash
# Serverda
cd /var/www/call-center
git pull origin main

# Backend
cd backend
npm install
npm run build
pm2 restart call-center-backend

# Frontend
cd ../frontend
npm install
npm run build
cp -r dist/* /var/www/crm24/
```

## Muammolar Bo'lsa

```bash
# Backend loglari
pm2 logs call-center-backend

# Nginx loglari
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Database tekshirish
sudo -u postgres psql -d callcenter
```

