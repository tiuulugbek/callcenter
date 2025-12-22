#!/bin/bash

# SIP Trunk Permissions Fix Script
# Bu scriptni serverda ishga tushiring

set -e

echo "=========================================="
echo "SIP Trunk Permissions Fix"
echo "=========================================="

echo "1. Backend user ni aniqlash..."
BACKEND_USER=$(ps aux | grep "node.*main.js" | grep -v grep | head -1 | awk '{print $1}')
if [ -z "$BACKEND_USER" ]; then
    BACKEND_USER="www-data"
fi
echo "Backend user: $BACKEND_USER"

echo "2. Asterisk guruhini tekshirish..."
if ! getent group asterisk > /dev/null 2>&1; then
    echo "❌ Asterisk guruhi topilmadi!"
    exit 1
fi
echo "✅ Asterisk guruhi mavjud"

echo "3. Backend user ni asterisk guruhiga qo'shish..."
if groups $BACKEND_USER | grep -q "\basterisk\b"; then
    echo "✅ Backend user allaqachon asterisk guruhida"
else
    usermod -a -G asterisk $BACKEND_USER
    echo "✅ Backend user asterisk guruhiga qo'shildi"
fi

echo "4. pjsip.conf fayl permissions ni sozlash..."
PJSIP_CONF="/etc/asterisk/pjsip.conf"
if [ -f "$PJSIP_CONF" ]; then
    chown asterisk:asterisk "$PJSIP_CONF"
    chmod 664 "$PJSIP_CONF"
    echo "✅ pjsip.conf permissions sozlandi"
else
    echo "⚠️  pjsip.conf fayl topilmadi: $PJSIP_CONF"
fi

echo "5. /etc/asterisk papkasiga yozish ruxsatini berish..."
ASTERISK_DIR="/etc/asterisk"
if [ -d "$ASTERISK_DIR" ]; then
    chmod 775 "$ASTERISK_DIR"
    echo "✅ /etc/asterisk papkasiga yozish ruxsati berildi"
else
    echo "⚠️  /etc/asterisk papkasi topilmadi"
fi

echo "6. PM2 ni restart qilish (backend user o'zgarishlarini qo'llash uchun)..."
if command -v pm2 > /dev/null 2>&1; then
    pm2 restart call-center-backend || true
    echo "✅ PM2 restart qilindi"
else
    echo "⚠️  PM2 topilmadi"
fi

echo ""
echo "=========================================="
echo "✅ Permissions fix yakunlandi!"
echo "=========================================="
echo ""
echo "Agar hali ham muammo bo'lsa, quyidagilarni bajaring:"
echo "  sudo chown asterisk:asterisk /etc/asterisk/pjsip.conf"
echo "  sudo chmod 664 /etc/asterisk/pjsip.conf"
echo "  sudo chmod 775 /etc/asterisk"
echo "  sudo usermod -a -G asterisk $BACKEND_USER"
echo "  sudo systemctl restart asterisk"

