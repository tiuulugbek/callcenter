#!/bin/bash

# Admin Foydalanuvchi Yaratish Script

cd /var/www/call-center/backend

echo "=========================================="
echo "Admin Foydalanuvchi Yaratish"
echo "=========================================="

# Seed scriptni ishga tushirish
echo "Seed scriptni ishga tushirish..."
npx ts-node prisma/seed.ts

# Yoki Prisma Studio orqali qo'lda yaratish
echo ""
echo "Agar seed script ishlamasa, quyidagi buyruqni ishlating:"
echo "npx prisma studio"
echo ""
echo "Yoki database ga to'g'ridan-to'g'ri kirib yarating:"
echo "psql -U postgres -d callcenter"
echo ""
echo "INSERT INTO operators (id, name, extension, username, password, role, status, created_at, updated_at)"
echo "VALUES (gen_random_uuid(), 'Admin', '1001', 'admin', '\$2b\$10\$...', 'admin', 'onlayn', NOW(), NOW());"
echo ""
echo "Parol hash qilish uchun Node.js da:"
echo "node -e \"const bcrypt = require('bcrypt'); bcrypt.hash('admin123', 10).then(h => console.log(h));\""

echo "=========================================="

