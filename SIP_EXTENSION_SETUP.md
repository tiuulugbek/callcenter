# SIP Extension Sozlash - To'liq Qo'llanma

## 🎯 Maqsad

MicroSIP kabi oddiy SIP clientlar bilan Asterisk ga ulanib ishlatish.

## 📋 Qadamlar

### 1. Web Dashboard da Extension Yaratish

1. **Settings** → **SIP Extensionlar** tab ga o'ting
2. **Operator** tanlang
3. **Extension raqami** kiriting (masalan: `1001`)
4. **Parol** kiriting
5. **Yaratish** tugmasini bosing

### 2. MicroSIP da Sozlash

1. **MicroSIP** ni oching
2. **Account** → **Add**
3. Quyidagi ma'lumotlarni kiriting:

```
Domain: 152.53.229.176
Username: 1001 (yaratilgan extension)
Password: your_password
Proxy: 152.53.229.176
Port: 5060
Transport: UDP
Register: ✅ Enable
```

### 3. Tekshirish

**MicroSIP da:**
- Status: `Registered` (yashil) ko'rinishi kerak

**Asterisk da:**
```bash
asterisk -rx "pjsip show endpoints 1001"
```

## ✅ Natija

Endi MicroSIP orqali:
- ✅ Ichki qo'ng'iroqlar qilish mumkin
- ✅ Tashqi qo'ng'iroqlar qilish mumkin (SIP trunk orqali)
- ✅ Qo'ng'iroqlarni qabul qilish mumkin

## 🔧 Avtomatik Sozlash

Extension yaratganda:
- ✅ Database ga yoziladi
- ✅ Asterisk PJSIP konfiguratsiyasi avtomatik yangilanadi
- ✅ Asterisk avtomatik reload qilinadi

## 📱 Boshqa SIP Clientlar

MicroSIP o'rniga quyidagi ilovalarni ham ishlatish mumkin:
- **Zoiper** (Windows/Mac/iOS/Android)
- **Linphone** (Windows/Mac/iOS/Android)
- **X-Lite** (Windows/Mac)

Barcha ilovalarda sozlamalar bir xil:
- **Server:** `152.53.229.176`
- **Username:** Extension raqami
- **Password:** Extension paroli
- **Port:** `5060`

## 🐛 Muammolar

### Extension "Not Registered"

1. Parol to'g'rimi tekshiring
2. Firewall da 5060 port ochiqligini tekshiring
3. Asterisk loglarini ko'ring:
   ```bash
   asterisk -rvvv
   ```

### Audio Yo'q

1. Firewall da 10000-20000 portlari ochiqligini tekshiring
2. Codec sozlamalarini tekshiring (ulaw/alaw)

## 📚 Qo'shimcha Ma'lumot

- `MICROSIP_SETUP.md` - MicroSIP batafsil qo'llanma
- `KERIO_CONTROL_SETUP.md` - Kerio Control qoidalari

