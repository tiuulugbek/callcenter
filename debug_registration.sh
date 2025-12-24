#!/bin/bash

echo "=== SIP Registratsiya Muammosini Tekshirish ==="
echo ""

echo "1. Registratsiya holati:"
echo "-----------------------"
sudo asterisk -rx "pjsip show registrations"
echo ""

echo "2. Registratsiya loglarini ko'rish (oxirgi 50 qator):"
echo "------------------------------------------------------"
sudo tail -50 /var/log/asterisk/full | grep -i "registration\|register\|SIPnomer\|bell.uz\|401\|403\|rejected" | tail -20
echo ""

echo "3. Trunk konfiguratsiyasini tekshirish:"
echo "----------------------------------------"
sudo cat /etc/asterisk/pjsip.conf | grep -A 30 "\[SIPnomer" | head -40
echo ""

echo "4. Registratsiyani qo'lda sinab ko'rish:"
echo "----------------------------------------"
echo "Quyidagi buyruqni ishlating:"
echo "sudo asterisk -rx 'pjsip send register SIPnomer-registration'"
echo ""

echo "5. Registratsiya xatolarini ko'rish:"
echo "-------------------------------------"
sudo asterisk -rx "pjsip set logger on"
sudo tail -f /var/log/asterisk/full | grep -i "registration\|register\|SIPnomer\|bell.uz\|401\|403\|rejected" &
TAIL_PID=$!
sleep 5
sudo asterisk -rx "pjsip send register SIPnomer-registration"
sleep 5
kill $TAIL_PID 2>/dev/null
echo ""

echo "6. Registratsiya holatini qayta tekshirish:"
echo "-------------------------------------------"
sudo asterisk -rx "pjsip show registrations"
echo ""

