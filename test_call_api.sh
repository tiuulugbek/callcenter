#!/bin/bash

# Qo'ng'iroq qilish test scripti (jq siz)

echo "=== Qo'ng'iroq Test ==="
echo ""

# 1. Token olish (avval admin123, keyin password)
echo "1. Token olish..."
RESPONSE=$(curl -s -X POST https://crm24.soundz.uz/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}')

echo "Response: $RESPONSE"

# Token ni ajratish (jq siz)
TOKEN=$(echo $RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

# Agar admin123 ishlamasa, password ni sinab ko'rish
if [ -z "$TOKEN" ]; then
  echo "admin123 ishlamadi, password ni sinab ko'ryapman..."
  RESPONSE=$(curl -s -X POST https://crm24.soundz.uz/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"password"}')
  
  TOKEN=$(echo $RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
fi

if [ -z "$TOKEN" ]; then
  echo "❌ Token olinmadi!"
  echo "Response: $RESPONSE"
  echo ""
  echo "Admin user ni yaratish/yangilash kerak:"
  echo "cd /var/www/call-center/backend && node CREATE_ADMIN.js"
  exit 1
fi

echo "✅ Token olingan: ${TOKEN:0:20}..."
echo ""

# 2. Qo'ng'iroq qilish
echo "2. Qo'ng'iroq qilish..."
FROM_NUMBER="${1:-998909429271}"
TO_NUMBER="${2:-998909429271}"

echo "From: $FROM_NUMBER"
echo "To: $TO_NUMBER"
echo ""

CALL_RESPONSE=$(curl -s -X POST https://crm24.soundz.uz/api/calls/outbound \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"fromNumber\":\"$FROM_NUMBER\",\"toNumber\":\"$TO_NUMBER\"}")

echo "Call Response: $CALL_RESPONSE"
echo ""

# 3. Backend loglarini ko'rish
echo "3. Backend loglarini ko'rish (oxirgi 20 qator):"
pm2 logs call-center-backend --lines 20 --nostream | tail -20

