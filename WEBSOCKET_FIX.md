# WebSocket va Transport Muammolari - Hal Qilish

## Muammolar

1. **Transport muammosi:**
   ```
   ERROR: Transport 'Kerio-transport' could not be started: Address already in use
   ```

2. **WebSocket muammosi:**
   ```
   WARNING: Web socket closed abruptly
   WARNING: WebSocket read error: Success
   ```

## Yechimlar

### 1. Transport Muammosini Hal Qilish

```bash
sudo nano /etc/asterisk/pjsip.conf
```

`[Kerio-transport]` section ni o'chirish yoki comment qilish, va Kerio endpoint da `transport = transport-udp` ishlatish:

```ini
[Kerio]
type = endpoint
context = from-external
disallow = all
allow = ulaw
allow = alaw
allow = g729
direct_media = no
transport = transport-udp  # Kerio-transport o'rniga
aors = Kerio
auth = Kerio-auth
outbound_auth = Kerio-auth
```

### 2. Asterisk ni To'liq Restart

```bash
# Asterisk ni to'xtatish
systemctl stop asterisk

# Qayta ishga tushirish
systemctl start asterisk

# Yoki
asterisk -rx "core stop now"
# Keyin
systemctl start asterisk
```

### 3. Backend ni Restart

```bash
# PM2 da restart
pm2 restart call-center-backend --update-env

# Loglar
pm2 logs call-center-backend
```

### 4. ARI WebSocket Tekshirish

```bash
# ARI ishlayaptimi?
asterisk -rx "ari show status"

# Backend loglarda "Connected to Asterisk ARI WebSocket" ko'rinishi kerak
pm2 logs call-center-backend | grep -i "connected"
```

## To'liq Yechim

```bash
# 1. Transport muammosini hal qilish
sudo nano /etc/asterisk/pjsip.conf
# Kerio-transport ni o'chirish yoki transport-udp ishlatish

# 2. Asterisk ni to'liq restart
systemctl restart asterisk

# 3. Backend restart
pm2 restart call-center-backend --update-env

# 4. Tekshirish
asterisk -rx "pjsip show endpoints Kerio"
pm2 logs call-center-backend
```

## WebSocket Muammosi

WebSocket uzilmoqda - bu backend yoki Asterisk restart qilinganda normal. Agar doimiy uzilayotgan bo'lsa:

1. **Backend .env tekshirish:**
   ```bash
   cd /var/www/call-center/backend
   cat .env | grep ASTERISK_ARI
   ```

2. **ARI parol to'g'rimi?**
   ```bash
   # ARI ni test qilish
   curl -u backend:CallCenter2025 http://localhost:8088/ari/asterisk/info
   ```

3. **Backend loglar:**
   ```bash
   pm2 logs call-center-backend | grep -i "websocket\|ari"
   ```

