# Server Manual Fix - Prisma Extension Query

## 🐛 Muammo

Serverda hali ham eski kod ishlayapti:
```typescript
extension: {
  not: null  // Noto'g'ri
}
```

## ✅ Yechim 1: Qo'lda Yangilash

### Serverda quyidagilarni bajaring:

```bash
# Serverga ulanish
ssh root@152.53.229.176

# Faylni ochish
nano /var/www/call-center/backend/src/settings/sip-extension.service.ts
```

**188-200 qatorlarni quyidagicha yangilang:**

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

**Saqlash:** `Ctrl+O`, `Enter`, `Ctrl+X`

**Keyin:**
```bash
cd /var/www/call-center/backend
npm run build
pm2 restart call-center-backend --update-env
pm2 logs call-center-backend --err --lines 50
```

## ✅ Yechim 2: Script Ishlatish

```bash
# Scriptni serverga yuklash
scp fix_prisma_extension.sh root@152.53.229.176:/tmp/

# Serverda
ssh root@152.53.229.176
chmod +x /tmp/fix_prisma_extension.sh
/tmp/fix_prisma_extension.sh
```

## ✅ Yechim 3: Git Pull va Rebuild

```bash
# Serverga ulanish
ssh root@152.53.229.176

# Project papkasiga o'tish
cd /var/www/call-center

# Git pull
git pull origin main

# Kod yangilanganligini tekshiring
cat backend/src/settings/sip-extension.service.ts | grep -A 15 "getExtensions"

# Agar yangilangan bo'lsa:
cd backend
npm run build
pm2 restart call-center-backend --update-env

# Agar yangilanmagan bo'lsa, Yechim 1 ni ishlating
```

## ✅ Tekshirish

```bash
# Error loglarida xatolik yo'qligini tekshiring
pm2 logs call-center-backend --err --lines 50

# Agar xatolik bo'lmasa, muvaffaqiyatli!
```

## 🎯 Natija

- ✅ Prisma xatosi hal qilindi
- ✅ Extensionlar to'g'ri ko'rsatiladi
- ✅ Backend ishlaydi

