# Kerio Operator Integratsiyasi

## 📋 Maqsad

Kerio Operator PBX bilan integratsiya qilish:
- Call Detail Records (CDR) ni olish
- Call events ni subscribe qilish
- Call recordings ni olish
- Database ga sync qilish

## 🔧 Sozlash

### 1. Environment Variables

`.env` faylga quyidagilarni qo'shing:

```env
KERIO_PBX_HOST=90.156.199.92
KERIO_API_USERNAME=your_api_username
KERIO_API_PASSWORD=your_api_password
```

### 2. Kerio Operator API

Kerio Operator API endpoint lari:
- CDR: `/api/v1/calls/cdr`
- Recording: `/api/v1/calls/{callId}/recording`
- Auth: `/api/v1/auth/verify`

**Eslatma:** Kerio Operator API endpoint lari haqiqiy API ga moslashtirish kerak.

## 📡 API Endpoints

### GET /kerio/auth/verify
Kerio Operator autentifikatsiyasini tekshirish

### POST /kerio/sync
Call records ni sync qilish
- Query params: `startDate`, `endDate`, `extension`

### GET /kerio/calls/:pbxCallId/recording
Call recording ni olish

## 🔄 Avtomatik Sync

Backend ishga tushganda avtomatik sync ishga tushadi:

```typescript
// main.ts da
kerioService.startAutoSync(5); // Har 5 minutda sync
```

## 📊 Database

Call records `calls` jadvaliga saqlanadi:
- `callId` - Kerio Operator call ID
- `pbxCallId` - Kerio Operator PBX call ID
- `recordingPath` - Recording fayl yo'li

## ⚠️ Muhim

1. **Kerio Operator API Endpoints:**
   - Haqiqiy API endpoint larni tekshirish kerak
   - API dokumentatsiyasini ko'rib chiqish kerak

2. **Authentication:**
   - Basic Auth yoki Token Auth
   - API credentials ni to'g'ri sozlash

3. **Rate Limiting:**
   - Kerio Operator API rate limit ni hisobga olish
   - Sync interval ni moslashtirish

## 🧪 Test Qilish

```bash
# Auth tekshirish
curl -X GET http://localhost:4000/kerio/auth/verify \
  -H "Authorization: Bearer YOUR_TOKEN"

# Sync qilish
curl -X POST http://localhost:4000/kerio/sync \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📝 Keyingi Qadamlar

1. Kerio Operator API dokumentatsiyasini ko'rib chiqish
2. Haqiqiy API endpoint larni tekshirish
3. Authentication usulini aniqlash
4. CDR formatini tekshirish
5. Recording URL formatini aniqlash

