#!/bin/bash

echo "=== QADAM 1: Qo'ng'iroq Asterisk ga Kelayotganini Tekshirish (Yaxshilangan) ==="
echo ""

echo "1. Transport-UDP Muammosini Tekshirish:"
echo "----------------------------------------"
if asterisk -rx "pjsip show transports" 2>&1 | grep -q "transport-udp"; then
    echo "✅ transport-udp mavjud"
else
    echo "❌ transport-udp topilmadi!"
    echo ""
    echo "⚠️  MUAMMO: Transport-udp topilmadi!"
    echo "Yechim: ./fix_transport_issue.sh scriptini ishlating"
    echo ""
    exit 1
fi

echo ""
echo "2. Asterisk Console ga Kirish:"
echo "-------------------------------"
echo "Quyidagi buyruqni boshqa terminalda ishlating:"
echo "sudo asterisk -rvvv"
echo ""
echo "Keyin PortSIP orqali qo'ng'iroq qiling va console da quyidagilarni qidiring:"
echo "- Channel yaratiladi (masalan: PJSIP/...-00000001)"
echo "- Qo'ng'iroq keladi"
echo "- Dialplan ishga tushadi"

echo ""
echo "3. Hozirgi Faol Channel lar:"
echo "----------------------------"
asterisk -rx "core show channels" 2>&1 | head -15

echo ""
echo "4. PJSIP Endpoint Holati (SIPnomer):"
echo "-----------------------------------"
asterisk -rx "pjsip show endpoints SIPnomer" 2>&1 | head -15

echo ""
echo "5. Kiruvchi Qo'ng'iroqlarni Tekshirish:"
echo "--------------------------------------"
echo "Quyidagi buyruqni boshqa terminalda ishlating:"
echo "sudo asterisk -rvvv | grep -i 'from-external\|incoming\|inbound'"
echo ""
echo "Yoki Asterisk console da quyidagilarni qidiring:"
echo "- 'from-external' context"
echo "- 'Incoming call' yoki 'Inbound call'"

echo ""
echo "=== QADAM 1 yakunlandi ==="
echo ""
echo "Agar qo'ng'iroq Asterisk ga kelmayapti:"
echo "1. PortSIP sozlamalarini tekshiring"
echo "2. SIP Proxy yoki Outbound Proxy: Asterisk server IP (152.53.229.176)"
echo "3. Yoki tashqi raqamdan Asterisk ga test qo'ng'iroq qiling"
echo ""
echo "Agar transport-udp muammosi bo'lsa:"
echo "1. ./fix_transport_issue.sh scriptini ishlating"
echo "2. Asterisk ni qayta ishga tushiring: systemctl restart asterisk"

