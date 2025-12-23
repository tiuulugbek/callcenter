#!/bin/bash

# PM2 Cleanup Script
# Duplicate processlarni o'chirish va to'g'ri sozlash

echo "PM2 Cleanup boshlandi..."

# Barcha processlarni ko'rish
echo "Hozirgi processlar:"
pm2 list

# Barcha processlarni to'xtatish
echo "Barcha processlarni to'xtatish..."
pm2 stop all

# Barcha processlarni o'chirish
echo "Barcha processlarni o'chirish..."
pm2 delete all

# Ecosystem config orqali qayta ishga tushirish
echo "Ecosystem config orqali qayta ishga tushirish..."
cd /var/www/call-center
pm2 start ecosystem.config.js

# PM2 ni saqlash
echo "PM2 ni saqlash..."
pm2 save

# Processlar holati
echo "Yangi processlar:"
pm2 list

echo "PM2 Cleanup tugadi!"

