# Trunk Endpoint Config To'g'rilash

## Muammo
```
ERROR: Could not create dialog to invalid URI 'SIPnomer'
```

## Yechim - Serverni Yangilash

### 1. Git Pull va Backend Build

```bash
cd /var/www/call-center
git pull origin main
cd backend
npm install
npm run build
pm2 restart call-center-backend
```

### 2. Mavjud Trunk ni Qayta Yaratish

**Settings sahifasida:**
1. Eski trunk ni o'chiring
2. Yangi trunk yarating:
   - Nomi: `SIPnomer` (yoki `BellUZ`)
   - SIP Server: `bell.uz`
   - Login: `998785553322`
   - Password: Bell.uz paroli
   - Port: `5060`
   - Transport: `UDP`

Bu yangi config ni yaratadi:
- `context = outbound` (chiquvchi qo'ng'iroqlar uchun)
- `qualify_frequency = 0` (Bell.uz uchun kerak emas)
- `from_user` va `from_domain` qo'shilgan

### 3. Yoki Config ni Qo'lda Tuzatish

```bash
sudo nano /etc/asterisk/pjsip.conf
```

`[SIPnomer]` endpoint qismini quyidagicha o'zgartiring:

```ini
[SIPnomer]
type = endpoint
context = outbound          # ← from-external dan outbound ga o'zgartirish
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
from_user = 998785553322    # ← Qo'shish
from_domain = bell.uz        # ← Qo'shish
```

AOR qismida:
```ini
[SIPnomer]
type = aor
contact = sip:998785553322@bell.uz:5060
qualify_frequency = 0        # ← 60 dan 0 ga o'zgartirish
maximum_expiration = 3600
```

Keyin:
```bash
sudo asterisk -rx "pjsip reload"
```

### 4. Test Qo'ng'iroq

**ARI orqali (tavsiya etiladi):**
```bash
curl -u backend:secure_password -X POST \
  "http://localhost:8088/ari/channels?endpoint=PJSIP/998909429271@SIPnomer&app=call-center&appArgs=chiquvchi,998909429271,998909429271&callerId=998909429271"
```

**Yoki Backend API orqali:**
```bash
curl -X POST https://crm24.soundz.uz/api/calls/outbound \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"fromNumber": "998909429271", "toNumber": "998909429271"}'
```

### 5. Tekshirish

```bash
sudo asterisk -rx "pjsip show endpoint SIPnomer"
sudo asterisk -rx "dialplan show outbound"
```

