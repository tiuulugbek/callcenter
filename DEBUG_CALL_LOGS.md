# Call History Muammosini Tuzatish

## Muammo
Call history ko'rinmayapti. Loglarda xatoliklar bor:
- "Error adding channel to bridge"
- "Channel not found"
- "Error handling StasisStart"

## Tekshirish Qadamlari

### 1. Database da Call Loglar Borligini Tekshirish

```bash
# PostgreSQL ga ulanish
sudo -u postgres psql -d callcenter

# Call loglarni ko'rish
SELECT id, "callId", direction, "fromNumber", "toNumber", status, "startTime" 
FROM "Call" 
ORDER BY "startTime" DESC 
LIMIT 10;

# Chiqish
\q
```

### 2. Backend Loglarini To'liq Ko'rish

```bash
# Oxirgi 50 qator loglarni ko'rish
pm2 logs call-center-backend --lines 50 --nostream

# Faqat StasisStart eventlarini ko'rish
pm2 logs call-center-backend --lines 100 --nostream | grep -i "StasisStart"

# Faqat xatoliklarni ko'rish
pm2 logs call-center-backend --lines 100 --nostream | grep -i "error"
```

### 3. ARI Eventlar Kelayotganini Tekshirish

```bash
# ARI WebSocket ulanishini tekshirish
curl -u backend:CallCenter2025 http://localhost:8088/ari/asterisk/info

# ARI applications ni ko'rish
curl -u backend:CallCenter2025 http://localhost:8088/ari/applications

# ARI channels ni ko'rish
curl -u backend:CallCenter2025 http://localhost:8088/ari/channels
```

### 4. Asterisk Dialplan ni Tekshirish

```bash
# Asterisk CLI ga kirish
sudo asterisk -rvvv

# Dialplan ni ko'rish
dialplan show from-external
dialplan show outbound

# Stasis application ishlatilayotganini tekshirish
core show applications | grep -i stasis

# Chiqish
exit
```

### 5. Test Qo'ng'iroq Qilish

Agar call loglar kelmayotgan bo'lsa, test qo'ng'iroq qiling va loglarni kuzating:

```bash
# Backend loglarini real-time kuzatish
pm2 logs call-center-backend

# Boshqa terminalda test qo'ng'iroq qiling
# (IP telefon yoki softphone orqali)
```

## Muammo Sabablari

### 1. Eski Kod Serverda
Serverda eski versiya ishlayapti. Yangi kodni deploy qilish kerak.

### 2. ARI WebSocket Ulanmagan
Backend ARI ga ulanmagan. `.env` faylida ARI credentials to'g'ri bo'lishi kerak.

### 3. Dialplan da Stasis Application Yo'q
Dialplan da `Stasis(call-center,...)` application chaqirilmayapti.

### 4. Database Connection Muammosi
Backend database ga ulanmayapti yoki call loglar saqlanmayapti.

## Tuzatish

### 1. Yangi Kodni Deploy Qilish

```bash
cd /var/www/call-center
git pull origin main
cd backend
npm install
npx prisma generate
npm run build
cd ../frontend
npm install
npm run build
cd ..
pm2 restart call-center-backend
pm2 restart call-center-frontend
```

### 2. ARI Credentials ni Tekshirish

```bash
# Backend .env faylini tekshirish
cd /var/www/call-center/backend
cat .env | grep ASTERISK_ARI

# To'g'ri sozlash:
# ASTERISK_ARI_URL=http://localhost:8088/ari
# ASTERISK_ARI_USERNAME=backend
# ASTERISK_ARI_PASSWORD=CallCenter2025
```

### 3. Dialplan ni Tekshirish va Reload Qilish

```bash
# Dialplan ni ko'rish
sudo cat /etc/asterisk/extensions.conf | grep -A 5 "Stasis"

# Dialplan reload qilish
sudo asterisk -rx "dialplan reload"

# Asterisk reload qilish (agar kerak bo'lsa)
sudo systemctl restart asterisk
```

### 4. Database ni Tekshirish

```bash
# Database connection ni tekshirish
cd /var/www/call-center/backend
npx prisma db pull

# Prisma Client ni generate qilish
npx prisma generate
```

## Tekshirish Script

Quyidagi script barcha tekshiruvlarni avtomatik qiladi:

```bash
#!/bin/bash

echo "=== Call History Tekshirish ==="
echo ""

echo "1. Database da call loglar:"
sudo -u postgres psql -d callcenter -c "SELECT COUNT(*) FROM \"Call\";"

echo ""
echo "2. Backend loglarida StasisStart eventlar:"
pm2 logs call-center-backend --lines 50 --nostream | grep -c "StasisStart" || echo "0"

echo ""
echo "3. ARI WebSocket ulanishi:"
curl -s -u backend:CallCenter2025 http://localhost:8088/ari/asterisk/info | grep -q "version" && echo "✅ Ulangan" || echo "❌ Ulanmagan"

echo ""
echo "4. PM2 holati:"
pm2 status

echo ""
echo "5. Backend .env fayli:"
cd /var/www/call-center/backend
cat .env | grep ASTERISK_ARI || echo "ARI sozlamalari topilmadi"
```

