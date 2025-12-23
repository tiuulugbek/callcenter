# ARI Config To'g'rilash

## Muammo
- `[general]` section ikki marta takrorlangan ❌
- Bu noto'g'ri va muammo yaratadi

## To'g'ri Config

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

## Serverni Yangilash

```bash
sudo nano /etc/asterisk/ari.conf
```

**Eski config ni o'chirib, quyidagini qo'ying:**

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

## Backend .env ni Yangilash

Backend `.env` faylida password ni yangilash:

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

Keyin:
```bash
pm2 restart call-center-backend
```

## Test

```bash
# ARI authentication test
curl -u backend:CallCenter2025 http://localhost:8088/ari/asterisk/info

# Endpointlarni ko'rish
curl -u backend:CallCenter2025 http://localhost:8088/ari/endpoints | grep SIPnomer

# Qo'ng'iroq qilish
curl -u backend:CallCenter2025 -X POST \
  "http://localhost:8088/ari/channels?endpoint=PJSIP/998909429271@SIPnomer&app=call-center&appArgs=chiquvchi,998909429271,998909429271&callerId=998909429271"
```

