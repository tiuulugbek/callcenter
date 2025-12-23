# Dialplan Tushuntirish va To'g'rilash

## Muammolar:

### 1. Pattern Tartibi Noto'g'ri ❌

**Eski (noto'g'ri):**
```ini
[outbound]
exten => _X.,1,...        # ← Bu birinchi kelmoqda
exten => _998X.,1,...     # ← Bu ikkinchi, lekin hech qachon ishlamaydi!
```

**Sabab:** Asterisk birinchi mos keladigan pattern ni ishlatadi. `_X.` barcha raqamlarga mos keladi, shuning uchun `_998X.` hech qachon ishlamaydi.

**To'g'ri:**
```ini
[outbound]
exten => _998X.,1,...     # ← Bu birinchi bo'lishi kerak!
exten => _X.,1,...        # ← Bu ikkinchi (fallback)
```

### 2. Trunk Nomi Noto'g'ri ❌

**Eski (noto'g'ri):**
```ini
Dial(PJSIP/${EXTEN}@trunk)  # ← "trunk" nomi mavjud emas!
```

**To'g'ri:**
```ini
Dial(PJSIP/${EXTEN}@SIPnomer)  # ← To'g'ri trunk nomi
```

### 3. Stasis va Dial ❌

**Eski (noto'g'ri):**
```ini
same => n,Dial(PJSIP/${EXTEN}@trunk)
same => n,Stasis(...)  # ← Bu hech qachon ishlamaydi, chunki Dial qo'ng'iroqni kutadi
```

**To'g'ri:**
ARI orqali qo'ng'iroq qilish uchun `Stasis` ishlatiladi, `Dial` emas:
```ini
same => n,Stasis(call-center,${CALL_ID},chiquvchi,${FROM_NUMBER},${TO_NUMBER})
```

ARI (Asterisk REST Interface) qo'ng'iroqni boshqaradi va trunk ga yuboradi.

## To'g'ri Dialplan:

```ini
[outbound]
; Uzbekistan raqamlari (998XXXXXXXXX) - SIPnomer trunk orqali
exten => _998X.,1,NoOp(Chiquvchi qo'ng'iroq SIPnomer trunk orqali: ${EXTEN})
 same => n,Set(CALL_ID=${UUID})
 same => n,Set(RECORDING_PATH=/var/spool/asterisk/recordings/call_${CALL_ID}.wav)
 same => n,Set(FROM_NUMBER=${CALLERID(num)})
 same => n,Set(TO_NUMBER=${EXTEN})
 same => n,Stasis(call-center,${CALL_ID},chiquvchi,${FROM_NUMBER},${TO_NUMBER})
 same => n,Hangup()
```

## Serverni Yangilash:

```bash
# 1. Backup yaratish
sudo cp /etc/asterisk/extensions.conf /etc/asterisk/extensions.conf.backup

# 2. Yangi dialplan ni ko'chirish
sudo cp /var/www/call-center/asterisk-config/extensions.conf /etc/asterisk/extensions.conf

# 3. Dialplan reload
sudo asterisk -rx "dialplan reload"

# 4. Tekshirish
sudo asterisk -rx "dialplan show outbound"
```

## Qo'ng'iroq Qilish:

### ARI orqali (Backend API):
```bash
POST /api/calls/outbound
{
  "fromNumber": "998901234567",
  "toNumber": "998901234567"
}
```

Backend ARI orqali qo'ng'iroqni boshlaydi:
```javascript
endpoint: `PJSIP/${toNumber}@SIPnomer`
```

### Test Qo'ng'iroq:
```bash
sudo asterisk -rvvv
channel originate PJSIP/998901234567@SIPnomer application Playback hello-world
```

