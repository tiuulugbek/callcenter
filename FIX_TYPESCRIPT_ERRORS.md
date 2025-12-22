# TypeScript Xatolari Fix - GitHub Push

## 📤 Lokal Mashinada - Push Qilish

Terminal da quyidagi buyruqlarni bajaring:

```bash
cd /Users/tiuulugbek/asterisk-call-center

git add .
git commit -m "Fix: TypeScript xatolari tuzatildi

- Duplicate key 'failed' o'chirildi
- CallsService.create metodiga startTime, endTime, duration, status qo'shildi
- Kerio service da create metodini to'g'ri ishlatish"

git push origin main
```

## 📥 Serverda - Pull va Build

Push qilgandan keyin serverda:

```bash
ssh root@152.53.229.176
cd /var/www/call-center
git pull origin main

# Backend rebuild
cd backend
npm install
npm run build
pm2 restart call-center-backend
```

## ✅ Tekshirish

Build muvaffaqiyatli bo'lishi kerak.

