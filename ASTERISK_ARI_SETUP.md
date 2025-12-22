# Asterisk ARI Sozlash

## ARI Konfiguratsiya Fayli

**Lokal (Development):**
```
/Users/tiuulugbek/asterisk-call-center/asterisk-config/ari.conf
```

**Serverda (Production):**
```
/etc/asterisk/ari.conf
```

## Hozirgi Konfiguratsiya

```ini
[general]
enabled = yes
pretty = yes
auth_realm = Asterisk
allowed_origins = *

[backend]
type = user
read_only = no
password = secure_password
```

## Parolni O'zgartirish

### 1. Lokal (Development)

```bash
cd /Users/tiuulugbek/asterisk-call-center/asterisk-config
nano ari.conf
```

Parolni o'zgartiring:
```ini
[backend]
type = user
read_only = no
password = SIZNING_YANGI_PAROLINGIZ
```

### 2. Serverda (Production)

```bash
sudo nano /etc/asterisk/ari.conf
```

Xuddi shu parolni kiriting.

## .env Faylida Sozlash

Backend `.env` faylida:

```env
ASTERISK_ARI_URL=http://localhost:8088/ari
ASTERISK_ARI_WS_URL=ws://localhost:8088/ari/events
ASTERISK_ARI_USERNAME=backend
ASTERISK_ARI_PASSWORD=SIZNING_YANGI_PAROLINGIZ
```

**Muhim:** `ari.conf` va `.env` dagi parol bir xil bo'lishi kerak!

## Misol

Agar `ari.conf` da parol `MySecurePass123` bo'lsa:

**ari.conf:**
```ini
[backend]
type = user
read_only = no
password = MySecurePass123
```

**.env:**
```env
ASTERISK_ARI_USERNAME=backend
ASTERISK_ARI_PASSWORD=MySecurePass123
```

## Asterisk ni Qayta Ishga Tushirish

Parolni o'zgartirgandan keyin:

```bash
# Serverda
sudo systemctl restart asterisk

# Yoki
sudo asterisk -rx "core restart now"
```

## Tekshirish

```bash
# ARI ishlayaptimi?
curl -u backend:SIZNING_PAROLINGIZ http://localhost:8088/ari/asterisk/info

# Muvaffaqiyatli bo'lsa, JSON javob qaytadi
```

## Xavfsizlik

1. **Kuchli parol ishlating:** Kamida 16 belgi, harflar, raqamlar, belgilar
2. **Production da:** `allowed_origins` ni cheklang (faqat backend IP)
3. **HTTPS ishlating:** Production da ARI ni HTTPS orqali ulang

## Qo'shimcha Sozlamalar

Agar bir nechta user kerak bo'lsa:

```ini
[general]
enabled = yes
pretty = yes
auth_realm = Asterisk

[backend]
type = user
read_only = no
password = secure_password

[readonly_user]
type = user
read_only = yes
password = readonly_password
```

`.env` da:
```env
ASTERISK_ARI_USERNAME=backend
ASTERISK_ARI_PASSWORD=secure_password
```

