# Tezkor Yechim - ARI Authentication va Qo'ng'iroq Qilish

## 1. ARI Config ni Tekshirish va Yaratish

```bash
# ARI config ni tekshirish
sudo cat /etc/asterisk/ari.conf

# Agar yo'q bo'lsa, yaratish
sudo nano /etc/asterisk/ari.conf
```

Quyidagi konfiguratsiyani qo'shing:

```ini
[general]
enabled = yes
pretty = yes
allowed_origins = localhost,127.0.0.1,::1

[backend]
type = user
read_only = no
password = secure_password
```

Keyin:
```bash
sudo asterisk -rx "module reload res_ari"
```

## 2. Backend .env ni Yangilash

```bash
cd /var/www/call-center/backend
nano .env
```

Quyidagilarni qo'shing:

```env
ASTERISK_ARI_URL=http://localhost:8088/ari
ASTERISK_ARI_USERNAME=backend
ASTERISK_ARI_PASSWORD=secure_password
```

Keyin:
```bash
pm2 restart call-center-backend
```

## 3. ARI Authentication Test

```bash
# Test
curl -u backend:secure_password http://localhost:8088/ari/asterisk/info

# Endpointlarni ko'rish
curl -u backend:secure_password http://localhost:8088/ari/endpoints | grep SIPnomer
```

## 4. Qo'ng'iroq Qilish

### ARI orqali (to'g'ridan-to'g'ri):

```bash
curl -u backend:secure_password -X POST \
  "http://localhost:8088/ari/channels?endpoint=PJSIP/998909429271@SIPnomer&app=call-center&appArgs=chiquvchi,998909429271,998909429271&callerId=998909429271"
```

### Backend API orqali (tavsiya etiladi):

**1. Token olish:**
```bash
TOKEN=$(curl -X POST https://crm24.soundz.uz/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}' | jq -r '.access_token')
```

**2. Qo'ng'iroq qilish:**
```bash
curl -X POST https://crm24.soundz.uz/api/calls/outbound \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"fromNumber":"998909429271","toNumber":"998909429271"}'
```

## 5. Tekshirish

```bash
# Backend loglar
pm2 logs call-center-backend --lines 30

# Asterisk loglar
sudo tail -f /var/log/asterisk/full | grep -i "SIPnomer\|PJSIP\|ARI"
```

