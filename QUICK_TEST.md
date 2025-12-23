# Tez Test Qo'llanmasi

## Serverni Yangilash va Test

```bash
cd /var/www/call-center

# 1. Git pull
git pull origin main

# 2. Test scriptni yuklab olish
chmod +x test_call_api.sh

# 3. Admin user ni tekshirish/yaratish
cd backend
node CREATE_ADMIN.js

# 4. Backend ni restart qilish
npm install
npm run build
pm2 restart call-center-backend

# 5. Test qo'ng'iroq
cd ..
./test_call_api.sh 998909429271 998909429271
```

## Token Olish (Qo'lda)

```bash
# admin123 bilan
RESPONSE=$(curl -s -X POST https://crm24.soundz.uz/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}')

TOKEN=$(echo $RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN"

# Qo'ng'iroq qilish
curl -X POST https://crm24.soundz.uz/api/calls/outbound \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"fromNumber":"998909429271","toNumber":"998909429271"}'
```

## Yoki To'g'ridan-to'g'ri ARI orqali

```bash
curl -u backend:CallCenter2025 -X POST \
  "http://localhost:8088/ari/channels?endpoint=Local/998909429271@outbound&app=call-center&appArgs=chiquvchi,998909429271,998909429271&callerId=998909429271&timeout=30"
```

