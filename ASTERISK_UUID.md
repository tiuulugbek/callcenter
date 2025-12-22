# UUID Paketini Topish

## UUID Paketlarini Qidirish

```bash
# Qaysi uuid paketlar mavjud?
apt search uuid | grep dev

# Yoki
apt-cache search uuid | grep dev
```

## Odatda Quyidagilar Ishlaydi

```bash
# Variant 1: uuid-dev (agar mavjud bo'lsa)
apt install -y uuid-dev

# Variant 2: libuuid1-dev (Debian/Ubuntu)
apt install -y libuuid1-dev

# Variant 3: uuid-runtime va libuuid1
apt install -y uuid-runtime libuuid1

# Variant 4: libossp-uuid-dev
apt install -y libossp-uuid-dev
```

## Agar Hech Biri Ishlamasa

Configure scriptni uuid siz ishga tushirish:

```bash
cd /usr/src/asterisk-20.*
./configure --with-jansson-bundled --with-pjproject-bundled --without-uuid
```

Yoki configure scriptni o'zgartirish kerak bo'lmasligi mumkin, chunki uuid ixtiyoriy bo'lishi mumkin.

## To'liq Paketlar Ro'yxati (UUID siz)

```bash
apt install -y \
  build-essential wget pkg-config libssl-dev libncurses5-dev libnewt-dev \
  libxml2-dev linux-headers-$(uname -r) libsqlite3-dev libjansson-dev \
  libcurl4-openssl-dev libedit-dev libogg-dev libvorbis-dev libspeex-dev \
  libspeexdsp-dev libsrtp2-dev liblua5.2-dev libopus-dev \
  libavcodec-dev libavformat-dev libavutil-dev libswresample-dev \
  uuid-runtime libuuid1
```

Keyin configure:

```bash
./configure --with-jansson-bundled --with-pjproject-bundled
```

