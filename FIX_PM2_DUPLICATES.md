# PM2 Duplicate Processes Fix

## Muammo

PM2 da frontend 2 marta ishga tushirilgan va backend 11 marta restart bo'lgan.

## Yechim

### 1. Duplicate Frontend Processni O'chirish

```bash
ssh root@152.53.229.176

# Barcha processlarni ko'rish
pm2 list

# Duplicate frontend processni o'chirish (ID: 2)
pm2 delete 2

# Yoki barcha frontend processlarni o'chirish va qayta ishga tushirish
pm2 delete call-center-frontend
cd /var/www/call-center/frontend
pm2 start npx --name call-center-frontend -- vite preview --host 0.0.0.0 --port 4001
```

### 2. Ecosystem Config Ishlatish (Tavsiya etiladi)

```bash
ssh root@152.53.229.176
cd /var/www/call-center

# Barcha processlarni to'xtatish
pm2 delete all

# Ecosystem config orqali ishga tushirish
pm2 start ecosystem.config.js

# PM2 ni saqlash
pm2 save
```

### 3. Backend Restart Sababini Tekshirish

```bash
# Backend loglarini ko'rish
pm2 logs call-center-backend --lines 100

# Yoki error loglarni ko'rish
pm2 logs call-center-backend --err

# Backend ni qayta ishga tushirish
pm2 restart call-center-backend
```

### 4. PM2 ni To'g'ri Sozlash

```bash
# PM2 da barcha processlarni ko'rish
pm2 list

# PM2 ni saqlash (avtostart uchun)
pm2 save

# PM2 startup script (server qayta ishga tushganda avtomatik ishga tushishi uchun)
pm2 startup
# Keyin ko'rsatilgan buyruqni root sifatida ishga tushiring
```

## Ecosystem Config

`ecosystem.config.js` faylini ishlatish:

```bash
cd /var/www/call-center

# Barcha processlarni ishga tushirish
pm2 start ecosystem.config.js

# Barcha processlarni qayta ishga tushirish
pm2 restart ecosystem.config.js

# Barcha processlarni to'xtatish
pm2 stop ecosystem.config.js

# Barcha processlarni o'chirish
pm2 delete ecosystem.config.js
```

## Tekshirish

```bash
# Processlar holati
pm2 list

# Loglar
pm2 logs

# Monitoring
pm2 monit
```

## Backend Restart Sabablari

Backend 11 marta restart bo'lgan sabablari:
1. Database connection xatolik
2. Environment variables noto'g'ri
3. Port allaqachon band
4. Memory limit
5. Unhandled exceptions

**Tekshirish:**
```bash
pm2 logs call-center-backend --lines 200
```

