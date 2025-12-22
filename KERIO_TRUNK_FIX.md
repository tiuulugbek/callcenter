# Kerio SIP Trunk - To'g'ri Sozlash

## Hozirgi Konfiguratsiya Muammolari

1. `[Kerio](!)` ikki marta ishlatilgan
2. Transport endpoint da ishlatilmagan
3. Identify section noto'g'ri

## To'g'ri Konfiguratsiya

```bash
sudo nano /etc/asterisk/pjsip.conf
```

Quyidagiga o'zgartiring:

```ini
; SIP Trunk: Kerio
; Generated automatically

[Kerio-transport]
type = transport
protocol = udp
bind = 0.0.0.0

[Kerio]
type = aor
contact = sip:21441@90.156.199.92:5060

[Kerio]
type = endpoint
context = from-external
disallow = all
allow = ulaw
allow = alaw
allow = g729
direct_media = no
transport = Kerio-transport
aors = Kerio
auth = Kerio-auth
outbound_auth = Kerio-auth

[Kerio-auth]
type = auth
auth_type = userpass
username = 21441
password = Ni3bz8iYDTaH9qME

[Kerio-identify]
type = identify
endpoint = Kerio
match = 90.156.199.92
```

## Asterisk ni Reload

```bash
# Asterisk CLI ga kirish
asterisk -rvvv

# Yoki reload
asterisk -rx "core reload"
```

## Inbound Calllarni Tekshirish

### 1. SIP Trunk Status

```bash
# Asterisk CLI da
asterisk -rx "pjsip show endpoints"
asterisk -rx "pjsip show aors"
asterisk -rx "pjsip show endpoints Kerio"
```

### 2. Real-time Loglar

```bash
# Asterisk loglar
tail -f /var/log/asterisk/full

# Yoki Asterisk CLI da
asterisk -rvvv
```

### 3. Backend Loglar

```bash
# Backend loglar (real-time)
pm2 logs call-center-backend
```

### 4. Qo'ng'iroq Kelganda

Qo'ng'iroq kelganda:
- Asterisk loglarda ko'rinadi
- Backend loglarda `StasisStart` event ko'rinadi
- Database da `Call` yaratiladi

## Test Qo'ng'iroq

### 1. Test Qo'ng'iroq Qilish

Kerio dan test qo'ng'iroq qiling yoki boshqa telefon orqali qo'ng'iroq qiling.

### 2. Loglarni Ko'rish

```bash
# Asterisk loglar
tail -f /var/log/asterisk/full

# Backend loglar
pm2 logs call-center-backend
```

### 3. Database Tekshirish

```bash
# Qo'ng'iroqlar yaratilganini tekshirish
sudo -u postgres psql -d callcenter -c "SELECT * FROM calls ORDER BY created_at DESC LIMIT 5;"
```

## Muammolar

### Qo'ng'iroq Kelmayapti

```bash
# SIP Trunk status
asterisk -rx "pjsip show endpoints Kerio"

# Registration tekshirish
asterisk -rx "pjsip show registrations"

# Loglar
tail -f /var/log/asterisk/full | grep Kerio
```

### Backend ga Kelmayapti

```bash
# ARI ishlayaptimi?
asterisk -rx "ari show status"

# Stasis app ishlayaptimi?
asterisk -rx "stasis show applications"

# Backend loglar
pm2 logs call-center-backend
```

### Dialplan Ishlamayapti

```bash
# Dialplan tekshirish
asterisk -rx "dialplan show from-external"

# Context tekshirish
asterisk -rx "dialplan show from-external@default"
```

## To'liq Tekshirish

```bash
# 1. SIP Trunk status
asterisk -rx "pjsip show endpoints Kerio"

# 2. Dialplan
asterisk -rx "dialplan show from-external"

# 3. ARI status
asterisk -rx "ari show status"

# 4. Backend loglar
pm2 logs call-center-backend

# 5. Real-time monitoring
asterisk -rvvv
```

