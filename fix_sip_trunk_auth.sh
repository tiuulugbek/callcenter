#!/bin/bash

# SIP Trunk Auth nomini to'g'rilash scripti

echo "=== SIP Trunk Auth Nomini To'g'rilash ==="

PJSIP_CONFIG="/etc/asterisk/pjsip.conf"

# Backup yaratish
echo "1. Backup yaratilmoqda..."
sudo cp $PJSIP_CONFIG ${PJSIP_CONFIG}.backup.$(date +%Y%m%d_%H%M%S)

# Auth nomini to'g'rilash
echo "2. Auth nomini to'g'rilash..."
sudo sed -i 's/\[SIP nomer-auth\]/[SIPnomer-auth]/g' $PJSIP_CONFIG

# PJSIP reload
echo "3. PJSIP reload qilinmoqda..."
sudo asterisk -rx "pjsip reload"

echo ""
echo "=== Tekshirish ==="
echo "Auths:"
sudo asterisk -rx "pjsip show auths" | grep -i "SIP"

echo ""
echo "Endpoints:"
sudo asterisk -rx "pjsip show endpoints" | grep -i "SIPnomer"

echo ""
echo "=== Yakunlandi ==="

