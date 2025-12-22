# Loyiha Strukturasi

## Umumiy Ko'rinish

```
asterisk-call-center/
├── asterisk-config/          # Asterisk konfiguratsiya fayllari
│   ├── ari.conf              # ARI sozlamalari
│   ├── http.conf             # HTTP server sozlamalari
│   ├── pjsip.conf            # PJSIP sozlamalari
│   └── extensions.conf       # Dialplan
├── backend/                  # NestJS backend
│   ├── src/
│   │   ├── asterisk/         # Asterisk ARI integratsiyasi
│   │   ├── calls/            # Qo'ng'iroqlar moduli
│   │   ├── chats/            # Chatlar moduli
│   │   │   └── integrations/ # Telegram, Facebook integratsiyalari
│   │   ├── operators/        # Operatorlar moduli
│   │   ├── auth/             # Autentifikatsiya
│   │   └── common/           # Umumiy modullar
│   ├── prisma/               # Prisma schema va migratsiyalar
│   └── package.json
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── pages/            # Sahifalar
│   │   ├── components/       # Komponentlar
│   │   ├── contexts/         # React contextlar
│   │   └── services/         # API va WebSocket servislar
│   └── package.json
├── README.md                 # Asosiy hujjat
├── SETUP.md                  # Batafsil o'rnatish qo'llanmasi
└── QUICK_START.md            # Tezkor boshlash
```

## Backend Modullar

### AsteriskModule
- ARI WebSocket ulanishi
- Qo'ng'iroq eventlarini qayta ishlash
- Chiquvchi qo'ng'iroqlar

### CallsModule
- Qo'ng'iroqlar CRUD operatsiyalari
- Yozuvlarni yuklab olish
- Filtrlash va qidirish

### ChatsModule
- Chatlar va xabarlar boshqaruvi
- Telegram integratsiyasi
- Facebook/Instagram integratsiyasi

### OperatorsModule
- Operatorlar boshqaruvi
- Status yangilanishlari

### AuthModule
- JWT autentifikatsiya
- Login/logout

## Frontend Sahifalar

### Login
- Tizimga kirish formasi

### Dashboard
- Umumiy statistika
- Real-time kiruvchi qo'ng'iroqlar popup

### Calls
- Qo'ng'iroqlar ro'yxati
- Sana bo'yicha filtr
- Yozuvlarni eshitish

### Chats
- Chatlar ro'yxati
- Xabarlar oynasi
- Xabar yuborish

## Ma'lumotlar Bazasi

### operators
- Operatorlar ma'lumotlari
- Status va rollar

### calls
- Barcha qo'ng'iroqlar
- Yozuvlar manzillari

### chats
- Chatlar ro'yxati
- Platforma ma'lumotlari

### messages
- Xabarlar
- Yuboruvchi va vaqt

## Integratsiyalar

### Telegram
- Bot API
- Webhook qabul qilish
- Xabar yuborish

### Facebook/Instagram
- Graph API
- Webhook qabul qilish
- Xabar yuborish

## Real-time

- WebSocket orqali:
  - Yangi qo'ng'iroqlar
  - Qo'ng'iroq holati
  - Yangi xabarlar
  - Operator holati

