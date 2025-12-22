# WebRTC Telefon Qo'shish

## 🎯 Maqsad

Web dasturda telefon qilish va qabul qilish funksiyasini qo'shish.

## 📋 Talablar

1. **Asterisk** - SIP server (kerak!)
2. **WebRTC** - Browser da telefon qilish
3. **ARI** - Asterisk REST Interface (mavjud)
4. **WebSocket** - Real-time aloqa (mavjud)

## 🔧 Qo'shiladigan Funksiyalar

### 1. WebRTC Client Component
- Telefon qilish tugmasi
- Qo'ng'iroqni qabul qilish tugmasi
- Telefon qo'ng'iroq interfeysi
- Mikrofon va dinamik boshqaruvi

### 2. Backend WebRTC Gateway
- WebRTC signal processing
- Asterisk ARI integratsiyasi
- Qo'ng'iroq boshqaruvi

### 3. Frontend Telefon Interfeysi
- Dashboard da telefon panel
- Qo'ng'iroq holati ko'rsatkichlari
- Raqam kiritish paneli

## 📝 Keyingi Qadamlar

1. WebRTC library qo'shish (JSSIP yoki SIP.js)
2. WebRTC component yaratish
3. Backend WebRTC gateway yaratish
4. Frontend telefon interfeysini yaratish
5. Test qilish

## ⚠️ Muhim

Asterisk o'rnatilishi kerak, chunki:
- SIP server sifatida ishlaydi
- WebRTC va SIP o'rtasida konvertatsiya qiladi
- Kerio Control bilan integratsiya qiladi

