# SIP Trunk Fix - Avtomatik Yangilash

## ✅ O'zgarishlar

### 1. Transport Muammosi Hal Qilindi

- Har bir trunk uchun alohida transport yaratilmaydi
- Mavjud `transport-udp` va `transport-tcp` dan foydalaniladi
- Transport muammosi hal qilindi

### 2. Avtomatik pjsip.conf Yangilash

- Trunk yaratganda avtomatik pjsip.conf fayli yangilanadi
- Backup avtomatik yaratiladi
- Asterisk avtomatik reload qilinadi

### 3. Xatoliklar Yaxshilandi

- Xatoliklar aniq ko'rsatiladi
- Manual yangilash kerak bo'lsa, konfiguratsiya ko'rsatiladi

## 🔧 Qanday Ishlaydi

1. **Trunk Yaratish:**
   - Nomi, Server IP, Username, Password kiritiladi
   - Port va Transport (ixtiyoriy, default: 5060, UDP)

2. **Avtomatik Yangilash:**
   - pjsip.conf fayli avtomatik yangilanadi
   - Backup yaratiladi
   - Asterisk reload qilinadi

3. **Xatolik Bo'lsa:**
   - Konfiguratsiya ko'rsatiladi
   - Qo'lda yangilash uchun ko'rsatma beriladi

## 📋 Qo'llash

### Serverda Ruxsatlar

```bash
# Asterisk config faylini yozish uchun ruxsat
sudo chmod 664 /etc/asterisk/pjsip.conf
sudo chown asterisk:asterisk /etc/asterisk/pjsip.conf

# Yoki backend user ga ruxsat
sudo usermod -aG asterisk www-data
```

### Backend Restart

```bash
cd /var/www/call-center/backend
npm run build
pm2 restart call-center-backend --update-env
```

## 🎯 Ishlatish

1. **Settings → SIP Trunk (Provayder)**
2. **Yangi SIP Trunk Yaratish:**
   - Trunk Nomi: `kerio-control` (lotin harflar, tire)
   - Server IP: `90.156.199.92`
   - Username: `21441`
   - Password: `Ni3bz8iYDTaH9qME`
   - Port: `5060` (default)
   - Transport: `UDP` (default)

3. **Trunk Yaratish** tugmasini bosing

4. **Tekshirish:**
   ```bash
   asterisk -rx "pjsip show endpoints"
   asterisk -rx "pjsip reload"
   ```

## ✅ Natija

- ✅ Trunk avtomatik yaratiladi
- ✅ pjsip.conf avtomatik yangilanadi
- ✅ Asterisk avtomatik reload qilinadi
- ✅ Ma'lumotlar saqlanadi

## 🐛 Muammolar

### Ruxsat Muammosi

Agar "pjsip.conf faylini qo'lda yangilang" xabari chiqsa:

```bash
# Ruxsatlarni tekshiring
ls -la /etc/asterisk/pjsip.conf

# Ruxsat berish
sudo chmod 664 /etc/asterisk/pjsip.conf
sudo chown asterisk:asterisk /etc/asterisk/pjsip.conf
```

### Asterisk Reload Xatosi

Agar Asterisk reload qilinmasa:

```bash
# Qo'lda reload
asterisk -rx "pjsip reload"
```

