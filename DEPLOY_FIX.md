# Deploy Script Permission Fix

## Muammo

```bash
./deploy.sh: Permission denied
```

## Yechim

### 1. Serverda Execute Permission Berish

```bash
ssh root@152.53.229.176
cd /var/www/call-center
chmod +x deploy.sh
./deploy.sh
```

### 2. Yoki Qo'lda Deploy

```bash
# 1. Git pull
cd /var/www/call-center
git pull origin main

# 2. Backend
cd backend
npm install
npm run prisma:generate
npm run build

# PM2 restart (to'g'ri path bilan)
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

### 3. Deploy Scriptni Avtomatik Permission Berish

Agar deploy scriptni GitHub dan pull qilgandan keyin avtomatik permission berishni xohlasangiz:

```bash
# Serverda
cd /var/www/call-center
git pull origin main
chmod +x deploy.sh
./deploy.sh
```

Yoki bir qatorda:

```bash
cd /var/www/call-center && git pull origin main && chmod +x deploy.sh && ./deploy.sh
```

