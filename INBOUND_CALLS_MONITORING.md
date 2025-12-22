# Inbound Calls Monitoring - Qo'ng'iroqlarni Tekshirish

## ✅ Endpoint Muvaffaqiyatli Sozlandi!

```
Endpoint:  Kerio                                                Not in use    0 of inf
```

## Qo'ng'iroq Kelganda Tekshirish

### 1. Real-time Monitoring

```bash
# Asterisk CLI da real-time monitoring
asterisk -rvvv

# Yoki backend loglar
pm2 logs call-center-backend
```

### 2. Qo'ng'iroq Kelganda

Qo'ng'iroq kelganda:
- Asterisk loglarda ko'rinadi
- Backend loglarda `StasisStart` event ko'rinadi
- Database da `Call` yaratiladi

### 3. Asterisk CLI da Tekshirish

```bash
asterisk -rvvv
```

CLI da quyidagi buyruqlarni ishlatish mumkin:

```
# Faol qo'ng'iroqlarni ko'rish
core show channels

# PJSIP endpoint status
pjsip show endpoints Kerio

# Qo'ng'iroq loglar
pjsip set logger on
```

### 4. Backend Loglar

```bash
# Real-time loglar
pm2 logs call-center-backend

# Yoki oxirgi 100 qator
pm2 logs call-center-backend --lines 100
```

Qo'ng'iroq kelganda backend loglarda quyidagilar ko'rinishi kerak:
- `StasisStart` event
- `Call created` log
- `Channel created` log

### 5. Database Tekshirish

```bash
# Qo'ng'iroqlar yaratilganini tekshirish
sudo -u postgres psql -d callcenter -c "SELECT * FROM calls ORDER BY created_at DESC LIMIT 10;"

# Yoki
sudo -u postgres psql -d callcenter -c "SELECT id, direction, from_number, to_number, status, created_at FROM calls ORDER BY created_at DESC LIMIT 10;"
```

## Test Qo'ng'iroq

### 1. Test Qo'ng'iroq Qilish

Kerio dan yoki boshqa telefon orqali test qo'ng'iroq qiling.

### 2. Loglarni Ko'rish

```bash
# Asterisk loglar
tail -f /var/log/asterisk/full

# Yoki Asterisk CLI da
asterisk -rvvv

# Backend loglar
pm2 logs call-center-backend
```

### 3. Database Tekshirish

```bash
# Qo'ng'iroqlar yaratilganini tekshirish
sudo -u postgres psql -d callcenter -c "SELECT * FROM calls ORDER BY created_at DESC LIMIT 5;"
```

## Qo'ng'iroq Flow

1. **SIP Trunk** → Qo'ng'iroq keladi (90.156.199.92 dan)
2. **Asterisk** → `from-external` context ga yo'naladi
3. **Dialplan** → `Stasis(call-center,${CALL_ID})` chaqiriladi
4. **Backend ARI** → `StasisStart` event qabul qilinadi
5. **Backend** → Qo'ng'iroqni database ga yozadi
6. **Backend** → Operatorga yo'naltiradi yoki kutish rejimiga qo'yadi

## Muammolar

### Qo'ng'iroq Kelmayapti

```bash
# SIP Trunk status
asterisk -rx "pjsip show endpoints Kerio"

# Dialplan tekshirish
asterisk -rx "dialplan show from-external"

# Loglar
tail -f /var/log/asterisk/full | grep -i kerio
```

### Backend ga Kelmayapti

```bash
# ARI ishlayaptimi?
asterisk -rx "ari show status"

# Stasis app ishlayaptimi?
asterisk -rx "stasis show applications"

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

## To'liq Monitoring

```bash
# 1. Asterisk CLI da
asterisk -rvvv

# 2. Backend loglar (boshqa terminalda)
pm2 logs call-center-backend

# 3. Database monitoring (boshqa terminalda)
watch -n 1 'sudo -u postgres psql -d callcenter -c "SELECT COUNT(*) FROM calls;"'
```

## Qo'ng'iroq Kelganda Ko'rinadigan Loglar

### Asterisk Loglarda:
```
[Dec 22 15:00:00] NOTICE: Channel PJSIP/21441-00000001 created
[Dec 22 15:00:00] NOTICE: Stasis app call-center started
```

### Backend Loglarda:
```
[Nest] LOG [AsteriskGateway] StasisStart event received
[Nest] LOG [CallsService] Call created: {id: ..., from: ..., to: ...}
```

