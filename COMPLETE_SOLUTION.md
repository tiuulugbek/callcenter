# To'liq Yechim - Extension Boshqarish UI

## Umumiy Ko'rinish

Endi Extension lar UI orqali yaratiladi, tahrirlanadi va o'chiriladi. Barcha o'zgarishlar avtomatik ravishda Asterisk ga qo'shiladi/yangilanadi.

---

## QADAM 1: Database Migration

Serverda quyidagi buyruqlarni bajaring:

```bash
cd /var/www/call-center/backend

# Prisma Client ni yangilash
npx prisma generate

# Database migration
npx prisma migrate dev --name add_sip_extensions
# yoki
npx prisma db push
```

---

## QADAM 2: Backend ni Qayta Ishga Tushirish

```bash
cd /var/www/call-center

# Backend ni qayta ishga tushirish
pm2 restart call-center-backend

# Yoki
cd backend
npm run build
pm2 restart call-center-backend
```

---

## QADAM 3: Frontend ni Build Qilish

```bash
cd /var/www/call-center/frontend

# Build qilish
npm run build

# Nginx ni reload qilish (agar kerak bo'lsa)
sudo systemctl reload nginx
```

---

## QADAM 4: UI da Extension Yaratish

1. Browser da `https://crm24.soundz.uz/settings` ga kiring
2. "SIP Extensions" tab ni tanlang
3. "+ Yangi Extension" tugmasini bosing
4. Quyidagi ma'lumotlarni kiriting:
   - Extension: `1001`
   - Password: `Soundz2025`
   - Display Name: `Test User` (ixtiyoriy)
   - Context: `from-internal`
   - Transport: `transport-udp`
   - Codecs: `ulaw,alaw,g729`
5. "Yaratish" tugmasini bosing

**Natija:** Extension avtomatik ravishda:
- Database ga saqlanadi
- Asterisk PJSIP ga qo'shiladi
- Asterisk reload qilinadi

---

## QADAM 5: PortSIP orqali Ulanish

Extension yaratilgandan keyin:

1. PortSIP da quyidagi sozlamalarni kiriting:
   ```
   SIP Server: 152.53.229.176
   Port: 5060
   Transport: UDP
   Username: 1001
   Password: Soundz2025
   Auth Username: 1001
   ```

2. PortSIP da "Register" tugmasini bosing

3. UI da "Holat" tugmasini bosib extension holatini tekshiring

---

## QADAM 6: Extension Holatini Tekshirish

UI da:
- "Holat" tugmasini bosib extension holatini ko'ring
- "Tahrirlash" tugmasini bosib extension ni yangilang
- "O'chirish" tugmasini bosib extension ni o'chiring

---

## QADAM 7: Chiquvchi Qo'ng'iroq Test Qilish

Extension ulanganidan keyin:

1. PortSIP orqali `998XXXXXXXXX` raqamiga qo'ng'iroq qiling
2. Backend loglarini kuzating:
   ```bash
   pm2 logs call-center-backend --lines 0 | grep -i 'StasisStart\|Call record created'
   ```
3. Database da call loglarni tekshiring:
   ```bash
   sudo -u postgres psql -d callcenter -c "SELECT * FROM calls ORDER BY start_time DESC LIMIT 5;"
   ```

---

## API Endpoints

### GET /extensions
Barcha extension larni olish

### GET /extensions/:id
Extension ni ID bo'yicha olish

### GET /extensions/:id/status
Extension holatini tekshirish

### POST /extensions
Yangi extension yaratish
```json
{
  "extension": "1001",
  "password": "Soundz2025",
  "displayName": "Test User",
  "context": "from-internal",
  "transport": "transport-udp",
  "codecs": "ulaw,alaw,g729"
}
```

### PUT /extensions/:id
Extension ni yangilash

### DELETE /extensions/:id
Extension ni o'chirish

---

## Muammo Bo'lsa

### Extension Yaratilmayapti
1. Backend loglarini tekshiring: `pm2 logs call-center-backend --lines 50`
2. Database migration ni tekshiring: `npx prisma migrate status`
3. Asterisk loglarini tekshiring: `sudo asterisk -rvvv`

### Extension Asterisk ga Qo'shilmayapti
1. `/etc/asterisk/pjsip.conf` faylini tekshiring
2. Asterisk reload qiling: `asterisk -rx "pjsip reload"`
3. Extension holatini tekshiring: `asterisk -rx "pjsip show endpoints 1001"`

### PortSIP Ulana Olmayapti
1. Extension holatini UI da tekshiring
2. PortSIP sozlamalarini qayta tekshiring
3. Real-time loglarni kuzating: `sudo asterisk -rvvv 2>&1 | grep -i '1001'`

---

## YAKUNIY TEKSHIRISH

✅ Extension UI da yaratiladi
✅ Extension Asterisk ga avtomatik qo'shiladi
✅ Extension holati tekshiriladi
✅ Extension tahrirlanadi va o'chiriladi
✅ PortSIP orqali ulanish ishlaydi
✅ Chiquvchi qo'ng'iroqlar ishlaydi
✅ Call loglar yaratiladi

---

## Keyingi Qadamlar

1. Database migration ni bajaring
2. Backend ni qayta ishga tushiring
3. Frontend ni build qiling
4. UI da Extension yarating
5. PortSIP orqali ulaning
6. Qo'ng'iroq test qiling

