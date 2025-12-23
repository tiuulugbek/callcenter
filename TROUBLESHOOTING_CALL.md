# Qo'ng'iroq Qilish Muammosini Hal Qilish

## Muammo
Telefon ishlamayapti - qo'ng'iroq qilishda muammo bor.

## Tekshirish

### 1. Backend Loglarni Tekshirish

```bash
pm2 logs call-center-backend --lines 100 | grep -i "call\|error\|stasis"
```

### 2. Asterisk Loglarni Tekshirish

```bash
sudo tail -f /var/log/asterisk/full | grep -i "call\|pjsip\|sipnomer\|outbound"
```

### 3. SIP Trunk Holatini Tekshirish

```bash
sudo asterisk -rx "pjsip show endpoints" | grep -i "SIPnomer"
sudo asterisk -rx "pjsip show aors" | grep -i "SIPnomer"
sudo asterisk -rx "pjsip show contacts" | grep -i "SIPnomer"
```

### 4. Dialplan ni Tekshirish

```bash
sudo asterisk -rx "dialplan show outbound"
```

### 5. ARI Authentication Tekshirish

```bash
curl -u backend:CallCenter2025 http://localhost:8088/ari/asterisk/info
```

### 6. Qo'ng'iroq Qilish Test

```bash
cd /var/www/call-center
./test_call_api.sh 998909429271 998909429271
```

## Muammo Tuzatish

### Muammo 1: SIP Trunk Ishlayaptimi?

```bash
# SIP trunk holatini tekshirish
sudo asterisk -rx "pjsip show endpoints SIPnomer"

# Agar "Unavailable" bo'lsa:
# 1. SIP trunk config ni tekshirish
sudo nano /etc/asterisk/pjsip.conf | grep -A 20 "SIPnomer"

# 2. SIP trunk ni reload qilish
sudo asterisk -rx "pjsip reload"

# 3. SIP trunk ni test qilish
sudo asterisk -rx "pjsip qualify SIPnomer"
```

### Muammo 2: Dialplan To'g'rimi?

```bash
# Dialplan ni tekshirish
sudo asterisk -rx "dialplan show outbound"

# Agar dialplan yo'q bo'lsa:
sudo nano /etc/asterisk/extensions.conf

# Dialplan ni reload qilish
sudo asterisk -rx "dialplan reload"
```

### Muammo 3: ARI Ishlayaptimi?

```bash
# ARI config ni tekshirish
sudo cat /etc/asterisk/ari.conf

# ARI ni reload qilish
sudo asterisk -rx "module reload res_ari"

# ARI authentication test
curl -u backend:CallCenter2025 http://localhost:8088/ari/asterisk/info
```

### Muammo 4: Backend Kod Muammosi?

```bash
# Backend loglarni tekshirish
pm2 logs call-center-backend --lines 100

# Backend ni restart qilish
pm2 restart call-center-backend

# Backend kodini tekshirish
cd /var/www/call-center/backend
npm run build
pm2 restart call-center-backend
```

## To'liq Test

```bash
# 1. SIP trunk holatini tekshirish
sudo asterisk -rx "pjsip show endpoints SIPnomer"

# 2. Dialplan ni tekshirish
sudo asterisk -rx "dialplan show outbound"

# 3. ARI authentication test
curl -u backend:CallCenter2025 http://localhost:8088/ari/asterisk/info

# 4. Qo'ng'iroq qilish test
cd /var/www/call-center
./test_call_api.sh 998909429271 998909429271

# 5. Backend loglarni real-time ko'rish
pm2 logs call-center-backend --lines 50

# 6. Asterisk loglarni real-time ko'rish
sudo tail -f /var/log/asterisk/full
```

## Muhim

- SIP trunk "Available" bo'lishi kerak
- Dialplan to'g'ri bo'lishi kerak
- ARI authentication ishlashi kerak
- Backend kod to'g'ri bo'lishi kerak

