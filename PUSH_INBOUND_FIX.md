# Push va Deploy - Kiruvchi Qo'ng'iroqlar Fix

## 📤 Lokal Mashinada - Push Qilish

Terminal da quyidagi buyruqlarni bajaring:

```bash
cd /Users/tiuulugbek/asterisk-call-center

# Barcha o'zgarishlarni qo'shish
git add .

# Commit qilish
git commit -m "Fix: Inbound calls logging - Dialplan va backend yangilandi

- Dialplan da Stasis appArgs ga direction, fromNumber, toNumber qo'shildi
- Backend da handleStasisStart yangilandi (argumentlarni to'g'ri olish)
- handleChannelDestroyed da call ni yangilash (endTime, duration)
- Logging va error handling yaxshilandi"

# GitHub ga push qilish
git push origin main
```

## 📥 Serverda - Pull va Deploy

SSH orqali serverga ulaning va quyidagilarni bajaring:

```bash
# Serverga ulanish
ssh root@152.53.229.176

# Project papkasiga o'tish
cd /var/www/call-center

# Git pull
git pull origin main

# Asterisk Dialplan Reload
asterisk -rx "dialplan reload"

# Backend Restart
cd backend
npm install
npm run build
pm2 restart call-center-backend --update-env

# Backend Loglar
pm2 logs call-center-backend --lines 50
```

## ✅ Tekshirish

### 1. Asterisk Dialplan

```bash
asterisk -rx "dialplan show from-external"
```

### 2. Backend Loglar

```bash
pm2 logs call-center-backend | grep -i "stasis\|call"
```

Ko'rinishi kerak:
```
[Nest] LOG [AsteriskService] StasisStart: PJSIP/Kerio-00000001, CallId: ..., Direction: kiruvchi
[Nest] LOG [AsteriskService] Call record created: ...
```

### 3. Database

```bash
sudo -u postgres psql -d callcenter -c "SELECT * FROM calls ORDER BY created_at DESC LIMIT 5;"
```

### 4. Test Qo'ng'iroq

Kerio Control dan test qo'ng'iroq qiling va database ga yozilganligini tekshiring.

## 🎯 Yangi Funksiyalar

1. **Dialplan yangilandi:**
   - `from-external` context da `Stasis` appArgs ga `direction`, `fromNumber`, `toNumber` qo'shildi
   - `exten => s` qo'shildi (EXTEN bo'sh bo'lsa ham ishlaydi)

2. **Backend yangilandi:**
   - `handleStasisStart` da argumentlarni to'g'ri olish
   - Logging yaxshilandi
   - Error handling yaxshilandi
   - `handleChannelDestroyed` da call ni yangilash (endTime, duration)

3. **AsteriskGateway yangilandi:**
   - `handleChannelDestroyed` da `callsService` ni yuborish

## 📋 Checklist

- [ ] Git push qilindi
- [ ] Serverda git pull qilindi
- [ ] Asterisk dialplan reload qilindi
- [ ] Backend restart qilindi
- [ ] Test qo'ng'iroq qilindi
- [ ] Database ga yozilganligi tekshirildi
- [ ] Backend loglarida "StasisStart" ko'rinadi

