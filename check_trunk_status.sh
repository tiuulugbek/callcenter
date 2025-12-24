#!/bin/bash

echo "=== SIP Trunk Holatini Tekshirish ==="
echo ""

echo "1. SIP Trunk Registratsiya Holati:"
echo "-----------------------------------"
sudo asterisk -rx "pjsip show registrations"
echo ""

echo "2. SIP Trunk Endpoint Holati:"
echo "------------------------------"
sudo asterisk -rx "pjsip show endpoints SIPnomer"
echo ""

echo "3. SIP Trunk AOR Holati:"
echo "------------------------"
sudo asterisk -rx "pjsip show aors SIPnomer"
echo ""

echo "4. Faol Channel lar:"
echo "---------------------"
sudo asterisk -rx "core show channels" | head -20
echo ""

echo "5. Bridge lar:"
echo "--------------"
sudo asterisk -rx "bridge show all" | head -20
echo ""

echo "6. Backend loglarini ko'rish (oxirgi 50 qator):"
echo "--------------------------------------------"
pm2 logs call-center-backend --lines 50 --nostream | tail -50

