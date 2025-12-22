# Qo'ng'iroq Ishlamayapti - Debug Qo'llanmasi

## Muammoni Aniqlash

### 1. Asterisk Loglar

```bash
# Real-time loglar
asterisk -rvvv

# Yoki
sudo journalctl -u asterisk -f
```

### 2. Backend Loglar

```bash
# Real-time loglar
pm2 logs call-center-backend

# Yoki oxirgi 100 qator
pm2 logs call-center-backend --lines 100
```

### 3. ARI Tekshirish

```bash
# ARI ishlayaptimi?
asterisk -rx "ari show status"

# ARI WebSocket ulanganmi?
# Backend loglarda "Connected to Asterisk ARI WebSocket" ko'rinishi kerak
```

### 4. Stasis App Tekshirish

```bash
# Qo'ng'iroq kelganda Asterisk CLI da
core show channels

# Qo'ng'iroq kelganda ko'rinishi kerak
```

## GitHub Workflow

### Lokal (Development)

```bash
cd /Users/tiuulugbek/asterisk-call-center

# O'zgarishlarni qo'shish
git add .

# Commit qilish
git commit -m "Fix: Qo'ng'iroq muammosini hal qilish"

# GitHub ga push qilish
git push origin main
```

### Serverda (Production)

```bash
ssh root@152.53.229.176

# Kodni yangilash
cd /var/www/call-center
git pull origin main

# Backend yangilanishlar
cd backend
npm install  # Yangi paketlar bo'lsa
npm run prisma:generate  # Agar schema o'zgarganda
npm run build
pm2 restart call-center-backend --update-env

# Frontend yangilanishlar (agar o'zgarganda)
cd ../frontend
npm install
npm run build
cp -r dist/* /var/www/crm24/
```

## Tezkor Deploy Script

Serverda `deploy.sh` script ni ishlatish:

```bash
cd /var/www/call-center
./deploy.sh
```

## Muammolarni Hal Qilish

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
   - Dialplan da: `Stasis(call-center,${CALL_ID})`
   - Backend da: `app=call-center`

3. **Backend loglar:**
   ```bash
   pm2 logs call-center-backend --lines 100
   ```

## To'liq Debug

```bash
# 1. Asterisk CLI da
asterisk -rvvv
# CLI da: core show channels

# 2. Backend loglar (yangi terminal)
pm2 logs call-center-backend

# 3. Test qo'ng'iroq qiling va loglarni ko'ring
```

