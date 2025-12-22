# Server Sed Fix - To'g'ridan-to'g'ri Yangilash

## 🔧 Serverda Quyidagi Buyruqni Bajaring

```bash
ssh root@152.53.229.176

cd /var/www/call-center/backend

# Backup
cp src/settings/sip-extension.service.ts src/settings/sip-extension.service.ts.backup

# Faylni yangilash (sed orqali)
sed -i '188,200d' src/settings/sip-extension.service.ts
sed -i '187a\
  async getExtensions() {\
    const allOperators = await this.prisma.operator.findMany({\
      select: {\
        id: true,\
        name: true,\
        extension: true,\
        status: true,\
      },\
    });\
    return allOperators.filter(op => op.extension !== null && op.extension !== '\''\'\'');\
  }' src/settings/sip-extension.service.ts

# Build
npm run build

# Restart
pm2 restart call-center-backend --update-env

# Tekshirish
pm2 logs call-center-backend --err --lines 20
```

## ✅ Yoki Nano Orqali

```bash
nano src/settings/sip-extension.service.ts
```

188-200 qatorlarni o'chirib, quyidagini qo'ying:

```typescript
async getExtensions() {
  const allOperators = await this.prisma.operator.findMany({
    select: {
      id: true,
      name: true,
      extension: true,
      status: true,
    },
  });
  return allOperators.filter(op => op.extension !== null && op.extension !== '');
}
```

Ctrl+O, Enter, Ctrl+X

```bash
npm run build
pm2 restart call-center-backend --update-env
```

