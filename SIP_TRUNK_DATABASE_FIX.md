# SIP Trunk Database Fix - Trunklar Saqlanmayapti

## 🐛 Muammo

SIP trunk yaratilganda:
- Konfiguratsiya ko'rsatilmoqda
- Lekin trunklar ro'yxatida ko'rinmayapti
- Saqlanmagan

## ✅ Yechim

Database ga SipTrunk modelini qo'shish va trunklarni database ga saqlash.

### 1. Database Model Qo'shildi

```prisma
model SipTrunk {
  id          String   @id @default(uuid())
  name        String   @unique
  host        String
  username    String
  password    String
  port        Int      @default(5060)
  transport   String   @default("udp")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 2. Service Yangilandi

- Trunk yaratganda database ga saqlanadi
- Trunklar ro'yxati database dan olinadi
- Password yashiriladi

## 📥 Serverda - Fix Qo'llash

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
npm run prisma:generate

# Backend Build
npm run build

# Backend Restart
pm2 restart call-center-backend --update-env

# Backend Loglar
pm2 logs call-center-backend --lines 50
```

## ✅ Tekshirish

### 1. Database

```bash
# SipTrunk jadvali yaratilganligini tekshiring
sudo -u postgres psql -d callcenter -c "\dt sip_trunks"

# Trunklar ro'yxatini ko'ring
sudo -u postgres psql -d callcenter -c "SELECT name, host, username, port FROM sip_trunks;"
```

### 2. Frontend

1. Settings → SIP Trunk (Provayder)
2. Yangi trunk yaratish
3. Trunklar ro'yxatida ko'rinishi kerak

## 🎯 Natija

- ✅ Trunklar database ga saqlanadi
- ✅ Trunklar ro'yxatida ko'rinadi
- ✅ Password yashiriladi
- ✅ Trunklar saqlanadi va ko'rinadi

## 📋 Checklist

- [ ] Database migration qilindi
- [ ] Prisma client generate qilindi
- [ ] Backend build qilindi
- [ ] Backend restart qilindi
- [ ] Trunk yaratish test qilindi
- [ ] Trunklar ro'yxatida ko'rinadi

