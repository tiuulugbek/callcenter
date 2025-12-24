#!/bin/bash

echo "=== QADAM 1: Qo'ng'iroq Asterisk ga Kelayotganini Tekshirish ==="
echo ""

echo "1. Asterisk Console ga Kirish:"
echo "-------------------------------"
echo "Quyidagi buyruqni boshqa terminalda ishlating:"
echo "sudo asterisk -rvvv"
echo ""
echo "Keyin PortSIP orqali qo'ng'iroq qiling va console da quyidagilarni qidiring:"
echo "- Channel yaratiladi (masalan: PJSIP/...-00000001)"
echo "- Qo'ng'iroq keladi"
echo "- Dialplan ishga tushadi"

echo ""
echo "2. Hozirgi Faol Channel lar:"
echo "----------------------------"
sudo asterisk -rx "core show channels" 2>&1 | head -10

echo ""
echo "3. PJSIP Endpoint Holati:"
echo "------------------------"
sudo asterisk -rx "pjsip show endpoints SIPnomer" 2>&1 | head -10

echo ""
echo "=== QADAM 1 yakunlandi ==="
echo ""
echo "Agar qo'ng'iroq Asterisk ga kelmayapti:"
echo "1. PortSIP sozlamalarini tekshiring"
echo "2. SIP Proxy yoki Outbound Proxy: Asterisk server IP (152.53.229.176)"
echo "3. Yoki tashqi raqamdan Asterisk ga test qo'ng'iroq qiling"

