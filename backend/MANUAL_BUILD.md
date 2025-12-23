# Manual Build Qo'llanmasi

## Muammo

Build log bo'sh va `dist/main.js` topilmadi. NestJS build jarayoni to'liq yakunlanmagan.

## Yechim

### Variant 1: Force Build Script

```bash
cd /var/www/call-center/backend
chmod +x FORCE_BUILD.sh
./FORCE_BUILD.sh
```

### Variant 2: Qo'lda Build

```bash
cd /var/www/call-center/backend

# 1. To'liq clean
rm -rf dist node_modules/.cache tsconfig.tsbuildinfo

# 2. Dependencies
npm install

# 3. Prisma
npx prisma generate

# 4. NestJS build (verbose)
npx nest build --verbose

# 5. Tekshirish
ls -la dist/main.js
```

### Variant 3: npm run build

```bash
cd /var/www/call-center/backend

# Clean
rm -rf dist

# Build
npm run build

# Tekshirish
ls -la dist/main.js
```

### Variant 4: TypeScript Compiler

```bash
cd /var/www/call-center/backend

# TypeScript compile
npx tsc

# Tekshirish
ls -la dist/main.js
```

## Xatoliklar

### Build log bo'sh

**Sabab:**
- Build jarayoni to'liq yakunlanmagan
- Output redirect qilinmagan

**Yechim:**
```bash
npm run build 2>&1 | tee build.log
```

### dist/main.js topilmadi

**Sabab:**
- Build muvaffaqiyatsiz
- Output path noto'g'ri
- TypeScript xatoliklar

**Yechim:**
```bash
# TypeScript check
npx tsc --noEmit

# Build verbose
npx nest build --verbose
```

## Tekshirish

```bash
# Build fayl mavjudligini tekshirish
ls -la dist/main.js

# Dist papka ichida nima bor
ls -la dist/

# Build log
cat build-verbose.log
```

