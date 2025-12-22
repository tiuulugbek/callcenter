# Kerio Endpoint Muammosi - Final Yechim

## Muammo
```
[Kerio](!)  <- Bu template, endpoint emas!
```

`(!)` belgisi template degani. Endpoint uchun template emas, to'g'ridan-to'g'ri endpoint bo'lishi kerak.

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

**O'zgarishlar:**
- `[Kerio](!)` → `[Kerio]` (template belgisini olib tashlash)
- `transport = Kerio-transport` qo'shish
- `[Kerio-identify]` nomini o'zgartirish

## Asterisk ni Reload

```bash
asterisk -rx "core reload"
```

## Tekshirish

```bash
# Endpoint mavjudmi?
asterisk -rx "pjsip show endpoints"

# Kerio endpoint
asterisk -rx "pjsip show endpoints Kerio"

# AOR
asterisk -rx "pjsip show aors Kerio"
```

## Inbound Call Test

```bash
# Real-time loglar
asterisk -rvvv

# Yoki backend loglar
pm2 logs call-center-backend
```

Qo'ng'iroq kelganda loglarda ko'rinishi kerak.

