# "Tekshirish" Tugmasi Debug Qo'llanmasi

## Muammo

"Tekshirish" tugmasi bosilganda hech narsa o'zgarmayapti.

## Tekshirish

### 1. Browser Console da

Browser console ni oching (F12) va quyidagilarni tekshiring:

```javascript
// Tugma bosilganda console da loglar ko'rinishi kerak:
// "Tekshirish tugmasi bosildi"
// "checkKerioConnection chaqirildi"
// "Kerio Operator ulanishini tekshirish..."
// "kerioApi.verifyAuth chaqirildi"
```

### 2. Network Tab da

Browser Network tab ni oching va "Tekshirish" tugmasini bosing:

1. `/kerio/auth/verify` so'rovi ko'rinishi kerak
2. Request Headers da `Authorization: Bearer <token>` bo'lishi kerak
3. Response status 200 yoki 401 bo'lishi kerak

### 3. Tugma Disabled emasligini Tekshirish

Browser Elements tab da tugmani toping va tekshiring:

```html
<button disabled="false">Tekshirish</button>
```

Agar `disabled="true"` bo'lsa, `kerioChecking` yoki `loading` `true` bo'lishi mumkin.

## Yechimlar

### Variant 1: Console Loglarini Ko'rish

1. Browser console ni oching (F12)
2. "Tekshirish" tugmasini bosing
3. Console da loglarni ko'ring
4. Xatolik bo'lsa, aniq ko'rinadi

### Variant 2: Network Tab da Tekshirish

1. Browser Network tab ni oching (F12 > Network)
2. "Tekshirish" tugmasini bosing
3. `/kerio/auth/verify` so'rovini toping
4. Request va Response ni ko'ring

### Variant 3: Tugma onClick Handler

Agar console da hech narsa ko'rinmasa:

1. Browser Elements tab da tugmani toping
2. onClick handler mavjudligini tekshiring
3. Yoki React DevTools ishlatish

## Xatoliklar

### Console da hech narsa ko'rinmayapti

**Sabab:**
- onClick handler ishlamayapti
- Tugma disabled

**Yechim:**
- Browser cache ni tozalang
- Page ni qayta yuklang (Ctrl+Shift+R)

### Network da so'rov ko'rinmayapti

**Sabab:**
- onClick handler ishlamayapti
- JavaScript xatolik

**Yechim:**
- Browser console da JavaScript xatoliklarni tekshiring
- Page ni qayta yuklang

### 401 Unauthorized

**Sabab:**
- Token yo'q yoki eskirgan

**Yechim:**
- Login qiling
- Token localStorage ga saqlanadi

