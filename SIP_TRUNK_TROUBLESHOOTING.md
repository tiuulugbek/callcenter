# SIP Trunk Troubleshooting Guide

## Trunk Holatini Tekshirish

### 1. CLI ichida tekshirish:

```bash
sudo asterisk -rvvv

# CLI ichida quyidagi buyruqlarni bajarish:
pjsip show endpoints
pjsip show registrations
pjsip show aors
pjsip show auths
pjsip show transports
```

### 2. Yoki buyruqlarni to'g'ridan-to'g'ri bajarish:

```bash
sudo asterisk -rx "pjsip show endpoints"
sudo asterisk -rx "pjsip show registrations"
sudo asterisk -rx "pjsip show aors"
sudo asterisk -rx "pjsip show auths"
```

## Muammolarni Hal Qilish

### Muammo 1: Trunk "Unavailable" holatida

**Sabab:** Trunk nomida bo'sh joy yoki maxsus belgilar bor

**Yechim:**
1. Settings sahifasida trunk ni o'chiring
2. Yangi trunk yarating (bo'sh joy yo'q):
   - Nomi: `BellUZ` yoki `SIPnomer`
   - Boshqa ma'lumotlar bir xil

### Muammo 2: Trunk registratsiya qilinmagan

**Sabab:** Bell.uz ga registratsiya qilinmagan (outbound registration kerak emas)

**Tekshirish:**
```bash
# Bell.uz trunk uchun registratsiya kerak emas
# Faqat outbound qo'ng'iroqlar uchun ishlatiladi
pjsip show endpoints
# Trunk "Available" holatida bo'lishi kerak
```

### Muammo 3: Contact "NonQual" holatida

**Sabab:** Qualify muammosi

**Yechim:**
```bash
# PJSIP config da qualify_frequency ni tekshirish
sudo cat /etc/asterisk/pjsip.conf | grep -A 5 "qualify"

# Agar kerak bo'lsa, qualify ni o'chirish:
# qualify_frequency = 0
```

### Muammo 4: OPTIONS request muammosi

**Sabab:** Transport yoki network muammosi

**Yechim:**
```bash
# Transport ni tekshirish
pjsip show transports

# Firewall ni tekshirish
sudo iptables -L | grep 5060
sudo ufw status | grep 5060
```

## Trunk Sozlash (To'g'ri Format)

### PJSIP Config misoli:

```ini
[BellUZ]
type = aor
contact = sip:998785553322@bell.uz:5060
qualify_frequency = 0
maximum_expiration = 3600

[BellUZ]
type = endpoint
context = from-external
disallow = all
allow = ulaw
allow = alaw
allow = g729
direct_media = no
transport = transport-udp
aors = BellUZ
auth = BellUZ-auth
outbound_auth = BellUZ-auth
rtp_symmetric = yes
force_rport = yes
rewrite_contact = yes
trust_id_inbound = yes
send_rpid = yes

[BellUZ-auth]
type = auth
auth_type = userpass
password = <parol>
username = 998785553322

[BellUZ-identify]
type = identify
endpoint = BellUZ
match = bell.uz
```

## Qo'ng'iroq Qilish

### Dialplan sozlash:

```ini
[outbound]
exten => _998X.,1,NoOp(Chiquvchi qo'ng'iroq BellUZ trunk orqali: ${EXTEN})
 same => n,Dial(PJSIP/${EXTEN}@BellUZ,30)
 same => n,Hangup()
```

### Dialplan reload:

```bash
sudo asterisk -rx "dialplan reload"
```

### Test qo'ng'iroq:

```bash
# Asterisk CLI da
channel originate PJSIP/998901234567@BellUZ application Playback hello-world
```

## Tekshirish Scripti

```bash
chmod +x check_sip_trunk.sh
./check_sip_trunk.sh
```

