# Qo'ng'iroq Holatini Tekshirish

## Serverni Yangilash

```bash
cd /var/www/call-center

# 1. Git pull
git pull origin main

# 2. Backend build va restart
cd backend
npm run build
pm2 restart call-center-backend

# 3. Yangi qo'ng'iroq qilish test
cd ..
./test_call_api.sh 998909429271 998909429271
```

## Loglarni Tekshirish

```bash
# Backend loglarni real-time ko'rish
pm2 logs call-center-backend --lines 100 | grep -i "call\|bridge\|error\|stasis"

# Yoki faqat yangi loglarni ko'rish
pm2 logs call-center-backend --lines 50 --nostream | tail -50
```

## Muammo Tuzatish

### Muammo 1: Bridge Error

Agar bridge error bo'lsa, quyidagilarni tekshirish:

```bash
# Asterisk loglarni ko'rish
sudo tail -f /var/log/asterisk/full | grep -i "bridge\|channel\|error"

# ARI bridge test
curl -u backend:CallCenter2025 http://localhost:8088/ari/bridges
```

### Muammo 2: Channel Destroyed

Agar channel lar tezda destroy bo'lsa:

```bash
# Channel holatini tekshirish
curl -u backend:CallCenter2025 http://localhost:8088/ari/channels

# SIP trunk holatini tekshirish
sudo asterisk -rx "pjsip show endpoints SIPnomer"
```

### Muammo 3: 409 Conflict

Agar hali ham 409 Conflict bo'lsa:

```bash
# Database ni tekshirish
sudo -u postgres psql callcenter -c "SELECT call_id, direction, from_number, to_number FROM calls ORDER BY created_at DESC LIMIT 5;"

# Prisma Client ni regenerate qilish
cd /var/www/call-center/backend
npx prisma generate
npm run build
pm2 restart call-center-backend
```

## Muhim

- Serverni yangilash kerak
- Yangi qo'ng'iroq qilishni sinab ko'rish kerak
- Loglarni tekshirish kerak

