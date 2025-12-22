#!/bin/bash

# Localtunnel ishga tushirish skripti

echo "Localtunnel ishga tushmoqda..."
echo "Port: 4000"
echo ""

# Localtunnel o'rnatilganligini tekshirish
if ! command -v lt &> /dev/null; then
    echo "Localtunnel o'rnatilmagan. O'rnatilmoqda..."
    npm install -g localtunnel
fi

# Tunnel ishga tushirish
lt --port 4000

