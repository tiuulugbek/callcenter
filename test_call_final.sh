#!/bin/bash

FROM_NUMBER=$1
TO_NUMBER=$2

if [ -z "$FROM_NUMBER" ] || [ -z "$TO_NUMBER" ]; then
  echo "Foydalanish: $0 <from_number> <to_number>"
  exit 1
fi

echo "=== Qo'ng'iroq Test (Optimallashtirilgan) ==="
echo ""

echo "1. Token olish..."
echo "Login qilish (admin/admin123)..."
RESPONSE=$(curl -s -X POST https://crm24.soundz.uz/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}')

echo "Response: $RESPONSE"

if echo "$RESPONSE" | grep -q "Unauthorized"; then
  echo "Admin123 bilan login muvaffaqiyatsiz. 'password' bilan sinab ko'rish..."
  RESPONSE=$(curl -s -X POST https://crm24.soundz.uz/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"password"}')
  echo "Response: $RESPONSE"
fi

# Token ni ajratib olish
TOKEN=$(echo "$RESPONSE" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Token olishda xatolik."
  echo "To'liq response: $RESPONSE"
  echo ""
  echo "Backend holatini tekshirish:"
  pm2 status
  echo ""
  echo "Backend loglarini ko'rish:"
  pm2 logs call-center-backend --lines 20 --nostream
  exit 1
fi

echo "✅ Token olingan: ${TOKEN:0:20}..."
echo ""

echo "2. Qo'ng'iroq qilish..."
echo "From: $FROM_NUMBER"
echo "To: $TO_NUMBER"

CALL_RESPONSE=$(curl -s -X POST https://crm24.soundz.uz/api/calls/outbound \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"fromNumber\":\"$FROM_NUMBER\",\"toNumber\":\"$TO_NUMBER\"}")

echo "Call Response: $CALL_RESPONSE"
echo ""

if echo "$CALL_RESPONSE" | grep -q '"success":true'; then
  echo "✅ Qo'ng'iroq muvaffaqiyatli boshlandi."
  echo ""
  echo "3. Channel va bridge holatini kuzatish (10 soniya)..."
  
  for i in {1..10}; do
    echo ""
    echo "--- $i soniya ---"
    echo "Active channels:"
    sudo asterisk -rx "core show channels" | grep -c "active channels" || echo "0"
    echo "Active bridges:"
    sudo asterisk -rx "bridge show all" | grep -c "bridge_" || echo "0"
    sleep 1
  done
  
  echo ""
  echo "4. Yakuniy holat:"
  sudo asterisk -rx "core show channels"
  echo ""
  sudo asterisk -rx "bridge show all"
else
  echo "❌ Qo'ng'iroq boshlashda xatolik."
  echo ""
  echo "Backend loglarini ko'rish:"
  pm2 logs call-center-backend --lines 30 --nostream
fi

