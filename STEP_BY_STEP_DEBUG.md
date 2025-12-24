# Ketma-ket Tekshirish va Sozlash

## Qadam 1: Qo'ng'iroq Asterisk ga Kelayotganini Tekshirish

### Tekshirish

```bash
# Asterisk console da real-time kuzatish
sudo asterisk -rvvv

# Boshqa terminalda PortSIP orqali qo'ng'iroq qiling
# Console da quyidagilarni ko'rasiz:
# - Channel yaratiladi
# - Qo'ng'iroq keladi
```

### Natija

- ✅ **Agar channel ko'rinadi** → Qadam 2 ga o'ting
- ❌ **Agar channel ko'rinmaydi** → Qo'ng'iroq Asterisk ga kelmayapti, PortSIP sozlamalarini tekshiring

---

## Qadam 2: Dialplan da Stasis Application Chaqirilayotganini Tekshirish

### Tekshirish

```bash
# Asterisk console da (asterisk -rvvv)
# Qo'ng'iroq kelganda quyidagilarni ko'rasiz:
# - "Executing Stasis" yoki "Stasis application"
```

### Natija

- ✅ **Agar Stasis ko'rinadi** → Qadam 3 ga o'ting
- ❌ **Agar Stasis ko'rinmaydi** → Dialplan muammosi, extensions.conf ni tekshiring

---

## Qadam 3: ARI Eventlar Kelayotganini Tekshirish

### Tekshirish

```bash
# Backend loglarini real-time kuzatish
pm2 logs call-center-backend --lines 0 | grep -i "StasisStart"

# Qo'ng'iroq kelganda quyidagilarni ko'rasiz:
# - "StasisStart: ..."
# - "Call record created: ..."
```

### Natija

- ✅ **Agar StasisStart ko'rinadi** → Qadam 4 ga o'ting
- ❌ **Agar StasisStart ko'rinmaydi** → ARI muammosi, ARI WebSocket ulanishini tekshiring

---

## Qadam 4: Database da Call Loglar Yaratilayotganini Tekshirish

### Tekshirish

```bash
# Database da call loglar sonini tekshirish
sudo -u postgres psql -d callcenter -c "SELECT COUNT(*) FROM calls;"

# Qo'ng'iroq tugagandan keyin yana tekshiring
sudo -u postgres psql -d callcenter -c "SELECT COUNT(*) FROM calls;"
```

### Natija

- ✅ **Agar soni oshadi** → Tizim ishlayapti! ✅
- ❌ **Agar soni oshmaydi** → Backend muammosi, backend loglarini tekshiring

---

## Muammo Bo'lsa

### Qadam 1 Muammosi: Qo'ng'iroq Asterisk ga Kelmayapti

**Yechim:**
- PortSIP sozlamalarini tekshiring
- SIP Proxy yoki Outbound Proxy: Asterisk server IP (152.53.229.176)
- Yoki tashqi raqamdan Asterisk ga test qo'ng'iroq qiling

### Qadam 2 Muammosi: Stasis Application Chaqirilmayapti

**Yechim:**
- Dialplan ni tekshiring: `sudo asterisk -rx "dialplan show from-external"`
- Extensions.conf ni tekshiring: `sudo cat /etc/asterisk/extensions.conf | grep -A 10 "from-external"`

### Qadam 3 Muammosi: ARI Eventlar Kelmayapti

**Yechim:**
- ARI WebSocket ulanishini tekshiring: `pm2 logs call-center-backend --lines 20 --nostream | grep -i "ARI\|WebSocket"`
- ARI credentials ni tekshiring: `cat /var/www/call-center/backend/.env | grep ASTERISK_ARI`

### Qadam 4 Muammosi: Call Loglar Yaratilmayapti

**Yechim:**
- Backend loglarini tekshiring: `pm2 logs call-center-backend --lines 50 --nostream | grep -i "error\|call"`
- Database connection ni tekshiring: `sudo -u postgres psql -d callcenter -c "SELECT COUNT(*) FROM calls;"`

