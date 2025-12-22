# Nginx Sozlash va Deploy

## ✅ Frontend Build Muvaffaqiyatli!

Build fayllar yaratilgan:
- `dist/index.html`
- `dist/assets/`

## Nginx ga Ko'chirish va Sozlash

### 1. Frontend Fayllarni Ko'chirish

```bash
cd /var/www/call-center/frontend

# Nginx papkasini yaratish
mkdir -p /var/www/crm24

# Frontend fayllarni ko'chirish
cp -r dist/* /var/www/crm24/

# Huquqlarni o'rnatish
chown -R www-data:www-data /var/www/crm24
chmod -R 755 /var/www/crm24

# Tekshirish
ls -la /var/www/crm24/
```

### 2. Nginx Konfiguratsiyasini Yaratish

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

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

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
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3. Nginx ni Faollashtirish

```bash
# Symlink yaratish
sudo ln -s /etc/nginx/sites-available/crm24.soundz.uz /etc/nginx/sites-enabled/

# Nginx konfiguratsiyasini tekshirish
sudo nginx -t

# Nginx ni qayta ishga tushirish
sudo systemctl restart nginx

# Nginx status
sudo systemctl status nginx
```

### 4. SSL Sertifikat (Let's Encrypt)

```bash
# Certbot o'rnatilganini tekshirish
which certbot

# SSL sertifikat o'rnatish
sudo certbot --nginx -d crm24.soundz.uz

# Avtomatik yangilanish test
sudo certbot renew --dry-run
```

## Tekshirish

```bash
# Frontend fayllar mavjudmi?
ls -la /var/www/crm24/

# Nginx ishlayaptimi?
sudo systemctl status nginx

# HTTP test (redirect tekshirish)
curl -I http://crm24.soundz.uz

# HTTPS test (SSL o'rnatilgandan keyin)
curl -I https://crm24.soundz.uz

# Browser da ochish
# http://crm24.soundz.uz yoki https://crm24.soundz.uz
```

## Muammolar

### Nginx Xatosi

```bash
# Nginx konfiguratsiyasini tekshirish
sudo nginx -t

# Nginx loglar
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Frontend Ochilmayapti

```bash
# Frontend fayllar mavjudmi?
ls -la /var/www/crm24/

# Huquqlar to'g'rimi?
ls -la /var/www/crm24/index.html
```

### Backend API Ishlamayapti

```bash
# Backend ishlayaptimi?
pm2 status
pm2 logs call-center-backend

# Port 4000 ochiqmi?
ss -tlnp | grep 4000

# Backend ni test qilish
curl http://localhost:4000/auth/login
```

