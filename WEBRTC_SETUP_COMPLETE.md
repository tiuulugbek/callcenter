# WebRTC Telefon - To'liq Sozlash

## ✅ Qilingan Ishlar

1. **JSSIP Library Qo'shildi**
   - `package.json` ga `jssip` qo'shildi
   - SIP client sifatida ishlaydi

2. **SIP Service Yaratildi**
   - `src/services/sip.ts` - SIP client service
   - Kerio Control ga ulanish
   - Qo'ng'iroq qilish va qabul qilish

3. **Phone Component Yaratildi**
   - `src/components/Phone.tsx` - Telefon interfeysi
   - Dashboard ga integratsiya qilindi

## ⚠️ Muhim Muammo

**Kerio Control WebSocket Support:**

Kerio Control to'g'ridan-to'g'ri WebSocket orqali ulanmaydi. Quyidagi variantlar:

### Variant 1: Asterisk WebRTC Gateway (Tavsiya)

Asterisk WebRTC gateway sifatida ishlaydi:
- Browser → Asterisk (WebRTC)
- Asterisk → Kerio Control (SIP)

### Variant 2: SIP.js Library

SIP.js library ishlatish:
- Browser → SIP.js → Kerio Control (SIP over WebSocket)

### Variant 3: SIP Proxy Server

Alohida SIP proxy server:
- Browser → SIP Proxy (WebSocket)
- SIP Proxy → Kerio Control (SIP)

## 🔧 Keyingi Qadamlar

### 1. JSSIP O'rnatish

```bash
cd frontend
npm install jssip
```

### 2. Kerio Control WebSocket Sozlash

Kerio Control da WebSocket support yo'q bo'lsa:
- Asterisk o'rnatish kerak (WebRTC gateway sifatida)
- Yoki SIP proxy server o'rnatish

### 3. Settings da SIP Sozlamalari

Settings bo'limida:
- SIP Extension yaratish
- Password ni saqlash
- Dashboard da telefon ko'rsatish

## 📋 Checklist

- [x] JSSIP library qo'shildi
- [x] SIP service yaratildi
- [x] Phone component yaratildi
- [x] Dashboard ga integratsiya qilindi
- [ ] JSSIP npm install qilindi
- [ ] Kerio Control WebSocket sozlandi
- [ ] Settings da SIP sozlamalari qo'shildi
- [ ] Test qilindi

## 🎯 Xulosa

WebRTC telefon funksiyasi qo'shildi, lekin Kerio Control ga to'g'ridan-to'g'ri ulanish uchun:
- Asterisk WebRTC gateway kerak, YOKI
- SIP proxy server kerak

Agar Kerio Control WebSocket support qo'llab-quvvatlasa, to'g'ridan-to'g'ri ulanadi.

