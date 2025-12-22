# Kiruvchi Qo'ng'iroqlar Debugging - To'liq Qo'llanma

## 🔍 Muammo

Database da calls jadvali bo'sh (0 rows). Qo'ng'iroqlar database ga yozilmayapti.

## 📋 Tekshirish Qadamlari

### 1. Asterisk Dialplan Tekshirish

```bash
# Dialplan reload qilinganligini tekshiring
asterisk -rx "dialplan reload"

# Dialplan ko'rinishini tekshiring
asterisk -rx "dialplan show from-external"
```

Ko'rinishi kerak:
```
[from-external]
  _X. =>      1. NoOp(Kiruvchi qo'ng'iroq: ${EXTEN}...)
             2. Set(CALL_ID=${UUID})
             3. Set(RECORDING_PATH=...)
             4. Set(FROM_NUMBER=${CALLERID(num)})
             5. Set(TO_NUMBER=${EXTEN})
             6. MixMonitor(...)
             7. Stasis(call-center,${CALL_ID},kiruvchi,${FROM_NUMBER},${TO_NUMBER})
             8. Hangup()
```

### 2. ARI WebSocket Ulanishi Tekshirish

```bash
# Backend loglarida "Connected to Asterisk ARI WebSocket" ko'rinishi kerak
pm2 logs call-center-backend | grep -i "connected\|ari\|websocket"
```

### 3. Asterisk ARI Status Tekshirish

```bash
# ARI ishlayaptimi?
asterisk -rx "ari show status"

# Stasis app ro'yxatini ko'rish
asterisk -rx "stasis show applications"
```

Ko'rinishi kerak:
```
Application: call-center
```

### 4. SIP Trunk Status Tekshirish

```bash
# Kerio trunk holatini tekshiring
asterisk -rx "pjsip show endpoints Kerio"

# Barcha endpointlarni ko'rish
asterisk -rx "pjsip show endpoints"
```

### 5. Real-time Monitoring

**Terminal 1: Asterisk CLI (verbose)**
```bash
asterisk -rvvv
```

**Terminal 2: Backend Loglar**
```bash
pm2 logs call-center-backend --lines 100
```

**Terminal 3: Database Monitoring**
```bash
watch -n 1 'sudo -u postgres psql -d callcenter -c "SELECT COUNT(*) FROM calls;"'
```

### 6. Test Qo'ng'iroq

Kerio Control dan test qo'ng'iroq qiling va quyidagilarni kuzating:

**Asterisk CLI da ko'rinishi kerak:**
```
[Dec 22 17:00:00] NOTICE: Channel PJSIP/Kerio-00000001 created
[Dec 22 17:00:00] NOTICE: Stasis app call-center started
[Dec 22 17:00:00] NOTICE: NoOp: Kiruvchi qo'ng'iroq: ...
```

**Backend loglarida ko'rinishi kerak:**
```
[Nest] LOG [AsteriskGateway] StasisStart event received
[Nest] LOG [AsteriskService] StasisStart: PJSIP/Kerio-00000001, CallId: ..., Direction: kiruvchi
[Nest] LOG [AsteriskService] Call record created: ...
```

## 🐛 Muammolar va Yechimlar

### Muammo 1: Dialplan Reload Qilinmagan

**Belgilar:**
- Dialplan o'zgarishlari ko'rinmayapti

**Yechim:**
```bash
asterisk -rx "dialplan reload"
# Yoki
asterisk -rx "core reload"
```

### Muammo 2: ARI WebSocket Ulanmagan

**Belgilar:**
- Backend loglarida "Connected to Asterisk ARI WebSocket" ko'rinmayapti

**Yechim:**
```bash
# ARI parolni tekshiring
cat /var/www/call-center/backend/.env | grep ASTERISK_ARI

# ARI ni test qilish
curl -u backend:CallCenter2025 http://localhost:8088/ari/asterisk/info

# Backend restart
pm2 restart call-center-backend --update-env
```

### Muammo 3: Stasis App Nomlash Muammosi

**Belgilar:**
- `stasis show applications` da `call-center` ko'rinmayapti

**Yechim:**
- Dialplan da `Stasis(call-center,...)` to'g'ri yozilganligini tekshiring
- Backend da `app=call-center` to'g'ri sozlanganligini tekshiring

### Muammo 4: SIP Trunk Ulanmagan

**Belgilar:**
- `pjsip show endpoints Kerio` da "Not in use" ko'rinadi

**Yechim:**
```bash
# PJSIP reload
asterisk -rx "pjsip reload"

# Trunk holatini tekshiring
asterisk -rx "pjsip show endpoints Kerio"
```

### Muammo 5: Database Connection Muammosi

**Belgilar:**
- Backend loglarida database xatolari ko'rinadi

**Yechim:**
```bash
# Database connection tekshiring
sudo -u postgres psql -d callcenter -c "SELECT 1;"

# Backend .env da DATABASE_URL ni tekshiring
cat /var/www/call-center/backend/.env | grep DATABASE_URL
```

## 🔧 To'liq Debugging Script

```bash
#!/bin/bash

echo "=== Asterisk Dialplan ==="
asterisk -rx "dialplan show from-external"

echo ""
echo "=== ARI Status ==="
asterisk -rx "ari show status"

echo ""
echo "=== Stasis Applications ==="
asterisk -rx "stasis show applications"

echo ""
echo "=== SIP Trunk Status ==="
asterisk -rx "pjsip show endpoints Kerio"

echo ""
echo "=== Backend Logs (last 20 lines) ==="
pm2 logs call-center-backend --lines 20 --nostream

echo ""
echo "=== Database Calls Count ==="
sudo -u postgres psql -d callcenter -c "SELECT COUNT(*) FROM calls;"
```

## ✅ Checklist

- [ ] Dialplan reload qilindi
- [ ] ARI WebSocket ulangan
- [ ] Stasis app ro'yxatida `call-center` ko'rinadi
- [ ] SIP trunk ulangan
- [ ] Backend ishlayapti
- [ ] Test qo'ng'iroq qilindi
- [ ] Asterisk CLI da qo'ng'iroq ko'rinadi
- [ ] Backend loglarida "StasisStart" ko'rinadi
- [ ] Database ga yozilgan

## 📞 Keyingi Qadamlar

Agar barcha tekshiruvlar o'tgan bo'lsa, lekin qo'ng'iroqlar yozilmayotgan bo'lsa:

1. **Backend loglarini to'liq ko'ring:**
   ```bash
   pm2 logs call-center-backend --lines 200
   ```

2. **Asterisk CLI da verbose mode:**
   ```bash
   asterisk -rvvv
   ```

3. **Database connection tekshiring:**
   ```bash
   sudo -u postgres psql -d callcenter -c "\dt"
   ```

4. **CallsService tekshiring:**
   - Backend loglarida "Call record created" ko'rinishi kerak
   - Agar ko'rinmasa, CallsService muammosi bo'lishi mumkin

