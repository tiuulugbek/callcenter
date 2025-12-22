# Prisma Fix - Extension Query Xatosi

## 🐛 Muammo

```
Argument `not` must not be null.
PrismaClientValidationError: Invalid `this.prisma.operator.findMany()` invocation
```

## ✅ Yechim

Prisma da `extension: { not: null }` noto'g'ri. `not: { equals: null }` ishlatish kerak.

## 🔧 O'zgarish

```typescript
// Noto'g'ri
where: {
  extension: { not: null },
}

// To'g'ri
where: {
  extension: {
    not: {
      equals: null,
    },
  },
}
```

## 📥 Serverda - Fix Qo'llash

```bash
# Serverga ulanish
ssh root@152.53.229.176

# Project papkasiga o'tish
cd /var/www/call-center

# Git pull (agar fix push qilingan bo'lsa)
git pull origin main

# Backend
cd backend

# Backend Build
npm run build

# Backend Restart
pm2 restart call-center-backend --update-env

# Backend Loglar
pm2 logs call-center-backend --lines 50
```

## ✅ Tekshirish

```bash
# Backend loglarida xatolik yo'qligini tekshiring
pm2 logs call-center-backend | grep -i "error\|prisma"

# Settings API tekshiring
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:4000/settings/sip-extensions
```

