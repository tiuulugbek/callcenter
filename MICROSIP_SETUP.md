# MicroSIP - Asterisk ga Ulanish Qo'llanmasi

## 📱 MicroSIP nima?

MicroSIP - bu Windows uchun bepul SIP telefon ilovasi. Bu ilova orqali Asterisk server ga ulanib qo'ng'iroq qilish va qabul qilish mumkin.

## 🔧 MicroSIP O'rnatish

1. **MicroSIP ni yuklab olish:**
   - https://www.microsip.org/ saytidan yuklab oling
   - Windows versiyasini o'rnating

2. **MicroSIP ni ishga tushirish**

## ⚙️ MicroSIP Sozlash

### 1. Yangi Account Yaratish

1. MicroSIP da **"Account"** → **"Add"** tugmasini bosing
2. Quyidagi ma'lumotlarni kiriting:

### 2. Sozlamalar

**Account Settings:**
- **Account name:** Istalgan nom (masalan: "Asterisk")
- **Domain:** `152.53.229.176` (Asterisk server IP)
- **Username:** Extension raqami (masalan: `1001`)
- **Password:** Extension paroli
- **Display name:** Operator nomi (masalan: "Admin")

**Advanced Settings:**
- **Proxy:** `152.53.229.176` (Asterisk server IP)
- **Port:** `5060`
- **Transport:** `UDP`
- **Register:** ✅ Enable (yoqilgan bo'lishi kerak)
- **Register interval:** `60` seconds

### 3. To'liq Sozlamalar Ro'yxati

```
Account name: Asterisk
Domain: 152.53.229.176
Username: 1001
Password: your_password
Display name: Admin
Proxy: 152.53.229.176
Port: 5060
Transport: UDP
Register: Yes
Register interval: 60
```

## ✅ Tekshirish

### 1. MicroSIP da Status

MicroSIP da quyidagi status ko'rinishi kerak:
- **Status:** `Registered` (yashil)
- **Account:** `1001@152.53.229.176`

### 2. Asterisk da Tekshirish

```bash
# SSH orqali serverga ulaning
ssh root@152.53.229.176

# Asterisk CLI ga kirish
asterisk -rvvv

# Extension holatini ko'rish
pjsip show endpoints 1001

# Faol qo'ng'iroqlarni ko'rish
core show channels
```

## 📞 Qo'ng'iroq Qilish

### Ichki Qo'ng'iroq (Extension dan Extension ga)

1. MicroSIP da raqamni kiriting (masalan: `1002`)
2. **"Call"** tugmasini bosing
3. Qo'ng'iroq ulanadi

### Tashqi Qo'ng'iroq (SIP Trunk orqali)

1. MicroSIP da to'liq raqamni kiriting (masalan: `+998901234567`)
2. **"Call"** tugmasini bosing
3. Qo'ng'iroq SIP trunk orqali ulanadi

## 🔍 Muammolar va Yechimlar

### MicroSIP "Not Registered"

**Muammo:** MicroSIP "Not Registered" ko'rsatmoqda

**Yechimlar:**
1. **Parol to'g'rimi?**
   - Settings page da extension parolini tekshiring
   - Parol to'g'ri kiritilganligini tekshiring

2. **Firewall:**
   - Windows Firewall da MicroSIP ga ruxsat bering
   - Asterisk server firewall da 5060 port ochiqligini tekshiring

3. **Network:**
   - MicroSIP va Asterisk server bir xil tarmoqda bo'lishi kerak
   - Yoki Asterisk server public IP ga ulanishi kerak

4. **Asterisk Loglar:**
   ```bash
   asterisk -rvvv
   # MicroSIP dan qo'ng'iroq qiling va loglarni ko'ring
   ```

### Audio Yo'q

**Muammo:** Qo'ng'iroq ulanadi, lekin audio yo'q

**Yechimlar:**
1. **RTP Portlari:**
   - Firewall da 10000-20000 portlari ochiqligini tekshiring
   - Asterisk da RTP portlari to'g'ri sozlanganligini tekshiring

2. **Codec:**
   - MicroSIP da codec sozlamalarini tekshiring
   - ulaw yoki alaw codec ishlatilayotganligini tekshiring

### Qo'ng'iroq Ulanmayapti

**Muammo:** Qo'ng'iroq qilishga harakat qilganda ulanmayapti

**Yechimlar:**
1. **Extension holati:**
   ```bash
   asterisk -rx "pjsip show endpoints 1001"
   ```
   - Extension "Not in use" yoki "Available" ko'rinishi kerak

2. **Dialplan:**
   ```bash
   asterisk -rx "dialplan show from-internal"
   ```
   - Dialplan to'g'ri sozlanganligini tekshiring

## 📋 Qisqa Checklist

- [ ] MicroSIP o'rnatilgan
- [ ] Account yaratilgan
- [ ] Domain: `152.53.229.176`
- [ ] Username: Extension raqami
- [ ] Password: Extension paroli
- [ ] Status: `Registered` (yashil)
- [ ] Test qo'ng'iroq: ✅ Ishlamoqda

## 🔗 Boshqa SIP Clientlar

MicroSIP o'rniga quyidagi ilovalarni ham ishlatish mumkin:

### Windows
- **X-Lite** (https://www.counterpath.com/x-lite/)
- **Zoiper** (https://www.zoiper.com/)
- **Linphone** (https://www.linphone.org/)

### Mac
- **Zoiper** (https://www.zoiper.com/)
- **Linphone** (https://www.linphone.org/)
- **Groundwire** (https://www.groundwire.com/)

### iOS/Android
- **Zoiper** (App Store / Google Play)
- **Linphone** (App Store / Google Play)
- **CSipSimple** (Google Play)

Barcha ilovalarda sozlamalar bir xil:
- **Server:** `152.53.229.176`
- **Username:** Extension raqami
- **Password:** Extension paroli
- **Port:** `5060`

