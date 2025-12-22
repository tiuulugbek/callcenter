# ✅ Backend PM2 da Ishga Tushdi!

## Tekshirish

### 1. PM2 Status

```bash
pm2 status
```

### 2. PM2 Loglar

```bash
# Real-time loglar
pm2 logs call-center-backend

# Yoki oxirgi 50 qator
pm2 logs call-center-backend --lines 50
```

### 3. Backend Ishlamoqdamimi?

```bash
# Backend ni test qilish
curl http://localhost:4000/auth/login

# Yoki
curl http://localhost:4000
```

### 4. PM2 Save

```bash
# PM2 ni saqlash (server qayta ishga tushganda avtomatik ishga tushishi uchun)
pm2 save

# PM2 startup
pm2 startup
```

## Keyingi Qadamlar

### 1. Frontend Build va Deploy

```bash
cd /var/www/call-center/frontend

# Paketlar o'rnatilganini tekshirish
npm install

# .env faylini tekshirish
cat .env

# Build
npm run build

# Nginx ga ko'chirish
mkdir -p /var/www/crm24
cp -r dist/* /var/www/crm24/
chown -R www-data:www-data /var/www/crm24
```

### 2. Nginx Sozlash

```bash
# Nginx konfiguratsiyasini yaratish
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

### 3. SSL Sertifikat (Let's Encrypt)

```bash
sudo certbot --nginx -d crm24.soundz.uz
```

## Monitoring

```bash
# PM2 status
pm2 status

# PM2 monitoring
pm2 monit

# Backend loglar
pm2 logs call-center-backend

# Nginx loglar
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

## Muammolar

### Backend Ishlamayapti

```bash
# PM2 loglar
pm2 logs call-center-backend --lines 50

# Port 4000 bandmi?
ss -tlnp | grep 4000

# Database connection tekshirish
cat .env | grep DATABASE_URL
```

### Frontend Ochilmayapti

```bash
# Nginx ishlayaptimi?
sudo systemctl status nginx

# Nginx loglar
sudo tail -f /var/log/nginx/error.log

# Frontend fayllar mavjudmi?
ls -la /var/www/crm24/
```

