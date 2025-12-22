# Database Migration - SipTrunk Jadvali

## 🐛 Muammo

```
Did not find any relation named "sip_trunks".
ERROR: relation "sip_trunks" does not exist
```

## ✅ Yechim

Database migration qilish kerak.

## 🔧 Qadamlari

```bash
# Serverda
ssh root@152.53.229.176

# Project papkasiga o'tish
cd /var/www/call-center

# Git pull (agar yangi kod bo'lsa)
git pull origin main

# Backend
cd backend

# Database Migration (SipTrunk modeli uchun)
npx prisma db push

# Prisma Client Generate (muhim!)
npx prisma generate

# Backend Build
npm run build

# Backend Restart
pm2 restart call-center-backend --update-env
```

## ✅ Tekshirish

### 1. Database Jadvali

```bash
# SipTrunk jadvali yaratilganligini tekshiring
sudo -u postgres psql -d callcenter -c "\dt sip_trunks"

# Barcha jadvallarni ko'ring
sudo -u postgres psql -d callcenter -c "\dt"
```

Ko'rinishi kerak:
```
          List of relations
 Schema |    Name     | Type  |  Owner   
--------+-------------+-------+----------
 public | sip_trunks  | table | postgres
```

### 2. Backend Loglar

```bash
# Backend ishlayaptimi?
pm2 status

# Error loglar
pm2 logs call-center-backend --err --lines 50

# Agar xatolik bo'lmasa, muvaffaqiyatli
```

### 3. Frontend Test

1. Settings → SIP Trunk (Provayder)
2. Yangi trunk yaratish
3. Trunklar ro'yxatida ko'rinishi kerak

## 🎯 Natija

- ✅ `sip_trunks` jadvali yaratildi
- ✅ Trunklar database ga saqlanadi
- ✅ Trunklar ro'yxatida ko'rinadi

## 📋 Checklist

- [ ] Git pull qilindi
- [ ] `npx prisma db push` qilindi
- [ ] `npx prisma generate` qilindi
- [ ] Backend build qilindi
- [ ] Backend restart qilindi
- [ ] Database jadvali tekshirildi
- [ ] Trunk yaratish test qilindi

