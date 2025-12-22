# Qo'ng'iroq Monitoring - Qo'ng'iroq Kelganda

## ✅ Endpoint Sozlandi!

Endpoint muvaffaqiyatli sozlangan va ishlayapti.

## Qo'ng'iroq Kelganda Monitoring

### 1. Asterisk CLI da Real-time Monitoring

```bash
asterisk -rvvv
```

CLI da quyidagi buyruqlarni ishlatish mumkin:

```
# Faol qo'ng'iroqlarni ko'rish
core show channels

# PJSIP endpoint status
pjsip show endpoints Kerio

# Qo'ng'iroq kelganda avtomatik ko'rinadi
```

### 2. Backend Loglar (Yangi Terminal)

```bash
# Real-time loglar
pm2 logs call-center-backend

# Yoki oxirgi 100 qator
pm2 logs call-center-backend --lines 100
```

### 3. Database Monitoring (Yangi Terminal)

```bash
# Qo'ng'iroqlar soni
sudo -u postgres psql -d callcenter -c "SELECT COUNT(*) FROM calls;"

# Oxirgi qo'ng'iroqlar
sudo -u postgres psql -d callcenter -c "SELECT id, direction, from_number, to_number, status, created_at FROM calls ORDER BY created_at DESC LIMIT 10;"

# Real-time monitoring
watch -n 1 'sudo -u postgres psql -d callcenter -c "SELECT COUNT(*) FROM calls;"'
```

## Qo'ng'iroq Kelganda Ko'rinadigan Loglar

### Asterisk CLI da:
```
[Dec 22 16:00:00] NOTICE: Channel PJSIP/Kerio-00000001 created
[Dec 22 16:00:00] NOTICE: Stasis app call-center started
Channel PJSIP/Kerio-00000001 is ringing
```

### Backend Loglarda:
```
[Nest] LOG [AsteriskGateway] StasisStart event received
[Nest] LOG [AsteriskService] StasisStart: PJSIP/Kerio-00000001, CallId: ...
[Nest] LOG [CallsService] Call created: {id: ..., from: ..., to: ...}
```

## Test Qo'ng'iroq

1. **Test qo'ng'iroq qiling** (Kerio dan yoki boshqa telefon orqali)
2. **Asterisk CLI da ko'ring:**
   ```
   core show channels
   ```
3. **Backend loglarni ko'ring:**
   ```bash
   pm2 logs call-center-backend
   ```
4. **Database ni tekshiring:**
   ```bash
   sudo -u postgres psql -d callcenter -c "SELECT * FROM calls ORDER BY created_at DESC LIMIT 5;"
   ```

## Qo'ng'iroq Flow

1. **SIP Trunk** → Qo'ng'iroq keladi (90.156.199.92 dan)
2. **Asterisk** → `from-external` context ga yo'naladi
3. **Dialplan** → `Stasis(call-center,${CALL_ID})` chaqiriladi
4. **Backend ARI** → `StasisStart` event qabul qilinadi
5. **Backend** → Qo'ng'iroqni database ga yozadi
6. **Backend** → WebSocket orqali frontend ga yuboradi

## To'liq Monitoring (3 ta Terminal)

### Terminal 1: Asterisk CLI
```bash
asterisk -rvvv
# CLI da: core show channels
```

### Terminal 2: Backend Loglar
```bash
pm2 logs call-center-backend
```

### Terminal 3: Database Monitoring
```bash
watch -n 1 'sudo -u postgres psql -d callcenter -c "SELECT COUNT(*) FROM calls;"'
```

## Muammolar

### Qo'ng'iroq Kelmayapti

```bash
# SIP Trunk status
asterisk -rx "pjsip show endpoints Kerio"

# Dialplan tekshirish
asterisk -rx "dialplan show from-external"

# Loglar
asterisk -rvvv
```

### Backend ga Kelmayapti

```bash
# ARI ishlayaptimi?
asterisk -rx "ari show status"

# Backend loglar
pm2 logs call-center-backend --lines 100
```

### Database ga Yozilmayapti

```bash
# Backend loglar
pm2 logs call-center-backend --lines 100

# Database connection
cd /var/www/call-center/backend
cat .env | grep DATABASE_URL
```

