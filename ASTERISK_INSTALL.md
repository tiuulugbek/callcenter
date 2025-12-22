# Asterisk O'rnatish va Sozlash

## Serverda Asterisk O'rnatish

### 1. Kerakli Paketlarni O'rnatish

```bash
# Update
apt update && apt upgrade -y

# Build dependencies
apt install -y build-essential wget libssl-dev libncurses5-dev libnewt-dev \
  libxml2-dev linux-headers-$(uname -r) libsqlite3-dev uuid-dev libjansson-dev \
  libcurl4-openssl-dev libpjsip-dev libpjsip-ua-dev libpjsip-simple-dev \
  libpjsua-dev libpjmedia-dev libpjmedia-audiodev-dev libpjmedia-codec-dev \
  libpjmedia-videodev-dev libpjsua2-dev

# Asterisk dependencies
apt install -y libedit-dev libuuid1 uuid-dev libjansson-dev libxml2-dev \
  libsqlite3-dev libcurl4-openssl-dev libogg-dev libvorbis-dev libspeex-dev \
  libspeexdsp-dev libsrtp2-dev liblua5.2-dev libopus-dev libavcodec-dev \
  libavformat-dev libavresample-dev libavutil-dev libswresample-dev
```

### 2. Asterisk 20 LTS Yuklab Olish va O'rnatish

```bash
# Yuklab olish
cd /usr/src
wget http://downloads.asterisk.org/pub/telephony/asterisk/asterisk-20-current.tar.gz
tar xvf asterisk-20-current.tar.gz
cd asterisk-20.*

# Konfiguratsiya
./configure --with-jansson-bundled

# Menyu konfiguratsiyasi
make menuselect

# Menyu da quyidagilarni tanlang:
# - Core Sound Packages (UZ, EN)
# - Music On Hold
# - PJSIP (chan_pjsip)
# - ARI (Asterisk REST Interface)
# - ODBC
# - PostgreSQL

# Compile
make -j$(nproc)

# O'rnatish
make install
make samples
make config

# Asterisk user yaratish
useradd -r -d /var/lib/asterisk -s /bin/false asterisk
chown -R asterisk:asterisk /var/lib/asterisk /var/spool/asterisk /var/log/asterisk /etc/asterisk
```

### 3. Asterisk ni Ishga Tushirish

```bash
# Systemd service yaratish
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

# Service ni ishga tushirish
systemctl daemon-reload
systemctl enable asterisk
systemctl start asterisk

# Tekshirish
asterisk -rx "core show version"
```

### 4. Konfiguratsiya Fayllarini Ko'chirish

```bash
# GitHub dan kodni yuklab oling (agar hali qilmagan bo'lsangiz)
cd /var/www/call-center

# Konfiguratsiya fayllarini ko'chirish
cp asterisk-config/ari.conf /etc/asterisk/
cp asterisk-config/http.conf /etc/asterisk/
cp asterisk-config/pjsip.conf /etc/asterisk/
cp asterisk-config/extensions.conf /etc/asterisk/

# Huquqlarni o'rnatish
chown -R asterisk:asterisk /etc/asterisk
chmod 640 /etc/asterisk/*.conf
```

### 5. ARI Konfiguratsiyasini Sozlash

```bash
sudo nano /etc/asterisk/ari.conf
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

### 6. HTTP Server Sozlash

```bash
sudo nano /etc/asterisk/http.conf
```

```ini
[general]
enabled=yes
bindaddr=0.0.0.0
bindport=8088
prefix=asterisk
```

### 7. Asterisk ni Qayta Ishga Tushirish

```bash
systemctl restart asterisk

# Yoki
asterisk -rx "core reload"
```

### 8. Tekshirish

```bash
# Asterisk ishlayaptimi?
systemctl status asterisk

# ARI ishlayaptimi?
curl -u backend:SIZNING_PAROLINGIZ http://localhost:8088/ari/asterisk/info

# PJSIP ishlayaptimi?
asterisk -rx "pjsip show endpoints"
```

## Tezkor O'rnatish (Agar Muammo Bo'lsa)

Agar yuqoridagi usul ishlamasa, paketlar orqali o'rnatish:

```bash
# Asterisk paketlarini qo'shish
apt install -y software-properties-common
add-apt-repository universe
apt update

# Asterisk o'rnatish (paketlar orqali)
apt install -y asterisk asterisk-config asterisk-modules

# Service ni ishga tushirish
systemctl enable asterisk
systemctl start asterisk
```

**Eslatma:** Paketlar orqali o'rnatilgan Asterisk versiyasi eski bo'lishi mumkin. Manbalardan o'rnatish tavsiya etiladi.

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

# ARI konfiguratsiyasini tekshirish
asterisk -rx "ari show status"
```

### PJSIP ishlamayapti
```bash
# PJSIP modulini yuklash
asterisk -rx "module load chan_pjsip.so"

# Endpointlarni ko'rish
asterisk -rx "pjsip show endpoints"
```

