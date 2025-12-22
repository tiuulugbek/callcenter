# Asterisk O'rnatish - Oddiy Usul

## Qadamlar

### 1. Kerakli Paketlarni O'rnatish

```bash
apt update && apt upgrade -y

apt install -y build-essential wget libssl-dev libncurses5-dev libnewt-dev \
  libxml2-dev linux-headers-$(uname -r) libsqlite3-dev uuid-dev libjansson-dev \
  libcurl4-openssl-dev libpjsip-dev libpjsip-ua-dev libpjsip-simple-dev \
  libpjsua-dev libpjmedia-dev libpjmedia-audiodev-dev libpjmedia-codec-dev \
  libpjsua2-dev libedit-dev libogg-dev libvorbis-dev libspeex-dev \
  libspeexdsp-dev libsrtp2-dev liblua5.2-dev libopus-dev
```

### 2. Asterisk Yuklab Olish

```bash
cd /usr/src
wget http://downloads.asterisk.org/pub/telephony/asterisk/asterisk-20-current.tar.gz
tar xvf asterisk-20-current.tar.gz
cd asterisk-20.*
```

### 3. MP3 Support (Ixtiyoriy)

```bash
contrib/scripts/get_mp3_source.sh
```

### 4. Konfiguratsiya

```bash
./configure --with-jansson-bundled
```

### 5. Menyu Konfiguratsiyasi

```bash
make menuselect
```

**Muhim:** Quyidagilarni tanlang:
- **Core Sound Packages** → UZ va EN tanlang
- **Music On Hold**
- **PJSIP** (chan_pjsip) - **MUHIM!**
- **ARI** (Asterisk REST Interface) - **MUHIM!**
- **ODBC**
- **PostgreSQL** (agar kerak bo'lsa)

**Menuda:**
- `*` belgisi tanlangan degani
- `Space` - tanlash/bekor qilish
- `X` - chiqish va saqlash

### 6. Compile va O'rnatish

```bash
make -j$(nproc)
make install
make samples
make config
```

### 7. Asterisk User Yaratish

```bash
useradd -r -d /var/lib/asterisk -s /bin/false asterisk
mkdir -p /var/lib/asterisk /var/spool/asterisk /var/log/asterisk
chown -R asterisk:asterisk /var/lib/asterisk /var/spool/asterisk /var/log/asterisk /etc/asterisk
```

### 8. Systemd Service Yaratish

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

### 9. Tekshirish

```bash
# Asterisk ishlayaptimi?
systemctl status asterisk

# Versiyani ko'rish
asterisk -rx "core show version"

# ARI ishlayaptimi?
asterisk -rx "ari show status"
```

### 10. Konfiguratsiya Fayllarini Ko'chirish

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

## Muammolar

### Compile xatosi bo'lsa

```bash
# Barcha dependencies ni o'rnatish
apt install -y libavcodec-dev libavformat-dev libavresample-dev libavutil-dev libswresample-dev

# Qayta compile
make clean
./configure --with-jansson-bundled
make -j$(nproc)
```

### PJSIP moduli topilmayapti

```bash
# PJSIP paketlarini o'rnatish
apt install -y libpjsip-dev libpjsip-ua-dev libpjsip-simple-dev libpjsua-dev \
  libpjmedia-dev libpjmedia-audiodev-dev libpjmedia-codec-dev libpjsua2-dev

# Qayta configure
./configure --with-jansson-bundled --with-pjproject-bundled
```

### ARI ishlamayapti

```bash
# HTTP server ishlayaptimi?
netstat -tlnp | grep 8088

# ARI konfiguratsiyasini tekshirish
cat /etc/asterisk/ari.conf

# Asterisk loglarni ko'rish
tail -f /var/log/asterisk/full
```

