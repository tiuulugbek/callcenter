#!/bin/bash

# Asterisk Call Center - Start Script

echo "🚀 Asterisk Call Center ni ishga tushirish..."

# Logs papkasini yaratish
mkdir -p logs

# PM2 orqali ishga tushirish
echo "📦 PM2 orqali backend va frontend ni ishga tushirish..."
pm2 start ecosystem.config.js

# Status ko'rsatish
echo ""
echo "✅ Loyiha ishga tushirildi!"
echo ""
echo "📊 PM2 status:"
pm2 list
echo ""
echo "📝 Loglarni ko'rish:"
echo "  Backend:  pm2 logs call-center-backend"
echo "  Frontend: pm2 logs call-center-frontend"
echo ""
echo "🌐 URLlar:"
echo "  Backend:  http://localhost:4000"
echo "  Frontend: http://localhost:4001"
echo ""
echo "⏹️  To'xtatish: pm2 stop all"
echo "🔄 Qayta ishga tushirish: pm2 restart all"
echo "🗑️  O'chirish: pm2 delete all"

