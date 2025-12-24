#!/bin/bash

echo "=== QADAM 2: Dialplan da Stasis Application Chaqirilayotganini Tekshirish ==="
echo ""

echo "1. Dialplan da from-external Kontekst:"
echo "--------------------------------------"
sudo asterisk -rx "dialplan show from-external" 2>&1 | grep -A 10 "Stasis" | head -15

echo ""
echo "2. Extensions.conf Faylini Tekshirish:"
echo "--------------------------------------"
sudo cat /etc/asterisk/extensions.conf | grep -A 10 "from-external" | head -20

echo ""
echo "3. Asterisk Console da Real-time Kuzatish:"
echo "-------------------------------------------"
echo "Quyidagi buyruqni boshqa terminalda ishlating:"
echo "sudo asterisk -rvvv"
echo ""
echo "Keyin PortSIP orqali qo'ng'iroq qiling va console da quyidagilarni qidiring:"
echo "- 'Executing Stasis' yoki 'Stasis application'"
echo "- 'call-center' application nomi"

echo ""
echo "=== QADAM 2 yakunlandi ==="
echo ""
echo "Agar Stasis application chaqirilmayapti:"
echo "1. Extensions.conf ni tekshiring"
echo "2. Dialplan reload qiling: sudo asterisk -rx 'dialplan reload'"
echo "3. Stasis application nomi 'call-center' bo'lishi kerak"

