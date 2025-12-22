# Kiruvchi Qo'ng'iroqlarni Yozish - Hal Qilish

## 🎯 Maqsad

Kerio Control dan kelgan qo'ng'iroqlarni backend database ga yozish.

## 🔧 O'zgarishlar

### 1. Dialplan Yangilandi

`extensions.conf` faylida `from-external` context yangilandi:

```ini
[from-external]
exten => _X.,1,NoOp(Kiruvchi qo'ng'iroq: ${EXTEN}, From: ${CALLERID(num)}, To: ${EXTEN})
 same => n,Set(CALL_ID=${UUID})
 same => n,Set(RECORDING_PATH=/var/spool/asterisk/recordings/call_${CALL_ID}.wav)
 same => n,Set(FROM_NUMBER=${CALLERID(num)})
 same => n,Set(TO_NUMBER=${EXTEN})
 same => n,MixMonitor(${RECORDING_PATH})
 same => n,Stasis(call-center,${CALL_ID},kiruvchi,${FROM_NUMBER},${TO_NUMBER})
 same => n,Hangup()

; EXTEN bo'sh bo'lsa ham ishlaydi
exten => s,1,NoOp(Kiruvchi qo'ng'iroq: From: ${CALLERID(num)})
 same => n,Set(CALL_ID=${UUID})
 same => n,Set(RECORDING_PATH=/var/spool/asterisk/recordings/call_${CALL_ID}.wav)
 same => n,Set(FROM_NUMBER=${CALLERID(num)})
 same => n,Set(TO_NUMBER=${EXTEN})
 same => n,MixMonitor(${RECORDING_PATH})
 same => n,Stasis(call-center,${CALL_ID},kiruvchi,${FROM_NUMBER},${TO_NUMBER})
 same => n,Hangup()
```

### 2. Backend Yangilandi

**AsteriskService:**
- `handleStasisStart` da argumentlarni to'g'ri olish
- Logging yaxshilandi
- Error handling yaxshilandi

**AsteriskGateway:**
- `handleChannelDestroyed` da `callsService` ni yuborish

## 📋 Qo'ng'iroq Flow

1. **Kerio Control** → Qo'ng'iroq keladi
2. **Asterisk** → `from-external` context ga yo'naladi
3. **Dialplan** → `Stasis(call-center,${CALL_ID},kiruvchi,${FROM_NUMBER},${TO_NUMBER})` chaqiriladi
4. **Backend ARI** → `StasisStart` event qabul qilinadi
5. **Backend** → Qo'ng'iroqni database ga yozadi
6. **Backend** → WebSocket orqali frontend ga yuboradi
7. **Qo'ng'iroq tugaganda** → `ChannelDestroyed` event
8. **Backend** → Qo'ng'iroqni yangilaydi (endTime, duration)

## 🧪 Test Qilish

### 1. Asterisk Dialplan Reload

```bash
ssh root@152.53.229.176
asterisk -rx "dialplan reload"
```

### 2. Backend Restart

```bash
pm2 restart call-center-backend --update-env
pm2 logs call-center-backend
```

### 3. Test Qo'ng'iroq

Kerio Control dan test qo'ng'iroq qiling.

### 4. Tekshirish

**Backend Loglar:**
```bash
pm2 logs call-center-backend | grep -i "stasis\|call"
```

Ko'rinishi kerak:
```
[Nest] LOG [AsteriskService] StasisStart: PJSIP/Kerio-00000001, CallId: ..., Direction: kiruvchi, From: ..., To: ...
[Nest] LOG [AsteriskService] Call record created: ...
```

**Database:**
```bash
sudo -u postgres psql -d callcenter -c "SELECT * FROM calls ORDER BY created_at DESC LIMIT 5;"
```

**Asterisk CLI:**
```bash
asterisk -rvvv
# Qo'ng'iroq kelganda loglarni ko'ring
```

## 🐛 Muammolar

### Qo'ng'iroq Kelmayapti

1. **SIP Trunk tekshirish:**
   ```bash
   asterisk -rx "pjsip show endpoints Kerio"
   ```

2. **Dialplan tekshirish:**
   ```bash
   asterisk -rx "dialplan show from-external"
   ```

3. **ARI tekshirish:**
   ```bash
   asterisk -rx "ari show status"
   ```

### Backend ga Kelmayapti

1. **ARI WebSocket ulanganmi?**
   - Backend loglarda "Connected to Asterisk ARI WebSocket" ko'rinishi kerak

2. **Stasis app nomi to'g'rimi?**
   - Dialplan da: `Stasis(call-center,...)` ✅
   - Backend da: `app=call-center` ✅

3. **Backend loglar:**
   ```bash
   pm2 logs call-center-backend --lines 100
   ```

### Database ga Yozilmayapti

1. **CallsService mavjudmi?**
   - Backend loglarda "Call record created" ko'rinishi kerak

2. **Database tekshirish:**
   ```bash
   sudo -u postgres psql -d callcenter -c "SELECT COUNT(*) FROM calls;"
   ```

## ✅ Checklist

- [ ] Dialplan reload qilindi
- [ ] Backend restart qilindi
- [ ] ARI WebSocket ulangan
- [ ] Test qo'ng'iroq qilindi
- [ ] Backend loglarida "StasisStart" ko'rinadi
- [ ] Database ga yozilgan
- [ ] Frontend da ko'rinadi

