#!/bin/bash

echo "=== QADAM 3: ARI Eventlar Kelayotganini Tekshirish ==="
echo ""

echo "1. ARI WebSocket Ulanishi:"
echo "--------------------------"
pm2 logs call-center-backend --lines 20 --nostream 2>&1 | grep -i "ARI\|WebSocket" | tail -5

echo ""
echo "2. ARI Applications:"
echo "-------------------"
curl -s -u backend:CallCenter2025 http://localhost:8088/ari/applications 2>&1 | python3 -m json.tool 2>/dev/null || curl -s -u backend:CallCenter2025 http://localhost:8088/ari/applications 2>&1

echo ""
echo "3. Backend Loglarini Real-time Kuzatish:"
echo "----------------------------------------"
echo "Quyidagi buyruqni boshqa terminalda ishlating:"
echo "pm2 logs call-center-backend --lines 0 | grep -i 'StasisStart\|Call record created'"
echo ""
echo "Keyin PortSIP orqali qo'ng'iroq qiling va loglarda quyidagilarni qidiring:"
echo "- 'StasisStart: ...'"
echo "- 'Call record created: ...'"

echo ""
echo "4. ARI Credentials ni Tekshirish:"
echo "---------------------------------"
cd /var/www/call-center/backend 2>/dev/null && cat .env | grep ASTERISK_ARI || echo "ARI sozlamalari topilmadi"

echo ""
echo "=== QADAM 3 yakunlandi ==="
echo ""
echo "Agar ARI eventlar kelmayapti:"
echo "1. ARI WebSocket ulanishini tekshiring"
echo "2. ARI credentials ni tekshiring"
echo "3. ARI application nomi 'call-center' bo'lishi kerak"

