# SIP Trunk To'liq Sozlash va Ulanish

## Muhim Tushuncha

**SIP Trunk** - Tashqi provayderga (bell.uz) ulanish uchun. Bu orqali:
- **Inbound calls**: Tashqidan kelgan qo'ng'iroqlar Asterisk ga tushadi
- **Outbound calls**: MicroSIP orqali ulanadigan telefonlar trunk orqali tashqi raqamlarga qo'ng'iroq qiladi

**SIP Extension** - Ichki telefonlar uchun (MicroSIP). Bu orqali:
- Operatorlar MicroSIP orqali Asterisk ga ulanadi
- Ichki qo'ng'iroqlar (extension dan extension ga)
- Tashqi raqamlarga qo'ng'iroq (trunk orqali)

## Qadamlar

### 1. SIP Trunk Yaratish

**Settings → SIP Provayder** sahifasida:

1. **Nomi**: `BellUZ` (yoki boshqa nom)
2. **SIP Server**: `bell.uz`
3. **Login**: (Sizning login)
4. **Password**: (Sizning parol)
5. **Port**: `5060`
6. **Transport**: `UDP`
7. **Ma'lumotlarni Saqlash** tugmasini bosing

### 2. SIP Extension Yaratish (MicroSIP uchun)

**Settings → SIP Extensionlar** sahifasida:

1. **Operator** tanlang
2. **Extension Raqami** kiriting (masalan: `1001`)
3. **Parol** kiriting (yoki avtomatik yaratiladi)
4. **Yaratish** tugmasini bosing

### 3. MicroSIP da Ulanish

**MicroSIP sozlamalari:**

```
SIP Server: 152.53.229.176 yoki crm24.soundz.uz
Username: 1001 (extension raqami)
Password: (yaratilgan parol)
Domain: 152.53.229.176 yoki crm24.soundz.uz
```

### 4. Qo'ng'iroq Qilish

**Ichki qo'ng'iroq:**
- MicroSIP dan extension raqamiga qo'ng'iroq qiling (masalan: `1002`)

**Tashqi qo'ng'iroq:**
- MicroSIP dan tashqi raqamga qo'ng'iroq qiling (masalan: `998901234567`)
- Qo'ng'iroq avtomatik ravishda trunk orqali ketadi

## Dialplan Ishlashi

### Inbound Calls (Tashqidan kelgan)

```
bell.uz → Asterisk (from-external context) → ARI → Database → WebSocket → Frontend
```

### Outbound Calls (MicroSIP dan)

```
MicroSIP → Asterisk (from-internal context) → Trunk (BellUZ) → bell.uz → Tashqi raqam
```

## Tekshirish

### 1. Trunk Status

```bash
sudo asterisk -rvvv
pjsip show endpoints
pjsip show endpoint BellUZ
pjsip show registrations
```

### 2. Extension Status

```bash
pjsip show endpoint 1001
pjsip show aor 1001
```

### 3. Test Qo'ng'iroq

1. **MicroSIP dan extension ga** qo'ng'iroq qiling
2. **MicroSIP dan tashqi raqamga** qo'ng'iroq qiling
3. **Dashboard da call ko'rinishi** kerak

## Xatoliklar

### Trunk ulanmayapti

**Sabab:**
- Noto'g'ri credentials
- Firewall 5060 port ochiq emas
- Network connectivity

**Yechim:**
```bash
# Loglar
sudo tail -f /var/log/asterisk/full

# PJSIP debug
sudo asterisk -rvvv
pjsip set logger on
```

### Extension ulanmayapti

**Sabab:**
- Noto'g'ri extension yoki parol
- MicroSIP sozlamalari noto'g'ri

**Yechim:**
- Extension va parolni tekshiring
- MicroSIP sozlamalarini qayta tekshiring

### Tashqi raqamga qo'ng'iroq qilmayapti

**Sabab:**
- Trunk ulanmagan
- Dialplan noto'g'ri

**Yechim:**
- Trunk status ni tekshiring
- Dialplan ni reload qiling: `dialplan reload`

