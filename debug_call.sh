#!/bin/bash

# Qo'ng'iroq muammosini debug qilish scripti

echo "=== Qo'ng'iroq Debug ==="
echo ""

echo "1. Endpoint holati:"
curl -u backend:CallCenter2025 http://localhost:8088/ari/endpoints/SIPnomer 2>/dev/null | jq '.' || echo "Endpoint topilmadi"

echo ""
echo "2. Barcha endpointlar:"
curl -u backend:CallCenter2025 http://localhost:8088/ari/endpoints 2>/dev/null | grep -i "SIPnomer" | head -5

echo ""
echo "3. Dialplan tekshirish:"
sudo asterisk -rx "dialplan show outbound" | head -20

echo ""
echo "4. Test qo'ng'iroq (to'g'ri format):"
echo "   curl -u backend:CallCenter2025 -X POST \\"
echo "     \"http://localhost:8088/ari/channels?endpoint=PJSIP/998909429271@SIPnomer&app=call-center&appArgs=chiquvchi,998909429271,998909429271&callerId=998909429271&timeout=30\""

echo ""
echo "5. Yoki dialplan orqali:"
echo "   curl -u backend:CallCenter2025 -X POST \\"
echo "     \"http://localhost:8088/ari/channels?endpoint=Local/998909429271@outbound&app=call-center&appArgs=chiquvchi,998909429271,998909429271&callerId=998909429271\""

