# Asterisk PBX To'liq Sozlash

## Muhim O'zgarish

**Endi Asterisk to'liq PBX sifatida ishlaydi!**

Kerio Operator o'rniga Asterisk PBX orqali:
- Inbound calls (bell.uz dan kelgan qo'ng'iroqlar)
- Outbound calls (bell.uz orqali chiquvchi qo'ng'iroqlar)
- SIP Extensions (ichki telefonlar)
- Call Recording
- Call Logging

## Qadamlar

### 1. Asterisk O'rnatish va Sozlash

**Serverda:**

```bash
# Asterisk o'rnatish
sudo apt-get update
sudo apt-get install -y asterisk

# Asterisk config fayllarini nusxalash
sudo cp asterisk-config/pjsip.conf /etc/asterisk/pjsip.conf
sudo cp asterisk-config/extensions.conf /etc/asterisk/extensions.conf
sudo cp asterisk-config/http.conf /etc/asterisk/http.conf
sudo cp asterisk-config/ari.conf /etc/asterisk/ari.conf

# Permissions
sudo chown asterisk:asterisk /etc/asterisk/*.conf
sudo chmod 644 /etc/asterisk/*.conf

# Recordings papkasini yaratish
sudo mkdir -p /var/spool/asterisk/recordings
sudo chown asterisk:asterisk /var/spool/asterisk/recordings
sudo chmod 755 /var/spool/asterisk/recordings
```

### 2. bell.uz SIP Trunk Sozlash

**pjsip.conf da:**

```ini
[BellUZ]
type = aor
contact = sip:username@bell.uz:5060
qualify_frequency = 60

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
username = YOUR_LOGIN
password = YOUR_PASSWORD

[BellUZ-identify]
type = identify
endpoint = BellUZ
match = bell.uz
```

**Yoki Frontend orqali:**

1. Settings → SIP Provayder
2. Ma'lumotlarni kiriting:
   - Nomi: `BellUZ`
   - SIP Server: `bell.uz`
   - Login: (Sizning login)
   - Password: (Sizning parol)
   - Port: `5060`
   - Transport: `UDP`
3. "Ma'lumotlarni Saqlash" tugmasini bosing

### 3. ARI (Asterisk REST Interface) Sozlash

**ari.conf:**

```ini
[general]
enabled = yes
pretty = yes
allowed_origins = localhost:4001,crm24.soundz.uz

[backend]
type = user
read_only = no
password = secure_password
```

**http.conf:**

```ini
[general]
enabled = yes
bindaddr = 0.0.0.0
bindport = 8088
prefix = asterisk
```

### 4. Backend .env Sozlash

```env
# Asterisk ARI
ASTERISK_ARI_URL=http://localhost:8088/ari
ASTERISK_ARI_WS_URL=ws://localhost:8088/ari/events
ASTERISK_ARI_USERNAME=backend
ASTERISK_ARI_PASSWORD=secure_password

# Asterisk Config
ASTERISK_PJSIP_CONFIG=/etc/asterisk/pjsip.conf
```

### 5. Asterisk Service Ishga Tushirish

```bash
# Asterisk ni restart qilish
sudo systemctl restart asterisk

# Status tekshirish
sudo systemctl status asterisk

# Loglar
sudo tail -f /var/log/asterisk/full
```

### 6. Backend ni Ishga Tushirish

```bash
cd /var/www/call-center/backend

# PM2 restart
pm2 restart call-center-backend

# Loglar
pm2 logs call-center-backend
```

## Tekshirish

### 1. Asterisk Status

```bash
# Asterisk CLI ga kirish
sudo asterisk -rvvv

# PJSIP status
pjsip show endpoints
pjsip show aors
pjsip show registrations

# Channels
core show channels
```

### 2. Trunk Status

```bash
# Trunk registered bo'lishi kerak
pjsip show endpoint BellUZ
```

### 3. Test Qo'ng'iroq

1. **Inbound:** bell.uz dan qo'ng'iroq qiling
2. **Outbound:** Dashboard dan qo'ng'iroq qiling
3. **Dashboard da call ko'rinishi kerak**

## Xatoliklar

### Trunk ulanmayapti

**Sabab:**
- Noto'g'ri credentials
- Firewall 5060 port ochiq emas
- Network connectivity

**Yechim:**
```bash
# Loglar
sudo tail -f /var/log/asterisk/full

# PJSIP debug
sudo asterisk -rvvv
pjsip set logger on
```

### ARI ulanmayapti

**Sabab:**
- ARI enabled emas
- Port 8088 ochiq emas
- Credentials noto'g'ri

**Yechim:**
```bash
# ARI status
curl -u backend:secure_password http://localhost:8088/ari/asterisk/info

# HTTP status
netstat -tlnp | grep 8088
```

### Qo'ng'iroqlar ko'rinmayapti

**Sabab:**
- ARI WebSocket ulanmagan
- Backend loglarni tekshiring

**Yechim:**
```bash
# Backend loglar
pm2 logs call-center-backend

# ARI events
curl -u backend:secure_password http://localhost:8088/ari/events
```

## Eslatma

1. **Asterisk to'liq PBX** - barcha qo'ng'iroqlar Asterisk orqali
2. **bell.uz trunk** - inbound va outbound calls uchun
3. **ARI WebSocket** - real-time call events
4. **Call Recording** - `/var/spool/asterisk/recordings/` da

