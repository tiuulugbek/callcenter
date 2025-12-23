# ARI Authentication Fix (Server)

## Muammo
```
ERROR [AsteriskGateway] Error: Unexpected server response: 401
ERROR [AsteriskService] Authentication required
```

## Yechim

### 1. ARI Config ni Tekshirish

```bash
sudo nano /etc/asterisk/ari.conf
```

Quyidagi konfiguratsiya bo'lishi kerak:

```ini
[general]
enabled = yes
pretty = yes
auth_realm = Asterisk
allowed_origins = localhost,127.0.0.1,::1

[backend]
type = user
read_only = no
password = CallCenter2025
```

**Muhim:** `[general]` section faqat bir marta bo'lishi kerak!

Keyin:
```bash
sudo asterisk -rx "module reload res_ari"
```

### 2. Backend .env ni Yangilash

```bash
cd /var/www/call-center/backend
nano .env
```

Quyidagilarni qo'shing/yangilang:

```env
ASTERISK_ARI_URL=http://localhost:8088/ari
ASTERISK_ARI_USERNAME=backend
ASTERISK_ARI_PASSWORD=CallCenter2025
```

**Muhim:** Password ARI config dagi password bilan bir xil bo'lishi kerak!

### 3. Backend ni Restart Qilish

```bash
pm2 restart call-center-backend
pm2 logs call-center-backend --lines 30
```

### 4. ARI Authentication Test

```bash
# Test
curl -u backend:CallCenter2025 http://localhost:8088/ari/asterisk/info

# Agar ishlasa, quyidagi javobni olasiz:
# {"build":{...},"system":{...},"config":{...},"status":{...}}
```

### 5. Qo'ng'iroq Qilish Test

```bash
cd /var/www/call-center
./test_call_api.sh 998909429271 998909429271
```

## Tekshirish

```bash
# 1. ARI config
sudo asterisk -rx "ari show config"

# 2. Backend .env
cd /var/www/call-center/backend
grep -i "ARI" .env

# 3. Backend loglar
pm2 logs call-center-backend --lines 50 | grep -i "ari\|authentication"

# 4. ARI endpoint test
curl -u backend:CallCenter2025 http://localhost:8088/ari/endpoints
```

## Muammo Tuzatish

1. **401 Unauthorized:**
   - ARI config da password to'g'riligini tekshirish
   - Backend .env da password to'g'riligini tekshirish
   - Password lar bir xil bo'lishi kerak!

2. **ARI WebSocket error:**
   - Backend .env da `ASTERISK_ARI_URL` to'g'ri bo'lishi kerak
   - ARI config da `allowed_origins` ga `localhost` qo'shilgan bo'lishi kerak

3. **Module reload:**
   - ARI config ni o'zgartirgandan keyin: `sudo asterisk -rx "module reload res_ari"`
   - Backend ni restart qilish: `pm2 restart call-center-backend`

