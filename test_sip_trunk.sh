#!/bin/bash

# SIP Trunk Test Script

echo "=== SIP Trunk Test ==="
echo ""

echo "1. Endpoint holati:"
sudo asterisk -rx "pjsip show endpoint SIPnomer"

echo ""
echo "2. AOR holati:"
sudo asterisk -rx "pjsip show aor SIPnomer"

echo ""
echo "3. Auth holati:"
sudo asterisk -rx "pjsip show auth SIPnomer-auth"

echo ""
echo "4. Transport holati:"
sudo asterisk -rx "pjsip show transports"

echo ""
echo "5. Test qo'ng'iroq (to'g'ri format):"
echo "   channel originate PJSIP/998909429271@SIPnomer application Playback hello-world"
echo ""
echo "Yoki ARI orqali:"
echo "   curl -u backend:secure_password -X POST 'http://localhost:8088/ari/channels?endpoint=PJSIP/998909429271@SIPnomer&app=call-center&appArgs=chiquvchi,998909429271,998909429271'"

