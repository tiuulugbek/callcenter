# ARI Authentication Muammosi

## Muammo
```
{
  "message": "Authentication required"
}
```

## Tekshirish Qadamlari

### 1. ARI Konfiguratsiyasini Tekshirish

```bash
# ARI konfiguratsiyasini ko'rish
cat /etc/asterisk/ari.conf
```

Quyidagicha bo'lishi kerak:
```ini
[general]
enabled = yes
pretty = yes
auth_realm = Asterisk
allowed_origins = *

[backend]
type = user
read_only = no
password = CallCenter2025
```

### 2. HTTP Server Tekshirish

```bash
# HTTP konfiguratsiyasini ko'rish
cat /etc/asterisk/http.conf
```

Quyidagicha bo'lishi kerak:
```ini
[general]
enabled=yes
bindaddr=0.0.0.0
bindport=8088
prefix=asterisk
```

### 3. HTTP Server Ishlamayaptimi?

```bash
# Port 8088 ochiqmi?
netstat -tlnp | grep 8088

# Yoki
ss -tlnp | grep 8088
```

Agar port ochiq bo'lmasa, HTTP server ishlamayapti.

### 4. ARI Modulini Yuklash

```bash
# ARI modulini yuklash
asterisk -rx "module load res_ari.so"

# ARI status
asterisk -rx "ari show status"

# HTTP modulini yuklash
asterisk -rx "module load res_http_websocket.so"
```

### 5. Asterisk ni Qayta Ishga Tushirish

```bash
systemctl restart asterisk

# Yoki reload
asterisk -rx "core reload"
```

### 6. ARI ni Test Qilish

```bash
# Basic auth bilan test
curl -u backend:CallCenter2025 http://localhost:8088/ari/asterisk/info

# Yoki
curl -u backend:CallCenter2025 http://localhost:8088/ari/asterisk/info | jq
```

### 7. Asterisk Loglarni Ko'rish

```bash
# Real-time loglar
asterisk -rvvv

# Yoki
tail -f /var/log/asterisk/full
```

## Yechimlar

### Yechim 1: HTTP Server ni Ishga Tushirish

```bash
# HTTP modulini yuklash
asterisk -rx "module load res_http_websocket.so"

# HTTP server status
asterisk -rx "http show status"
```

### Yechim 2: ARI Modulini Yuklash

```bash
# ARI modulini yuklash
asterisk -rx "module load res_ari.so"

# ARI status
asterisk -rx "ari show status"
```

### Yechim 3: Konfiguratsiyani Qayta Yuklash

```bash
# Asterisk ni reload qilish
asterisk -rx "core reload"

# Yoki to'liq restart
systemctl restart asterisk
```

### Yechim 4: ARI Konfiguratsiyasini To'g'rilash

```bash
nano /etc/asterisk/ari.conf
```

Quyidagicha bo'lishi kerak:
```ini
[general]
enabled = yes
pretty = yes
auth_realm = Asterisk
allowed_origins = *

[backend]
type = user
read_only = no
password = CallCenter2025
```

Keyin:
```bash
asterisk -rx "core reload"
```

## To'liq Tekshirish

```bash
# 1. HTTP server ishlayaptimi?
asterisk -rx "http show status"

# 2. ARI moduli yuklanganmi?
asterisk -rx "module show like ari"

# 3. Port ochiqmi?
netstat -tlnp | grep 8088

# 4. ARI ni test qilish
curl -u backend:CallCenter2025 http://localhost:8088/ari/asterisk/info
```

## Muammo Bo'lsa

Agar hali ham ishlamasa:

```bash
# Asterisk CLI ga kirish
asterisk -rvvv

# Keyin CLI da:
module load res_http_websocket.so
module load res_ari.so
http show status
ari show status
```

