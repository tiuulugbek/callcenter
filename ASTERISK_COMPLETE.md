# Asterisk O'rnatish Yakunlandi - Keyingi Qadamlar

## ✅ Asterisk O'rnatildi!

## 1. Asterisk User Yaratish

```bash
useradd -r -d /var/lib/asterisk -s /bin/false asterisk
mkdir -p /var/lib/asterisk /var/spool/asterisk /var/log/asterisk
chown -R asterisk:asterisk /var/lib/asterisk /var/spool/asterisk /var/log/asterisk /etc/asterisk
```

## 2. Systemd Service Yaratish

```bash
cat > /etc/systemd/system/asterisk.service << 'EOF'
[Unit]
Description=Asterisk PBX
After=network.target

[Service]
Type=forking
User=root
Group=root
ExecStart=/usr/sbin/asterisk -f
ExecReload=/usr/sbin/asterisk -rx 'core reload'
ExecStop=/usr/sbin/asterisk -rx 'core stop now'
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable asterisk
systemctl start asterisk
```

## 3. Tekshirish

```bash
# Asterisk ishlayaptimi?
systemctl status asterisk

# Versiyani ko'rish
asterisk -rx "core show version"

# PJSIP moduli yuklanganmi?
asterisk -rx "module show like pjsip"

# ARI ishlayaptimi?
asterisk -rx "ari show status"

# HTTP server ishlayaptimi?
netstat -tlnp | grep 8088
```

## 4. Konfiguratsiya Fayllarini Ko'chirish

```bash
# Kodni yuklab oling (agar hali qilmagan bo'lsangiz)
cd /var/www
git clone https://github.com/tiuulugbek/callcenter.git call-center

# Konfiguratsiya fayllarini ko'chirish
cp /var/www/call-center/asterisk-config/*.conf /etc/asterisk/

# Huquqlarni o'rnatish
chown -R asterisk:asterisk /etc/asterisk
chmod 640 /etc/asterisk/*.conf
```

## 5. ARI Konfiguratsiyasini Sozlash

```bash
nano /etc/asterisk/ari.conf
```

Parolni o'zgartiring:
```ini
[general]
enabled = yes
pretty = yes
auth_realm = Asterisk
allowed_origins = *

[backend]
type = user
read_only = no
password = SIZNING_PAROLINGIZ
```

## 6. HTTP Server Sozlash

```bash
nano /etc/asterisk/http.conf
```

```ini
[general]
enabled=yes
bindaddr=0.0.0.0
bindport=8088
prefix=asterisk
```

## 7. Asterisk ni Qayta Ishga Tushirish

```bash
systemctl restart asterisk
```

## 8. ARI ni Tekshirish

```bash
# ARI ishlayaptimi?
curl -u backend:SIZNING_PAROLINGIZ http://localhost:8088/ari/asterisk/info

# Muvaffaqiyatli bo'lsa, JSON javob qaytadi
```

## 9. Backend .env Faylida Sozlash

```bash
cd /var/www/call-center/backend
nano .env
```

Quyidagilarni qo'shing:
```env
ASTERISK_ARI_URL=http://localhost:8088/ari
ASTERISK_ARI_WS_URL=ws://localhost:8088/ari/events
ASTERISK_ARI_USERNAME=backend
ASTERISK_ARI_PASSWORD=SIZNING_PAROLINGIZ
```

**Muhim:** `ari.conf` va `.env` dagi parol bir xil bo'lishi kerak!

## Muammolar

### Asterisk ishlamayapti

```bash
# Loglarni ko'rish
tail -f /var/log/asterisk/full

# Konfiguratsiyani tekshirish
asterisk -rx "core show settings"
```

### ARI ishlamayapti

```bash
# HTTP server ishlayaptimi?
netstat -tlnp | grep 8088

# ARI modulini yuklash
asterisk -rx "module load res_ari.so"

# ARI status
asterisk -rx "ari show status"
```

### PJSIP ishlamayapti

```bash
# PJSIP modulini yuklash
asterisk -rx "module load chan_pjsip.so"

# Endpointlarni ko'rish
asterisk -rx "pjsip show endpoints"
```

