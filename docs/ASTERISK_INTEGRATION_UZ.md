# Mavjud Asterisk Serverni CRM Tizimiga Ulash Qo'llanmasi

Ushbu qo'llanma serveringizdagi mavjud Asterisk stansiyasini hech qanday qayta o'rnatishlarsiz CRM tizimi bilan bog'lash uchun mo'ljallangan.

---

### 1-qadam: Asterisk HTTP serverini yoqish

Asterisk ARI ishlashi uchun uning o'rnatilgan HTTP serveri yoqilgan bo'lishi kerak.
Fayl: `/etc/asterisk/http.conf`

```ini
[general]
enabled=yes
bindaddr=127.0.0.1
bindport=8088
```

> **Eslatma:** Agar CRM va Asterisk bitta serverda tursa, `bindaddr=127.0.0.1` xavfsiz hisoblanadi. Agar alohida serverlarda bo'lsa, `0.0.0.0` qilib o'rnatiladi.

---

### 2-qadam: Asterisk ARI foydalanuvchisini yaratish

CRM tizimi Asterisk'ga ulanishi uchun ARI foydalanuvchisi sozlanadi.
Fayl: `/etc/asterisk/ari.conf`

```ini
[general]
enabled=yes
pretty=yes
allowed_origins=*

[backend]
type=user
read_only=no
password=sizning_maxfiy_parolingiz
```

Sozlamalarni kiritgandan so'ng Asterisk konsolida qayta yuklang:
```bash
asterisk -rx "module reload res_http_server.so"
asterisk -rx "module reload res_ari.so"
```

Ulanishni tekshirish:
```bash
curl -u backend:sizning_maxfiy_parolingiz http://127.0.0.1:8088/ari/asterisk/info
```
Agar JSON ma'lumot qaytsa, Asterisk ARI to'g'ri sozlangan!

---

### 3-qadam: Dialplan orqali voqealarni CRM'ga yuborish

Qo'ng'iroqlar kelganda CRM ularni real-vaqtda ushlab olishi va audio fayllarni yozishi uchun dialplanda `Stasis` ilovasi ishlatiladi.
Fayl: `/etc/asterisk/extensions.conf`

Kiruvchi va chiquvchi yo'nalishlarga quyidagicha qo'shiladi:
```ini
; Kiruvchi qo'ng'iroq kelganda
exten => _X.,1,NoOp(CRM monitoring)
 same => n,Set(CALL_ID=${UNIQUEID})
 same => n,MixMonitor(/var/spool/asterisk/recordings/call_${CALL_ID}.wav,b)
 same => n,Stasis(call-center,${CALL_ID},kiruvchi,${CALLERID(num)},${EXTEN})
 same => n,Dial(PJSIP/${EXTEN},30)
 same => n,Hangup()
```

---

### 4-qadam: Backend `.env` faylini sozlash

Backend papkasida (`backend/.env`):
```env
PORT=4000
DATABASE_URL="postgresql://callcenter_user:callcenter_secret_pass@localhost:5432/callcenter?schema=public"
JWT_SECRET="crm_super_secret_jwt_key_2024"

# Asterisk ARI sozlamalari:
ASTERISK_ARI_URL=http://localhost:8088/ari
ASTERISK_ARI_WS_URL=ws://localhost:8088/ari/events
ASTERISK_ARI_USERNAME=backend
ASTERISK_ARI_PASSWORD=sizning_maxfiy_parolingiz

# Telegram Bot sozlamalari (Ixtiyoriy):
TELEGRAM_BOT_TOKEN=sizning_bot_tokeningiz
TELEGRAM_POLLING=true
```

---

### 5-qadam: Audio yozuvlarni tejash (Avtomatik MP3 siqish)

80 GB diskni to'lib ketishdan asrash uchun har soatda `.wav` fayllarni sifatli `.mp3` formatga siquvchi skript:
```bash
chmod +x scripts/compress_recordings.sh
# Sinab ko'rish:
./scripts/compress_recordings.sh
```
Crontab orqali avtomatik rejimda har soatda ishlaydi.
