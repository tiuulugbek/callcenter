# Backend Build Debug Qo'llanmasi

## Xatolik

```
ERROR: Backend build muvaffaqiyatsiz! dist/main.js topilmadi
```

## Tekshirish

### 1. Build Xatoliklarni Ko'rish

```bash
cd /var/www/call-center/backend

# Build va xatoliklarni ko'rish
npm run build

# Yoki TypeScript xatoliklarni ko'rish
npx tsc --noEmit
```

### 2. Umumiy Xatoliklar

#### Circular Dependency

```bash
# Circular dependency xatoliklarni topish
npm run build 2>&1 | grep -i "circular"
```

#### Import Xatoliklar

```bash
# Import xatoliklarni topish
npm run build 2>&1 | grep -i "cannot find module"
```

#### TypeScript Xatoliklar

```bash
# TypeScript xatoliklarni ko'rish
npx tsc --noEmit
```

### 3. Build Loglarini Ko'rish

```bash
cd /var/www/call-center/backend

# To'liq build log
npm run build 2>&1 | tee build.log

# Xatoliklarni ko'rish
cat build.log | grep -i error
```

## Yechimlar

### Variant 1: Clean Build

```bash
cd /var/www/call-center/backend

# Eski build fayllarni o'chirish
rm -rf dist
rm -rf node_modules/.cache

# Dependencies qayta o'rnatish
npm install

# Build
npm run build
```

### Variant 2: TypeScript Check

```bash
cd /var/www/call-center/backend

# TypeScript xatoliklarni ko'rish
npx tsc --noEmit

# Xatoliklarni tuzatish
# Keyin build
npm run build
```

### Variant 3: NestJS Build

```bash
cd /var/www/call-center/backend

# NestJS CLI orqali build
npx nest build

# Yoki
npm run build
```

## Xatoliklar va Yechimlar

### 1. Circular Dependency

**Xatolik:**
```
Circular dependency detected
```

**Yechim:**
- `forwardRef()` ishlatish
- Module strukturasini o'zgartirish

### 2. Import Xatoliklar

**Xatolik:**
```
Cannot find module '...'
```

**Yechim:**
- Package o'rnatish: `npm install <package>`
- Import path ni tekshirish

### 3. TypeScript Xatoliklar

**Xatolik:**
```
Type '...' is not assignable to type '...'
```

**Yechim:**
- Type definitionlarni tekshirish
- Type casting ishlatish

### 4. Prisma Xatoliklar

**Xatolik:**
```
PrismaClient is not generated
```

**Yechim:**
```bash
npx prisma generate
```

## To'liq Debug Script

```bash
#!/bin/bash

cd /var/www/call-center/backend

echo "Dependencies tekshirilmoqda..."
npm install

echo "Prisma generate..."
npx prisma generate

echo "TypeScript check..."
npx tsc --noEmit

echo "Build..."
npm run build

echo "Build tekshirish..."
if [ -f "dist/main.js" ]; then
    echo "✅ Build muvaffaqiyatli!"
else
    echo "❌ Build muvaffaqiyatsiz!"
    exit 1
fi
```

