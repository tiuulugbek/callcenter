# Push va Deploy - Contacts Moduli

## 📤 Lokal Mashinada - Push Qilish

Terminal da quyidagi buyruqlarni bajaring:

```bash
cd /Users/tiuulugbek/asterisk-call-center

# Barcha o'zgarishlarni qo'shish
git add .

# Commit qilish
git commit -m "Add: Contacts module - AmoCRM style mijozlar boshqaruvi

- Backend: ContactsModule, ContactsService, ContactsController
- Frontend: Contacts page va Contacts.css
- Database: Contact modeli qo'shildi
- Call va Chat modellariga contactId qo'shildi
- API endpoints: CRUD operations va link-call/link-chat
- Navigation: Mijozlar link qo'shildi"

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

# Database Migration
cd backend
npx prisma migrate deploy
# yoki
npx prisma db push

# Prisma Client Generate
npm run prisma:generate

# Backend Build
npm run build

# Backend Restart
pm2 restart call-center-backend --update-env

# Backend Loglar
pm2 logs call-center-backend --lines 50

# Frontend Build
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
# Contacts jadvali yaratilganligini tekshiring
sudo -u postgres psql -d callcenter -c "\dt contacts"

# Contact modeli mavjudligini tekshiring
sudo -u postgres psql -d callcenter -c "SELECT COUNT(*) FROM contacts;"
```

### 2. Backend API

```bash
# Contacts API tekshiring
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:4000/contacts
```

### 3. Frontend

```bash
# Browser da oching
https://crm24.soundz.uz/contacts
```

## 🎯 Yangi Funksiyalar

1. **Contacts Module:**
   - Mijozlar ro'yxati
   - Mijoz yaratish/tahrirlash
   - Qidirish funksiyasi
   - Qo'ng'iroqlar va chatlar soni

2. **Database:**
   - Contact modeli
   - Call va Chat ga contactId qo'shildi

3. **Frontend:**
   - Contacts page
   - Navigation link

## 📋 Checklist

- [ ] Git push qilindi
- [ ] Serverda git pull qilindi
- [ ] Database migration qilindi
- [ ] Prisma client generate qilindi
- [ ] Backend build qilindi
- [ ] Backend restart qilindi
- [ ] Frontend build qilindi
- [ ] Frontend deploy qilindi
- [ ] Contacts API ishlayapti
- [ ] Frontend da Contacts page ko'rinadi

