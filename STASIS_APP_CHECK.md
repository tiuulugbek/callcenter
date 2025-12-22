# Stasis App Tekshirish - Inbound Calls

## Muammo
- Database bo'sh (qo'ng'iroq kelmagan)
- Endpoint sozlangan ✅
- Dialplan sozlangan ✅
- Backend ishlayapti ✅

## Tekshirish

### 1. Stasis App Ishlamoqdamimi?

```bash
# Asterisk CLI da
asterisk -rvvv
```

CLI da:
```
stasis show applications
```

`call-center` app ko'rinishi kerak.

### 2. ARI WebSocket Ulanganmi?

Backend loglarda ko'rsatilgan:
```
[AsteriskGateway] Connected to Asterisk ARI WebSocket
```

Bu to'g'ri.

### 3. Dialplan Tekshirish

Dialplan to'g'ri sozlangan:
```
Stasis(call-center,${CALL_ID})
```

### 4. Qo'ng'iroq Kelganda Test

```bash
# Real-time monitoring
asterisk -rvvv

# Yoki backend loglar
pm2 logs call-center-backend
```

## Muammolar

### Stasis App Ishlamayapti

```bash
# Asterisk CLI da
stasis show applications

# Agar ko'rinmasa, reload
core reload
```

### Qo'ng'iroq Kelmayapti

```bash
# SIP Trunk status
pjsip show endpoints Kerio

# Dialplan test
dialplan show from-external

# Loglar
pjsip set logger on
```

### Backend ga Kelmayapti

```bash
# ARI status
ari show status

# Backend loglar
pm2 logs call-center-backend --lines 100

# ARI WebSocket ulanganmi?
# Backend loglarda "Connected to Asterisk ARI WebSocket" ko'rinishi kerak
```

## Test Qo'ng'iroq

1. Test qo'ng'iroq qiling
2. Asterisk CLI da ko'ring:
   ```
   core show channels
   ```
3. Backend loglarni ko'ring:
   ```bash
   pm2 logs call-center-backend
   ```
4. Database ni tekshiring:
   ```bash
   sudo -u postgres psql -d callcenter -c "SELECT * FROM calls ORDER BY created_at DESC LIMIT 5;"
   ```

## Qo'ng'iroq Kelganda Ko'rinadigan Loglar

### Asterisk CLI da:
```
Channel PJSIP/Kerio-00000001 created
Stasis app call-center started
```

### Backend Loglarda:
```
[Nest] LOG [AsteriskGateway] StasisStart event received
[Nest] LOG [CallsService] Call created
```

