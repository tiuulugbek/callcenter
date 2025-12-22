# Serverda To'liq Clean va Rebuild

## 🔍 Muammo

Error logda hali ham eski kod ko'rsatilmoqda. Bu source map yoki build cache muammosi bo'lishi mumkin.

## ✅ Yechim - To'liq Clean va Rebuild

### Variant 1: Script Orqali (Tavsiya)

SSH orqali serverga ulaning va quyidagilarni bajaring:

```bash
ssh root@152.53.229.176
cd /var/www/call-center
git pull origin main
chmod +x server_full_clean.sh
./server_full_clean.sh
```

### Variant 2: Qo'lda

SSH orqali serverga ulaning va quyidagilarni bajaring:

```bash
ssh root@152.53.229.176

# PM2 ni to'xtatish
pm2 delete call-center-backend
pm2 kill
sleep 3

# Project papkasiga o'tish
cd /var/www/call-center

# Git pull
git pull origin main

# Backend papkasiga o'tish
cd backend

# Barcha build va cache fayllarni o'chirish
rm -rf dist
rm -rf node_modules/.cache
rm -rf .nest
rm -rf tsconfig.tsbuildinfo
rm -rf src/**/*.js
rm -rf src/**/*.js.map
find . -name "*.js.map" -delete

# Source faylni tekshirish
cat src/settings/sip-extension.service.ts | grep -A 15 "getExtensions"

# Database Migration
npx prisma db push

# Prisma Client Generate
npx prisma generate

# Node modules cache ni tozalash
npm cache clean --force

# Build
npm run build

# Build faylini tekshirish
cat dist/src/settings/sip-extension.service.js | grep -A 15 "getExtensions"

# PM2 ni qayta ishga tushirish
pm2 start dist/src/main.js --name call-center-backend --update-env

# Loglar
pm2 logs call-center-backend --err --lines 30
```

## ✅ Tekshirish

### 1. Source Fayl

```bash
cat src/settings/sip-extension.service.ts | grep -A 15 "getExtensions"
```

Quyidagi kod ko'rinishi kerak:
```typescript
async getExtensions() {
    // Database dan extensionlarni olish
    // Barcha operatorlarni olish va keyin filter qilish
    const allOperators = await this.prisma.operator.findMany({
        select: {
            id: true,
            name: true,
            extension: true,
            status: true,
        },
    });
    // Extension mavjud bo'lgan operatorlarni qaytarish
    return allOperators.filter(op => op.extension !== null && op.extension !== '');
}
```

### 2. Build Fayl

```bash
cat dist/src/settings/sip-extension.service.js | grep -A 15 "getExtensions"
```

Quyidagi kod ko'rinishi kerak:
```javascript
async getExtensions() {
    // Database dan extensionlarni olish
    // Barcha operatorlarni olish va keyin filter qilish
    const allOperators = await this.prisma.operator.findMany({
        select: {
            id: true,
            name: true,
            extension: true,
            status: true,
        },
    });
    // Extension mavjud bo'lgan operatorlarni qaytarish
    return allOperators.filter(op => op.extension !== null && op.extension !== '');
}
```

### 3. Error Loglar

```bash
pm2 logs call-center-backend --err --lines 50
```

Xatolik bo'lmasa, hech qanday xatolik ko'rsatilmaydi.

## 🔧 Agar Hali Ham Xatolik Bo'lsa

### Source Map ni To'liq O'chirish

```bash
cd /var/www/call-center/backend

# tsconfig.json da sourceMap ni o'chirish
nano tsconfig.json
# "sourceMap": false, qiling

# Qayta build
rm -rf dist
npm run build

# PM2 restart
pm2 restart call-center-backend
```

### PM2 Cache ni Tozalash

```bash
pm2 kill
rm -rf ~/.pm2
pm2 start dist/src/main.js --name call-center-backend
```

## 📋 Checklist

- [ ] PM2 to'xtatildi
- [ ] Barcha build va cache fayllar o'chirildi
- [ ] Git pull qilindi
- [ ] Source fayl to'g'ri
- [ ] Database migration qilindi
- [ ] Prisma client generate qilindi
- [ ] Build qilindi
- [ ] Build fayl to'g'ri
- [ ] PM2 qayta ishga tushirildi
- [ ] Error loglarida xatolik yo'q

