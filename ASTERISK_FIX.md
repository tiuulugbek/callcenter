# Asterisk O'rnatish - Muammolarni Hal Qilish

## pkg-config O'rnatish

```bash
apt install -y pkg-config
```

## Qayta Configure

```bash
cd /usr/src/asterisk-20.*
./configure --with-jansson-bundled
```

## Agar Boshqa Paketlar Yo'q Bo'lsa

```bash
# Barcha kerakli paketlarni o'rnatish
apt install -y pkg-config libavcodec-dev libavformat-dev libavresample-dev \
  libavutil-dev libswresample-dev libavcodec-extra libavcodec-extra58

# Qayta configure
cd /usr/src/asterisk-20.*
make clean
./configure --with-jansson-bundled
```

## To'liq Paketlar Ro'yxati

```bash
apt install -y \
  build-essential \
  wget \
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
  pkg-config \
  libavcodec-dev \
  libavformat-dev \
  libavresample-dev \
  libavutil-dev \
  libswresample-dev
```

## Keyin Configure

```bash
cd /usr/src/asterisk-20.*
./configure --with-jansson-bundled
```

