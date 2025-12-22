# Array Tekshiruvi Fix - GitHub Push

## 📤 Lokal Mashinada - Push Qilish

Terminal da quyidagi buyruqlarni bajaring:

```bash
cd /Users/tiuulugbek/asterisk-call-center

git add .
git commit -m "Fix: Array tekshiruvi va xatoliklar tuzatildi

- Dashboard.tsx da Array.isArray tekshiruvi
- Calls.tsx da array tekshiruvi qo'shildi
- Settings.tsx da array tekshiruvi qo'shildi
- SIP service timeout qo'shildi
- Xatolik xabarlarini yaxshilash"

git push origin main
```

## 📥 Serverda Build

Push qilgandan keyin serverda:

```bash
ssh root@152.53.229.176
cd /var/www/call-center
git pull origin main

cd frontend
npm run build
cp -r dist/* /var/www/crm24/
```

## ✅ Tekshirish

1. Browser da: `https://crm24.soundz.uz/dashboard`
2. Console da xatoliklar kamayishi kerak
3. `e.map is not a function` xatosi yo'qolishi kerak

## ⚠️ Muhim

Browser da to'g'ridan-to'g'ri Kerio Control ga ulanib bo'lmaydi. Asterisk WebRTC gateway kerak.

