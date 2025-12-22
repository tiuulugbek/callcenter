# Asterisk Directory Fix

## 🔍 Muammo

Xatolik: "Config directory not found: /etc/asterisk"

Bu shuni anglatadiki:
- `/etc/asterisk` papkasi mavjud emas yoki
- Backend user papkaga kirish huquqiga ega emas

## ✅ Yechim

### 1. Asterisk Directory Fix Scriptni Ishga Tushirish

Serverda quyidagilarni bajaring:

```bash
ssh root@152.53.229.176
cd /var/www/call-center
git pull origin main
chmod +x fix_asterisk_directory.sh
./fix_asterisk_directory.sh
```

### 2. Qo'lda Fix

Agar script ishlamasa, qo'lda:

```bash
# Asterisk papkasini yaratish
sudo mkdir -p /etc/asterisk
sudo chown asterisk:asterisk /etc/asterisk
sudo chmod 775 /etc/asterisk

# pjsip.conf faylini yaratish (agar mavjud bo'lmasa)
sudo touch /etc/asterisk/pjsip.conf
sudo chown asterisk:asterisk /etc/asterisk/pjsip.conf
sudo chmod 664 /etc/asterisk/pjsip.conf

# Backend user ni asterisk guruhiga qo'shish
BACKEND_USER=$(ps aux | grep "node.*main.js" | grep -v grep | head -1 | awk '{print $1}')
sudo usermod -a -G asterisk $BACKEND_USER

# PM2 restart
pm2 restart call-center-backend
```

### 3. Backend Kodini Yangilash

Backend kodida avtomatik ravishda:
- Config papkasini tekshiradi
- Agar mavjud bo'lmasa, yaratishga harakat qiladi
- Permissions ni sozlashga harakat qiladi

## 🧪 Test Qilish

### 1. Directory Tekshirish

```bash
# Asterisk papkasi mavjudligini tekshiring
ls -la /etc/asterisk

# Permissions ni tekshiring
ls -ld /etc/asterisk
```

### 2. SIP Trunk Yaratish

1. Browser da: `https://crm24.soundz.uz/settings`
2. "SIP Trunk (Provayder)" tab ni oching
3. Trunk yarating
4. Agar muvaffaqiyatli bo'lsa, "success" xabari ko'rinadi

### 3. Backend Loglar

```bash
pm2 logs call-center-backend --err --lines 30
```

## 📋 Checklist

- [ ] Asterisk papkasi yaratildi
- [ ] Asterisk papkasi permissions sozlandi
- [ ] pjsip.conf fayl mavjud yoki yaratildi
- [ ] Backend user asterisk guruhiga qo'shildi
- [ ] PM2 restart qilindi
- [ ] SIP Trunk yaratish test qilindi
- [ ] Avtomatik yangilash ishlayapti

## 🔧 Agar Hali Ham Muammo Bo'lsa

### Asterisk O'rnatilganligini Tekshirish

```bash
# Asterisk o'rnatilganligini tekshiring
which asterisk
asterisk -V

# Agar o'rnatilmagan bo'lsa, o'rnating
sudo apt-get update
sudo apt-get install -y asterisk
```

### Config Faylini Qo'lda Yaratish

```bash
# pjsip.conf faylini yaratish
sudo touch /etc/asterisk/pjsip.conf
sudo chown asterisk:asterisk /etc/asterisk/pjsip.conf
sudo chmod 664 /etc/asterisk/pjsip.conf

# Asosiy konfiguratsiyani qo'shish
sudo tee /etc/asterisk/pjsip.conf > /dev/null <<EOF
[transport-udp]
type=transport
protocol=udp
bind=0.0.0.0:5060
EOF

sudo chown asterisk:asterisk /etc/asterisk/pjsip.conf
```

