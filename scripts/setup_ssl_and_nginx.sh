#!/bin/bash
# ==============================================================================
# Nginx va Let's Encrypt SSL avtomatik o'rnatish skripti
# Domen: call.crm24uz.com
# IP: 193.24.97.95
# ==============================================================================

set -e

DOMAIN="call.crm24uz.com"
EMAIL="admin@crm24uz.com"

echo "=========================================================="
echo "  [1/4] Certbot va Nginx o'rnatilmoqda..."
echo "=========================================================="
apt-get update -y
apt-get install -y certbot python3-certbot-nginx nginx

# Sayt papkalarini yaratish
mkdir -p /var/www/callcenter/frontend/dist
mkdir -p /var/www/certbot

echo "=========================================================="
echo "  [2/4] Boshlang'ich Nginx konfiguratsiyasi yaratilmoqda..."
echo "=========================================================="
cat > /etc/nginx/sites-available/$DOMAIN << EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        root /var/www/callcenter/frontend/dist;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }
}
EOF

ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default || true

nginx -t
systemctl reload nginx

echo "=========================================================="
echo "  [3/4] Let's Encrypt SSL sertifikati olinmoqda..."
echo "=========================================================="
certbot certonly --webroot -w /var/www/certbot -d $DOMAIN --non-interactive --agree-tos --email $EMAIL || {
    echo "[OGOHLANTIRISH] Webroot usuli o'xshamasa, standalone usulida sinab ko'ramiz..."
    systemctl stop nginx
    certbot certonly --standalone -d $DOMAIN --non-interactive --agree-tos --email $EMAIL
    systemctl start nginx
}

echo "=========================================================="
echo "  [4/4] To'liq HTTPS konfiguratsiyasi yoqilmoqda..."
echo "=========================================================="
cp "$(dirname "$0")/../nginx/call.crm24uz.com.conf" /etc/nginx/sites-available/$DOMAIN

nginx -t
systemctl restart nginx

echo "=========================================================="
echo "  Muvaffaqiyatli yakunlandi!"
echo "  Domen: https://$DOMAIN"
echo "=========================================================="
