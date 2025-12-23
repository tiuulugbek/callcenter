# Dialplan To'g'rilash

## Muammolar:

1. **Pattern tartibi noto'g'ri:** `_X.` pattern `_998X.` dan oldin kelmoqda, shuning uchun `_998X.` hech qachon ishlamaydi
2. **Trunk nomi noto'g'ri:** `Dial(PJSIP/${EXTEN}@trunk)` da `trunk` nomi mavjud emas, `SIPnomer` bo'lishi kerak
3. **Stasis chaqirilishi noto'g'ri:** `Stasis` `Dial` dan keyin chaqirilmoqda, lekin u qo'ng'iroqni kutadi

## To'g'ri Dialplan:

### Muhim o'zgarishlar:

1. **Pattern tartibi:** `_998X.` ni `_X.` dan oldin qo'yish kerak
2. **Trunk nomi:** `SIPnomer` ishlatish kerak
3. **Stasis:** `Dial` dan oldin chaqirilishi kerak (ARI orqali boshqarish uchun)

### Serverni yangilash:

```bash
# 1. Backup yaratish
sudo cp /etc/asterisk/extensions.conf /etc/asterisk/extensions.conf.backup

# 2. Yangi dialplan ni ko'chirish
sudo cp /var/www/call-center/asterisk-config/extensions.conf.fixed /etc/asterisk/extensions.conf

# 3. Dialplan reload
sudo asterisk -rx "dialplan reload"

# 4. Tekshirish
sudo asterisk -rx "dialplan show outbound"
```

### Yoki qo'lda tuzatish:

```bash
sudo nano /etc/asterisk/extensions.conf
```

`[outbound]` kontekstini quyidagicha o'zgartiring:

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

**Muhim:** `_998X.` ni `_X.` dan oldin qo'yish kerak!

## Test Qo'ng'iroq:

```bash
sudo asterisk -rvvv
channel originate PJSIP/998901234567@SIPnomer application Playback hello-world
```

Yoki ARI orqali:
```bash
curl -u backend:secure_password -X POST "http://localhost:8088/ari/channels?endpoint=PJSIP/998901234567@SIPnomer&app=call-center&appArgs=chiquvchi,998901234567,998901234567"
```

