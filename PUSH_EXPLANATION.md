# SIP Trunk va Extension Tushuntirish - GitHub Push

## 📤 Lokal Mashinada - Push Qilish

Terminal da quyidagi buyruqlarni bajaring:

```bash
cd /Users/tiuulugbek/asterisk-call-center

git add .
git commit -m "Fix: SIP Extension va Trunk tushuntirish qo'shildi

- Frontend da SIP Extension bo'limiga MicroSIP ulanish ko'rsatmalari qo'shildi
- SIP Trunk bo'limiga ogohlantirish qo'shildi (MicroSIP uchun emas)
- SIP_TRUNK_EXPLANATION.md qo'llanma qo'shildi
- Foydalanuvchilar uchun aniqroq tushuntirish"

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
2. "SIP Extensionlar" tab ni oching
3. MicroSIP ulanish ko'rsatmalari ko'rinishi kerak
4. "SIP Trunk" tab ni oching
5. Ogohlantirish ko'rinishi kerak (MicroSIP uchun emas)

## 🎯 Foydalanuvchilar Uchun

### MicroSIP uchun (SIP Extension):
1. Settings → SIP Extensionlar
2. Operator tanlang
3. Extension va parol kiriting
4. MicroSIP da ulaning

### Tashqi telefonlar uchun (SIP Trunk):
1. Settings → SIP Trunk
2. Faqat tashqi provayderga ulanish kerak bo'lsa
3. MicroSIP uchun emas!

