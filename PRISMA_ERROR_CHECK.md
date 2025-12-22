# Prisma Error Check - To'liq Tekshirish

## 🔍 To'liq Xatolikni Ko'rish

```bash
# Serverda
ssh root@152.53.229.176

# To'liq error loglarni ko'rish
pm2 logs call-center-backend --err --lines 100

# Yoki
cat /root/.pm2/logs/call-center-backend-error.log | tail -50
```

## 🐛 Mumkin Bo'lgan Xatolar

### 1. SipTrunk Modeli Topilmayapti

**Xatolik:**
```
Unknown model `SipTrunk`
```

**Yechim:**
```bash
cd /var/www/call-center/backend
npx prisma db push
npx prisma generate
npm run build
pm2 restart call-center-backend
```

### 2. Extension Query Xatosi

**Xatolik:**
```
Argument `not` must not be null
```

**Yechim:**
- Kod yangilangan bo'lishi kerak (filter qilish usuli)
- Git pull qiling va rebuild qiling

### 3. Database Connection Xatosi

**Xatolik:**
```
Can't reach database server
```

**Yechim:**
```bash
# Database connection tekshiring
sudo -u postgres psql -d callcenter -c "SELECT 1;"

# .env faylini tekshiring
cat /var/www/call-center/backend/.env | grep DATABASE_URL
```

## 🔧 To'liq Fix Qadamlari

```bash
# 1. Serverga ulanish
ssh root@152.53.229.176

# 2. Project papkasiga o'tish
cd /var/www/call-center

# 3. Git pull
git pull origin main

# 4. Backend
cd backend

# 5. Database Migration
npx prisma db push

# 6. Prisma Client Generate
npx prisma generate

# 7. Backend Build
npm run build

# 8. Backend Restart
pm2 restart call-center-backend --update-env

# 9. To'liq Error Loglarni Ko'rish
pm2 logs call-center-backend --err --lines 100
```

## ✅ Tekshirish

### 1. Prisma Client

```bash
# Prisma client generate qilinganligini tekshiring
ls -la node_modules/.prisma/client/

# Yoki
npx prisma generate
```

### 2. Database Schema

```bash
# Database schema tekshiring
sudo -u postgres psql -d callcenter -c "\dt"

# SipTrunk jadvali mavjudligini tekshiring
sudo -u postgres psql -d callcenter -c "\d sip_trunks"
```

### 3. Backend Loglar

```bash
# Backend ishlayaptimi?
pm2 status

# Error loglar
pm2 logs call-center-backend --err --lines 50

# Out loglar
pm2 logs call-center-backend --out --lines 50
```

## 📋 Checklist

- [ ] Git pull qilindi
- [ ] Database migration qilindi (`npx prisma db push`)
- [ ] Prisma client generate qilindi (`npx prisma generate`)
- [ ] Backend build qilindi
- [ ] Backend restart qilindi
- [ ] Error loglar tekshirildi
- [ ] Database schema tekshirildi

## 🎯 Keyingi Qadamlar

Agar xatolik davom etsa:

1. **To'liq error loglarni ko'ring:**
   ```bash
   pm2 logs call-center-backend --err --lines 200
   ```

2. **Xatolikni aniqlang:**
   - Model topilmayaptimi?
   - Database connection muammosimi?
   - Query xatosimi?

3. **Xatolikni hal qiling:**
   - Database migration qiling
   - Prisma client generate qiling
   - Backend rebuild qiling

