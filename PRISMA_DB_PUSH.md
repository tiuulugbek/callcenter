# Prisma DB Push - Hal Qilish

## 🐛 Muammo

```
Error: P3005
The database schema is not empty. Read more about how to baseline an existing production database
```

## ✅ Yechim

Migration o'rniga `db push` ishlatish kerak:

```bash
# Serverda
cd /var/www/call-center/backend

# Prisma DB Push (migration o'rniga)
npx prisma db push

# Prisma Client Generate
npm run prisma:generate

# Backend Build
npm run build

# Backend Restart
pm2 restart call-center-backend --update-env
```

## 📋 To'liq Deploy Qadamlari

```bash
# 1. Serverga ulanish
ssh root@152.53.229.176

# 2. Project papkasiga o'tish
cd /var/www/call-center

# 3. Git pull
git pull origin main

# 4. Backend
cd backend

# 5. Prisma DB Push (migration o'rniga)
npx prisma db push

# 6. Prisma Client Generate
npm run prisma:generate

# 7. Backend Build
npm run build

# 8. Backend Restart
pm2 restart call-center-backend --update-env

# 9. Backend Loglar
pm2 logs call-center-backend --lines 50

# 10. Frontend
cd ../frontend
npm install
npm run build

# 11. Frontend Deploy
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

# Call jadvalida contact_id ustuni mavjudligini tekshiring
sudo -u postgres psql -d callcenter -c "\d calls" | grep contact_id

# Chat jadvalida contact_id ustuni mavjudligini tekshiring
sudo -u postgres psql -d callcenter -c "\d chats" | grep contact_id
```

### 2. Backend API

```bash
# Contacts API tekshiring
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:4000/contacts
```

### 3. Frontend

Browser da oching: `https://crm24.soundz.uz/contacts`

## 🔍 Muammolar

### Prisma Schema Topilmayapti

Agar `prisma/schema.prisma` topilmasa:

```bash
# Backend papkasida ekanligini tekshiring
cd /var/www/call-center/backend
ls -la prisma/schema.prisma

# Agar yo'q bo'lsa, GitHub dan pull qiling
git pull origin main
```

### Database Connection Muammosi

```bash
# .env faylini tekshiring
cat /var/www/call-center/backend/.env | grep DATABASE_URL

# Database connection tekshiring
sudo -u postgres psql -d callcenter -c "SELECT 1;"
```

## 📚 Qo'shimcha Ma'lumot

- `npx prisma db push` - Development uchun (migration yaratmaydi)
- `npx prisma migrate deploy` - Production uchun (migration kerak)
- `npx prisma migrate dev` - Migration yaratish uchun

Hozirgi holatda `db push` ishlatish tavsiya etiladi.

