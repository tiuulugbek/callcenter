# Build Path Muammosi

## Muammo
```
dist/ papkasi yaratilgan, lekin dist/main.js topilmayapti
dist/src/ papkasi bor
```

Bu shuni anglatadiki, build fayllar `dist/src/` ichida.

## Yechim

### 1. Build Faylini Topish

```bash
cd /var/www/call-center/backend

# dist/src/ ichida qidirish
find dist/ -name "main.js"

# Yoki
ls -la dist/src/
ls -la dist/src/main.js
```

### 2. PM2 da To'g'ri Yo'l Bilan Ishga Tushirish

```bash
cd /var/www/call-center/backend

# Agar dist/src/main.js bo'lsa
pm2 start dist/src/main.js --name call-center-backend --update-env

# Yoki dist/main.js bo'lishi kerak bo'lsa, tsconfig.json ni tekshirish
cat tsconfig.json | grep outDir
```

### 3. TypeScript Konfiguratsiyasini To'g'rilash

Agar `dist/src/main.js` bo'lsa, `tsconfig.json` da `outDir` ni o'zgartirish kerak bo'lishi mumkin.

```bash
cd /var/www/call-center/backend

# tsconfig.json ni ko'rish
cat tsconfig.json

# Agar outDir "./dist" bo'lsa, lekin fayllar dist/src/ ga ketayotgan bo'lsa,
# nest-cli.json ni tekshirish kerak
cat nest-cli.json
```

### 4. NestJS Build Output

NestJS odatda `dist/` ga to'g'ridan-to'g'ri build qiladi. Agar `dist/src/` ga ketayotgan bo'lsa, `tsconfig.json` da `rootDir` muammosi bo'lishi mumkin.

## Tekshirish

```bash
cd /var/www/call-center/backend

# 1. Build faylini topish
find dist/ -name "main.js" -type f

# 2. Agar dist/src/main.js bo'lsa
pm2 start dist/src/main.js --name call-center-backend --update-env

# 3. Yoki dist/main.js bo'lishi kerak bo'lsa
# tsconfig.json ni o'zgartirish kerak
```

## Yechim Variantlari

### Variant 1: dist/src/main.js ishlatish

```bash
pm2 start dist/src/main.js --name call-center-backend --update-env
```

### Variant 2: tsconfig.json ni to'g'rilash

```bash
# tsconfig.json da rootDir ni o'chirish yoki to'g'rilash
nano tsconfig.json
```

`rootDir` ni o'chirish yoki `"rootDir": "./src"` qo'shish.

### Variant 3: nest-cli.json ni tekshirish

```bash
cat nest-cli.json
```

