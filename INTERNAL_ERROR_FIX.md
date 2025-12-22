# Internal Server Error - Muammoni Hal Qilish

## Tekshirish Qadamlari

### 1. Nginx Error Loglar

```bash
# Nginx error loglarini ko'rish
sudo tail -f /var/log/nginx/error.log

# Yoki oxirgi 50 qator
sudo tail -n 50 /var/log/nginx/error.log
```

### 2. Backend Loglar

```bash
# PM2 loglar
pm2 logs call-center-backend --lines 50

# Yoki real-time
pm2 logs call-center-backend
```

### 3. Backend Ishlamoqdamimi?

```bash
# PM2 status
pm2 status

# Backend ni to'g'ridan-to'g'ri test qilish
curl http://localhost:4000/auth/login

# Yoki
curl http://localhost:4000
```

### 4. Port 4000 Ochikmi?

```bash
# Port tekshirish
ss -tlnp | grep 4000

# Yoki
netstat -tlnp | grep 4000
```

## Umumiy Muammolar va Yechimlar

### Muammo 1: Backend Ishlamayapti

```bash
# PM2 da restart
pm2 restart call-center-backend

# Yoki qayta ishga tushirish
pm2 delete call-center-backend
cd /var/www/call-center/backend
pm2 start dist/src/main.js --name call-center-backend --update-env
pm2 save
```

### Muammo 2: Database Connection Error

```bash
# .env faylini tekshirish
cd /var/www/call-center/backend
cat .env | grep DATABASE_URL

# PostgreSQL ishlayaptimi?
sudo systemctl status postgresql

# Database connection test
sudo -u postgres psql -d callcenter -c "SELECT 1;"
```

### Muammo 3: Nginx Proxy Xatosi

```bash
# Nginx konfiguratsiyasini tekshirish
sudo nginx -t

# Nginx konfiguratsiyasini ko'rish
sudo cat /etc/nginx/sites-available/crm24.soundz.uz

# Nginx ni reload qilish
sudo systemctl reload nginx
```

### Muammo 4: CORS Xatosi

Backend `.env` faylida:
```env
FRONTEND_URL=https://crm24.soundz.uz
```

Backend `main.ts` da CORS sozlanganini tekshirish kerak.

### Muammo 5: File Permissions

```bash
# Frontend fayllar huquqlari
ls -la /var/www/crm24/

# Huquqlarni to'g'rilash
chown -R www-data:www-data /var/www/crm24
chmod -R 755 /var/www/crm24
```

## To'liq Tekshirish

```bash
# 1. Backend status
pm2 status
pm2 logs call-center-backend --lines 50

# 2. Backend test
curl http://localhost:4000/auth/login

# 3. Nginx error loglar
sudo tail -n 50 /var/log/nginx/error.log

# 4. Nginx access loglar
sudo tail -n 50 /var/log/nginx/access.log

# 5. Nginx konfiguratsiyasi
sudo nginx -t

# 6. Database connection
cd /var/www/call-center/backend
cat .env | grep DATABASE_URL
```

## Tezkor Yechim

```bash
# 1. Backend ni restart qilish
pm2 restart call-center-backend

# 2. Nginx ni reload qilish
sudo systemctl reload nginx

# 3. Loglarni ko'rish
pm2 logs call-center-backend --lines 20
sudo tail -n 20 /var/log/nginx/error.log
```

## Browser Console da Xatolarni Ko'rish

1. Browser da F12 ni bosing
2. Console tab ni oching
3. Network tab ni oching
4. Xatolarni ko'ring

## API Endpoint Test

```bash
# Login endpoint test
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Settings endpoint test
curl http://localhost:4000/settings
```

