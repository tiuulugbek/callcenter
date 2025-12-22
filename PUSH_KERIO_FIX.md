# Kerio Operator Fix - GitHub Push

## 📤 Lokal Mashinada - Push Qilish

Terminal da quyidagi buyruqlarni bajaring:

```bash
cd /Users/tiuulugbek/asterisk-call-center

git add .
git commit -m "Fix: Kerio Operator API va authentication yaxshilandi

- Kerio Operator API endpoint lari yaxshilandi
- Authentication tekshiruvi yaxshilandi
- Xatolik xabarlari yaxshilandi
- KERIO_ASTERISK_EXPLANATION.md qo'llanma qo'shildi
- Asterisk kerak emasligi tushuntirildi"

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

# Frontend rebuild
cd ../frontend
npm install
npm run build
cp -r dist/* /var/www/crm24/
```

## ⚙️ Sozlash

### Backend .env

```env
KERIO_PBX_HOST=90.156.199.92
KERIO_API_USERNAME=your_api_username
KERIO_API_PASSWORD=your_api_password
KERIO_SYNC_INTERVAL=5
```

### Kerio Operator API Endpoint lari

Kerio Operator API dokumentatsiyasini ko'rib chiqing va haqiqiy endpoint larni aniqlang:
- CDR endpoint
- Recording endpoint
- Authentication usuli

## ⚠️ Muhim

**Asterisk kerak emas!** Faqat Kerio Operator API ga ulanib, ma'lumotlarni olish kerak.

## 📋 Checklist

- [ ] Git push qilindi
- [ ] Serverda git pull qilindi
- [ ] Backend rebuild qilindi
- [ ] Frontend rebuild qilindi
- [ ] .env fayl sozlandi
- [ ] Kerio Operator API endpoint lari tekshirildi
- [ ] Authentication test qilindi

