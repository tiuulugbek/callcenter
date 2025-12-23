# ARI Authentication Muammosini Hal Qilish

## Muammo
```
{"message": "Authentication required"}
```

## Yechim

### 1. ARI Config ni Tekshirish

```bash
sudo cat /etc/asterisk/ari.conf
```

Quyidagi sozlamalar bo'lishi kerak:

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

### 2. ARI Config ni Yaratish/Yangilash

```bash
sudo nano /etc/asterisk/ari.conf
```

Quyidagi konfiguratsiyani qo'shing:

```ini
[general]
enabled = yes
pretty = yes
allowed_origins = localhost,127.0.0.1,::1,152.53.229.176

[backend]
type = user
read_only = no
password = secure_password
```

Keyin:
```bash
sudo asterisk -rx "module reload res_ari"
```

### 3. ARI Authentication Test

```bash
# Test authentication
curl -u backend:secure_password http://localhost:8088/ari/asterisk/info

# Endpointlarni ko'rish
curl -u backend:secure_password http://localhost:8088/ari/endpoints

# Qo'ng'iroq qilish
curl -u backend:secure_password -X POST \
  "http://localhost:8088/ari/channels?endpoint=PJSIP/998909429271@SIPnomer&app=call-center&appArgs=chiquvchi,998909429271,998909429271&callerId=998909429271"
```

### 4. Backend API orqali Qo'ng'iroq Qilish

**Token olish:**
```bash
curl -X POST https://crm24.soundz.uz/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

**Qo'ng'iroq qilish:**
```bash
curl -X POST https://crm24.soundz.uz/api/calls/outbound \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"fromNumber":"998909429271","toNumber":"998909429271"}'
```

### 5. Backend .env Tekshirish

Backend `.env` faylida quyidagilar bo'lishi kerak:

```env
ASTERISK_ARI_URL=http://localhost:8088/ari
ASTERISK_ARI_USERNAME=backend
ASTERISK_ARI_PASSWORD=secure_password
```

### 6. Backend ni Restart Qilish

```bash
cd /var/www/call-center/backend
pm2 restart call-center-backend
pm2 logs call-center-backend --lines 20
```
