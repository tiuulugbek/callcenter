#!/bin/bash
# ==============================================================================
# Call Center CRM: Mavjud Asterisk Serverga O'rnatish Skripti
# Server talablari: 2 vCPU, 4 GB RAM, 80 GB SSD (Ubuntu 20.04/22.04/24.04)
# ==============================================================================

set -e

echo "=========================================================="
echo "  Call Center CRM: Server Sozlash Boshlandi"
echo "=========================================================="

# 1. 2 GB Swap xotira yaratish (4 GB RAM server qotib qolmasligi uchun)
if [ ! -f /swapfile ]; then
    echo "[1/6] Swap xotira (2 GB) yaratilmoqda..."
    fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    echo "[✓] Swap xotira yoqildi."
else
    echo "[1/6] Swap xotira allaqachon mavjud."
fi

# 2. Tizim paketlarini yangilash va keraklilarni o'rnatish
echo "[2/6] Kerakli paketlar o'rnatilmoqda..."
apt-get update -y
apt-get install -y curl git nginx postgresql postgresql-contrib ffmpeg

# Node.js 18 LTS o'rnatish (agar mavjud bo'lmasa)
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

# PM2 o'rnatish
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

# 3. PostgreSQL ma'lumotlar bazasini sozlash
echo "[3/6] PostgreSQL bazasi tekshirilmoqda..."
DB_EXISTS=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='callcenter'")
if [ "$DB_EXISTS" != "1" ]; then
    echo "Yangi callcenter bazasi yaratilmoqda..."
    sudo -u postgres psql -c "CREATE USER callcenter_user WITH PASSWORD 'callcenter_secret_pass';"
    sudo -u postgres psql -c "CREATE DATABASE callcenter OWNER callcenter_user;"
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE callcenter TO callcenter_user;"
    echo "[✓] Baza yaratildi."
else
    echo "[✓] Baza allaqachon mavjud."
fi

# 4. Recordings papkasini tayyorlash
echo "[4/6] Audio yozuvlar papkasi tekshirilmoqda..."
mkdir -p /var/spool/asterisk/recordings
chmod 777 /var/spool/asterisk/recordings

# Audio siqish skriptiga ruxsat va cron o'rnatish
chmod +x "$(pwd)/scripts/compress_recordings.sh"
(crontab -l 2>/dev/null | grep -F "compress_recordings.sh") || (crontab -l 2>/dev/null; echo "0 * * * * $(pwd)/scripts/compress_recordings.sh >> /var/log/audio_compress.log 2>&1") | crontab -

echo "=========================================================="
echo "  Tizim asoslari muvaffaqiyatli sozlandi!"
echo "  Endi Asterisk ARI sozlamalarini tekshiring:"
echo "  Qo'llanma: docs/ASTERISK_INTEGRATION_UZ.md"
echo "=========================================================="
