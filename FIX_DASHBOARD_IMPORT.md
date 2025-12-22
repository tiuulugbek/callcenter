# Dashboard Import Fix - GitHub Push

## 📤 Lokal Mashinada - Push Qilish

Terminal da quyidagi buyruqlarni bajaring:

```bash
cd /Users/tiuulugbek/asterisk-call-center

git add .
git commit -m "Fix: Dashboard import xatosi tuzatildi

- api import to'g'rilandi
- settingsApi ishlatildi"

git push origin main
```

## 📥 Serverda - Pull va Build

Push qilgandan keyin serverda:

```bash
ssh root@152.53.229.176
cd /var/www/call-center
git pull origin main

# Frontend rebuild
cd frontend
npm run build
cp -r dist/* /var/www/crm24/
```

## ✅ Tekshirish

Build muvaffaqiyatli bo'lishi kerak.

