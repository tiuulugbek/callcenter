# SIP Trunk Orqali Telefon Qo'ng'iroqlarini Qilish Qo'llanmasi

## 1. SIP Trunk Qo'shish

### Settings sahifasida:
1. `https://crm24.soundz.uz/settings` ga kiring
2. "SIP Provayder" tabini tanlang
3. Bell.uz ma'lumotlarini kiriting:
   - **Nomi**: `BellUZ` (yoki istalgan nom)
   - **SIP Server**: `bell.uz`
   - **Login**: Bell.uz dan olingan login
   - **Password**: Bell.uz dan olingan parol
   - **Port**: `5060` (default)
   - **Transport**: `UDP` (default)
4. "Ma'lumotlarni Saqlash" tugmasini bosing

### Tekshirish:
```bash
# Asterisk CLI ga kiring
sudo asterisk -rvvv

# Trunk holatini tekshirish
pjsip show endpoints
pjsip show registrations

# Trunk registratsiya qilinganini ko'rish kerak
# Masalan: BellUZ endpoint "Registered" holatida bo'lishi kerak
```

## 2. Dialplan Sozlash

### Extensions.conf faylini yangilash:

```bash
sudo nano /etc/asterisk/extensions.conf
```

### Chiquvchi qo'ng'iroqlar uchun dialplan:

```ini
[outbound]
; BellUZ trunk orqali chiquvchi qo'ng'iroq
; Format: PJSIP/number@trunk-name
exten => _998X.,1,NoOp(Chiquvchi qo'ng'iroq BellUZ trunk orqali: ${EXTEN})
 same => n,Set(CALL_ID=${UUID})
 same => n,Set(RECORDING_PATH=/var/spool/asterisk/recordings/call_${CALL_ID}.wav)
 same => n,Set(FROM_NUMBER=${CALLERID(num)})
 same => n,Set(TO_NUMBER=${EXTEN})
 same => n,Dial(PJSIP/${EXTEN}@BellUZ,30)
 same => n,Hangup()
```

### Asterisk ni reload qilish:

```bash
sudo asterisk -rx "dialplan reload"
sudo asterisk -rx "pjsip reload"
```

## 3. Backend API Endpoint

### Qo'ng'iroq qilish API:

```bash
POST /api/calls/outbound
Content-Type: application/json
Authorization: Bearer <token>

{
  "fromNumber": "998901234567",  // Qayerdan qo'ng'iroq qilinmoqda
  "toNumber": "998901234567",    // Qayerga qo'ng'iroq qilinmoqda
  "trunkName": "BellUZ"          // Trunk nomi (ixtiyoriy, default: BellUZ)
}
```

## 4. Frontend UI Qo'shish

### Calls sahifasiga qo'ng'iroq qilish tugmasi qo'shish:

1. Calls sahifasida "Qo'ng'iroq qilish" tugmasi
2. Raqam kiritish maydoni
3. Trunk tanlash dropdown (agar bir nechta trunk bo'lsa)
4. Qo'ng'iroq boshlash funksiyasi

## 5. Qo'ng'iroq Qilish Jarayoni

### Backend (AsteriskService):

1. **Trunk nomini aniqlash:**
   - Agar `trunkName` berilgan bo'lsa, uni ishlatish
   - Aks holda, database dan birinchi faol trunk ni topish
   - Yoki default "BellUZ" ni ishlatish

2. **ARI orqali qo'ng'iroq boshlash:**
   ```javascript
   endpoint: `PJSIP/${toNumber}@${trunkName}`
   ```

3. **Qo'ng'iroq holatini kuzatish:**
   - WebSocket orqali real-time yangilanishlar
   - Qo'ng'iroq holati: "ringing", "answered", "ended"

### Frontend:

1. **Qo'ng'iroq qilish formasi:**
   - Raqam kiritish
   - Trunk tanlash (ixtiyoriy)
   - "Qo'ng'iroq qilish" tugmasi

2. **API so'rov:**
   ```javascript
   await callsApi.makeOutbound({
     fromNumber: "998901234567",
     toNumber: "998901234567",
     trunkName: "BellUZ"  // ixtiyoriy
   })
   ```

3. **Qo'ng'iroq holatini ko'rsatish:**
   - Real-time WebSocket orqali
   - Qo'ng'iroq holati: "ringing", "answered", "ended"

## 6. Tekshirish

### 1. Trunk holatini tekshirish:
```bash
sudo asterisk -rvvv
pjsip show endpoints
pjsip show registrations
```

### 2. Qo'ng'iroq qilish:
- Frontend da Calls sahifasiga kiring
- Raqam kiriting va "Qo'ng'iroq qilish" tugmasini bosing
- Qo'ng'iroq boshlanishini kuzating

### 3. Loglarni tekshirish:
```bash
# Backend loglar
pm2 logs call-center-backend --lines 50

# Asterisk loglar
sudo tail -f /var/log/asterisk/full
```

## 7. Muammolarni Hal Qilish

### Trunk ulanmayapti:
1. **Trunk ma'lumotlarini tekshirish:**
   ```bash
   sudo asterisk -rvvv
   pjsip show endpoints
   ```

2. **PJSIP config ni tekshirish:**
   ```bash
   sudo cat /etc/asterisk/pjsip.conf | grep -A 20 "BellUZ"
   ```

3. **Trunk ni qayta registratsiya qilish:**
   ```bash
   sudo asterisk -rx "pjsip reload"
   ```

### Qo'ng'iroq boshlanmayapti:
1. **Dialplan ni tekshirish:**
   ```bash
   sudo asterisk -rx "dialplan show outbound"
   ```

2. **ARI ulanishini tekshirish:**
   ```bash
   curl -u backend:secure_password http://localhost:8088/ari/endpoints
   ```

3. **Backend loglarini tekshirish:**
   ```bash
   pm2 logs call-center-backend --lines 100
   ```

## 8. Muhim Eslatmalar

1. **Trunk nomi:** Settings sahifasida kiritilgan trunk nomi bilan dialplan da ishlatilishi kerak
2. **Raqam formati:** `998XXXXXXXXX` formatida bo'lishi kerak
3. **ARI sozlamalari:** Backend .env da `ASTERISK_ARI_URL`, `ASTERISK_ARI_USERNAME`, `ASTERISK_ARI_PASSWORD` bo'lishi kerak
4. **WebSocket:** Real-time qo'ng'iroq holatini ko'rsatish uchun WebSocket ishlatiladi

