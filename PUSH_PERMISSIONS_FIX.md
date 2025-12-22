# Permissions Fix - GitHub Push

## 📤 Lokal Mashinada - Push Qilish

Terminal da quyidagi buyruqlarni bajaring:

```bash
cd /Users/tiuulugbek/asterisk-call-center

git add .
git commit -m "Fix: SIP Trunk permissions va xabarlarni yaxshilash

- Backend xabarlarni yaxshilash (permissions muammosi aniq ko'rsatiladi)
- Frontend xabarlarni yaxshilash (warning type, permissions fix script ko'rsatiladi)
- Permissions fix scriptni ishga tushirish ko'rsatmalari qo'shildi"

git push origin main
```

## 📥 Serverda - Pull va Permissions Fix

Push qilgandan keyin serverda:

```bash
ssh root@152.53.229.176
cd /var/www/call-center
git pull origin main

# Permissions fix scriptni ishga tushirish (MUHIM!)
chmod +x fix_sip_trunk_permissions.sh
./fix_sip_trunk_permissions.sh

# Backend rebuild va restart
cd backend
npm run build
pm2 restart call-center-backend

# Frontend rebuild
cd ../frontend
npm run build
cp -r dist/* /var/www/crm24/
```

## ✅ Tekshirish

### 1. Permissions Tekshirish

```bash
# Backend user ni aniqlash
BACKEND_USER=$(ps aux | grep "node.*main.js" | grep -v grep | head -1 | awk '{print $1}')
echo "Backend user: $BACKEND_USER"

# Backend user asterisk guruhida ekanligini tekshiring
groups $BACKEND_USER

# pjsip.conf permissions ni tekshiring
ls -la /etc/asterisk/pjsip.conf
```

### 2. SIP Trunk Yaratish

1. Browser da: `https://crm24.soundz.uz/settings`
2. "SIP Trunk (Provayder)" tab ni oching
3. Trunk yarating
4. Agar avtomatik yangilash muvaffaqiyatli bo'lsa, "success" xabari ko'rinadi
5. Agar permissions muammosi bo'lsa, "warning" xabari va permissions fix script ko'rsatiladi

### 3. Backend Loglar

```bash
pm2 logs call-center-backend --err --lines 30
```

## 🔧 Agar Hali Ham Muammo Bo'lsa

### Qo'lda Permissions Fix

```bash
# Backend user ni aniqlash
BACKEND_USER=$(ps aux | grep "node.*main.js" | grep -v grep | head -1 | awk '{print $1}')

# Backend user ni asterisk guruhiga qo'shish
sudo usermod -a -G asterisk $BACKEND_USER

# pjsip.conf permissions ni sozlash
sudo chown asterisk:asterisk /etc/asterisk/pjsip.conf
sudo chmod 664 /etc/asterisk/pjsip.conf

# /etc/asterisk papkasiga yozish ruxsatini berish
sudo chmod 775 /etc/asterisk

# PM2 ni restart qilish
pm2 restart call-center-backend
```

## 📋 Checklist

- [ ] Git push qilindi
- [ ] Serverda git pull qilindi
- [ ] Permissions fix script ishga tushirildi
- [ ] Backend user asterisk guruhiga qo'shildi
- [ ] pjsip.conf permissions sozlandi
- [ ] Backend rebuild va restart qilindi
- [ ] Frontend rebuild va deploy qilindi
- [ ] SIP trunk yaratish test qilindi
- [ ] Avtomatik yangilash ishlayapti

