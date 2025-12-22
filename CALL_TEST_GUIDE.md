# Qo'ng'iroq Test Qo'llanmasi

## ✅ Backend Ishlamoqda!

Backend loglarda ko'rsatilgan:
- ARI WebSocket ulangan ✅
- Backend ishlayapti ✅
- Barcha route'lar mapp qilingan ✅

## Qo'ng'iroq Kelganda Nima Bo'ladi?

### 1. Qo'ng'iroq Flow

1. **SIP Trunk** → Qo'ng'iroq keladi (90.156.199.92 dan)
2. **Asterisk** → `from-external` context ga yo'naladi
3. **Dialplan** → `Stasis(call-center,${CALL_ID})` chaqiriladi
4. **Backend ARI** → `StasisStart` event qabul qilinadi
5. **Backend** → Qo'ng'iroqni database ga yozadi
6. **Backend** → WebSocket orqali frontend ga yuboradi

### 2. Qo'ng'iroq Kelganda Ko'rinadigan Loglar

**Asterisk CLI da:**
```
[Dec 22 16:30:00] NOTICE: Channel PJSIP/Kerio-00000001 created
[Dec 22 16:30:00] NOTICE: Stasis app call-center started
```

**Backend Loglarda:**
```
[Nest] LOG [AsteriskGateway] StasisStart event received
[Nest] LOG [AsteriskService] StasisStart: PJSIP/Kerio-00000001, CallId: ...
[Nest] LOG [CallsService] Call created: {id: ..., from: ..., to: ...}
```

## Test Qo'ng'iroq

### 1. Real-time Monitoring

**Terminal 1: Asterisk CLI**
```bash
asterisk -rvvv
# CLI da: core show channels
```

**Terminal 2: Backend Loglar**
```bash
pm2 logs call-center-backend
```

**Terminal 3: Database Monitoring**
```bash
watch -n 1 'sudo -u postgres psql -d callcenter -c "SELECT COUNT(*) FROM calls;"'
```

### 2. Test Qo'ng'iroq Qilish

Kerio dan yoki boshqa telefon orqali test qo'ng'iroq qiling.

### 3. Tekshirish

```bash
# Asterisk CLI da
core show channels

# Backend loglar
pm2 logs call-center-backend

# Database
sudo -u postgres psql -d callcenter -c "SELECT * FROM calls ORDER BY created_at DESC LIMIT 5;"
```

## Muammolar

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
   - Backend loglarda "Connected to Asterisk ARI WebSocket" ko'rinishi kerak ✅

2. **Stasis app nomi to'g'rimi?**
   - Dialplan da: `Stasis(call-center,${CALL_ID})` ✅
   - Backend da: `app=call-center` ✅

3. **Backend loglar:**
   ```bash
   pm2 logs call-center-backend --lines 100
   ```

## GitHub Workflow

### Lokal - Push Qilish

```bash
cd /Users/tiuulugbek/asterisk-call-center
git add .
git commit -m "Fix: Qo'ng'iroq sozlamalari"
git push origin main
```

### Serverda - Pull Qilish

```bash
ssh root@152.53.229.176
cd /var/www/call-center
git pull origin main
cd backend && npm install && npm run build && pm2 restart call-center-backend --update-env
```

Yoki deploy script:
```bash
cd /var/www/call-center
./deploy.sh
```

