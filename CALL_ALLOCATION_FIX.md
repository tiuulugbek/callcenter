# "Allocation failed" Muammosini Hal Qilish

## Muammo
```
{"error": "Allocation failed"}
```

Bu muammo endpoint yoki dialplan bilan bog'liq bo'lishi mumkin.

## Yechim

### 1. Endpoint ni Tekshirish

```bash
curl -u backend:CallCenter2025 http://localhost:8088/ari/endpoints/SIPnomer
```

Agar endpoint topilmasa, PJSIP config ni tekshirish kerak.

### 2. Dialplan orqali Qo'ng'iroq Qilish (Tavsiya etiladi)

ARI da to'g'ridan-to'g'ri trunk ga qo'ng'iroq qilish o'rniga, dialplan orqali qo'ng'iroq qilish yaxshiroq:

```bash
curl -u backend:CallCenter2025 -X POST \
  "http://localhost:8088/ari/channels?endpoint=Local/998909429271@outbound&app=call-center&appArgs=chiquvchi,998909429271,998909429271&callerId=998909429271&timeout=30"
```

Bu `outbound` kontekstidagi dialplan ni ishlatadi va trunk ga yuboradi.

### 3. Yoki Backend API orqali (Eng Yaxshi)

Backend API avtomatik dialplan ni ishlatadi:

```bash
# Token olish
TOKEN=$(curl -X POST https://crm24.soundz.uz/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}' | jq -r '.access_token')

# Qo'ng'iroq qilish
curl -X POST https://crm24.soundz.uz/api/calls/outbound \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"fromNumber":"998909429271","toNumber":"998909429271"}'
```

### 4. Backend Kodini Tekshirish

Backend `makeOutboundCall` funksiyasi to'g'ri endpoint formatini ishlatishi kerak. Keling, tekshiramiz:

```javascript
// Backend da endpoint format:
endpoint: `PJSIP/${toNumber}@${trunkName}`
```

Lekin bu "Allocation failed" xatosi beradi. Yechim - dialplan orqali qo'ng'iroq qilish:

```javascript
endpoint: `Local/${toNumber}@outbound`
```

### 5. Backend Kodini Yangilash

Backend kodida endpoint formatini o'zgartirish kerak. Dialplan orqali qo'ng'iroq qilish yaxshiroq, chunki:
- Dialplan trunk ni avtomatik aniqlaydi
- Stasis orqali qo'ng'iroqni boshqaradi
- Recording va boshqa funksiyalar ishlaydi

