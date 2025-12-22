#!/bin/bash

# Server Sozlash Skripti (Serverda ishga tushirish)

echo "=========================================="
echo "Server Sozlash"
echo "=========================================="

# Update
echo "1. Paketlar yangilanmoqda..."
apt update && apt upgrade -y

# Node.js 18+
echo "2. Node.js o'rnatilmoqda..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# PostgreSQL
echo "3. PostgreSQL o'rnatilmoqda..."
apt install -y postgresql postgresql-contrib
systemctl start postgresql
systemctl enable postgresql

# Nginx
echo "4. Nginx o'rnatilmoqda..."
apt install -y nginx
systemctl start nginx
systemctl enable nginx

# PM2
echo "5. PM2 o'rnatilmoqda..."
npm install -g pm2

# Git
echo "6. Git o'rnatilmoqda..."
apt install -y git

# Build tools
echo "7. Build tools o'rnatilmoqda..."
apt install -y build-essential

# UFW Firewall
echo "8. Firewall sozlanmoqda..."
apt install -y ufw
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Certbot (SSL)
echo "9. Certbot o'rnatilmoqda..."
apt install -y certbot python3-certbot-nginx

echo ""
echo "=========================================="
echo "Server sozlandi!"
echo "=========================================="
echo "Keyingi qadamlar:"
echo "1. Database yaratish"
echo "2. Kodni yuklab olish"
echo "3. Backend va Frontend sozlash"
echo ""

