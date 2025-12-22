# Git Workflow - Serverda Yangilanishlar

## Qanday Ishlaydi?

### 1. Lokal (Development)

```bash
# Kod o'zgartirishlar
# ...

# Git ga qo'shish
git add .

# Commit qilish
git commit -m "Yangi xususiyat qo'shildi"

# GitHub ga push qilish
git push origin main
```

### 2. Serverda (Production)

```bash
# Serverga kirish
ssh root@152.53.229.176

# Kodni yangilash
cd /var/www/call-center
git pull origin main

# Backend yangilanishlar
cd backend
npm install  # Yangi paketlar bo'lsa
npm run build
pm2 restart call-center-backend

# Frontend yangilanishlar
cd ../frontend
npm install  # Yangi paketlar bo'lsa
npm run build
cp -r dist/* /var/www/crm24/
```

## Avtomatik Yangilanish Script

### deploy.sh Script Yaratish

```bash
# Serverda
cd /var/www/call-center
nano deploy.sh
```

Quyidagini kiriting:

```bash
#!/bin/bash

echo "=== Call Center Deployment Script ==="

# Git pull
echo "1. Git pull..."
git pull origin main

# Backend
echo "2. Backend yangilanishlar..."
cd backend
npm install
npm run prisma:generate
npm run build
pm2 restart call-center-backend
cd ..

# Frontend
echo "3. Frontend yangilanishlar..."
cd frontend
npm install
npm run build
cp -r dist/* /var/www/crm24/
cd ..

echo "=== Deployment Tugadi ==="
pm2 status
```

```bash
# Script ni executable qilish
chmod +x deploy.sh
```

### Ishlatish

```bash
cd /var/www/call-center
./deploy.sh
```

## Qo'lda Yangilanish (Tavsiya Etiladi)

### Backend Yangilanishlar

```bash
ssh root@152.53.229.176

cd /var/www/call-center

# Git pull
git pull origin main

# Backend
cd backend
npm install
npm run prisma:generate  # Agar schema o'zgarganda
npm run build
pm2 restart call-center-backend

# Loglarni ko'rish
pm2 logs call-center-backend
```

### Frontend Yangilanishlar

```bash
cd /var/www/call-center/frontend
npm install
npm run build
cp -r dist/* /var/www/crm24/
```

### Database Migration (Agar Schema O'zgarganda)

```bash
cd /var/www/call-center/backend
npx prisma migrate deploy
# Yoki
npx prisma db push
npm run prisma:seed  # Agar seed o'zgarganda
```

## GitHub Actions (Avtomatik Deployment)

### .github/workflows/deploy.yml

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: 152.53.229.176
          username: root
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/call-center
            git pull origin main
            cd backend
            npm install
            npm run build
            pm2 restart call-center-backend
            cd ../frontend
            npm install
            npm run build
            cp -r dist/* /var/www/crm24/
```

## Best Practices

### 1. Branch Strategy

```bash
# Development branch
git checkout -b develop
git push origin develop

# Production branch (main)
git checkout main
git merge develop
git push origin main
```

### 2. Testing Before Deploy

```bash
# Lokal test
npm run test

# Build test
npm run build

# Keyin push
git push origin main
```

### 3. Rollback (Agar Muammo Bo'lsa)

```bash
# Serverda
cd /var/www/call-center

# Oldingi commit ga qaytish
git log  # Commit hash ni topish
git checkout <commit-hash>

# Backend
cd backend
npm run build
pm2 restart call-center-backend

# Frontend
cd ../frontend
npm run build
cp -r dist/* /var/www/crm24/
```

### 4. Backup Before Deploy

```bash
# Database backup
sudo -u postgres pg_dump callcenter > backup_$(date +%Y%m%d_%H%M%S).sql

# Code backup
cd /var/www
tar -czf call-center-backup-$(date +%Y%m%d_%H%M%S).tar.gz call-center/
```

## Tezkor Yangilanish (Quick Update)

```bash
# Serverda
cd /var/www/call-center && git pull && cd backend && npm install && npm run build && pm2 restart call-center-backend && cd ../frontend && npm install && npm run build && cp -r dist/* /var/www/crm24/
```

## Monitoring

```bash
# PM2 status
pm2 status

# PM2 loglar
pm2 logs call-center-backend

# Nginx loglar
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

