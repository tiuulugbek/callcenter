# Asterisk Sozlandi - Keyingi Qadamlar

## ✅ Asterisk Service Ishlamoqda!

```
Active: active (running)
```

## 1. Asterisk ni Tekshirish

```bash
# Versiyani ko'rish
asterisk -rx "core show version"

# PJSIP moduli yuklanganmi?
asterisk -rx "module show like pjsip"

# ARI moduli yuklanganmi?
asterisk -rx "module show like ari"

# ARI status
asterisk -rx "ari show status"

# HTTP server ishlayaptimi?
netstat -tlnp | grep 8088
```

## 2. ARI Konfiguratsiyasini Tekshirish va Sozlash

```bash
# ARI konfiguratsiyasini ko'rish
cat /etc/asterisk/ari.conf

# Parolni o'zgartirish (kerak bo'lsa)
nano /etc/asterisk/ari.conf
```

Parolni o'zgartiring:
```ini
[backend]
type = user
read_only = no
password = SIZNING_PAROLINGIZ
```

## 3. HTTP Server Tekshirish

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

## 4. Asterisk ni Qayta Ishga Tushirish

```bash
systemctl restart asterisk
```

## 5. ARI ni Test Qilish

```bash
# ARI ni test qilish (parolni o'zgartiring)
curl -u backend:SIZNING_PAROLINGIZ http://localhost:8088/ari/asterisk/info

# Muvaffaqiyatli bo'lsa, JSON javob qaytadi
```

## 6. Backend .env Faylida Sozlash

```bash
cd /var/www/call-center/backend
nano .env
```

Quyidagilarni qo'shing/yangilang:
```env
ASTERISK_ARI_URL=http://localhost:8088/ari
ASTERISK_ARI_WS_URL=ws://localhost:8088/ari/events
ASTERISK_ARI_USERNAME=backend
ASTERISK_ARI_PASSWORD=SIZNING_PAROLINGIZ
```

**Muhim:** `ari.conf` va `.env` dagi parol bir xil bo'lishi kerak!

## 7. PJSIP Endpointlarni Tekshirish

```bash
# PJSIP endpointlarni ko'rish
asterisk -rx "pjsip show endpoints"

# PJSIP transportlarni ko'rish
asterisk -rx "pjsip show transports"
```

## 8. Keyingi Qadamlar

1. ✅ Asterisk o'rnatildi
2. ✅ Service sozlandi
3. ✅ Konfiguratsiya fayllari ko'chirildi
4. ⏭️ ARI parolini sozlash
5. ⏭️ Backend ni sozlash
6. ⏭️ Database ni sozlash
7. ⏭️ Frontend ni build qilish
8. ⏭️ Nginx ni sozlash

## Muammolar

### ARI ishlamayapti

```bash
# ARI modulini yuklash
asterisk -rx "module load res_ari.so"

# ARI status
asterisk -rx "ari show status"

# HTTP server ishlayaptimi?
netstat -tlnp | grep 8088
```

### PJSIP ishlamayapti

```bash
# PJSIP modulini yuklash
asterisk -rx "module load chan_pjsip.so"

# Endpointlarni ko'rish
asterisk -rx "pjsip show endpoints"
```

