# Kerio Operator va Asterisk - Tushuntirish

## 🔍 Muhim Savol

**Kerio Operator ga ulanishda Asterisk ham kerakmi?**

## ✅ Javob

**Yo'q, Asterisk kerak emas!**

### Nima Kerak?

1. **Kerio Operator PBX** - allaqachon o'rnatilgan va ishlayapti
2. **Backend System** - Kerio Operator API ga ulanib, ma'lumotlarni olish
3. **Frontend Dashboard** - Qo'ng'iroqlarni ko'rsatish

### Asterisk Nima Uchun Kerak Emas?

- Kerio Operator allaqachon PBX sifatida ishlayapti
- Qo'ng'iroqlar Kerio Operator da boshqariladi
- Bizning vazifamiz - faqat ma'lumotlarni olish va ko'rsatish
- Asterisk o'rnatish shart emas

## 🔧 Kerio Operator Integratsiyasi

### 1. API Sozlash

Kerio Operator API endpoint lari:
- CDR: `/api/rest/v1/calls/cdr` (yoki boshqa endpoint)
- Recording: `/api/rest/v1/calls/{callId}/recording`
- Auth: Basic Auth yoki Token Auth

### 2. Backend .env

```env
KERIO_PBX_HOST=90.156.199.92
KERIO_API_USERNAME=your_api_username
KERIO_API_PASSWORD=your_api_password
KERIO_SYNC_INTERVAL=5
```

### 3. API Endpoint larni Tekshirish

Kerio Operator API dokumentatsiyasini ko'rib chiqing:
- REST API endpoint lari
- SOAP API endpoint lari
- Authentication usuli

## 📋 Checklist

- [ ] Kerio Operator API dokumentatsiyasini ko'rib chiqildi
- [ ] API endpoint lari aniqlandi
- [ ] Authentication usuli aniqlandi
- [ ] Backend .env sozlandi
- [ ] API test qilindi
- [ ] CDR sync ishlayapti

## 🎯 Xulosa

**Asterisk kerak emas!** Faqat Kerio Operator API ga ulanib, ma'lumotlarni olish kerak.

