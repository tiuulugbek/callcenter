# Build Faylini Tuzatish - Hozir

## 🔍 Muammo

Build fayl topilmadi (`dist/src/settings/sip-extension.service.js: No such file or directory`) va error logda hali ham eski kod ko'rsatilmoqda.

## ✅ Yechim

### Serverda Quyidagilarni Bajaring:

```bash
ssh root@152.53.229.176

# Project papkasiga o'tish
cd /var/www/call-center

# Git pull
git pull origin main

# Backend papkasiga o'tish
cd backend

# Source faylni tekshirish
cat src/settings/sip-extension.service.ts | grep -A 15 "getExtensions"

# PM2 ni to'xtatish
pm2 delete call-center-backend
pm2 kill
sleep 3

# Barcha build va cache fayllarni o'chirish
rm -rf dist
rm -rf node_modules/.cache
rm -rf .nest
rm -rf tsconfig.tsbuildinfo
find . -name "*.js.map" -delete

# Database Migration
npx prisma db push

# Prisma Client Generate
npx prisma generate

# Build
npm run build

# Build faylini tekshirish
cat dist/src/settings/sip-extension.service.js | grep -A 15 "getExtensions"

# PM2 ni qayta ishga tushirish
pm2 start dist/src/main.js --name call-center-backend --update-env

# Loglar
pm2 logs call-center-backend --err --lines 30
```

### Yoki Script Orqali:

```bash
cd /var/www/call-center
git pull origin main
chmod +x fix_build_now.sh
./fix_build_now.sh
```

## ✅ Tekshirish

### 1. Source Fayl

```bash
cd /var/www/call-center/backend
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

## 🔧 Agar Build Xatosi Bo'lsa

```bash
cd /var/www/call-center/backend

# TypeScript xatolarini tekshirish
npx tsc --noEmit

# Build xatolarini ko'rish
npm run build 2>&1 | tee build.log

# Build logni ko'rish
cat build.log
```

## 📋 Checklist

- [ ] Git pull qilindi
- [ ] Backend papkasiga o'tildi
- [ ] Source fayl to'g'ri
- [ ] PM2 to'xtatildi
- [ ] Barcha build va cache fayllar o'chirildi
- [ ] Database migration qilindi
- [ ] Prisma client generate qilindi
- [ ] Build qilindi
- [ ] Build fayl topildi va to'g'ri
- [ ] PM2 qayta ishga tushirildi
- [ ] Error loglarida xatolik yo'q

