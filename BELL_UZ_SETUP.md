# Bell.uz SIP Provayder Sozlash

## Ma'lumotlar

- **SIP Server:** bell.uz
- **Login:** (Sizning login)
- **Password:** (Sizning parol)
- **Port:** 5060

## ⚠️ MUHIM ESLATMA

**Bu sistema faqat monitoring va logging uchun!**

Telefonlar **Kerio Operator PBX** ga tushadi. Bizning sistema faqat call events ni olish va ko'rsatish uchun.

## Qadamlar

### 1. Kerio Operator da SIP Trunk Sozlash

**Kerio Operator Admin Panel da:**

1. **SIP Trunks** bo'limiga kiring
2. **Yangi Trunk** yarating:
   ```
   Name: BellUZ
   Host: bell.uz
   Username: (Sizning login)
   Password: (Sizning parol)
   Port: 5060
   Transport: UDP
   ```
3. **Trunk ni faollashtiring**
4. Trunk holatini tekshiring - "Registered" bo'lishi kerak

### 2. Inbound Routes Sozlash

**Kerio Operator da:**

1. **Inbound Routes** bo'limiga kiring
2. **Yangi Route** yarating:
   ```
   Trunk: BellUZ
   Pattern: * (yoki bo'sh)
   Destination: Extension yoki Queue
   ```
3. Route ni faollashtiring

### 3. Bizning Sistemada Sozlash (Ixtiyoriy)

Bizning sistemada SIP trunk sozlash **faqat ma'lumotlarni saqlash uchun**.

**Frontend da:**
1. Settings → SIP Provayder ga kiring
2. Quyidagi ma'lumotlarni kiriting:
   - **Nomi:** BellUZ
   - **SIP Server:** bell.uz
   - **Login:** (Sizning login)
   - **Password:** (Sizning parol)
   - **Port:** 5060
   - **Transport:** UDP
3. **Ma'lumotlarni Saqlash** tugmasini bosing

**Eslatma:** Bu faqat database ga saqlaydi. Asosiy sozlash Kerio Operator da bo'ladi.

## Tekshirish

### 1. Kerio Operator da

1. Kerio Operator Admin Panel da Trunk holatini tekshiring
2. Trunk "Registered" bo'lishi kerak
3. Test qo'ng'iroq qiling
4. Qo'ng'iroq Kerio Operator ga tushishi kerak

### 2. Bizning Sistemada

1. Qo'ng'iroq qiling
2. Dashboard da call ko'rinishi kerak (Kerio Operator dan sync qilingandan keyin)
3. Calls sahifasida call history ko'rinishi kerak

## Xatoliklar

### Trunk ulanmayapti

**Sabab:**
- Noto'g'ri credentials
- Firewall 5060 port ochiq emas
- Network connectivity

**Yechim:**
- Credentials ni tekshiring
- Firewall ni tekshiring
- Network connectivity ni tekshiring

### Qo'ng'iroqlar ko'rinmayapti

**Sabab:**
- Kerio Operator API ulanmagan
- Polling ishlamayapti

**Yechim:**
- Backend loglarini tekshiring: `pm2 logs call-center-backend`
- Kerio Operator API credentials ni tekshiring
- Settings → Kerio Operator → "Tekshirish" tugmasini bosing

## Eslatma

1. **Telefonlar Kerio Operator ga tushadi** - bizning sistema orqali emas
2. **Bizning sistema faqat call events ni olish** - Kerio Operator API orqali
3. **Asosiy sozlash Kerio Operator da** - SIP trunk va inbound routes

