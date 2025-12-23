#!/bin/bash

# ARI Authentication Fix Script

echo "=== ARI Authentication Fix ==="
echo ""

# 1. ARI config ni tekshirish
echo "1. ARI config ni tekshirish..."
if [ -f /etc/asterisk/ari.conf ]; then
  echo "ARI config mavjud:"
  cat /etc/asterisk/ari.conf | grep -A 5 "\[backend\]"
else
  echo "❌ ARI config topilmadi!"
  echo "Yaratish kerak:"
  echo "sudo nano /etc/asterisk/ari.conf"
fi

echo ""
echo "2. Backend .env ni tekshirish..."
cd /var/www/call-center/backend

if [ -f .env ]; then
  echo "Backend .env mavjud:"
  grep -i "ARI" .env || echo "ARI sozlamalari topilmadi!"
else
  echo "❌ Backend .env topilmadi!"
fi

echo ""
echo "3. ARI authentication test..."
curl -u backend:CallCenter2025 http://localhost:8088/ari/asterisk/info 2>&1 | head -5

echo ""
echo "4. Backend ni restart qilish..."
pm2 restart call-center-backend

echo ""
echo "5. Backend loglarini ko'rish (5 soniya)..."
sleep 2
pm2 logs call-center-backend --lines 10 --nostream | tail -10

