#!/bin/bash

echo "=== Eski Channel va Bridge larni Tozalash ==="
echo ""

echo "1. Barcha Local channel larni o'chirish..."
sudo asterisk -rx "core show channels" | grep "Local/998909429271@outbound" | awk '{print $1}' | while read channel; do
  echo "O'chirilmoqda: $channel"
  sudo asterisk -rx "channel request hangup $channel" 2>/dev/null || true
done

echo ""
echo "2. Barcha bridge larni o'chirish..."
sudo asterisk -rx "bridge show all" | grep "bridge_" | awk '{print $1}' | while read bridge; do
  echo "O'chirilmoqda: $bridge"
  sudo asterisk -rx "bridge destroy $bridge" 2>/dev/null || true
done

echo ""
echo "3. Holatni tekshirish..."
echo "Active channels:"
sudo asterisk -rx "core show channels" | grep -c "active channels" || echo "0"
echo ""
echo "Active bridges:"
sudo asterisk -rx "bridge show all" | grep -c "bridge_" || echo "0"

echo ""
echo "4. Agar hali ham channel lar bo'lsa, Asterisk ni restart qilish kerak bo'lishi mumkin:"
echo "sudo systemctl restart asterisk"

