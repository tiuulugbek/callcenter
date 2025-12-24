#!/bin/bash

echo "=== Transport-UDP Muammosini Hal Qilish ==="
echo ""

PJSIP_CONF="/etc/asterisk/pjsip.conf"

echo "1. Hozirgi pjsip.conf ni Tekshirish:"
echo "-------------------------------------"
if [ -f "$PJSIP_CONF" ]; then
    echo "✅ pjsip.conf mavjud"
    
    # Transport-udp bor-yo'qligini tekshirish
    if grep -q "^\[transport-udp\]" "$PJSIP_CONF"; then
        echo "✅ [transport-udp] mavjud"
    else
        echo "❌ [transport-udp] topilmadi!"
        echo ""
        echo "2. Transport-UDP Qo'shish:"
        echo "-------------------------"
        
        # Backup yaratish
        cp "$PJSIP_CONF" "${PJSIP_CONF}.backup.$(date +%Y%m%d_%H%M%S)"
        echo "✅ Backup yaratildi: ${PJSIP_CONF}.backup.$(date +%Y%m%d_%H%M%S)"
        
        # Transport-udp ni fayl boshiga qo'shish
        cat > /tmp/transport_udp.txt << 'EOF'
[transport-udp]
type = transport
protocol = udp
bind = 0.0.0.0

EOF
        
        # Transport-udp ni fayl boshiga qo'shish
        cat /tmp/transport_udp.txt "$PJSIP_CONF" > /tmp/pjsip_new.conf
        mv /tmp/pjsip_new.conf "$PJSIP_CONF"
        rm /tmp/transport_udp.txt
        
        echo "✅ [transport-udp] qo'shildi!"
        
        # Asterisk reload
        echo ""
        echo "3. Asterisk Reload Qilish:"
        echo "-------------------------"
        asterisk -rx "module reload res_pjsip.so" 2>&1
        asterisk -rx "pjsip reload" 2>&1
        echo "✅ Asterisk reload qilindi!"
    fi
else
    echo "❌ pjsip.conf topilmadi!"
    exit 1
fi

echo ""
echo "4. Transport-UDP Holatini Tekshirish:"
echo "------------------------------------"
asterisk -rx "pjsip show transports" 2>&1 | grep -i "transport-udp" || echo "⚠️  Transport-udp hali ham ko'rinmayapti"

echo ""
echo "5. PJSIP Endpoint Holatini Tekshirish:"
echo "-------------------------------------"
asterisk -rx "pjsip show endpoints SIPnomer" 2>&1 | head -10

echo ""
echo "=== TAYYOR! ==="
echo ""
echo "Agar transport-udp hali ham ko'rinmayapti:"
echo "1. Asterisk ni qayta ishga tushiring: systemctl restart asterisk"
echo "2. Yoki: asterisk -rx 'core restart now'"

