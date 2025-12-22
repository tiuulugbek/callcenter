# Server Fix - Prisma Extension Query Xatosi

## 🐛 Muammo

Serverda hali ham eski kod ishlayapti:
```
extension: {
  not: null  // Noto'g'ri
}
```

## ✅ Yechim

Serverda kod yangilanishi va rebuild qilish kerak.

## 🔧 Qadamlari

```bash
# Serverga ulanish
ssh root@152.53.229.176

# Project papkasiga o'tish
cd /var/www/call-center

# Git pull (yangilash)
git pull origin main

# Backend
cd backend

# Kodni tekshirish (yangilanganligini)
cat src/settings/sip-extension.service.ts | grep -A 10 "getExtensions"

# Agar hali eski kod bo'lsa, qo'lda yangilash:
# src/settings/sip-extension.service.ts faylini ochib, getExtensions funksiyasini yangilash

# Backend Build
npm run build

# Backend Restart
pm2 restart call-center-backend --update-env

# Error Loglarni Tekshirish
pm2 logs call-center-backend --err --lines 50
```

## 📝 Qo'lda Yangilash (Agar Git Pull Ishlamasa)

```bash
# Serverda
nano /var/www/call-center/backend/src/settings/sip-extension.service.ts
```

`getExtensions` funksiyasini quyidagicha yangilang:

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

Keyin:
```bash
npm run build
pm2 restart call-center-backend --update-env
```

## ✅ Tekshirish

```bash
# Error loglarida xatolik yo'qligini tekshiring
pm2 logs call-center-backend --err --lines 50

# Settings API test qiling
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:4000/settings/sip-extensions
```

## 🎯 Natija

- ✅ Prisma xatosi hal qilindi
- ✅ Extensionlar to'g'ri ko'rsatiladi
- ✅ Backend ishlaydi

