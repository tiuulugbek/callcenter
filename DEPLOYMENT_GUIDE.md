# Deployment Guide - Simplified Call Center

## O'zgarishlar

Bu versiyada barcha Kerio, SIP, WebRTC va PBX logikasi olib tashlandi.
Tizim endi faqat **call log viewer** va **recording player** sifatida ishlaydi.

## Git Push (Local Machine)

```bash
cd /Users/tiuulugbek/asterisk-call-center

# Barcha o'zgarishlarni qo'shish
git add -A

# Commit qilish
git commit -m "Barcha Kerio, SIP, WebRTC va PBX logikasini olib tashlash - faqat call log viewer va recording player qoldirildi"

# GitHub ga push qilish
git push origin main
```

## Server Deployment

Serverga SSH orqali ulaning va quyidagi buyruqlarni bajaring:

```bash
# Server da project papkasiga o'tish
cd /var/www/call-center

# Git pull
git pull origin main

# Backend dependencies
cd backend
npm install

# Prisma generate
npx prisma generate

# Backend build
npm run build

# Frontend dependencies
cd ../frontend
npm install

# Frontend build
npm run build

# PM2 restart
cd ..
pm2 restart call-center-backend
pm2 restart call-center-frontend

# Holatni tekshirish
pm2 status
pm2 logs call-center-backend --lines 20
```

## Yoki Script Orqali

Agar `deploy_simplified.sh` script mavjud bo'lsa:

```bash
cd /var/www/call-center
chmod +x deploy_simplified.sh
./deploy_simplified.sh
```

## O'chirilgan Funksionallik

- ❌ Kerio Operator integratsiyasi
- ❌ SIP trunk management
- ❌ SIP extension management
- ❌ WebRTC telefon
- ❌ Call originate/answer/hangup
- ❌ PBX logikasi

## Qolgan Funksionallik

- ✅ Call history (qo'ng'iroqlar ro'yxati)
- ✅ Recording playback (yozuvlarni eshitish)
- ✅ Telegram bot sozlamalari
- ✅ Asterisk ARI event listener (faqat call loglarni yaratish)

## Muhim Eslatmalar

1. **Asterisk ARI** hali ham ishlaydi - u faqat call eventlarni kuzatadi va loglaydi
2. **Call recordings** hali ham saqlanadi va eshitish mumkin
3. **Telegram bot** sozlamalari Settings sahifasida mavjud
4. Tizim endi **passive monitoring system** - qo'ng'iroqlarni boshlaydi yoki boshqarmaydi

## Tekshirish

Deployment dan keyin quyidagilarni tekshiring:

1. Backend ishlayaptimi:
   ```bash
   pm2 logs call-center-backend --lines 20
   ```

2. Frontend ishlayaptimi:
   ```bash
   pm2 logs call-center-frontend --lines 20
   ```

3. Web sahifa ochilayaptimi:
   - https://crm24.soundz.uz

4. Settings sahifasida faqat Telegram tabi ko'rinishi kerak

