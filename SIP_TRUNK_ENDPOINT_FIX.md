# SIP Trunk Endpoint Muammosini Hal Qilish

## Muammo
```
ERROR: Could not create dialog to invalid URI 'SIPnomer'. Is endpoint registered and reachable?
```

Bu muammo trunk endpoint konfiguratsiyasida bo'lishi mumkin.

## Yechim

### 1. Endpoint Holatini Tekshirish

```bash
sudo asterisk -rx "pjsip show endpoint SIPnomer"
```

### 2. PJSIP Config ni Tekshirish

```bash
sudo cat /etc/asterisk/pjsip.conf | grep -A 30 "\[SIPnomer\]"
```

### 3. To'g'ri Config Format

Trunk endpoint uchun quyidagi konfiguratsiya bo'lishi kerak:

```ini
[SIPnomer]
type = aor
contact = sip:998785553322@bell.uz:5060
qualify_frequency = 0
maximum_expiration = 3600

[SIPnomer]
type = endpoint
context = outbound
disallow = all
allow = ulaw
allow = alaw
allow = g729
direct_media = no
transport = transport-udp
aors = SIPnomer
auth = SIPnomer-auth
outbound_auth = SIPnomer-auth
rtp_symmetric = yes
force_rport = yes
rewrite_contact = yes
trust_id_inbound = yes
send_rpid = yes
rtp_ipv6 = no
use_avpf = no
media_encryption = no
dtmf_mode = rfc4733

[SIPnomer-auth]
type = auth
auth_type = userpass
username = 998785553322
password = <parol>

[SIPnomer-identify]
type = identify
endpoint = SIPnomer
match = bell.uz
```

### 4. Muhim O'zgarishlar

1. **context = outbound** - Qo'ng'iroqlar `outbound` kontekstiga yo'naltiriladi
2. **qualify_frequency = 0** - Qualify o'chirilgan (Bell.uz uchun kerak emas)
3. **outbound_auth** - Chiquvchi qo'ng'iroqlar uchun auth kerak

### 5. Config ni Yangilash

```bash
# Backup yaratish
sudo cp /etc/asterisk/pjsip.conf /etc/asterisk/pjsip.conf.backup

# Config ni tahrirlash
sudo nano /etc/asterisk/pjsip.conf

# PJSIP reload
sudo asterisk -rx "pjsip reload"
```

### 6. Test Qo'ng'iroq

**ARI orqali (tavsiya etiladi):**
```bash
curl -u backend:secure_password -X POST \
  "http://localhost:8088/ari/channels?endpoint=PJSIP/998909429271@SIPnomer&app=call-center&appArgs=chiquvchi,998909429271,998909429271&callerId=998909429271"
```

**Yoki Asterisk CLI da:**
```bash
sudo asterisk -rvvv
channel originate PJSIP/998909429271@SIPnomer application Playback hello-world
```

### 7. Backend API orqali

```bash
curl -X POST https://crm24.soundz.uz/api/calls/outbound \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "fromNumber": "998909429271",
    "toNumber": "998909429271"
  }'
```

## Muammo Davom Etsa

1. **Endpoint ni to'liq tekshirish:**
   ```bash
   sudo asterisk -rx "pjsip show endpoint SIPnomer"
   ```

2. **AOR ni tekshirish:**
   ```bash
   sudo asterisk -rx "pjsip show aor SIPnomer"
   ```

3. **Transport ni tekshirish:**
   ```bash
   sudo asterisk -rx "pjsip show transports"
   ```

4. **Loglarni tekshirish:**
   ```bash
   sudo tail -f /var/log/asterisk/full | grep -i "SIPnomer\|PJSIP"
   ```

