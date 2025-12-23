# Build Xatoliklarni Tuzatish

## Xatolik

```
❌ Build muvaffaqiyatsiz! dist/main.js topilmadi
```

## Tekshirish

### 1. Build Xatoliklarni Ko'rish

```bash
cd /var/www/call-center/backend

# Build xatoliklarni ko'rish
./CHECK_BUILD_ERRORS.sh

# Yoki oddiy build
./SIMPLE_BUILD.sh
```

### 2. TypeScript Xatoliklarni Ko'rish

```bash
cd /var/www/call-center/backend

# TypeScript check
npx tsc --noEmit

# Yoki
npm run build
```

### 3. Umumiy Xatoliklar

#### Import Xatoliklar

```bash
# Import xatoliklarni topish
npm run build 2>&1 | grep -i "cannot find module"
```

#### Circular Dependency

```bash
# Circular dependency xatoliklarni topish
npm run build 2>&1 | grep -i "circular"
```

#### TypeScript Type Xatoliklar

```bash
# Type xatoliklarni topish
npx tsc --noEmit 2>&1 | grep -i "type"
```

## Yechimlar

### Variant 1: Clean Build

```bash
cd /var/www/call-center/backend

# To'liq clean
rm -rf dist node_modules

# Dependencies
npm install

# Prisma
npx prisma generate

# Build
npm run build
```

### Variant 2: Step by Step

```bash
cd /var/www/call-center/backend

# 1. Dependencies
npm install

# 2. Prisma
npx prisma generate

# 3. TypeScript check
npx tsc --noEmit

# 4. Build
npm run build

# 5. Tekshirish
ls -la dist/main.js
```

### Variant 3: NestJS CLI

```bash
cd /var/www/call-center/backend

# NestJS CLI orqali build
npx nest build

# Yoki
npm run build
```

## Xatoliklar va Yechimlar

### 1. "Cannot find module"

**Yechim:**
```bash
npm install <package-name>
```

### 2. "Circular dependency"

**Yechim:**
- `forwardRef()` ishlatish
- Module strukturasini o'zgartirish

### 3. TypeScript Type Xatoliklar

**Yechim:**
- Type definitionlarni tekshirish
- `any` ishlatish (vaqtincha)

### 4. Prisma Xatoliklar

**Yechim:**
```bash
npx prisma generate
```

## Tekshirish

```bash
# Build muvaffaqiyatli bo'lganini tekshirish
ls -la dist/main.js

# PM2 da ishga tushirish
pm2 start ecosystem.config.js

# Loglar
pm2 logs call-center-backend
```

