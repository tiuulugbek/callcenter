# GitHub Workflow - To'liq Qo'llanma

## 📋 Workflow

### 1. Lokal Mashinada - Kod O'zgartirish va Push

```bash
# 1. Kod o'zgartirish
cd /Users/tiuulugbek/asterisk-call-center

# 2. O'zgarishlarni ko'rish
git status

# 3. Barcha o'zgarishlarni qo'shish
git add .

# 4. Commit qilish
git commit -m "Fix: Qo'ng'iroq sozlamalari va deploy script"

# 5. GitHub ga push qilish
git push origin main
```

### 2. Serverda - Pull va Deploy

```bash
# 1. Serverga ulanish
ssh root@152.53.229.176

# 2. Project papkasiga o'tish
cd /var/www/call-center

# 3. Deploy scriptni ishga tushirish
./deploy.sh
```

Yoki qo'lda:

```bash
# 1. Git pull
git pull origin main

# 2. Backend
cd backend
npm install
npm run prisma:generate
npm run build
pm2 restart call-center-backend --update-env
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

## 🔧 Deploy Script

Deploy script avtomatik ravishda:
1. ✅ Git pull qiladi
2. ✅ Backend dependencies o'rnatadi
3. ✅ Prisma client generate qiladi
4. ✅ Backend build qiladi
5. ✅ PM2 restart qiladi
6. ✅ Frontend dependencies o'rnatadi
7. ✅ Frontend build qiladi
8. ✅ Nginx papkasiga ko'chiradi

## 📝 Deploy Scriptni Ishlatish

```bash
# Serverda
cd /var/www/call-center
chmod +x deploy.sh
./deploy.sh
```

## 🐛 Muammolar

### Git Pull Xatosi

```bash
# Agar git pull xatolik bersa
git stash
git pull origin main
git stash pop
```

### PM2 Restart Xatosi

```bash
# PM2 ni to'liq restart
pm2 delete call-center-backend
cd /var/www/call-center/backend
pm2 start dist/main.js --name call-center-backend
# yoki
pm2 start dist/src/main.js --name call-center-backend
```

### Build Xatosi

```bash
# Backend build
cd /var/www/call-center/backend
rm -rf dist node_modules
npm install
npm run build

# Frontend build
cd /var/www/call-center/frontend
rm -rf dist node_modules
npm install
npm run build
```

## 🔍 Tekshirish

### Backend Ishlamoqdamimi?

```bash
# PM2 status
pm2 status

# Backend loglar
pm2 logs call-center-backend

# API test
curl http://localhost:4000/auth/login -X POST -H "Content-Type: application/json" -d '{"username":"admin","password":"admin123"}'
```

### Frontend Ishlamoqdamimi?

```bash
# Browser da ochish
https://crm24.soundz.uz

# Yoki
curl https://crm24.soundz.uz
```

## 📊 Monitoring

### Real-time Monitoring

```bash
# Backend loglar
pm2 logs call-center-backend --lines 50

# Asterisk loglar
journalctl -u asterisk -f

# Nginx loglar
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## 🚀 Tezkor Deploy

```bash
# Lokal
cd /Users/tiuulugbek/asterisk-call-center
git add . && git commit -m "Update" && git push origin main

# Server
ssh root@152.53.229.176 "cd /var/www/call-center && ./deploy.sh"
```
