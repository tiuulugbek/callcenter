# 📱 Telefon Sozlash Qo'llanmasi

## Qayerda Sozlanadi?

**Bu ma'lumotlar telefoningizdagi SIP client ilovasida kiritiladi, web sahifada emas!**

## 1. SIP Client Ilovasini O'rnatish

### iOS (iPhone/iPad)
- **Linphone** (Tavsiya etiladi)
- **Zoiper**
- **Groundwire**

### Android
- **Linphone** (Tavsiya etiladi)
- **Zoiper**
- **CSipSimple**

### Windows/Mac
- **X-Lite**
- **Zoiper**
- **Linphone**

## 2. Sozlash Qadamlari

### Umumiy Sozlash

Har bir SIP client da quyidagi ma'lumotlar kiritiladi:

1. **SIP Server / Proxy:** Asterisk server IP manzili
   - Masalan: `192.168.1.100`
   - Yoki domain: `asterisk.example.com`

2. **Username / User ID:** Extension raqami
   - Settings sahifasida yaratilgan extension
   - Masalan: `1001`

3. **Password:** Yaratilgan parol
   - Settings sahifasida extension yaratganda kiritilgan parol

4. **Domain:** Asterisk server IP yoki domain
   - Xuddi SIP Server kabi
   - Masalan: `192.168.1.100`

5. **Port:** 5060 (default)
   - Ko'pincha avtomatik to'ldiriladi

## 3. Linphone Sozlash (iOS/Android)

1. Ilovani oching
2. **Settings** → **SIP Accounts** → **Add Account**
3. Quyidagilarni kiriting:
   - **Username:** `1001` (extension raqami)
   - **Password:** `your_password`
   - **Domain:** `192.168.1.100` (Asterisk server IP)
   - **Transport:** UDP
   - **Port:** 5060
4. **Save** tugmasini bosing
5. Account faollashtiriladi va telefon qo'ng'iroq qabul qila oladi

## 4. Zoiper Sozlash

1. Ilovani oching
2. **Add Account** → **SIP Account**
3. Quyidagilarni kiriting:
   - **Username:** `1001`
   - **Password:** `your_password`
   - **Domain:** `192.168.1.100`
4. **Save** tugmasini bosing

## 5. X-Lite Sozlash (Windows/Mac)

1. Ilovani oching
2. **SIP Account Settings**
3. Quyidagilarni kiriting:
   - **User name:** `1001`
   - **Password:** `your_password`
   - **Domain:** `192.168.1.100`
   - **Authorization user name:** `1001`
4. **OK** tugmasini bosing

## 6. Muhim Eslatmalar

### Tarmoq Talablari

- ✅ Telefon va Asterisk server bir xil tarmoqda bo'lishi kerak (LAN)
- ✅ Yoki VPN orqali ulanish
- ✅ Firewall da 5060 port ochiq bo'lishi kerak

### IP Manzilini Topish

**Asterisk server IP manzilini topish:**

```bash
# Linux/Mac
ifconfig
# yoki
ip addr show

# Windows
ipconfig
```

### Test Qilish

1. SIP client da account status "Registered" yoki "Connected" bo'lishi kerak
2. Boshqa extension ga qo'ng'iroq qilish
3. Asterisk CLI da tekshirish: `sudo asterisk -rvvv`

## 7. Muammolarni Hal Qilish

### Account Ro'yxatdan O'tmayapti

- ✅ Extension yaratilganligini tekshiring
- ✅ Parol to'g'riligini tekshiring
- ✅ Asterisk server ishlayaptimi: `sudo systemctl status asterisk`
- ✅ PJSIP konfiguratsiyasini tekshiring

### Qo'ng'iroq Qilmayapti

- ✅ Tarmoq ulanishini tekshiring
- ✅ Firewall sozlamalarini tekshiring
- ✅ Asterisk loglarini tekshiring: `sudo tail -f /var/log/asterisk/full`

### Audio Ishlamayapti

- ✅ Codec sozlamalarini tekshiring (ulaw, alaw)
- ✅ RTP portlarini tekshiring (10000-20000)
- ✅ NAT sozlamalarini tekshiring

## 8. Production Sozlash

Production uchun:

1. **Domain ishlatish:** IP o'rniga domain
2. **HTTPS/TLS:** Xavfsiz ulanish
3. **STUN/TURN:** NAT muammolarini hal qilish
4. **Firewall:** Faqat kerakli portlarni ochish

## Qo'shimcha Ma'lumot

- Settings sahifasi: http://localhost:4001/settings
- Asterisk konfiguratsiya: `asterisk-config/pjsip.conf`
- Batafsil qo'llanma: `SETTINGS_GUIDE.md`

