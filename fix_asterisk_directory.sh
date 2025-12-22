#!/bin/bash

# Asterisk Directory Fix Script
# Bu scriptni serverda ishga tushiring

set -e

echo "=========================================="
echo "Asterisk Directory Fix"
echo "=========================================="

ASTERISK_DIR="/etc/asterisk"
PJSIP_CONF="$ASTERISK_DIR/pjsip.conf"

echo "1. Asterisk papkasini tekshirish..."
if [ ! -d "$ASTERISK_DIR" ]; then
    echo "❌ Asterisk papkasi topilmadi. Yaratilmoqda..."
    mkdir -p "$ASTERISK_DIR"
    echo "✅ Asterisk papkasi yaratildi"
else
    echo "✅ Asterisk papkasi mavjud"
fi

echo "2. Asterisk papkasiga permissions sozlash..."
chown asterisk:asterisk "$ASTERISK_DIR"
chmod 775 "$ASTERISK_DIR"
echo "✅ Asterisk papkasi permissions sozlandi"

echo "3. pjsip.conf faylini tekshirish..."
if [ ! -f "$PJSIP_CONF" ]; then
    echo "⚠️  pjsip.conf fayl topilmadi. Yaratilmoqda..."
    touch "$PJSIP_CONF"
    chown asterisk:asterisk "$PJSIP_CONF"
    chmod 664 "$PJSIP_CONF"
    echo "✅ pjsip.conf fayl yaratildi"
else
    echo "✅ pjsip.conf fayl mavjud"
    chown asterisk:asterisk "$PJSIP_CONF"
    chmod 664 "$PJSIP_CONF"
    echo "✅ pjsip.conf permissions sozlandi"
fi

echo "4. Backend user ni aniqlash..."
BACKEND_USER=$(ps aux | grep "node.*main.js" | grep -v grep | head -1 | awk '{print $1}')
if [ -z "$BACKEND_USER" ]; then
    BACKEND_USER="www-data"
fi
echo "Backend user: $BACKEND_USER"

echo "5. Backend user ni asterisk guruhiga qo'shish..."
if groups $BACKEND_USER | grep -q "\basterisk\b"; then
    echo "✅ Backend user allaqachon asterisk guruhida"
else
    usermod -a -G asterisk $BACKEND_USER
    echo "✅ Backend user asterisk guruhiga qo'shildi"
fi

echo "6. Permissions ni tekshirish..."
ls -la "$ASTERISK_DIR" | head -5
ls -la "$PJSIP_CONF" 2>/dev/null || echo "pjsip.conf fayl hali yaratilmagan"

echo ""
echo "=========================================="
echo "✅ Asterisk directory fix yakunlandi!"
echo "=========================================="
echo ""
echo "Keyingi qadamlar:"
echo "1. PM2 ni restart qiling: pm2 restart call-center-backend"
echo "2. SIP Trunk yaratishni qayta urinib ko'ring"

