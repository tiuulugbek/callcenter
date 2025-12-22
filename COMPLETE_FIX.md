# Complete Fix - GitHub Push va Server Pull

## 📤 Lokal Mashinada - Push Qilish

Terminal da quyidagi buyruqlarni bajaring:

```bash
cd /Users/tiuulugbek/asterisk-call-center

# Barcha o'zgarishlarni qo'shish
git add .

# Commit qilish
git commit -m "Fix: Prisma extension query va SIP trunk database

- Prisma extension query xatosi hal qilindi (filter qilish usuli)
- SIP Trunk database ga saqlash qo'shildi (SipTrunk modeli)
- Trunklar ro'yxatida ko'rinadi va saqlanadi
- Frontend da trunklar ro'yxatini yangilash yaxshilandi
- Contacts module qo'shildi
- SIP trunk avtomatik yangilash yaxshilandi"

# GitHub ga push qilish
git push origin main
```

## 📥 Serverda - Pull va Deploy

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

# Database Migration (SipTrunk modeli uchun)
npx prisma db push

# Prisma Client Generate
npx prisma generate

# To'liq clean build
rm -rf dist
rm -rf node_modules/.cache
rm -rf .nest
rm -rf tsconfig.tsbuildinfo

# Build
npm run build

# PM2 ni to'liq restart
pm2 delete call-center-backend
pm2 kill
sleep 3
pm2 start dist/src/main.js --name call-center-backend --update-env

# Backend Loglar
pm2 logs call-center-backend --err --lines 30

# Frontend
cd ../frontend
npm install
npm run build

# Frontend Deploy
mkdir -p /var/www/crm24
cp -r dist/* /var/www/crm24/
chown -R www-data:www-data /var/www/crm24

cd ..
```

## ✅ Tekshirish

### 1. Database

```bash
# SipTrunk jadvali yaratilganligini tekshiring
sudo -u postgres psql -d callcenter -c "\dt sip_trunks"

# Contacts jadvali
sudo -u postgres psql -d callcenter -c "\dt contacts"
```

### 2. Backend

```bash
# Error loglarida xatolik yo'qligini tekshiring
pm2 logs call-center-backend --err --lines 30

# Settings API test qiling
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:4000/settings/sip-extensions
```

### 3. Frontend

Browser da oching: `https://crm24.soundz.uz`

## 🎯 Yangi Funksiyalar

1. **Prisma Extension Query Fix:**
   - Filter qilish usuli ishlatildi
   - Extensionlar to'g'ri ko'rsatiladi

2. **SIP Trunk Database:**
   - SipTrunk modeli qo'shildi
   - Trunklar database ga saqlanadi
   - Trunklar ro'yxatida ko'rinadi

3. **Contacts Module:**
   - Mijozlar boshqaruvi
   - Qo'ng'iroqlar va chatlar integratsiyasi

4. **SIP Trunk Avtomatik Yangilash:**
   - Transport muammosi hal qilindi
   - Avtomatik pjsip.conf yangilash
   - Asterisk avtomatik reload

## 📋 Checklist

- [ ] Git push qilindi
- [ ] Serverda git pull qilindi
- [ ] Database migration qilindi
- [ ] Prisma client generate qilindi
- [ ] Backend build qilindi
- [ ] Backend restart qilindi
- [ ] Frontend build qilindi
- [ ] Frontend deploy qilindi
- [ ] Error loglarida xatolik yo'q
- [ ] Frontend ishlayapti

