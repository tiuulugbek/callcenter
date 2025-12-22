# Asterisk O'rnatish - Paketlar

## Kerakli Paketlarni O'rnatish

```bash
# Asosiy paketlar
apt install -y pkg-config libedit-dev

# libavresample-dev o'rniga mavjud paketlar
apt install -y libavcodec-dev libavformat-dev libavutil-dev libswresample-dev

# Agar libavresample-dev kerak bo'lsa, uni o'tkazib yuborish mumkin
# yoki libavutil-dev ishlatish mumkin
```

## To'liq Paketlar Ro'yxati

```bash
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
  libpjsip-dev \
  libpjsip-ua-dev \
  libpjsip-simple-dev \
  libpjsua-dev \
  libpjmedia-dev \
  libpjmedia-audiodev-dev \
  libpjmedia-codec-dev \
  libpjsua2-dev \
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

## Configure

```bash
cd /usr/src/asterisk-20.*
./configure --with-jansson-bundled
```

## Agar libavresample-dev Muammosi Bo'lsa

Asterisk 20 da `libavresample-dev` kerak bo'lmasligi mumkin. Configure script uni o'tkazib yuboradi yoki xatolik beradi.

**Yechim:** Configure scriptni `--without-resample` flag bilan ishga tushirish:

```bash
./configure --with-jansson-bundled --without-resample
```

Yoki configure scriptni o'zgartirish kerak bo'lmasligi mumkin, chunki libavutil-dev kifoya qilishi mumkin.

