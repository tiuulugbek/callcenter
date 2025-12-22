# SIP Trunk Permissions Fix

## 🐛 Muammo

SIP trunk yaratganda "pjsip.conf faylini qo'lda yangilang" xabari chiqmoqda. Bu ruxsat muammosini anglatadi.

## ✅ Yechim

### 1. Asterisk Config Fayl Ruxsatlari

```bash
# Serverda
ssh root@152.53.229.176

# Ruxsatlarni tekshiring
ls -la /etc/asterisk/pjsip.conf

# Ruxsat berish
sudo chmod 664 /etc/asterisk/pjsip.conf
sudo chown asterisk:asterisk /etc/asterisk/pjsip.conf

# Yoki backend user ga ruxsat
sudo usermod -aG asterisk www-data
sudo chmod 664 /etc/asterisk/pjsip.conf
```

### 2. Backend User ga Ruxsat

```bash
# Backend user ni tekshiring
whoami
# Yoki
ps aux | grep node

# Agar www-data bo'lsa
sudo usermod -aG asterisk www-data
sudo chmod 664 /etc/asterisk/pjsip.conf

# Yoki root bo'lsa
sudo chmod 664 /etc/asterisk/pjsip.conf
sudo chown asterisk:asterisk /etc/asterisk/pjsip.conf
```

### 3. Asterisk Config Papkasi Ruxsatlari

```bash
# Config papkasiga ruxsat
sudo chmod 755 /etc/asterisk
sudo chmod 664 /etc/asterisk/pjsip.conf
```

## 🔧 Test Qilish

### 1. Ruxsatlarni Tekshirish

```bash
# Fayl mavjudligini tekshiring
ls -la /etc/asterisk/pjsip.conf

# Yozishga harakat qiling
echo "test" >> /etc/asterisk/pjsip.conf
# Agar xatolik bo'lsa, ruxsat muammosi bor
```

### 2. Backend Restart

```bash
cd /var/www/call-center/backend
npm run build
pm2 restart call-center-backend --update-env
```

### 3. SIP Trunk Test

1. Settings → SIP Trunk (Provayder)
2. Yangi trunk yaratish
3. Agar "muvaffaqiyatli yaratildi" xabari chiqsa, ruxsat muammosi hal qilingan

## 📋 Checklist

- [ ] `/etc/asterisk/pjsip.conf` fayli mavjud
- [ ] Ruxsatlar to'g'ri (`664` yoki `666`)
- [ ] Fayl yozishga ruxsat bor
- [ ] Backend restart qilindi
- [ ] SIP Trunk test qilindi

## 🎯 Alternativ Yechim

Agar ruxsat muammosi hal qilinmasa, backend da fayl yozish o'rniga konfiguratsiyani qaytarish va qo'lda yangilash mumkin. Bu hozirgi holatda ishlayapti.

