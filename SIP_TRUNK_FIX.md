# SIP Trunk Avtomatik Yangilash Fix

## 🔍 Muammo

SIP trunk yaratilganda database ga saqlanadi, lekin `pjsip.conf` faylini avtomatik yangilay olmayapti va qo'lda qo'shish kerak deyapti.

## ✅ Yechim

### 1. Permissions Fix Scriptni Ishga Tushirish

Serverda quyidagilarni bajaring:

```bash
ssh root@152.53.229.176
cd /var/www/call-center
git pull origin main
chmod +x fix_sip_trunk_permissions.sh
./fix_sip_trunk_permissions.sh
```

Yoki qo'lda:

```bash
# Backend user ni aniqlash
BACKEND_USER=$(ps aux | grep "node.*main.js" | grep -v grep | head -1 | awk '{print $1}')
echo "Backend user: $BACKEND_USER"

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

### 2. Backend Kodini Yangilash

Backend kodida `SipTrunkService` avtomatik ravishda:
1. Database ga saqlaydi
2. `pjsip.conf` faylini yangilaydi (agar permissions to'g'ri bo'lsa)
3. Agar yozib bo'lmasa, sudo orqali yozishga harakat qiladi
4. Asterisk ni reload qiladi

### 3. Frontend Formani Yaxshilash

Frontend da form:
- Nomi (required)
- Server IP yoki Domain (required)
- Login (required)
- Password (required)
- Port (optional, default: 5060)
- Transport (optional, default: UDP)

## 🧪 Test Qilish

### 1. Permissions Tekshirish

```bash
# Backend user asterisk guruhida ekanligini tekshiring
groups $(ps aux | grep "node.*main.js" | grep -v grep | head -1 | awk '{print $1}')

# pjsip.conf permissions ni tekshiring
ls -la /etc/asterisk/pjsip.conf
```

### 2. SIP Trunk Yaratish

1. Browser da: `https://crm24.soundz.uz/settings`
2. "SIP Trunk (Provayder)" tab ni oching
3. Quyidagi ma'lumotlarni kiriting:
   - Nomi: `Kerio`
   - Server IP: `90.156.199.92`
   - Login: `21441`
   - Password: `Ni3bz8iYDTaH9qME`
4. "Trunk Yaratish" ni bosing

### 3. Tekshirish

```bash
# pjsip.conf faylida trunk ko'rinishini tekshiring
sudo grep -A 20 "\[Kerio\]" /etc/asterisk/pjsip.conf

# Asterisk da trunk holatini tekshiring
sudo asterisk -rx "pjsip show endpoints Kerio"
```

## 📋 Checklist

- [ ] Permissions fix script ishga tushirildi
- [ ] Backend user asterisk guruhiga qo'shildi
- [ ] pjsip.conf permissions sozlandi
- [ ] /etc/asterisk papkasiga yozish ruxsati berildi
- [ ] PM2 restart qilindi
- [ ] Frontend da SIP trunk yaratildi
- [ ] pjsip.conf faylida trunk ko'rinadi
- [ ] Asterisk da trunk ishlayapti

## 🔧 Agar Hali Ham Muammo Bo'lsa

### Manual Yozish

Agar avtomatik yozish ishlamasa, backend loglarida konfiguratsiya ko'rsatiladi va uni qo'lda qo'shishingiz mumkin.

### Sudo Password

Agar sudo password kerak bo'lsa, `sudoers` faylini sozlang:

```bash
sudo visudo
# Quyidagini qo'shing:
# www-data ALL=(ALL) NOPASSWD: /bin/cp /tmp/pjsip_* /etc/asterisk/pjsip.conf
# www-data ALL=(ALL) NOPASSWD: /bin/chown asterisk:asterisk /etc/asterisk/pjsip.conf
# www-data ALL=(ALL) NOPASSWD: /bin/chmod 664 /etc/asterisk/pjsip.conf
# www-data ALL=(ALL) NOPASSWD: /usr/bin/asterisk -rx *
```
