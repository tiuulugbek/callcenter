#!/bin/bash

echo "=== Call History Tekshirish ==="
echo ""

echo "1. Database da call loglar soni:"
sudo -u postgres psql -d callcenter -c "SELECT COUNT(*) as total_calls FROM \"Call\";" 2>/dev/null || echo "Database ga ulanib bo'lmadi"

echo ""
echo "2. Oxirgi 5 ta call log:"
sudo -u postgres psql -d callcenter -c "SELECT id, \"callId\", direction, \"fromNumber\", \"toNumber\", status, \"startTime\" FROM \"Call\" ORDER BY \"startTime\" DESC LIMIT 5;" 2>/dev/null || echo "Database ga ulanib bo'lmadi"

echo ""
echo "3. Backend loglarida StasisStart eventlar soni (oxirgi 100 qator):"
pm2 logs call-center-backend --lines 100 --nostream 2>/dev/null | grep -c "StasisStart" || echo "0"

echo ""
echo "4. ARI WebSocket ulanishi:"
if curl -s -u backend:CallCenter2025 http://localhost:8088/ari/asterisk/info | grep -q "version"; then
  echo "✅ ARI ulangan"
else
  echo "❌ ARI ulanmagan"
fi

echo ""
echo "5. PM2 holati:"
pm2 status

echo ""
echo "6. Backend .env faylida ARI sozlamalari:"
cd /var/www/call-center/backend 2>/dev/null && cat .env | grep ASTERISK_ARI || echo "ARI sozlamalari topilmadi yoki backend papkasi topilmadi"

echo ""
echo "7. Backend loglarida xatoliklar (oxirgi 20 qator):"
pm2 logs call-center-backend --lines 20 --nostream 2>/dev/null | grep -i "error" | tail -5 || echo "Xatoliklar topilmadi"

echo ""
echo "=== Tekshirish yakunlandi ==="

