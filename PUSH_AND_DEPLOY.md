# GitHub Push va Server Deploy - Qo'llanma

## 📤 Lokal Mashinada - Push Qilish

```bash
cd /Users/tiuulugbek/asterisk-call-center

# Barcha o'zgarishlarni qo'shish
git add .

# Commit qilish
git commit -m "Add: SIP Extension service, MicroSIP setup guide, and Kerio Control configuration"

# GitHub ga push qilish
git push origin main
```

## 📥 Serverda - Pull va Deploy

```bash
# Serverga ulanish
ssh root@152.53.229.176

# Project papkasiga o'tish
cd /var/www/call-center

# Git pull
git pull origin main

# Deploy scriptni ishga tushirish
chmod +x deploy.sh
./deploy.sh
```

## 🔄 Yoki Qo'lda Deploy

```bash
# 1. Git pull
cd /var/www/call-center
git pull origin main

# 2. Backend
cd backend
npm install
npm run prisma:generate
npm run build

# PM2 restart
if [ -f "dist/main.js" ]; then
    pm2 restart call-center-backend || pm2 start dist/main.js --name call-center-backend
elif [ -f "dist/src/main.js" ]; then
    pm2 restart call-center-backend || pm2 start dist/src/main.js --name call-center-backend
fi

cd ..

# 3. Frontend
cd frontend
npm install
npm run build
mkdir -p /var/www/crm24
cp -r dist/* /var/www/crm24/
chown -R www-data:www-data /var/www/crm24
cd ..
```

## ✅ Tekshirish

```bash
# Backend ishlayaptimi?
pm2 status
pm2 logs call-center-backend --lines 20

# Frontend ishlayaptimi?
curl https://crm24.soundz.uz
```

## 🎯 Yangi Funksiyalar

1. **SIP Extension Service**
   - Extension yaratganda Asterisk konfiguratsiyasi avtomatik yangilanadi
   - Asterisk avtomatik reload qilinadi

2. **MicroSIP Setup Guide**
   - MicroSIP sozlash qo'llanmasi
   - Boshqa SIP clientlar uchun misollar

3. **Kerio Control Configuration**
   - Kerio Control firewall qoidalari
   - NAT traversal sozlamalari

