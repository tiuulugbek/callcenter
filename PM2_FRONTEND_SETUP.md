# PM2 Frontend Setup

## Frontend ni PM2 da ishga tushirish

### Variant 1: Vite Preview (Tavsiya etiladi)

```bash
cd /var/www/call-center/frontend

# Build qilingan fayllarni preview qilish
pm2 start npx --name "call-center-frontend" -- vite preview --host 0.0.0.0 --port 4001

# Yoki ecosystem.config.js ishlatish
pm2 start /var/www/call-center/ecosystem.config.js
```

### Variant 2: Serve Package (Alternativ)

Agar `vite preview` ishlamasa, `serve` package ishlatish mumkin:

```bash
cd /var/www/call-center/frontend

# Serve package o'rnatish
npm install -g serve

# PM2 da ishga tushirish
pm2 start serve --name "call-center-frontend" -- -s dist -l 4001

# Yoki ecosystem.config.js da o'zgartirish:
# script: 'serve'
# args: '-s dist -l 4001'
```

### Variant 3: Nginx Static Files (Eng yaxshi)

Agar Nginx bor bo'lsa, static files ni serve qilish eng yaxshi:

```nginx
server {
    listen 4001;
    server_name crm24.soundz.uz;

    root /var/www/call-center/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## PM2 Buyruqlar

```bash
# Barcha processlarni ko'rish
pm2 list

# Frontend ni ishga tushirish
pm2 start call-center-frontend

# Frontend ni to'xtatish
pm2 stop call-center-frontend

# Frontend ni qayta ishga tushirish
pm2 restart call-center-frontend

# Frontend loglarini ko'rish
pm2 logs call-center-frontend

# Frontend ni o'chirish
pm2 delete call-center-frontend

# PM2 ni saqlash va avtostart
pm2 save
pm2 startup
```

## Ecosystem Config

`ecosystem.config.js` faylini ishlatish:

```bash
# Barcha processlarni ishga tushirish
pm2 start ecosystem.config.js

# Barcha processlarni qayta ishga tushirish
pm2 restart ecosystem.config.js

# Barcha processlarni to'xtatish
pm2 stop ecosystem.config.js
```

## Tekshirish

```bash
# Frontend ishlayaptimi?
curl http://localhost:4001

# Yoki browser da
http://crm24.soundz.uz:4001
```

