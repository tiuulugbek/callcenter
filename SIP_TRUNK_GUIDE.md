# SIP Trunk (Provayder) Sozlash Qo'llanmasi

## Nima Bu?

SIP Trunk - bu tashqi SIP provayderlarni (Kerio Control, boshqa SIP provayderlar) Asterisk ga ulash uchun ishlatiladi. Bu orqali:
- Tashqi telefon raqamlariga qo'ng'iroq qilish
- Tashqi telefon raqamlaridan qo'ng'iroq qabul qilish
- Chiquvchi qo'ng'iroqlar uchun provayder ishlatish

## Qanday Sozlanadi?

### 1. Settings Sahifasida

1. **Settings** → **SIP Trunk (Provayder)** tab ni tanlang
2. Quyidagi ma'lumotlarni kiriting:
   - **Trunk Nomi:** Identifikator (masalan: `kerio-control`)
   - **Server IP:** Provayder server manzili
   - **Username:** Provayder bergan login
   - **Password:** Provayder bergan parol
   - **Port:** SIP porti (default: 5060)
   - **Transport:** UDP, TCP yoki TLS
3. **Trunk Yaratish** tugmasini bosing

### 2. Kerio Control Sozlash

**Kerio Control da:**

1. **SIP foydalanuvchi yaratish:**
   - Kerio Control admin paneliga kirish
   - SIP foydalanuvchi yaratish
   - Username va password olish

2. **Settings sahifasida:**
   - **Server IP:** Kerio Control server IP (masalan: `192.168.1.100`)
   - **Username:** SIP foydalanuvchi nomi
   - **Password:** SIP foydalanuvchi paroli
   - **Port:** Kerio Control SIP porti (odatda 5060)

### 3. Boshqa Provayderlar

Har bir provayder uchun:
- **Server IP/Domain:** Provayder bergan SIP server manzili
- **Username:** Provayder bergan SIP username
- **Password:** Provayder bergan SIP password
- **Port:** Provayder bergan port (odatda 5060)

## Yaratilgan Konfiguratsiya

Trunk yaratgandan keyin quyidagi konfiguratsiya Asterisk `pjsip.conf` fayliga qo'shiladi:

```ini
[kerio-control-transport]
type = transport
protocol = udp
bind = 0.0.0.0

[kerio-control]
type = aor
contact = sip:username@192.168.1.100:5060

[kerio-control](!)
type = endpoint
context = from-external
disallow = all
allow = ulaw
allow = alaw
allow = g729
direct_media = no
aors = kerio-control
auth = kerio-control-auth
outbound_auth = kerio-control-auth

[kerio-control-auth]
type = auth
auth_type = userpass
username = username
password = password

[kerio-control](!)
type = identify
endpoint = kerio-control
match = 192.168.1.100
```

## Asterisk ni Qayta Ishga Tushirish

Trunk yaratgandan keyin:

```bash
sudo systemctl restart asterisk
```

Yoki Asterisk CLI da:

```bash
sudo asterisk -rvvv
pjsip reload
```

## Trunk Holatini Tekshirish

```bash
sudo asterisk -rvvv
```

CLI da:
```
pjsip show endpoints
pjsip show aors
pjsip show auths
```

Trunk "Registered" yoki "Available" holatida bo'lishi kerak.

## Chiquvchi Qo'ng'iroqlar

Trunk yaratgandan keyin, chiquvchi qo'ng'iroqlar uchun dialplan da trunk nomini ishlating:

```ini
[outbound]
exten => _X.,1,NoOp(Chiquvchi qo'ng'iroq: ${EXTEN})
 same => n,Dial(PJSIP/${EXTEN}@kerio-control)
 same => n,Hangup()
```

Yoki `extensions.conf` faylida trunk nomini o'zgartiring.

## Muammolarni Hal Qilish

### Trunk Ro'yxatdan O'tmayapti

1. **Ma'lumotlarni tekshiring:**
   - Server IP to'g'rimi?
   - Username va password to'g'rimi?
   - Port to'g'rimi?

2. **Tarmoq ulanishini tekshiring:**
   ```bash
   ping 192.168.1.100
   telnet 192.168.1.100 5060
   ```

3. **Asterisk loglarini tekshiring:**
   ```bash
   sudo tail -f /var/log/asterisk/full
   ```

4. **PJSIP konfiguratsiyasini tekshiring:**
   ```bash
   sudo cat /etc/asterisk/pjsip.conf | grep -A 20 kerio-control
   ```

### Qo'ng'iroq Qilmayapti

1. **Dialplan ni tekshiring:**
   - Trunk nomi to'g'ri ishlatilganmi?
   - Context to'g'rimi?

2. **Trunk holatini tekshiring:**
   - Trunk "Registered" holatidami?

3. **Codec sozlamalarini tekshiring:**
   - Provayder qanday codec qo'llab-quvvatlaydi?

## Production Sozlash

Production uchun:

1. **Domain ishlatish:** IP o'rniga domain
2. **TLS:** Xavfsiz ulanish uchun
3. **STUN/TURN:** NAT muammolarini hal qilish
4. **Firewall:** Faqat kerakli portlarni ochish

## Qo'shimcha Ma'lumot

- Settings sahifasi: http://localhost:4001/settings
- Asterisk konfiguratsiya: `/etc/asterisk/pjsip.conf`
- Dialplan: `/etc/asterisk/extensions.conf`

