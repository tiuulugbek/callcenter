# Kerio Operator Integratsiyasi - Final Push

## 📤 Lokal Mashinada - Push Qilish

Terminal da quyidagi buyruqlarni bajaring:

```bash
cd /Users/tiuulugbek/asterisk-call-center

git add .
git commit -m "Add: Kerio Operator integratsiyasi va telefon qismi olib tashlandi

- KerioModule, KerioService, KerioController yaratildi
- CDR sync funksiyasi qo'shildi
- Avtomatik sync qo'shildi (main.ts)
- Frontend da Kerio Operator tab qo'shildi
- Dashboard dan telefon qismi olib tashlandi
- Faqat Kerio Operator integratsiyasi qoldirildi"

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

### Frontend

Browser da: `https://crm24.soundz.uz/settings`
- "Kerio Operator" tab ni oching
- "Tekshirish" ni bosing
- "Qo'ng'iroqlarni Sync Qilish" ni bosing

## 📋 Checklist

- [ ] Git push qilindi
- [ ] Serverda git pull qilindi
- [ ] Backend rebuild qilindi
- [ ] Frontend rebuild qilindi
- [ ] .env fayl sozlandi
- [ ] Kerio Operator API endpoint lari tekshirildi
- [ ] Sync test qilindi

