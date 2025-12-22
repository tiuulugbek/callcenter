# Push va Deploy - SIP Trunk Fix

## 📤 Lokal Mashinada - Push Qilish

Terminal da quyidagi buyruqlarni bajaring:

```bash
cd /Users/tiuulugbek/asterisk-call-center

# Barcha o'zgarishlarni qo'shish
git add .

# Commit qilish
git commit -m "Fix: SIP Trunk avtomatik yangilash va transport muammosi

- Transport muammosi hal qilindi (mavjud transport-udp dan foydalanish)
- Avtomatik pjsip.conf yangilash yaxshilandi
- Backup avtomatik yaratiladi
- Asterisk avtomatik reload qilinadi
- Xatoliklar yaxshilandi va aniq ko'rsatiladi
- Frontend da xabarlar yaxshilandi"

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

# Prisma DB Push (agar Contact modeli qo'shilgan bo'lsa)
npx prisma db push

# Prisma Client Generate
npm run prisma:generate

# Backend Build
npm run build

# Backend Restart
pm2 restart call-center-backend --update-env

# Backend Loglar
pm2 logs call-center-backend --lines 50

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

## 🔧 Asterisk Ruxsatlari

Agar SIP trunk yaratganda "pjsip.conf faylini qo'lda yangilang" xabari chiqsa:

```bash
# Ruxsatlarni tekshiring
ls -la /etc/asterisk/pjsip.conf

# Ruxsat berish
sudo chmod 664 /etc/asterisk/pjsip.conf
sudo chown asterisk:asterisk /etc/asterisk/pjsip.conf

# Yoki backend user ga ruxsat
sudo usermod -aG asterisk www-data
```

## ✅ Tekshirish

### 1. Backend API

```bash
# Backend ishlayaptimi?
pm2 status
pm2 logs call-center-backend --lines 20
```

### 2. Frontend

Browser da oching: `https://crm24.soundz.uz`

### 3. SIP Trunk Test

1. Settings → SIP Trunk (Provayder)
2. Yangi trunk yaratish
3. Tekshirish:
   ```bash
   asterisk -rx "pjsip show endpoints"
   asterisk -rx "pjsip reload"
   ```

## 🎯 Yangi Funksiyalar

1. **SIP Trunk Fix:**
   - Transport muammosi hal qilindi
   - Avtomatik pjsip.conf yangilash
   - Asterisk avtomatik reload

2. **Contacts Module:**
   - Mijozlar boshqaruvi
   - Qo'ng'iroqlar va chatlar integratsiyasi

## 📋 Checklist

- [ ] Git push qilindi
- [ ] Serverda git pull qilindi
- [ ] Database migration qilindi (agar kerak bo'lsa)
- [ ] Prisma client generate qilindi
- [ ] Backend build qilindi
- [ ] Backend restart qilindi
- [ ] Frontend build qilindi
- [ ] Frontend deploy qilindi
- [ ] Asterisk ruxsatlari tekshirildi
- [ ] SIP Trunk test qilindi

