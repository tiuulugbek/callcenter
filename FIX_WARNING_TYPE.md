# Warning Type Fix - GitHub Push

## 📤 Lokal Mashinada - Push Qilish

Terminal da quyidagi buyruqlarni bajaring:

```bash
cd /Users/tiuulugbek/asterisk-call-center

git add .
git commit -m "Fix: Warning type qo'shildi va CSS style

- Settings.tsx da warning type qo'shildi
- Settings.css da alert-warning style qo'shildi
- Xabarlar ko'p qatorli ko'rsatiladi"

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

1. Browser da: `https://crm24.soundz.uz/settings`
2. SIP Trunk yarating
3. Agar permissions muammosi bo'lsa, warning xabari ko'rinadi
4. Xabar ko'p qatorli va o'qish oson bo'lishi kerak

