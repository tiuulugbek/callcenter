# Dialplan va Qo'ng'iroq Qilish Fix

## Muammo
Telefon ishlamayapti - qo'ng'iroq qilishda muammo bor.

## Yechim

### 1. Dialplan ni Yangilash

Serverni yangilash:

```bash
cd /var/www/call-center

# Git pull
git pull origin main

# Dialplan ni yangilash
sudo cp asterisk-config/extensions.conf /etc/asterisk/extensions.conf

# Dialplan ni reload qilish
sudo asterisk -rx "dialplan reload"
```

### 2. Backend ni Yangilash

```bash
cd /var/www/call-center/backend

# Build va restart
npm run build
pm2 restart call-center-backend

# Loglarni tekshirish
pm2 logs call-center-backend --lines 50
```

### 3. Test Qo'ng'iroq

```bash
cd /var/www/call-center
./test_call_api.sh 998909429271 998909429271
```

## O'zgarishlar

1. **StasisStart eventida trunk orqali qo'ng'iroq qilish** - chiquvchi qo'ng'iroqlar uchun trunk orqali qo'ng'iroq qilish funksiyasi qo'shildi
2. **Bridge qilish** - ikkala channel ni bridge qilish funksiyasi qo'shildi
3. **Error handling** - trunk orqali qo'ng'iroq qilishda muammo bo'lsa ham recording boshlanadi

## Muhim

- Dialplan ni yangilash kerak
- Backend ni rebuild qilish kerak
- SIP trunk "Available" bo'lishi kerak
- ARI authentication ishlashi kerak

## Tekshirish

```bash
# SIP trunk holatini tekshirish
sudo asterisk -rx "pjsip show endpoints SIPnomer"

# Dialplan ni tekshirish
sudo asterisk -rx "dialplan show outbound"

# Backend loglarni ko'rish
pm2 logs call-center-backend --lines 50

# Asterisk loglarni ko'rish
sudo tail -f /var/log/asterisk/full | grep -i "call\|pjsip\|bridge"
```

