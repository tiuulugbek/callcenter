# Kerio Endpoint Muammosi - Hal Qilish

## Muammo
```
pjsip show endpoints Kerio
No objects found.
```

AOR mavjud, lekin endpoint topilmayapti.

## Yechim

### 1. PJSIP Konfiguratsiyasini Tekshirish

```bash
sudo nano /etc/asterisk/pjsip.conf
```

Endpoint section ni tekshirish kerak. Quyidagicha bo'lishi kerak:

```ini
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

### 2. Asterisk ni Reload

```bash
asterisk -rx "core reload"
```

### 3. Endpoint ni Tekshirish

```bash
# Barcha endpointlarni ko'rish
asterisk -rx "pjsip show endpoints"

# Kerio endpoint ni tekshirish
asterisk -rx "pjsip show endpoints Kerio"

# AOR ni tekshirish
asterisk -rx "pjsip show aors Kerio"
```

### 4. Konfiguratsiya Xatolarini Tekshirish

```bash
# Asterisk CLI da
asterisk -rvvv

# Yoki
asterisk -rx "pjsip show endpoints" | grep -i error
```

## Muammolar

### Endpoint Yaratilmayapti

```bash
# Konfiguratsiyani tekshirish
sudo cat /etc/asterisk/pjsip.conf | grep -A 20 "\[Kerio\]"

# Asterisk loglar
sudo journalctl -u asterisk -n 50
```

### Transport Muammosi

```bash
# Transport mavjudmi?
asterisk -rx "pjsip show transports"

# Transport ni tekshirish
asterisk -rx "pjsip show transports Kerio-transport"
```

### Context Muammosi

```bash
# Dialplan tekshirish
asterisk -rx "dialplan show from-external"

# Context mavjudmi?
asterisk -rx "dialplan show contexts" | grep from-external
```

## To'liq Tekshirish

```bash
# 1. Konfiguratsiyani tekshirish
sudo cat /etc/asterisk/pjsip.conf | grep -A 30 "Kerio"

# 2. Asterisk reload
asterisk -rx "core reload"

# 3. Endpoint tekshirish
asterisk -rx "pjsip show endpoints"

# 4. AOR tekshirish
asterisk -rx "pjsip show aors Kerio"

# 5. Transport tekshirish
asterisk -rx "pjsip show transports"
```

## Inbound Call Test

Endpoint to'g'ri sozlanganidan keyin:

```bash
# Real-time loglar
asterisk -rvvv

# Yoki
sudo journalctl -u asterisk -f

# Backend loglar
pm2 logs call-center-backend
```

Qo'ng'iroq kelganda loglarda ko'rinishi kerak.

