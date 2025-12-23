#!/bin/bash

# Qo'ng'iroq qilish test scripti

echo "=== Qo'ng'iroq Qilish Test ==="
echo ""

# ARI sozlamalarini tekshirish
echo "1. ARI sozlamalarini tekshirish:"
echo "   Backend .env faylida quyidagilar bo'lishi kerak:"
echo "   ASTERISK_ARI_URL=http://localhost:8088/ari"
echo "   ASTERISK_ARI_USERNAME=backend"
echo "   ASTERISK_ARI_PASSWORD=secure_password"
echo ""

# ARI authentication test
echo "2. ARI authentication test:"
curl -u backend:secure_password http://localhost:8088/ari/asterisk/info 2>/dev/null | head -5
echo ""

# Endpoint test
echo "3. Endpoint test:"
curl -u backend:secure_password http://localhost:8088/ari/endpoints 2>/dev/null | grep -i "SIPnomer" | head -3
echo ""

# Qo'ng'iroq qilish
echo "4. Qo'ng'iroq qilish (ARI orqali):"
echo "   curl -u backend:secure_password -X POST \\"
echo "     \"http://localhost:8088/ari/channels?endpoint=PJSIP/998909429271@SIPnomer&app=call-center&appArgs=chiquvchi,998909429271,998909429271&callerId=998909429271\""
echo ""

# Backend API orqali
echo "5. Backend API orqali (token kerak):"
echo "   Token olish:"
echo "   curl -X POST https://crm24.soundz.uz/api/auth/login \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"username\":\"admin\",\"password\":\"password\"}'"
echo ""
echo "   Keyin qo'ng'iroq qilish:"
echo "   curl -X POST https://crm24.soundz.uz/api/calls/outbound \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -H \"Authorization: Bearer <token>\" \\"
echo "     -d '{\"fromNumber\":\"998909429271\",\"toNumber\":\"998909429271\"}'"

