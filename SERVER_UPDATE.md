# Serverni Yangilash - SIP Trunk Fix

## 1. Git Pull

```bash
cd /var/www/call-center
git pull origin main
```

## 2. Backend Build

```bash
cd backend
npm install
npm run build
pm2 restart call-center-backend
```

## 3. Trunk Holatini Tekshirish

Trunk "Unavailable" holati normal - Bell.uz trunk uchun registratsiya kerak emas. Faqat outbound qo'ng'iroqlar uchun ishlatiladi.

```bash
sudo asterisk -rx "pjsip show endpoints" | grep SIPnomer
```

## 4. Qo'ng'iroq Qilish

Trunk "Unavailable" bo'lsa ham qo'ng'iroq qilish mumkin. Dialplan da trunk nomini ishlating:

```bash
sudo nano /etc/asterisk/extensions.conf
```

Quyidagi dialplan qo'shing:

```ini
[outbound]
exten => _998X.,1,NoOp(Chiquvchi qo'ng'iroq trunk orqali: ${EXTEN})
 same => n,Dial(PJSIP/${EXTEN}@SIPnomer,30)
 same => n,Hangup()
```

Keyin:
```bash
sudo asterisk -rx "dialplan reload"
```

## 5. Test Qo'ng'iroq

```bash
# Asterisk CLI da
sudo asterisk -rvvv
channel originate PJSIP/998901234567@SIPnomer application Playback hello-world
```

## 6. Backend Loglarini Tekshirish

```bash
pm2 logs call-center-backend --lines 50
```

