# Inbound Calls (Kiruvchi Qo'ng'iroqlar) Sozlash

## SIP Trunk ulangan - Endi Inbound Calls ni Sozlash

### 1. Asterisk Dialplan ni Sozlash

```bash
sudo nano /etc/asterisk/extensions.conf
```

Quyidagi konfiguratsiyani qo'shing:

```ini
[from-trunk]
; SIP Trunk dan kelgan qo'ng'iroqlar
exten => _X.,1,NoOp(Inbound call from trunk: ${EXTEN})
exten => _X.,n,Set(CALLERID(name)=${CALLERID(name)})
exten => _X.,n,Set(CALLERID(num)=${CALLERID(num)})
exten => _X.,n,Stasis(inbound-call,${EXTEN})
exten => _X.,n,Hangup()
```

### 2. PJSIP Trunk ni Sozlash

```bash
sudo nano /etc/asterisk/pjsip.conf
```

Trunk uchun quyidagilarni qo'shing:

```ini
[trunk-provider]
type=endpoint
context=from-trunk
disallow=all
allow=ulaw
allow=alaw
allow=gsm
transport=transport-udp
aors=trunk-provider

[trunk-provider]
type=aor
contact=sip:your-provider.com:5060

[trunk-provider]
type=identify
endpoint=trunk-provider
match=your-provider-ip

[trunk-provider]
type=auth
auth_type=userpass
password=your-password
username=your-username
```

### 3. Asterisk ni Reload

```bash
# Asterisk CLI ga kirish
asterisk -rvvv

# Yoki reload
asterisk -rx "core reload"
```

### 4. Backend da Inbound Call Handler

Backend da inbound calllarni qabul qilish uchun Asterisk ARI dan foydalanish kerak.

### 5. Test Qilish

```bash
# Asterisk loglar
tail -f /var/log/asterisk/full

# Yoki Asterisk CLI da
asterisk -rvvv
```

## Inbound Call Flow

1. **SIP Trunk** → Qo'ng'iroq keladi
2. **Asterisk Dialplan** → `from-trunk` context ga yo'naladi
3. **Stasis Application** → Backend ARI ga yuboradi
4. **Backend** → Qo'ng'iroqni qayta ishlaydi va operatorga yo'naltiradi

## Backend da Inbound Call Handler

Backend da `asterisk.service.ts` da `handleStasisStart` funksiyasi inbound calllarni qabul qiladi.

## Tekshirish

```bash
# Asterisk CLI da
asterisk -rvvv

# Keyin CLI da:
pjsip show endpoints
pjsip show aors
core show channels
```

## Muammolar

### Qo'ng'iroq Kelmayapti

```bash
# SIP Trunk status
asterisk -rx "pjsip show endpoints"

# Dialplan tekshirish
asterisk -rx "dialplan show from-trunk"

# Loglar
tail -f /var/log/asterisk/full
```

### Backend ga Kelmayapti

```bash
# ARI ishlayaptimi?
asterisk -rx "ari show status"

# Backend loglar
pm2 logs call-center-backend
```

