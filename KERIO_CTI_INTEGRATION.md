# Kerio Operator CTI Integratsiyasi - To'liq Qo'llanma

## 🎯 Maqsad

Bu sistema **Kerio Operator PBX** dan qo'ng'iroq ma'lumotlarini olish va ko'rsatish uchun yaratilgan. Sistema **qo'ng'iroqlarni javob bermaydi** va **qo'ng'iroqlarni boshqarmaydi** - faqat monitoring va logging.

## ⚠️ MUHIM

- ❌ **PBX yaratmaydi** - Kerio Operator allaqachon bor
- ❌ **SIP signaling ishlatmaydi** - faqat API integratsiyasi
- ❌ **RTP/audio stream ishlatmaydi** - faqat metadata
- ❌ **Qo'ng'iroqlarni javob bermaydi** - IP telefonlar javob beradi
- ✅ **Faqat call events ni olish va ko'rsatish**

## 📋 Tizim Arxitektura

```
┌─────────────────┐
│ Kerio Operator  │ ← IP telefonlar ulanadi
│      PBX        │ ← Qo'ng'iroqlarni boshqaradi
└────────┬────────┘
         │ API (REST/SOAP)
         │
         ▼
┌─────────────────┐
│  Backend API    │ ← Call events ni polling qiladi
│  (NestJS)       │ ← CDR ni sync qiladi
└────────┬────────┘
         │ WebSocket
         │
         ▼
┌─────────────────┐
│  Frontend UI    │ ← Real-time call display
│   (React)       │ ← Call history
└─────────────────┘
```

## 🔧 Backend Qismi

### 1. KerioService

**Vazifasi:**
- Kerio Operator API ga ulanadi
- Faol qo'ng'iroqlarni polling qiladi (har 2 soniyada)
- CDR ni sync qiladi (har 5 daqiqada)
- WebSocket orqali frontend ga yuboradi

**Asosiy metodlar:**

```typescript
// Autentifikatsiya
await kerioService.authenticate()

// Faol qo'ng'iroqlarni polling
await kerioService.pollActiveCalls()

// CDR ni sync qilish
await kerioService.syncCallRecords()

// Real-time polling ni ishga tushirish
kerioService.startPolling(2) // har 2 soniyada

// CDR sync ni ishga tushirish
kerioService.startAutoSync(5) // har 5 daqiqada
```

### 2. Call State Tracking

