# NestJS Build Fix

## Muammo

NestJS build jarayoni `dist/main.js` faylini yaratmayapti. Build log bo'sh va dist papkada faqat `prisma`, `src` va `tsconfig.tsbuildinfo` bor.

## Tekshirish

### 1. Debug Script

```bash
cd /var/www/call-center/backend
chmod +x DEBUG_NESTJS_BUILD.sh
./DEBUG_NESTJS_BUILD.sh
```

### 2. Qo'lda Tekshirish

```bash
cd /var/www/call-center/backend

# Entry point tekshirish
ls -la src/main.ts

# NestJS CLI versiyasi
npx nest --version

# TypeScript compilation
npx tsc --noEmit

# Clean va build
rm -rf dist
npx nest build
```

## Yechimlar

### Variant 1: TypeScript Compiler To'g'ridan-to'g'ri

```bash
cd /var/www/call-center/backend

# Clean
rm -rf dist

# TypeScript compile
npx tsc

# Tekshirish
ls -la dist/main.js
```

### Variant 2: NestJS Build

```bash
cd /var/www/call-center/backend

# Clean
rm -rf dist

# NestJS build
npx nest build

# Yoki
npm run build
```

### Variant 3: Package.json Script

```bash
cd /var/www/call-center/backend

# Clean
rm -rf dist

# Build
npm run build

# Tekshirish
ls -la dist/main.js
```

## Xatoliklar

### NestJS CLI topilmadi

**Yechim:**
```bash
npm install -g @nestjs/cli
# Yoki
npm install --save-dev @nestjs/cli
```

### TypeScript xatoliklar

**Yechim:**
```bash
npx tsc --noEmit
# Xatoliklarni tuzatish
```

### Entry point topilmadi

**Yechim:**
- `src/main.ts` mavjudligini tekshirish
- `nest-cli.json` da `sourceRoot` ni tekshirish

## Tekshirish

```bash
# Build fayl mavjudligini tekshirish
ls -la dist/main.js

# Dist papka ichida nima bor
ls -la dist/

# NestJS build log
cat nest-build.log
```

