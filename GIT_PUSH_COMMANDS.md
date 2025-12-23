# GitHubga Push va Serverga Deploy Qilish

## GitHubga Push Qilish

Quyidagi buyruqlarni ketma-ket bajaring:

```bash
cd /Users/tiuulugbek/asterisk-call-center

# Barcha o'zgarishlarni qo'shish
git add -A

# Commit qilish
git commit -m "Kerio Operator logikasini optimallashtirish va SIP trunk o'chirishni tuzatish

- Kerio Operator avtomatik sync va polling o'chirildi
- Kerio Operator logikasi faqat Settings sahifasidagi Kerio Operator tabida ishlatiladi
- SIP trunk o'chirish funksiyasi tuzatildi
- Frontend TypeScript xatolari tuzatildi
- PM2 config yo'llari yangilandi"

# GitHubga push qilish
git push origin main
```

## Serverga Deploy Qilish

Serverni SSH orqali ulang va quyidagi buyruqlarni bajaring:

```bash
# Loyiha papkasiga o'tish
cd /var/www/call-center  # yoki loyiha papkangiz

# Git pull qilish
git pull origin main

# Deploy scriptni ishga tushirish
./deploy_to_server.sh
```

Yoki qo'lda:

```bash
cd /var/www/call-center  # yoki loyiha papkangiz

# Git pull
git pull origin main

# Backend dependencies
cd backend
npm install
npx prisma generate
npm run build

# Frontend dependencies
cd ../frontend
npm install
npm run build

# PM2 restart
cd ..
pm2 restart ecosystem.config.js
pm2 list
```

## O'zgarishlar

1. **Kerio Operator optimallashtirildi:**
   - `backend/src/main.ts` dan avtomatik sync va polling o'chirildi
   - Kerio Operator logikasi endi faqat Settings sahifasidagi "Kerio Operator" tabida ishlatiladi
   - Qo'lda sinxronlashtirish mumkin

2. **SIP Trunk o'chirish tuzatildi:**
   - Frontendda `trunk.id` to'g'ri ishlatiladi
   - O'chirish tugmasi faqat `id` mavjud bo'lganda faollashadi

3. **Frontend TypeScript xatolari tuzatildi:**
   - `vite/client` typelar qo'shildi
   - `jssip` type declarations yaratildi
   - Browser uchun EventEmitter klass yaratildi

4. **PM2 config yangilandi:**
   - Yo'llar loyiha papkasiga moslashtirildi
   - Log fayllar `logs/` papkasiga yo'naltirildi
