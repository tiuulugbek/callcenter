# SIP Trunk va SIP Extension - Tushuntirish

## 🔍 Farq Nima?

### SIP Extension (Ichki Telefonlar)
- **Maqsad:** Operatorlar uchun ichki telefon raqamlari
- **Qanday ishlaydi:**
  - Operatorlar MicroSIP yoki boshqa SIP client orqali ulanadi
  - Ichki qo'ng'iroqlar qilishadi
  - Bir-biriga qo'ng'iroq qilishadi
- **Misol:**
  - Extension: `1001`
  - Server: `152.53.229.176`
  - Login: `1001`
  - Password: `parol123`
  - MicroSIP da ulanish: ✅

### SIP Trunk (Tashqi Provayder)
- **Maqsad:** Tashqi telefon raqamlariga qo'ng'iroq qilish va qabul qilish
- **Qanday ishlaydi:**
  - Asterisk server tashqi SIP provayderga ulanadi (Kerio Control kabi)
  - Tashqi telefon raqamlariga qo'ng'iroq qilish mumkin bo'ladi
  - Tashqidan kelgan qo'ng'iroqlarni qabul qilish mumkin
- **Misol:**
  - Trunk: `Kerio`
  - Server: `90.156.199.92`
  - Login: `21441`
  - Password: `Ni3bz8iYDTaH9qME`
  - Bu Asterisk server uchun, MicroSIP uchun emas!

## 📱 Sizning Vaziyatingiz

Siz xohlayapsiz:
- Login, parol, domen kiritilsa
- MicroSIP ga ulanib ishlatish mumkin bo'lsin
- Telefon keladigan qilsin

**Bu SIP Extension funksiyasi!**

## ✅ Qanday Qilish Kerak?

### 1. SIP Extension Yaratish (MicroSIP uchun)

1. Browser da: `https://crm24.soundz.uz/settings`
2. "SIP Extensionlar" tab ni oching
3. Operator tanlang
4. Extension raqam kiriting (masalan: `1001`)
5. Parol kiriting
6. "Extension Yaratish" ni bosing

### 2. MicroSIP da Ulanish

1. MicroSIP ni oching
2. Quyidagi ma'lumotlarni kiriting:
   - **SIP Server:** `152.53.229.176` yoki `crm24.soundz.uz`
   - **Username:** `1001` (yaratilgan extension)
   - **Password:** (yaratilgan parol)
   - **Domain:** `152.53.229.176` yoki `crm24.soundz.uz`
3. "Register" ni bosing
4. Ulanadi va telefon keladi! ✅

### 3. SIP Trunk (Agar Kerak Bo'lsa)

SIP Trunk faqat quyidagi holatlarda kerak:
- Tashqi telefon raqamlariga qo'ng'iroq qilish kerak bo'lsa
- Tashqidan kelgan qo'ng'iroqlarni qabul qilish kerak bo'lsa
- Kerio Control yoki boshqa SIP provayder orqali tashqi telefonlar bilan ishlash kerak bo'lsa

## 🎯 Xulosa

- **MicroSIP uchun:** SIP Extension yarating (Settings → SIP Extensionlar)
- **Tashqi telefonlar uchun:** SIP Trunk yarating (Settings → SIP Trunk)

Sizning vaziyatingizda SIP Extension kerak, SIP Trunk emas!

