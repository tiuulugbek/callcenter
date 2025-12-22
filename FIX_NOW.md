# Serverda Hozir Fix Qilish - Aniq Qadamlari

## 🔧 Serverda Quyidagilarni Bajaring

```bash
# 1. Serverga ulanish
ssh root@152.53.229.176

# 2. Faylni ochish
nano /var/www/call-center/backend/src/settings/sip-extension.service.ts

# 3. 188-200 qatorlarni toping va quyidagicha o'zgartiring:
```

## 📝 Eski Kod (O'chirish):

```typescript
async getExtensions() {
  // Database dan extensionlarni olish
  const operators = await this.prisma.operator.findMany({
    where: {
      extension: {
        not: null,
      },
    },
    select: {
      id: true,
      name: true,
      extension: true,
      status: true,
    },
  });

  return operators;
}
```

## ✅ Yangi Kod (Qo'yish):

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

## 🔄 Keyin:

```bash
# Saqlash: Ctrl+O, Enter, Ctrl+X

# Build
cd /var/www/call-center/backend
npm run build

# Restart
pm2 restart call-center-backend --update-env

# Tekshirish
pm2 logs call-center-backend --err --lines 20
```

## ✅ Muvaffaqiyatli Bo'lsa:

Error loglarida xatolik bo'lmasligi kerak!

