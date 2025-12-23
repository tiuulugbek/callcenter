# SIP Trunk Registratsiya Muammosini Hal Qilish

## Muammo
- Trunk "SIP nomer" nomi bilan yaratilgan, lekin registratsiya qilinmagan
- Contact status "NonQual" - trunk to'g'ri ishlamayapti
- OPTIONS request yaratib bo'lmayapti

## Yechim

### 1. Trunk Nomini To'g'rilash

Trunk nomida bo'sh joy bo'lmasligi kerak. Settings sahifasida trunk nomini yangilang:

**Eski nom:** `SIP nomer` ❌
**Yangi nom:** `SIP-nomer` yoki `SIPnomer` yoki `BellUZ` ✅

### 2. PJSIP Config ni Tekshirish

```bash
sudo cat /etc/asterisk/pjsip.conf | grep -A 30 "SIP nomer"
```

### 3. Trunk Config ni To'g'rilash

Muammo: Trunk nomida bo'sh joy bor va bu PJSIP da muammo yaratmoqda.

**Yechim 1: Trunk ni qayta yaratish (tavsiya etiladi)**

1. Settings sahifasida eski trunk ni o'chiring
2. Yangi trunk yarating:
   - **Nomi**: `BellUZ` (bo'sh joy yo'q)
   - **SIP Server**: `bell.uz`
   - **Login**: `998785553322`
   - **Password**: Bell.uz paroli
   - **Port**: `5060`
   - **Transport**: `UDP`

**Yechim 2: Config ni qo'lda tuzatish**

```bash
sudo nano /etc/asterisk/pjsip.conf
```

Trunk nomini `SIP nomer` dan `SIPnomer` ga o'zgartiring:

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
auth = SIPnomer-auth
outbound_auth = SIPnomer-auth
rtp_symmetric = yes
force_rport = yes
rewrite_contact = yes
trust_id_inbound = yes
send_rpid = yes

[SIPnomer-auth]
type = auth
auth_type = userpass
password = <parol>
username = 998785553322
```

Keyin:
```bash
sudo asterisk -rx "pjsip reload"
```

### 4. Trunk Registratsiyasini Tekshirish

```bash
sudo asterisk -rvvv
pjsip show endpoints
pjsip show registrations
```

Trunk "Registered" holatida bo'lishi kerak.

### 5. Muammo Davom Etsa

**A. Transport tekshirish:**
```bash
pjsip show transports
```

**B. AOR tekshirish:**
```bash
pjsip show aors
```

**C. Auth tekshirish:**
```bash
pjsip show auths
```

**D. Loglarni tekshirish:**
```bash
sudo tail -f /var/log/asterisk/full | grep -i "SIP\|pjsip\|bell"
```

### 6. Trunk Nomini To'g'rilash (Backend Kodida)

Backend kodida trunk nomini tozalash funksiyasi mavjud, lekin u faqat lotin harflar, raqamlar va tire qoldiradi. Bo'sh joylarni olib tashlaydi.

**Tavsiya:** Trunk nomini yangilashda bo'sh joylarni olib tashlang:
- `SIP nomer` → `SIPnomer` yoki `SIP-nomer`
- Yoki `BellUZ` kabi oddiy nom ishlating

### 7. Qo'ng'iroq Qilish

Trunk registratsiya qilingandan keyin, dialplan da trunk nomini ishlating:

```ini
[outbound]
exten => _998X.,1,Dial(PJSIP/${EXTEN}@SIPnomer,30)
```

Yoki yangi trunk nomi bilan:
```ini
[outbound]
exten => _998X.,1,Dial(PJSIP/${EXTEN}@BellUZ,30)
```

## Tekshirish

1. **Trunk holatini tekshirish:**
   ```bash
   pjsip show endpoints
   # Trunk "Available" yoki "Registered" holatida bo'lishi kerak
   ```

2. **Registratsiyani tekshirish:**
   ```bash
   pjsip show registrations
   # Trunk registratsiya qilinganini ko'rish kerak
   ```

3. **Qo'ng'iroq qilish:**
   ```bash
   # Asterisk CLI da test qilish
   channel originate PJSIP/998901234567@SIPnomer application Playback hello-world
   ```
