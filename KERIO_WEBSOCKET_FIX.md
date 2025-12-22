# Kerio Control WebSocket Fix

## 🔍 Muammo

Browser da to'g'ridan-to'g'ri Kerio Control ga SIP ulanishi ishlamaydi, chunki:
1. Kerio Control WebSocket qo'llab-quvvatlamaydi
2. Browser da UDP ishlamaydi
3. SIP over WebSocket proxy kerak

## ⚠️ Muhim Tushuntirish

**Browser da to'g'ridan-to'g'ri SIP ulanishi ishlamaydi!**

Kerio Control ga ulanib ishlash uchun quyidagi variantlar:

### Variant 1: Asterisk WebRTC Gateway (Tavsiya)

Asterisk WebRTC gateway sifatida ishlaydi:
- Browser → Asterisk (WebRTC)
- Asterisk → Kerio Control (SIP)

### Variant 2: SIP.js Library (Test)

SIP.js library ishlatish:
- Browser → SIP.js → Kerio Control (agar WebSocket support bo'lsa)

### Variant 3: SIP Proxy Server

Alohida SIP proxy server:
- Browser → SIP Proxy (WebSocket)
- SIP Proxy → Kerio Control (SIP)

## 🔧 Hozirgi Holat

Hozirgi kod JSSIP ishlatmoqda, lekin Kerio Control WebSocket qo'llab-quvvatlamaydi.

## ✅ Yechim

### 1. Asterisk O'rnatish va WebRTC Gateway Sozlash

Asterisk o'rnatib, WebRTC gateway sifatida sozlash kerak.

### 2. Yoki MicroSIP Ishlatish

Agar browser da telefon qilish kerak bo'lmasa, MicroSIP ishlatish mumkin.

## 📋 Checklist

- [ ] Asterisk o'rnatilgan
- [ ] Asterisk WebRTC gateway sozlangan
- [ ] Browser da telefon ishlayapti
- [ ] Kerio Control ga ulanadi

## 🎯 Xulosa

Browser da to'g'ridan-to'g'ri Kerio Control ga ulanib bo'lmaydi. Asterisk WebRTC gateway kerak.

