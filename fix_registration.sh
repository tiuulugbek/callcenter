#!/bin/bash

echo "=== SIP Registratsiya Muammosini Hal Qilish ==="
echo ""

echo "1. Asterisk log fayllarini topish:"
echo "-----------------------------------"
sudo find /var/log -name "*asterisk*" -type f 2>/dev/null | head -10
echo ""

echo "2. Asterisk console loglarini ko'rish:"
echo "---------------------------------------"
sudo asterisk -rx "core show settings" | grep -i "log"
echo ""

echo "3. Registratsiya konfiguratsiyasini tekshirish:"
echo "-----------------------------------------------"
sudo cat /etc/asterisk/pjsip.conf | grep -A 15 "\[SIPnomer-registration\]"
echo ""

echo "4. Registratsiyani qo'lda sinab ko'rish (verbose mode):"
echo "--------------------------------------------------------"
sudo asterisk -rx "pjsip set logger on"
sudo asterisk -rx "pjsip send register SIPnomer-registration"
sleep 3
sudo asterisk -rx "pjsip show registrations"
echo ""

echo "5. Registratsiya xatolarini ko'rish:"
echo "-------------------------------------"
sudo asterisk -rx "pjsip show registration SIPnomer-registration"
echo ""

echo "6. Trunk konfiguratsiyasini to'liq ko'rish:"
echo "--------------------------------------------"
sudo cat /etc/asterisk/pjsip.conf | grep -B 5 -A 20 "\[SIPnomer"
echo ""

