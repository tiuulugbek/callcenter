# GitHub Workflow - To'liq Qo'llanma

## Lokal (Development) - Kodlarni GitHub ga Push Qilish

### 1. O'zgarishlarni Tekshirish

```bash
cd /Users/tiuulugbek/asterisk-call-center

# O'zgarishlarni ko'rish
git status

# Qaysi fayllar o'zgargandi?
git diff
```

### 2. O'zgarishlarni Qo'shish va Commit Qilish

```bash
cd /Users/tiuulugbek/asterisk-call-center

# Barcha o'zgarishlarni qo'shish
git add .

# Commit qilish
git commit -m "Fix: Qo'ng'iroq muammosini hal qilish va sozlamalarni yangilash"

# GitHub ga push qilish
git push origin main
```

## Serverda (Production) - Kodlarni Yangilash

### 1. Serverga Kirish

```bash
ssh root@152.53.229.176
```

### 2. Kodni Yangilash

```bash
cd /var/www/call-center

# GitHub dan yangi kodlarni olish
git pull origin main
```

### 3. Backend Yangilanishlar

```bash
cd /var/www/call-center/backend

# Yangi paketlar bo'lsa
npm install

# Prisma Client yangilash (agar schema o'zgarganda)
npm run prisma:generate

# Database migration (agar schema o'zgarganda)
npx prisma db push

# Build
npm run build

# PM2 restart
pm2 restart call-center-backend --update-env

# Loglar
pm2 logs call-center-backend --lines 50
```

### 4. Frontend Yangilanishlar (Agar O'zgarganda)

```bash
cd /var/www/call-center/frontend

# Yangi paketlar bo'lsa
npm install

# Build
npm run build

# Nginx ga ko'chirish
cp -r dist/* /var/www/crm24/
chown -R www-data:www-data /var/www/crm24
```

## Tezkor Deploy Script

Serverda `deploy.sh` script ni ishlatish:

```bash
cd /var/www/call-center

# Script ni executable qilish (birinchi marta)
chmod +x deploy.sh

# Deploy qilish
./deploy.sh
```

## Qo'ng'iroq Muammosini Debug Qilish

### 1. Asterisk Loglar

```bash
# Real-time loglar
asterisk -rvvv

# Yoki
sudo journalctl -u asterisk -f
```

### 2. Backend Loglar

```bash
# Real-time loglar
pm2 logs call-center-backend

# Yoki oxirgi 100 qator
pm2 logs call-center-backend --lines 100
```

### 3. ARI Tekshirish

```bash
# ARI ishlayaptimi?
asterisk -rx "ari show status"

# ARI WebSocket ulanganmi?
# Backend loglarda "Connected to Asterisk ARI WebSocket" ko'rinishi kerak
```

### 4. Test Qo'ng'iroq

```bash
# Asterisk CLI da
asterisk -rvvv
# CLI da: core show channels

# Test qo'ng'iroq qiling va loglarni ko'ring
```

## Muammolarni Hal Qilish

### Qo'ng'iroq Kelmayapti

1. **SIP Trunk tekshirish:**
   ```bash
   asterisk -rx "pjsip show endpoints Kerio"
   ```

2. **Dialplan tekshirish:**
   ```bash
   asterisk -rx "dialplan show from-external"
   ```

3. **ARI tekshirish:**
   ```bash
   asterisk -rx "ari show status"
   ```

### Backend ga Kelmayapti

1. **ARI WebSocket ulanganmi?**
   - Backend loglarda "Connected to Asterisk ARI WebSocket" ko'rinishi kerak

2. **Stasis app nomi to'g'rimi?**
   - Dialplan da: `Stasis(call-center,${CALL_ID})`
   - Backend da: `app=call-center`

3. **Backend loglar:**
   ```bash
   pm2 logs call-center-backend --lines 100
   ```

## To'liq Workflow

### Lokal:
```bash
cd /Users/tiuulugbek/asterisk-call-center
git add .
git commit -m "Fix: Muammo hal qilindi"
git push origin main
```

### Serverda:
```bash
ssh root@152.53.229.176
cd /var/www/call-center
git pull origin main
cd backend && npm install && npm run build && pm2 restart call-center-backend --update-env
```