**Call states (o'zbek tilida):**
- `kelyapti` - qo'ng'iroq kelmoqda (ringing)
- `suhbatda` - qo'ng'iroq javob berildi (connected)
- `yakunlandi` - qo'ng'iroq tugadi (ended)
- `javobsiz` - javob berilmadi (missed)

**State o'zgarishlari:**
- Yangi kiruvchi qo'ng'iroq → `kelyapti`
- Operator javob berdi → `suhbatda`
- Qo'ng'iroq tugadi → `yakunlandi`
- Javob berilmadi → `javobsiz`

### 3. WebSocket Events

**Frontend ga yuboriladigan eventlar:**

```typescript
// Yangi kiruvchi qo'ng'iroq
{
  event: 'incoming_call',
  data: {
    callId: 'pbx_call_id',
    fromNumber: '+998901234567',
    toNumber: '1001',
    direction: 'kiruvchi',
    startTime: '2025-01-01T12:00:00Z',
    state: 'kelyapti'
  }
}

// Call state o'zgarishi
{
  event: 'call_status',
  data: {
    callId: 'pbx_call_id',
    state: 'suhbatda' // yoki 'yakunlandi'
  }
}
```

## 🎨 Frontend Qismi

### 1. Dashboard - Real-time Call Display

**Kiruvchi qo'ng'iroq popup:**
```tsx
📞 Kiruvchi qo'ng'iroq
Raqam: +998901234567
Extension: 1001
Holat: Kelyapti
```

**Faol qo'ng'iroqlar ro'yxati:**
- Suhbatda bo'lgan qo'ng'iroqlar
- Davomiyligi real-time yangilanadi

### 2. Calls Page - Call History

**Ko'rsatiladigan ma'lumotlar:**
- Yo'nalish (Kiruvchi/Chiquvchi)
- Raqamlar
- Vaqt
- Davomiylik
- Holat (o'zbek tilida)
- Yozuvni eshitish tugmasi

## 📊 Database Schema

```prisma
model Call {
  id            String   @id @default(uuid())
  callId        String   @unique // PBX call ID
  direction     String   // "kiruvchi" | "chiquvchi"
  fromNumber    String
  toNumber      String
  extension     String?
  startTime     DateTime
  endTime       DateTime?
  duration      Int?     // sekundlarda
  status        String   // "javob berildi" | "javobsiz" | "band" | "xatolik"
  recordingPath String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

## ⚙️ Sozlash

### 1. Environment Variables

```env
# Kerio Operator API
KERIO_PBX_HOST=90.156.199.92
KERIO_API_USERNAME=your_api_username
KERIO_API_PASSWORD=your_api_password

# Sync intervals
KERIO_SYNC_INTERVAL=5      # daqiqada (CDR sync)
KERIO_POLL_INTERVAL=2      # soniyada (real-time polling)
```

### 2. Kerio Operator API Endpoints

**Kerio Operator API endpoint lari haqiqiy API ga moslashtirish kerak:**

```typescript
// CDR olish
GET /api/rest/v1/calls/cdr

// Faol qo'ng'iroqlarni olish
GET /api/rest/v1/calls/active

// Call recording olish
GET /api/rest/v1/calls/{callId}/recording
```

**Eslatma:** Haqiqiy Kerio Operator API endpoint lari farq qilishi mumkin. API dokumentatsiyasini tekshiring.

## 🚀 Ishga Tushirish

### Backend

```bash
cd backend
npm install
npm run build
npm run start:prod
```

Backend avtomatik ravishda:
1. Kerio Operator ga ulanadi
2. Real-time polling ni ishga tushiradi (har 2 soniyada)
3. CDR sync ni ishga tushiradi (har 5 daqiqada)

### Frontend

```bash
cd frontend
npm install
npm run build
npm run preview
```

## 📱 IP Telefonlar

**IP telefonlar Kerio Operator ga ulanadi:**

- SIP Server: Kerio Operator IP
- Username: Extension raqami
- Password: Extension paroli

**Bu sistema IP telefonlarni boshqarmaydi** - faqat call events ni olish va ko'rsatish.

## 🔍 Debugging

### Backend Logs

```bash
# PM2 logs
pm2 logs call-center-backend

# Yoki direkt
npm run start:dev
```

**Loglar:**
- `Kerio Operator service initialized`
- `Starting real-time polling every 2 seconds`
- `Starting auto-sync every 5 minutes`
- `Fetched X call records from Kerio Operator`
- `Synced X new call records`

### Frontend Console

```javascript
// WebSocket connection
socket.on('incoming_call', (data) => {
  console.log('New incoming call:', data);
});

socket.on('call_status', (data) => {
  console.log('Call status changed:', data);
});
```

## ⚠️ Xatoliklar

### 1. Kerio Operator ga ulanib bo'lmadi

**Sabab:**
- Noto'g'ri API credentials
- Network xatolik
- API endpoint noto'g'ri

**Yechim:**
- `.env` faylini tekshiring
- Kerio Operator API dokumentatsiyasini tekshiring
- Network connectivity ni tekshiring

### 2. Qo'ng'iroqlar ko'rinmayapti

**Sabab:**
- Polling ishlamayapti
- API endpoint noto'g'ri
- Call data format noto'g'ri

**Yechim:**
- Backend loglarini tekshiring
- API response ni tekshiring
- Call data mapping ni tekshiring

## 📝 Eslatmalar

1. **Bu sistema qo'ng'iroqlarni javob bermaydi** - IP telefonlar javob beradi
2. **Bu sistema qo'ng'iroqlarni boshqarmaydi** - Kerio Operator boshqaradi
3. **Bu sistema faqat monitoring va logging** - call events ni olish va ko'rsatish
4. **Kerio Operator API endpoint lari haqiqiy API ga moslashtirish kerak**

## 🔗 Foydali Linklar

- [Kerio Operator Documentation](https://www.kerio.com/support/kerio-operator)
- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)

