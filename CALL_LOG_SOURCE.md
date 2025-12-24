# Call Loglar Qayerdan Olinadi?

## Hozirgi Tizim Arxitekturasi

### 1. Call Loglar Manbasi

Call loglar **Asterisk ARI (Asterisk REST Interface)** orqali olinadi:

```
Asterisk PBX
    ↓
ARI WebSocket (ws://localhost:8088/ari/events)
    ↓
AsteriskGateway (backend/src/asterisk/asterisk.gateway.ts)
    ↓
AsteriskService (backend/src/asterisk/asterisk.service.ts)
    ↓
CallsService (backend/src/calls/calls.service.ts)
    ↓
PostgreSQL Database
```

### 2. Qanday Ishlaydi?

#### A) AsteriskGateway
- Backend ishga tushganda ARI WebSocket ga ulanadi
- `ws://localhost:8088/ari/events?api_key=backend:CallCenter2025&app=call-center`
- Real-time eventlarni qabul qiladi:
  - `StasisStart` - qo'ng'iroq boshlanganda
  - `ChannelStateChange` - channel holati o'zgarganda
  - `ChannelDestroyed` - qo'ng'iroq tugaganda

#### B) AsteriskService
- Eventlarni qayta ishlaydi
- Call loglarni yaratadi va yangilaydi
- WebSocket orqali frontend ga real-time yangilanishlar yuboradi

#### C) CallsService
- Database ga call loglarni saqlaydi (PostgreSQL)
- Call loglarni qidirish va olish funksiyalari

### 3. Muhim: Dialplan Sozlash

Asterisk ARI eventlarni faqat **Stasis application** ga kelgan qo'ng'iroqlar uchun yuboradi.

Dialplan da (`extensions.conf`) quyidagi sozlash kerak:

```ini
[from-external]
; Kiruvchi qo'ng'iroqlar
exten => _X.,1,NoOp(Kiruvchi qo'ng'iroq: ${EXTEN})
 same => n,Set(CALL_ID=${UUID})
 same => n,Stasis(call-center,${CALL_ID},kiruvchi,${FROM_NUMBER},${TO_NUMBER})
 same => n,Hangup()

[outbound]
; Chiquvchi qo'ng'iroqlar
exten => _998X.,1,NoOp(Chiquvchi qo'ng'iroq: ${EXTEN})
 same => n,Set(CALL_ID=${UUID})
 same => n,Stasis(call-center,${CALL_ID},chiquvchi,${FROM_NUMBER},${TO_NUMBER})
 same => n,Hangup()
```

**Muhim:** `Stasis(call-center,...)` application dialplan da chaqirilishi kerak, aks holda ARI eventlar kelmaydi.

### 4. Call Log Ma'lumotlari

Har bir call log quyidagi ma'lumotlarni o'z ichiga oladi:

- `callId` - unique call identifier (UUID)
- `direction` - "kiruvchi" yoki "chiquvchi"
- `fromNumber` - qo'ng'iroq qiluvchi raqam
- `toNumber` - qo'ng'iroq qabul qiluvchi raqam
- `startTime` - qo'ng'iroq boshlanish vaqti
- `endTime` - qo'ng'iroq tugash vaqti
- `duration` - qo'ng'iroq davomiyligi (sekundlarda)
- `status` - "kelyapti", "suhbatda", "yakunlandi"
- `recordingPath` - yozuv fayli joylashuvi

### 5. Tekshirish

#### ARI ulanishini tekshirish:
```bash
# Backend loglarini ko'rish
pm2 logs call-center-backend | grep -i "ARI\|StasisStart\|Channel"

# ARI WebSocket ulanishini tekshirish
curl -u backend:CallCenter2025 http://localhost:8088/ari/asterisk/info
```

#### Dialplan ni tekshirish:
```bash
# Asterisk CLI ga kirish
sudo asterisk -rvvv

# Dialplan ni ko'rish
dialplan show from-external
dialplan show outbound

# Stasis application ishlatilayotganini tekshirish
core show applications | grep -i stasis
```

### 6. Muammo Bo'lsa

Agar call loglar kelmayotgan bo'lsa:

1. **ARI ulanishini tekshirish:**
   - Backend loglarida "Connected to Asterisk ARI WebSocket" ko'rinishi kerak
   - ARI credentials to'g'ri bo'lishi kerak (`backend/.env`)

2. **Dialplan ni tekshirish:**
   - `Stasis(call-center,...)` application chaqirilayotganini tekshirish
   - Dialplan reload qilish: `sudo asterisk -rx "dialplan reload"`

3. **Asterisk ARI ni tekshirish:**
   - ARI yoqilgan bo'lishi kerak (`/etc/asterisk/ari.conf`)
   - ARI port ochiq bo'lishi kerak (8088)

### 7. Qo'shimcha Ma'lumot

- **ARI Documentation:** https://wiki.asterisk.org/wiki/display/AST/Asterisk+REST+Interface
- **Stasis Application:** Dialplan da `Stasis()` application chaqirilganda ARI eventlar yuboriladi
- **Event Types:** StasisStart, ChannelStateChange, ChannelDestroyed va boshqalar

