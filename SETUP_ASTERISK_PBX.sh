#!/bin/bash

# Asterisk PBX To'liq Sozlash Script
# Bu script Asterisk ni to'liq PBX sifatida sozlaydi

set -e

echo "========================================="
echo "Asterisk PBX To'liq Sozlash"
echo "========================================="

# 1. Asterisk o'rnatish
echo ""
echo "1. Asterisk o'rnatilmoqda..."
sudo apt-get update
sudo apt-get install -y asterisk

# 2. Config fayllarni nusxalash
echo ""
echo "2. Config fayllar nusxalanmoqda..."
ASTERISK_CONFIG_DIR="/etc/asterisk"
PROJECT_DIR="/var/www/call-center"

if [ ! -d "$ASTERISK_CONFIG_DIR" ]; then
    sudo mkdir -p "$ASTERISK_CONFIG_DIR"
fi

sudo cp "$PROJECT_DIR/asterisk-config/pjsip.conf" "$ASTERISK_CONFIG_DIR/pjsip.conf"
sudo cp "$PROJECT_DIR/asterisk-config/extensions.conf" "$ASTERISK_CONFIG_DIR/extensions.conf"
sudo cp "$PROJECT_DIR/asterisk-config/http.conf" "$ASTERISK_CONFIG_DIR/http.conf"
sudo cp "$PROJECT_DIR/asterisk-config/ari.conf" "$ASTERISK_CONFIG_DIR/ari.conf"

# 3. Permissions
echo ""
echo "3. Permissions o'rnatilmoqda..."
sudo chown asterisk:asterisk "$ASTERISK_CONFIG_DIR"/*.conf
sudo chmod 644 "$ASTERISK_CONFIG_DIR"/*.conf

# 4. Recordings papkasini yaratish
echo ""
echo "4. Recordings papkasi yaratilmoqda..."
sudo mkdir -p /var/spool/asterisk/recordings
sudo chown asterisk:asterisk /var/spool/asterisk/recordings
sudo chmod 755 /var/spool/asterisk/recordings

# 5. Asterisk ni restart qilish
echo ""
echo "5. Asterisk restart qilinmoqda..."
sudo systemctl restart asterisk
sleep 2

# 6. Status tekshirish
echo ""
echo "6. Asterisk status tekshirilmoqda..."
if sudo systemctl is-active --quiet asterisk; then
    echo "✅ Asterisk muvaffaqiyatli ishga tushdi"
else
    echo "❌ Asterisk ishga tushmadi. Loglarni tekshiring:"
    echo "   sudo tail -f /var/log/asterisk/full"
    exit 1
fi

# 7. PJSIP status
echo ""
echo "7. PJSIP status:"
sudo asterisk -rx "pjsip show endpoints" | head -20

echo ""
echo "========================================="
echo "Asterisk PBX sozlash tugadi!"
echo "========================================="
echo ""
echo "Keyingi qadamlar:"
echo "1. Settings → SIP Provayder da bell.uz ma'lumotlarini kiriting"
echo "2. Backend .env faylida ARI sozlamalarini tekshiring"
echo "3. Backend ni restart qiling: pm2 restart call-center-backend"
echo ""
echo "Tekshirish:"
echo "  sudo asterisk -rvvv"
echo "  pjsip show endpoints"
echo "  pjsip show registrations"

