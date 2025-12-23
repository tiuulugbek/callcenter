#!/bin/bash

# Frontend cache muammosini hal qilish va deploy qilish

echo "🔧 Frontend cache muammosini hal qilish..."

cd /var/www/call-center

# Frontend build papkasini tozalash
echo "🗑️ Eski build fayllarini o'chirish..."
rm -rf frontend/dist
rm -rf frontend/node_modules/.vite

# Frontend dependencies
echo "📦 Frontend dependencies o'rnatish..."
cd frontend
npm install

# Frontend build (cache busting bilan)
echo "🔨 Frontend build qilish (cache busting)..."
npm run build

# Nginx cache tozalash (agar kerak bo'lsa)
echo "🔄 Nginx cache tozalash..."
if command -v nginx &> /dev/null; then
    sudo nginx -s reload
fi

# PM2 restart
echo "🔄 PM2 restart qilish..."
cd ..
pm2 restart ecosystem.config.js

echo ""
echo "✅ Cache muammosi hal qilindi va deploy yakunlandi!"
echo ""
echo "📊 PM2 status:"
pm2 list
echo ""
echo "💡 Browser cache ni ham tozalashni unutmang:"
echo "   - Ctrl+Shift+R (Windows/Linux)"
echo "   - Cmd+Shift+R (Mac)"
echo "   yoki Browser DevTools > Network > Disable cache"

