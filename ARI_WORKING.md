# ✅ ARI Ishlamoqda!

## Muvaffaqiyatli Test

```bash
curl -u backend:CallCenter2025 http://localhost:8088/ari/asterisk/info
```

JSON javob qaytdi - ARI to'g'ri ishlayapti!

## Keyingi Qadamlar

### 1. Backend .env Faylida Sozlash

```bash
cd /var/www/call-center/backend
nano .env
```

Quyidagilarni qo'shing/yangilang:
```env
ASTERISK_ARI_URL=http://localhost:8088/ari
ASTERISK_ARI_WS_URL=ws://localhost:8088/ari/events
ASTERISK_ARI_USERNAME=backend
ASTERISK_ARI_PASSWORD=CallCenter2025
```

### 2. Database Sozlash

```bash
# PostgreSQL ga kirish
sudo -u postgres psql

# Database va user yaratish (agar hali qilmagan bo'lsangiz)
CREATE DATABASE callcenter;
CREATE USER callcenter_user WITH PASSWORD 'SIZNING_PAROLINGIZ';
GRANT ALL PRIVILEGES ON DATABASE callcenter TO callcenter_user;
ALTER DATABASE callcenter OWNER TO callcenter_user;
\q
```

### 3. Backend .env Faylida Database Sozlash

```bash
cd /var/www/call-center/backend
nano .env
```

Quyidagilarni qo'shing:
```env
DATABASE_URL="postgresql://callcenter_user:SIZNING_PAROLINGIZ@localhost:5432/callcenter?schema=public"
PORT=4000
FRONTEND_URL=https://crm24.soundz.uz
JWT_SECRET=SIZNING_JWT_SECRET_KEY
```

### 4. Backend Paketlarini O'rnatish

```bash
cd /var/www/call-center/backend
npm install
```

### 5. Prisma Migrations

```bash
cd /var/www/call-center/backend
npm run prisma:generate
npm run prisma db push
npm run prisma:seed
```

### 6. Backend Build

```bash
cd /var/www/call-center/backend
npm run build
```

### 7. Backend ni PM2 da Ishga Tushirish

```bash
cd /var/www/call-center/backend
pm2 start dist/main.js --name call-center-backend
pm2 save
pm2 startup
```

### 8. Frontend Sozlash

```bash
cd /var/www/call-center/frontend
npm install

# .env faylini yaratish
nano .env
```

`.env` fayli:
```env
VITE_API_URL=https://crm24.soundz.uz
VITE_WS_URL=https://crm24.soundz.uz
```

### 9. Frontend Build

```bash
cd /var/www/call-center/frontend
npm run build

# Nginx ga ko'chirish
mkdir -p /var/www/crm24
cp -r dist/* /var/www/crm24/
chown -R www-data:www-data /var/www/crm24
```

### 10. Nginx Sozlash

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

### 11. SSL Sertifikat (Let's Encrypt)

```bash
sudo certbot --nginx -d crm24.soundz.uz
```

## Tekshirish

```bash
# Backend ishlayaptimi?
pm2 status
pm2 logs call-center-backend

# Nginx ishlayaptimi?
sudo systemctl status nginx

# Frontend ochilayaptimi?
curl https://crm24.soundz.uz
```

