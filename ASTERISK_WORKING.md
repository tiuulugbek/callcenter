# Asterisk Ishga Tushdi!

## ✅ Asterisk Ishlamoqda!

Loglarda ko'rsatilgan:
```
Asterisk Ready.
```

Process ishlayapti:
```
/usr/sbin/asterisk -f
```

## Service ni To'g'rilash

Service "activating" holatida ko'rsatilgan, lekin Asterisk ishlayapti. Service type ni o'zgartirish kerak:

```bash
nano /etc/systemd/system/asterisk.service
```

Quyidagiga o'zgartiring:

```ini
[Unit]
Description=Asterisk PBX
After=network.target

[Service]
Type=simple
User=root
Group=root
ExecStart=/usr/sbin/asterisk -f
ExecReload=/usr/sbin/asterisk -rx 'core reload'
ExecStop=/usr/sbin/asterisk -rx 'core stop now'
Restart=always
RestartSec=10
TimeoutStartSec=60

[Install]
WantedBy=multi-user.target
```

Keyin:
```bash
systemctl daemon-reload
systemctl restart asterisk
systemctl status asterisk
```

## Asterisk ni Tekshirish

```bash
# Asterisk CLI ga kirish
asterisk -rvvv

# Yoki buyruqlar
asterisk -rx "core show version"
asterisk -rx "module show like pjsip"
asterisk -rx "ari show status"
asterisk -rx "pjsip show endpoints"
```

## Konfiguratsiya Fayllarini Ko'chirish

```bash
# Kodni yuklab oling (agar hali qilmagan bo'lsangiz)
cd /var/www
git clone https://github.com/tiuulugbek/callcenter.git call-center

# Konfiguratsiya fayllarini ko'chirish
cp /var/www/call-center/asterisk-config/*.conf /etc/asterisk/

# Huquqlarni o'rnatish
chown -R asterisk:asterisk /etc/asterisk
chmod 640 /etc/asterisk/*.conf

# Asterisk ni qayta ishga tushirish
systemctl restart asterisk
```

## ARI ni Tekshirish

```bash
# ARI ishlayaptimi?
asterisk -rx "ari show status"

# HTTP server ishlayaptimi?
netstat -tlnp | grep 8088

# ARI ni test qilish (parolni o'zgartiring)
curl -u backend:secure_password http://localhost:8088/ari/asterisk/info
```

