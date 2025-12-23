# SIP Trunk Auth Nomini To'g'rilash

## Muammo
- Trunk nomi `SIPnomer` ga o'zgartirilgan
- Lekin auth nomi hali ham `SIP nomer-auth` (bo'sh joy bilan)
- Bu muammo yaratmoqda

## Yechim

### 1. Script orqali (tavsiya etiladi):

```bash
cd /var/www/call-center
chmod +x fix_sip_trunk_auth.sh
sudo ./fix_sip_trunk_auth.sh
```

### 2. Yoki qo'lda:

```bash
# Backup yaratish
sudo cp /etc/asterisk/pjsip.conf /etc/asterisk/pjsip.conf.backup

# Auth nomini to'g'rilash
sudo sed -i 's/\[SIP nomer-auth\]/[SIPnomer-auth]/g' /etc/asterisk/pjsip.conf

# PJSIP reload
sudo asterisk -rx "pjsip reload"
```

### 3. Tekshirish:

```bash
# Auth nomini tekshirish
sudo asterisk -rx "pjsip show auths" | grep -i "SIP"

# Endpoint holatini tekshirish
sudo asterisk -rx "pjsip show endpoints" | grep -i "SIPnomer"
```

## To'g'ri Config Format:

```ini
[SIPnomer]
type = aor
contact = sip:998785553322@bell.uz:5060
qualify_frequency = 60
maximum_expiration = 3600

[SIPnomer]
type = endpoint
context = from-external
disallow = all
allow = ulaw
allow = alaw
allow = g729
direct_media = no
transport = transport-udp
aors = SIPnomer
auth = SIPnomer-auth          # ← To'g'ri nom
outbound_auth = SIPnomer-auth # ← To'g'ri nom
rtp_symmetric = yes
force_rport = yes
rewrite_contact = yes
trust_id_inbound = yes
send_rpid = yes

[SIPnomer-auth]                # ← To'g'ri nom (bo'sh joy yo'q)
type = auth
auth_type = userpass
username = 998785553322
password = mp3jeFJ8

[SIPnomer-identify]
type = identify
endpoint = SIPnomer
match = bell.uz
```

## Qo'ng'iroq Qilish

Auth nomini to'g'rilagandan keyin, dialplan da trunk nomini ishlating:

```ini
[outbound]
exten => _998X.,1,NoOp(Chiquvchi qo'ng'iroq trunk orqali: ${EXTEN})
 same => n,Dial(PJSIP/${EXTEN}@SIPnomer,30)
 same => n,Hangup()
```

Keyin:
```bash
sudo asterisk -rx "dialplan reload"
```

## Test Qo'ng'iroq:

```bash
sudo asterisk -rvvv
channel originate PJSIP/998901234567@SIPnomer application Playback hello-world
```

