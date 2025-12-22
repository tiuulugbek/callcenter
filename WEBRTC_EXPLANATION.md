# WebRTC Telefon - Tushuntirish

## 🔍 Sizning Vaziyatingiz

Siz xohlayapsiz:
- MicroSIP o'rniga web dasturda telefon qilish va qabul qilish
- Kerio Control dan kelgan qo'ng'iroqlarni web dasturda qabul qilish
- Asterisk o'rnatish kerak emas deyapsiz

## ⚠️ Muhim Tushuntirish

**Asterisk kerak!** Chunki:

1. **Kerio Control → Asterisk → Web Browser**
   - Kerio Control dan kelgan qo'ng'iroq Asterisk ga keladi
   - Asterisk uni web browser ga yo'naltiradi
   - Web browser WebRTC orqali qabul qiladi

2. **Web Browser → Asterisk → Kerio Control**
   - Web browser dan qo'ng'iroq Asterisk ga ketadi
   - Asterisk uni Kerio Control orqali tashqi raqamga yo'naltiradi

3. **Asterisk nima qiladi?**
   - SIP server sifatida ishlaydi
   - WebRTC va SIP o'rtasida konvertatsiya qiladi
   - Qo'ng'iroqlarni boshqaradi

## ✅ Yechim

### 1. Asterisk O'rnatish (Kerak!)

Asterisk o'rnatilishi kerak, chunki:
- SIP server sifatida ishlaydi
- WebRTC va SIP o'rtasida konvertatsiya qiladi
- Kerio Control bilan integratsiya qiladi

### 2. WebRTC Funksiyasini Qo'shish

Web dasturda:
- Telefon qilish tugmasi
- Qo'ng'iroqni qabul qilish tugmasi
- Telefon qo'ng'iroq interfeysi
- WebRTC client

### 3. Kerio Control Sozlash

Kerio Control dan kelgan qo'ng'iroqlar Asterisk ga yo'naltirilishi kerak.

## 🎯 Keyingi Qadamlar

1. Asterisk o'rnatish (agar o'rnatilmagan bo'lsa)
2. WebRTC funksiyasini qo'shish
3. Kerio Control sozlash
4. Test qilish

## 📋 Checklist

- [ ] Asterisk o'rnatilgan
- [ ] WebRTC funksiyasi qo'shilgan
- [ ] Kerio Control sozlangan
- [ ] Test qilingan

