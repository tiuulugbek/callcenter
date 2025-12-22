# Asterisk O'rnatish - Final Qo'llanma

## 1. Mavjud Paketlarni O'rnatish

```bash
apt update && apt upgrade -y

apt install -y \
  build-essential \
  wget \
  pkg-config \
  libssl-dev \
  libncurses5-dev \
  libnewt-dev \
  libxml2-dev \
  linux-headers-$(uname -r) \
  libsqlite3-dev \
  uuid-dev \
  libjansson-dev \
  libcurl4-openssl-dev \
  libedit-dev \
  libogg-dev \
  libvorbis-dev \
  libspeex-dev \
  libspeexdsp-dev \
  libsrtp2-dev \
  liblua5.2-dev \
  libopus-dev \
  libavcodec-dev \
  libavformat-dev \
  libavutil-dev \
  libswresample-dev
```

**Eslatma:** PJSIP paketlari Asterisk bilan birga keladi, alohida o'rnatish shart emas!

## 2. Asterisk Yuklab Olish

```bash
cd /usr/src
wget http://downloads.asterisk.org/pub/telephony/asterisk/asterisk-20-current.tar.gz
tar xvf asterisk-20-current.tar.gz
cd asterisk-20.*
```

## 3. PJSIP Yuklab Olish (Asterisk bilan birga)

```bash
contrib/scripts/get_mp3_source.sh
```

## 4. Configure (PJSIP Bundled)

```bash
./configure --with-jansson-bundled --with-pjproject-bundled
```

Bu flag PJSIP ni Asterisk bilan birga compile qiladi.

## 5. Menyu Konfiguratsiyasi

```bash
make menuselect
```

**Muhim:** Quyidagilarni tanlang:
- **Core Sound Packages** → UZ va EN
- **Music On Hold**
- **PJSIP** (chan_pjsip) - **MUHIM!**
- **ARI** (Asterisk REST Interface) - **MUHIM!**

## 6. Compile va O'rnatish

```bash
make -j$(nproc)
make install
make samples
make config
```

## 7. Service Yaratish

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

## 8. Tekshirish

```bash
systemctl status asterisk
asterisk -rx "core show version"
asterisk -rx "module show like pjsip"
asterisk -rx "ari show status"
```

## Muammolar

### uuid-dev topilmayapti

```bash
# uuid-dev o'rniga libuuid1-dev
apt install -y libuuid1-dev

# Yoki uuid-runtime
apt install -y uuid-runtime
```

### PJSIP paketlari topilmayapti

**Yechim:** PJSIP ni bundled qilib o'rnatish (yuqorida ko'rsatilgan)

```bash
./configure --with-jansson-bundled --with-pjproject-bundled
```

### libavresample-dev topilmayapti

Bu paket eskirgan. Configure script uni o'tkazib yuboradi yoki:

```bash
./configure --with-jansson-bundled --with-pjproject-bundled --without-resample
```

