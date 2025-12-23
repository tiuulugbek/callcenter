# Qo'ng'iroq Qilish Test Qo'llanmasi

## Muammo
- `jq` o'rnatilmagan
- Token olishda muammo
- Unauthorized xatosi

## Yechim

### 1. Admin User ni Tekshirish

```bash
# PostgreSQL ga ulanish
sudo -u postgres psql callcenter

# Admin user ni tekshirish
SELECT id, username, name, role FROM operators WHERE username = 'admin';

# Agar admin user yo'q bo'lsa yoki password noto'g'ri bo'lsa:
# Backend da admin user yaratish scriptini ishga tushirish
cd /var/www/call-center/backend
node CREATE_ADMIN.js
```

### 2. Token Olish (jq siz)

```bash
# Token olish va saqlash
RESPONSE=$(curl -s -X POST https://crm24.soundz.uz/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}')

echo "Response: $RESPONSE"

# Token ni ajratish
TOKEN=$(echo $RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

echo "Token: $TOKEN"
```

### 3. Qo'ng'iroq Qilish

```bash
# Token bilan qo'ng'iroq qilish
curl -X POST https://crm24.soundz.uz/api/calls/outbound \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"fromNumber":"998909429271","toNumber":"998909429271"}'
```

### 4. Test Script (Tavsiya etiladi)

```bash
cd /var/www/call-center
chmod +x test_call_api.sh
./test_call_api.sh 998909429271 998909429271
```

### 5. Yoki To'g'ridan-to'g'ri ARI orqali

```bash
curl -u backend:CallCenter2025 -X POST \
  "http://localhost:8088/ari/channels?endpoint=Local/998909429271@outbound&app=call-center&appArgs=chiquvchi,998909429271,998909429271&callerId=998909429271&timeout=30"
```

## Admin User Yaratish

Agar admin user yo'q bo'lsa:

```bash
cd /var/www/call-center/backend

# CREATE_ADMIN.js faylini yaratish
cat > CREATE_ADMIN.js << 'EOF'
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const password = 'password';
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.operator.upsert({
      where: { username: 'admin' },
      update: {
        password: hashedPassword,
        role: 'admin',
      },
      create: {
        username: 'admin',
        password: hashedPassword,
        name: 'Administrator',
        role: 'admin',
      },
    });

    console.log('Admin user created/updated:', admin.username);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
EOF

# Scriptni ishga tushirish
node CREATE_ADMIN.js
```

## Backend Loglarini Tekshirish

```bash
# Backend loglar
pm2 logs call-center-backend --lines 50

# Yoki
tail -f /var/www/call-center/logs/backend-out.log
```

## Muammo Tuzatish

1. **Unauthorized xatosi:**
   - Admin user mavjudligini tekshirish
   - Password to'g'riligini tekshirish
   - Backend loglarini ko'rish

2. **Token olishda muammo:**
   - Backend ishlayotganini tekshirish: `pm2 status`
   - Backend loglarini ko'rish
   - Database connection ni tekshirish

3. **Qo'ng'iroq qilishda muammo:**
   - ARI authentication ni tekshirish
   - Dialplan ni tekshirish: `sudo asterisk -rx "dialplan show outbound"`
   - SIP trunk ni tekshirish: `sudo asterisk -rx "pjsip show endpoints"`

