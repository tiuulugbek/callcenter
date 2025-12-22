# Syntax Fix - Fayl Noto'g'ri Yangilangan

## 🐛 Muammo

```
error TS1005: '}' expected.
```

Bu shuni anglatadiki, faylda qavslar mos kelmayapti yoki noto'g'ri yangilangan.

## ✅ Yechim

Serverda faylni to'liq tekshirib, tuzatish kerak.

## 🔧 Qadamlari

```bash
# Serverda
cd /var/www/call-center/backend

# 1. Faylni to'liq ko'rish
cat src/settings/sip-extension.service.ts | tail -30

# 2. Faylni ochish va tuzatish
nano src/settings/sip-extension.service.ts
```

## 📝 To'g'ri Kod

`getExtensions` funksiyasi quyidagicha bo'lishi kerak (186-200 qatorlar):

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
}
```

**Muhim:** Fayl oxirida `}` bo'lishi kerak (class yopilishi uchun).

## 🔍 Tekshirish

```bash
# Fayl oxirini tekshiring
tail -5 src/settings/sip-extension.service.ts

# Ko'rinishi kerak:
#   }
# }
```

## ✅ Keyin

```bash
# Build
npm run build

# Agar build muvaffaqiyatli bo'lsa:
pm2 delete call-center-backend
pm2 start dist/src/main.js --name call-center-backend --update-env
# yoki
pm2 start dist/main.js --name call-center-backend --update-env

# Tekshirish
pm2 logs call-center-backend --err --lines 30
```

