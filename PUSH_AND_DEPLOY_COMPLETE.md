# Push va Deploy - To'liq Qo'llanma

## 📤 Lokal Mashinada - Push Qilish

Terminal da quyidagi buyruqlarni bajaring:

```bash
cd /Users/tiuulugbek/asterisk-call-center

# Barcha o'zgarishlarni qo'shish
git add .

# Commit qilish
git commit -m "Fix: Prisma extension query - filter qilish usuli

- getExtensions metodida filter qilish usuli ishlatildi
- Prisma where clause xatosi hal qilindi
- Barcha operatorlar olinadi va keyin filter qilinadi"

# GitHub ga push qilish
git push origin main
```

## 📥 Serverda - Pull va Deploy

### Variant 1: Script Orqali (Tavsiya Etiladi)

SSH orqali serverga ulaning va quyidagilarni bajaring:

```bash
# Serverga ulanish
ssh root@152.53.229.176

# Script ni yuklab olish va ishga tushirish
cd /var/www/call-center
git pull origin main
chmod +x server_pull_and_fix.sh
./server_pull_and_fix.sh
```

### Variant 2: Qo'lda

SSH orqali serverga ulaning va quyidagilarni bajaring:

```bash
# Serverga ulanish
ssh root@152.53.229.176

# Project papkasiga o'tish
cd /var/www/call-center

# Git pull
git pull origin main

# Backend
cd backend

# Database Migration
npx prisma db push

# Prisma Client Generate
npx prisma generate

# To'liq clean build
rm -rf dist
rm -rf node_modules/.cache
rm -rf .nest
rm -rf tsconfig.tsbuildinfo
rm -rf src/**/*.js.map

# Build
npm run build

# Build faylini tekshirish
cat dist/src/settings/sip-extension.service.js | grep -A 10 "getExtensions"

# PM2 ni to'liq restart
pm2 delete call-center-backend
pm2 kill
sleep 3
pm2 start dist/src/main.js --name call-center-backend --update-env

# Backend Loglar
pm2 logs call-center-backend --err --lines 30
```

## ✅ Tekshirish

### 1. Build Faylini Tekshirish

```bash
# Build fayl ichida to'g'ri kod borligini tekshiring
cat dist/src/settings/sip-extension.service.js | grep -A 10 "getExtensions"

# Quyidagi kod ko'rinishi kerak:
# const allOperators = await this.prisma.operator.findMany({...});
# return allOperators.filter(op => op.extension !== null && op.extension !== '');
```

### 2. Error Loglarini Tekshirish

```bash
# Error loglarida xatolik yo'qligini tekshiring
pm2 logs call-center-backend --err --lines 50

# Xatolik bo'lmasa, quyidagi ko'rinish kerak:
# (hech qanday xatolik ko'rsatilmaydi)
```

### 3. API Test

```bash
# Settings API test qiling
curl http://localhost:4000/settings/sip-extensions

# Yoki browser da:
# https://crm24.soundz.uz/settings
```

### 4. Database Tekshirish

```bash
# Database jadvallarini tekshiring
sudo -u postgres psql -d callcenter -c "\dt"
```

## 🔍 Muammo Bo'lsa

Agar hali ham xatolik bo'lsa:

1. **PM2 Cache:**
   ```bash
   pm2 kill
   rm -rf ~/.pm2
   pm2 start dist/src/main.js --name call-center-backend
   ```

2. **Node Modules Cache:**
   ```bash
   rm -rf node_modules
   npm install
   npm run build
   ```

3. **Source Map Muammosi:**
   ```bash
   # tsconfig.json da sourceMap ni o'chirish
   nano tsconfig.json
   # "sourceMap": false, qiling
   npm run build
   ```

4. **To'liq Rebuild:**
   ```bash
   cd /var/www/call-center/backend
   rm -rf dist node_modules .nest tsconfig.tsbuildinfo
   npm install
   npm run build
   pm2 delete call-center-backend
   pm2 kill
   pm2 start dist/src/main.js --name call-center-backend
   ```

## 📋 Checklist

- [ ] Git push qilindi
- [ ] Serverda git pull qilindi
- [ ] Database migration qilindi
- [ ] Prisma client generate qilindi
- [ ] Backend build qilindi
- [ ] Build fayl ichida to'g'ri kod borligi tekshirildi
- [ ] PM2 restart qilindi
- [ ] Error loglarida xatolik yo'q
- [ ] API test qilindi
- [ ] Frontend ishlayapti

