#!/bin/bash

echo "=== SIP Trunk va Qo'ng'iroq Holatini Tekshirish ==="
echo ""

echo "1. SIP Trunk Registratsiya Holati:"
echo "-----------------------------------"
sudo asterisk -rx "pjsip show registrations" | grep -A 5 "SIPnomer\|bell.uz" || echo "Registratsiya topilmadi"
echo ""

echo "2. SIP Trunk Endpoint Holati:"
echo "------------------------------"
sudo asterisk -rx "pjsip show endpoints SIPnomer" | grep -E "Endpoint|State|Contact|Status" || echo "Endpoint topilmadi"
echo ""

echo "3. Faol Channel lar:"
echo "---------------------"
sudo asterisk -rx "core show channels" | head -20
echo ""

echo "4. Bridge lar:"
echo "--------------"
sudo asterisk -rx "bridge show all" | head -10 || echo "Bridge lar topilmadi"
echo ""

echo "5. Oxirgi qo'ng'iroqlar (Backend loglardan):"
echo "--------------------------------------------"
pm2 logs call-center-backend --lines 30 --nostream | grep -i "call\|bridge\|channel\|originating\|dialplan\|error" | tail -20
echo ""

echo "6. Test qo'ng'iroq qilish:"
echo "---------------------------"
echo "Quyidagi buyruqni ishlating:"
echo "./test_call_api.sh 998909429271 998909429271"
echo ""

echo "7. Asterisk loglarini ko'rish:"
echo "-------------------------------"
echo "Quyidagi buyruqni ishlating:"
echo "sudo tail -f /var/log/asterisk/full | grep -i 'SIPnomer\|998909429271\|call\|dial\|bridge'"
echo ""

