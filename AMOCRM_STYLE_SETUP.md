# AmoCRM Style Telefoniya - To'liq Qo'llanma

## 🎯 Maqsad

AmoCRM kabi telefoniya tizimi - Asterisk o'rnatmasdan, faqat Kerio Control dan SIP qo'ng'iroqlarni qabul qilish va yozib olish.

## 📋 Tizim Arxitekturasi

### Variant 1: Asterisk Minimal (Tavsiya etiladi)

**Kerio Control → Asterisk (SIP Trunk) → Backend → Database**

- Asterisk faqat SIP trunk sifatida ishlaydi
- Qo'ng'iroqlar Asterisk orqali keladi va yoziladi
- Minimal sozlash kerak

### Variant 2: Asterisk O'rnatmasdan (Murakkab)

**Kerio Control → Backend (SIP Server) → Database**

- Backend da SIP server yaratish kerak
- Murakkab va ko'p ish talab qiladi

## 🔧 Variant 1: Asterisk Minimal Sozlash

### 1. Asterisk Minimal Konfiguratsiya

Asterisk faqat SIP trunk sifatida ishlaydi:

```ini
# /etc/asterisk/pjsip.conf
# Faqat Kerio trunk va ichki extensionlar
# Minimal sozlash
```

### 2. Backend Sozlash

Backend qo'ng'iroqlarni qabul qiladi va yozadi:
- ARI orqali qo'ng'iroqlarni boshqarish
- Database ga yozish
- WebSocket orqali frontend ga yuborish

### 3. Frontend Sozlash

AmoCRM kabi interfeys:
- Qo'ng'iroqlar ro'yxati
- Chatlar
- Mijozlar
- Dashboard

## 📱 AmoCRM Features

### 1. Qo'ng'iroqlar

- ✅ Kiruvchi qo'ng'iroqlar
- ✅ Chiquvchi qo'ng'iroqlar
- ✅ Qo'ng'iroq yozib olish
- ✅ Qo'ng'iroq tarixi
- ✅ Qo'ng'iroq statistikasi

### 2. Chatlar

- ✅ Telegram
- ✅ Facebook Messenger
- ✅ Instagram Messaging
- ✅ Barcha chatlar bitta joyda

### 3. Mijozlar

- ✅ Mijozlar ro'yxati
- ✅ Mijoz bilan aloqa tarixi
- ✅ Qo'ng'iroqlar va chatlar

### 4. Dashboard

- ✅ Bugungi qo'ng'iroqlar
- ✅ Faol chatlar
- ✅ Statistika

## 🔄 Hozirgi Tizim

Hozirgi tizim allaqachon AmoCRM kabi ishlaydi:

1. **Qo'ng'iroqlar:**
   - ✅ Kiruvchi qo'ng'iroqlar (Kerio Control → Asterisk → Backend)
   - ✅ Chiquvchi qo'ng'iroqlar (Backend → Asterisk → Kerio Control)
   - ✅ Qo'ng'iroq yozib olish
   - ✅ Qo'ng'iroq tarixi

2. **Chatlar:**
   - ✅ Telegram
   - ✅ Facebook Messenger
   - ✅ Instagram Messaging

3. **Dashboard:**
   - ✅ Qo'ng'iroqlar ro'yxati
   - ✅ Chatlar ro'yxati
   - ✅ Statistika

## ⚙️ Sozlash

### 1. Asterisk Minimal

Asterisk faqat SIP trunk sifatida ishlaydi. Minimal sozlash:

```bash
# Asterisk o'rnatilgan bo'lishi kerak
# Lekin faqat SIP trunk sifatida ishlaydi
```

### 2. Kerio Control

Kerio Control dan Asterisk ga SIP trunk:

```
Kerio Control → Asterisk (152.53.229.176:5060)
```

### 3. Backend

Backend qo'ng'iroqlarni qabul qiladi va yozadi.

## 🎯 Keyingi Qadamlar

1. **Asterisk Minimal Sozlash:**
   - Faqat Kerio trunk va ichki extensionlar
   - Minimal dialplan

2. **Backend Sozlash:**
   - Qo'ng'iroqlarni qabul qilish va yozish
   - Chatlar integratsiyasi

3. **Frontend Sozlash:**
   - AmoCRM kabi interfeys
   - Dashboard va statistika

## 📚 Qo'shimcha Ma'lumot

- Hozirgi tizim allaqachon AmoCRM kabi ishlaydi
- Faqat Asterisk ni minimal sozlash kerak
- Yoki Asterisk ni o'chirib, boshqa yechim ishlatish mumkin

