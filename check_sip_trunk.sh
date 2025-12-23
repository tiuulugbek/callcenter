#!/bin/bash

# SIP Trunk holatini tekshirish scripti

echo "=== SIP Trunk Holatini Tekshirish ==="
echo ""

echo "1. Endpoints:"
sudo asterisk -rx "pjsip show endpoints" | grep -A 5 "SIP\|Bell"

echo ""
echo "2. Registrations:"
sudo asterisk -rx "pjsip show registrations"

echo ""
echo "3. AORs:"
sudo asterisk -rx "pjsip show aors" | grep -A 3 "SIP\|Bell"

echo ""
echo "4. Auths:"
sudo asterisk -rx "pjsip show auths" | grep -A 2 "SIP\|Bell"

echo ""
echo "5. PJSIP Config (SIP trunk qismi):"
sudo cat /etc/asterisk/pjsip.conf | grep -A 20 "\[SIP\|\[Bell" | head -40

echo ""
echo "=== Tekshirish yakunlandi ==="

