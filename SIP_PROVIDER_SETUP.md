# SIP Provayder (bell.uz) Sozlash

## Ma'lumotlar

- **SIP Server:** bell.uz
- **Login:** (Sizning login)
- **Password:** (Sizning parol)
- **Port:** 5060 (odatda)

## Muhim Eslatma

⚠️ **Bu sistema faqat monitoring va logging uchun!**

Telefonlar **Kerio Operator PBX** ga tushadi. Bizning sistema faqat call events ni olish va ko'rsatish uchun.

## Qadamlar

### 1. Kerio Operator da SIP Trunk Sozlash

Kerio Operator Admin Panel da:

1. **SIP Trunks** bo'limiga kiring
2. **Yangi Trunk** yarating:
   - **Name:** BellUZ
   - **Host:** bell.uz
   - **Username:** (Sizning login)
   - **Password:** (Sizning parol)
   - **Port:** 5060
   - **Transport:** UDP

3. **Trunk ni faollashtiring**

### 2. Inbound Routes Sozlash

Kerio Operator da:

1. **Inbound Routes** bo'limiga kiring
2. **Yangi Route** yarating:
   - **Trunk:** BellUZ
   - **Destination:** Extension yoki Queue
   - **Pattern:** (bo'sh qoldirish yoki *)

### 3. Bizning Sistemada Sozlash

Bizning sistemada SIP trunk sozlash **faqat ma'lumotlarni saqlash uchun**. Asosiy sozlash Kerio Operator da bo'ladi.

**Frontend da:**
1. Settings → SIP Trunk (Provayder) ga kiring
2. Quyidagi ma'lumotlarni kiriting:
   - **Nomi:** BellUZ
   - **Server IP:** bell.uz
   - **Login:** (Sizning login)
   - **Password:** (Sizning parol)
   - **Port:** 5060
   - **Transport:** UDP

3. **Trunk Yaratish** tugmasini bosing

**Eslatma:** Bu faqat database ga saqlaydi. Asosiy sozlash Kerio Operator da bo'ladi.

## Tekshirish

### 1. Kerio Operator da

1. Kerio Operator Admin Panel da Trunk holatini tekshiring
2. Trunk "Registered" bo'lishi kerak
3. Test qo'ng'iroq qiling

### 2. Bizning Sistemada

1. Qo'ng'iroq qiling
2. Dashboard da call ko'rinishi kerak
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
- Backend loglarini tekshiring
- Kerio Operator API credentials ni tekshiring

