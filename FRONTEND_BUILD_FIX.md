# Frontend Build Xatosi - TypeScript

## Muammo
```
error TS2339: Property 'env' does not exist on type 'ImportMeta'.
```

Bu TypeScript da `import.meta.env` ni tan olmayapti.

## Yechim

### 1. vite-env.d.ts Faylini Tekshirish

```bash
cd /var/www/call-center/frontend

# vite-env.d.ts faylini ko'rish
cat src/vite-env.d.ts
```

Agar fayl yo'q bo'lsa yoki noto'g'ri bo'lsa, quyidagini yarating:

```bash
nano src/vite-env.d.ts
```

Quyidagini kiriting:
```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_WS_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### 2. tsconfig.json ni Tekshirish

```bash
cat tsconfig.json
```

`types` ichida `vite/client` bo'lishi kerak.

### 3. Qayta Build

```bash
cd /var/www/call-center/frontend

# Build
npm run build

# Build tekshirish
ls -la dist/
```

## To'liq Yechim

```bash
cd /var/www/call-center/frontend

# vite-env.d.ts faylini yaratish/yangilash
cat > src/vite-env.d.ts << 'EOF'
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_WS_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
EOF

# Build
npm run build

# Build tekshirish
ls -la dist/
```

## Agar Hali Ham Xatolar Bo'lsa

```bash
# tsconfig.json ni tekshirish
cat tsconfig.json

# types qo'shish kerak bo'lsa
nano tsconfig.json
```

`compilerOptions` ichiga quyidagini qo'shing:
```json
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
```

