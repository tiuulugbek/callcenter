# Transport Muammosi - Hal Qilish

## Muammo
```
ERROR: Transport 'Kerio-transport' could not be started: Address already in use
```

Bu shuni anglatadiki, transport allaqachon yaratilgan.

## Yechim

### Variant 1: Mavjud Transport ni Ishlatish

Kerio endpoint uchun mavjud `transport-udp` ni ishlatish:

```bash
sudo nano /etc/asterisk/pjsip.conf
```

Kerio endpoint da `transport = transport-udp` qo'shing:

```ini
[Kerio]
type = endpoint
context = from-external
disallow = all
allow = ulaw
allow = alaw
allow = g729
direct_media = no
transport = transport-udp  # Kerio-transport o'rniga
aors = Kerio
auth = Kerio-auth
outbound_auth = Kerio-auth
```

### Variant 2: Kerio-transport ni O'chirish

Agar Kerio-transport kerak bo'lmasa, uni o'chirish:

```bash
sudo nano /etc/asterisk/pjsip.conf
```

`[Kerio-transport]` section ni o'chirish yoki comment qilish.

### Variant 3: Asterisk ni To'liq Restart

```bash
# Asterisk ni to'xtatish
systemctl stop asterisk

# Qayta ishga tushirish
systemctl start asterisk

# Yoki
asterisk -rx "core stop now"
asterisk -rx "core start now"
```

## To'g'ri Konfiguratsiya

```ini
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
transport = transport-udp  # Mavjud transport ni ishlatish
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
asterisk -rx "core reload"
```

## Tekshirish

```bash
# Endpoint mavjudmi?
asterisk -rx "pjsip show endpoints Kerio"

# Transport mavjudmi?
asterisk -rx "pjsip show transports"
```

## Qo'ng'iroq Kelganda

Qo'ng'iroq kelganda:
- Asterisk CLI da `core show channels` da ko'rinadi
- Backend loglarda `StasisStart` event ko'rinadi
- Database da `Call` yaratiladi

## Test

```bash
# Real-time monitoring
asterisk -rvvv

# Yoki backend loglar
pm2 logs call-center-backend
```

