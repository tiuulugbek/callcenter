# Asterisk O'rnatmasdan Telefoniya - Qo'llanma

## 🎯 Maqsad

Asterisk o'rnatmasdan, faqat Kerio Control dan SIP qo'ng'iroqlarni qabul qilish va yozib olish.

## ⚠️ Muammo

Asterisk o'rnatmasdan SIP qo'ng'iroqlarni qabul qilish uchun backend da SIP server yaratish kerak. Bu juda murakkab va ko'p ish talab qiladi.

## 🔧 Variantlar

### Variant 1: Asterisk Minimal (Tavsiya etiladi) ✅

**Kerio Control → Asterisk (Minimal) → Backend → Database**

- Asterisk faqat SIP trunk sifatida ishlaydi
- Minimal sozlash kerak
- Qo'ng'iroqlar yoziladi va boshqariladi

**Afzalliklari:**
- ✅ Oson sozlash
- ✅ Barqaror ishlash
- ✅ Qo'ng'iroq yozib olish
- ✅ Qo'ng'iroq boshqaruvi

**Kamchiliklari:**
- ⚠️ Asterisk o'rnatish kerak (lekin minimal)

### Variant 2: Asterisk O'rnatmasdan (Murakkab) ❌

**Kerio Control → Backend (SIP Server) → Database**

- Backend da SIP server yaratish kerak
- Node.js da SIP server yaratish juda murakkab
- Ko'p ish talab qiladi

**Afzalliklari:**
- ✅ Asterisk o'rnatish kerak emas

**Kamchiliklari:**
- ❌ Judda murakkab
- ❌ Barqarorlik muammosi
- ❌ Ko'p ish talab qiladi
- ❌ Qo'ng'iroq yozib olish qiyin

## 💡 Tavsiya

**Asterisk Minimal Variantini ishlatish tavsiya etiladi:**

1. Asterisk ni minimal sozlash
2. Faqat SIP trunk sifatida ishlatish
3. Qo'ng'iroqlarni backend ga yuborish
4. Database ga yozish

## 🔧 Asterisk Minimal Sozlash

### 1. Asterisk O'rnatish

```bash
# Asterisk ni o'rnatish (minimal)
apt-get install asterisk
```

### 2. Minimal Konfiguratsiya

Faqat Kerio trunk va ichki extensionlar:

```ini
# /etc/asterisk/pjsip.conf
# Faqat Kerio trunk
# Minimal sozlash
```

### 3. Backend Sozlash

Backend qo'ng'iroqlarni qabul qiladi va yozadi.

## 📱 AmoCRM Features

Hozirgi tizim allaqachon AmoCRM kabi ishlaydi:

1. **Qo'ng'iroqlar:**
   - ✅ Kiruvchi qo'ng'iroqlar
   - ✅ Chiquvchi qo'ng'iroqlar
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

## 🎯 Xulosa

**Asterisk Minimal Variantini ishlatish eng yaxshi yechim:**

- ✅ Oson sozlash
- ✅ Barqaror ishlash
- ✅ Qo'ng'iroqlar yoziladi
- ✅ AmoCRM kabi ishlaydi

Asterisk o'rnatmasdan ishlash juda murakkab va tavsiya etilmaydi.

