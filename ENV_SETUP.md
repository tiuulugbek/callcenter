# .env Fayli Sozlash Qo'llanmasi

## 1. DATABASE_URL

**Qayerdan:** O'zingiz yaratasiz PostgreSQL da

```bash
# Serverda PostgreSQL ga kirish
sudo -u postgres psql

# Database va user yaratish
CREATE DATABASE callcenter;
CREATE USER callcenter_user WITH PASSWORD 'SIZNING_PAROLINGIZ';
GRANT ALL PRIVILEGES ON DATABASE callcenter TO callcenter_user;
ALTER DATABASE callcenter OWNER TO callcenter_user;
\q
```

**Misol:**
```env
DATABASE_URL="postgresql://callcenter_user:SIZNING_PAROLINGIZ@localhost:5432/callcenter?schema=public"
```

## 2. JWT_SECRET

**Qayerdan:** O'zingiz yaratasiz (random string)

**Yaratish usullari:**

**Variant 1: Terminal orqali**
```bash
# Linux/Mac
openssl rand -base64 32

# Yoki
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Variant 2: Online generator**
- https://randomkeygen.com/ (CodeIgniter Encryption Keys)
- Yoki har qanday random string generator

**Misol:**
```env
JWT_SECRET=aBc123XyZ789!@#$%^&*()_+-=[]{}|;:,.<>?/~
```

**Muhim:** Uzun va murakkab bo'lishi kerak (kamida 32 belgi)

## 3. TELEGRAM_BOT_TOKEN

**Qayerdan:** @BotFather dan

**Qadamlar:**
1. Telegram da @BotFather ni toping
2. `/newbot` yozing
3. Bot nomini kiriting (masalan: "My Call Center Bot")
4. Bot username kiriting (masalan: "my_callcenter_bot")
5. BotFather sizga token beradi

**Misol:**
```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
```

**Webhook URL:** Avtomatik sozlanadi (Settings sahifasida)

## 4. ASTERISK_ARI_USERNAME va PASSWORD

**Qayerdan:** Asterisk konfiguratsiyasida belgilanadi

**Qadamlar:**

1. Asterisk konfiguratsiyasini oching:
```bash
nano /etc/asterisk/ari.conf
```

2. Quyidagini qo'shing:
```ini
[general]
enabled = yes
pretty = yes
auth_realm = Asterisk

[backend]
type = user
read_only = no
password = SIZNING_PAROLINGIZ
```

3. `.env` da:
```env
ASTERISK_ARI_USERNAME=backend
ASTERISK_ARI_PASSWORD=SIZNING_PAROLINGIZ
```

**Muhim:** `ari.conf` va `.env` dagi parol bir xil bo'lishi kerak!

## 5. FACEBOOK_PAGE_ACCESS_TOKEN

**Qayerdan:** Facebook Developer Console

**Qadamlar:**
1. https://developers.facebook.com/ ga kirish
2. "My Apps" → "Create App"
3. App turini tanlang (masalan: "Business")
4. App nomini kiriting
5. "Messenger" product ni qo'shing
6. "Settings" → "Messenger" → "Access Tokens"
7. Page ni tanlang va token ni oling

**Misol:**
```env
FACEBOOK_PAGE_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 6. FACEBOOK_APP_SECRET

**Qayerdan:** Facebook Developer Console

**Qadamlar:**
1. Facebook Developer Console → Your App
2. "Settings" → "Basic"
3. "App Secret" ni ko'ring (yashiringan bo'lsa "Show" ni bosing)

**Misol:**
```env
FACEBOOK_APP_SECRET=abc123def456ghi789jkl012mno345pqr
```

## 7. FACEBOOK_VERIFY_TOKEN

**Qayerdan:** O'zingiz yaratasiz (istalgan so'z)

Bu token webhook tekshirish uchun ishlatiladi. Har qanday random so'z bo'lishi mumkin.

**Misol:**
```env
FACEBOOK_VERIFY_TOKEN=my_verify_token_123
```

**Muhim:** Bu token ni Facebook webhook sozlashda ham kiriting!

## To'liq .env Fayli Misoli

```env
# Database
DATABASE_URL="postgresql://callcenter_user:MySecurePass123@localhost:5432/callcenter?schema=public"

# Server
PORT=4000
FRONTEND_URL=https://crm24.soundz.uz

# JWT
JWT_SECRET=MySuperSecretJWTKey123!@#$%^&*()_+-=[]{}|;:,.<>?/~

# Telegram
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_WEBHOOK_URL=https://crm24.soundz.uz/chats/webhook/telegram

# Asterisk ARI
ASTERISK_ARI_URL=http://localhost:8088/ari
ASTERISK_ARI_WS_URL=ws://localhost:8088/ari/events
ASTERISK_ARI_USERNAME=backend
ASTERISK_ARI_PASSWORD=MyAsteriskPassword123

# Facebook/Instagram
FACEBOOK_PAGE_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FACEBOOK_APP_SECRET=abc123def456ghi789jkl012mno345pqr
FACEBOOK_VERIFY_TOKEN=my_verify_token_123
```

## Qaysi Ma'lumotlar Kerak?

### Dastlabki Sozlash (Minimum):
- ✅ DATABASE_URL (o'zingiz yaratasiz)
- ✅ JWT_SECRET (o'zingiz yaratasiz)
- ✅ PORT va FRONTEND_URL (o'zingiz bilasiz)

### Telegram Uchun:
- ✅ TELEGRAM_BOT_TOKEN (@BotFather dan)

### Asterisk Uchun:
- ✅ ASTERISK_ARI_USERNAME va PASSWORD (Asterisk konfiguratsiyasida)

### Facebook/Instagram Uchun:
- ✅ FACEBOOK_PAGE_ACCESS_TOKEN (Facebook Developer dan)
- ✅ FACEBOOK_APP_SECRET (Facebook Developer dan)
- ✅ FACEBOOK_VERIFY_TOKEN (o'zingiz yaratasiz)

## Xavfsizlik Maslahatlari

1. **Parollar:** Kuchli parollar ishlating (kamida 16 belgi, harflar, raqamlar, belgilar)
2. **JWT_SECRET:** Judayam murakkab bo'lishi kerak (production uchun)
3. **.env fayli:** Hech qachon GitHub ga yuklamang! (`.gitignore` da bor)
4. **Serverda:** `.env` faylini faqat root yoki application user o'qishi mumkin bo'lishi kerak

