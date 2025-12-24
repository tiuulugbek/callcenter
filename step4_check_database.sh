#!/bin/bash

echo "=== QADAM 4: Database da Call Loglar Yaratilayotganini Tekshirish ==="
echo ""

echo "1. Database da Call Loglar Soni (Oldin):"
echo "----------------------------------------"
OLD_COUNT=$(sudo -u postgres psql -d callcenter -t -c "SELECT COUNT(*) FROM calls;" 2>/dev/null | tr -d ' ')
echo "   $OLD_COUNT ta call log"

echo ""
echo "2. PortSIP Orqali Test Qo'ng'iroq Qiling:"
echo "-----------------------------------------"
echo "PortSIP dan qo'ng'iroq qiling va tugagandan keyin Enter bosing"

read -p "Qo'ng'iroq tugagandan keyin Enter bosing..."

echo ""
echo "3. Database da Yangi Call Loglar:"
echo "---------------------------------"
NEW_COUNT=$(sudo -u postgres psql -d callcenter -t -c "SELECT COUNT(*) FROM calls;" 2>/dev/null | tr -d ' ')
echo "   $NEW_COUNT ta call log"

if [ "$NEW_COUNT" -gt "$OLD_COUNT" ]; then
    echo "   ✅ Yangi call loglar yaratildi! ($((NEW_COUNT - OLD_COUNT)) ta yangi)"
    echo ""
    echo "4. Oxirgi 5 ta Call Log:"
    sudo -u postgres psql -d callcenter -c "SELECT id, call_id, direction, from_number, to_number, status, start_time FROM calls ORDER BY start_time DESC LIMIT 5;" 2>/dev/null
    echo ""
    echo "✅ TIZIM ISHLAYAPTI!"
else
    echo "   ❌ Yangi call loglar yaratilmadi"
    echo ""
    echo "4. Backend Loglarida Xatoliklar:"
    pm2 logs call-center-backend --lines 50 --nostream 2>&1 | grep -i "error\|stasis\|call" | tail -10
fi

echo ""
echo "=== QADAM 4 yakunlandi ==="

