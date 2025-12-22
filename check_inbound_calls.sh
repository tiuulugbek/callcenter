#!/bin/bash

echo "=== Kiruvchi Qo'ng'iroqlar Tekshirish ==="
echo ""

echo "1. Asterisk Dialplan:"
asterisk -rx "dialplan show from-external" | head -20
echo ""

echo "2. ARI Status:"
asterisk -rx "ari show status" 2>/dev/null || echo "ARI status ko'rinmadi"
echo ""

echo "3. Stasis Applications:"
asterisk -rx "stasis show applications" 2>/dev/null || echo "Stasis applications ko'rinmadi"
echo ""

echo "4. SIP Trunk Status (Kerio):"
asterisk -rx "pjsip show endpoints Kerio" | head -10
echo ""

echo "5. Backend Logs (last 10 lines):"
pm2 logs call-center-backend --lines 10 --nostream 2>/dev/null | tail -10
echo ""

echo "6. Database Calls Count:"
sudo -u postgres psql -d callcenter -c "SELECT COUNT(*) as total_calls FROM calls;" 2>/dev/null || echo "Database connection xatosi"
echo ""

echo "7. Active Channels:"
asterisk -rx "core show channels" | head -5
echo ""

echo "=== Tekshirish Tugadi ==="
echo ""
echo "Keyingi qadamlar:"
echo "1. Test qo'ng'iroq qiling"
echo "2. Asterisk CLI da kuzating: asterisk -rvvv"
echo "3. Backend loglarini kuzating: pm2 logs call-center-backend"

