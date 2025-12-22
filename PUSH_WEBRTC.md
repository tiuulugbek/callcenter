# WebRTC Telefon - GitHub Push

## 📤 Lokal Mashinada - Push Qilish

Terminal da quyidagi buyruqlarni bajaring:

```bash
cd /Users/tiuulugbek/asterisk-call-center

git add .
git commit -m "Add: WebRTC telefon funksiyasi qo'shildi

- JSSIP library qo'shildi (package.json)
- SIP service yaratildi (src/services/sip.ts)
- Phone component yaratildi (src/components/Phone.tsx)
- Dashboard ga telefon integratsiya qilindi
- Kerio Control ga ulanish funksiyasi
- WEBRTC_SETUP_COMPLETE.md qo'llanma qo'shildi"

git push origin main
```

## 📥 Serverda - Pull va Build

Push qilgandan keyin serverda:

```bash
ssh root@152.53.229.176
cd /var/www/call-center
git pull origin main

# Frontend dependencies o'rnatish
cd frontend
npm install

# Frontend rebuild
npm run build
cp -r dist/* /var/www/crm24/
```

## ⚠️ Muhim

Kerio Control ga to'g'ridan-to'g'ri WebSocket orqali ulanmaydi. Quyidagi variantlar:

1. **Asterisk WebRTC Gateway** (Tavsiya)
2. **SIP Proxy Server**
3. **Kerio Control WebSocket Support** (agar mavjud bo'lsa)

## 📋 Checklist

- [ ] Git push qilindi
- [ ] Serverda git pull qilindi
- [ ] npm install qilindi
- [ ] Frontend build qilindi
- [ ] Deploy qilindi
- [ ] Test qilindi

