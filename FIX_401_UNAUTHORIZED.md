# 401 Unauthorized Xatolikni Tuzatish

## Muammo

`crm24.soundz.uz/settings` endpoint dan `{"message": "Unauthorized","statusCode":401}` xatolik qaytmoqda.

## Sabab

Backend `/settings` endpoint `@UseGuards(JwtAuthGuard)` bilan himoyalangan, lekin:
1. Frontend dan token yuborilmayapti
2. Token localStorage da yo'q
3. Token eskirgan yoki noto'g'ri

## Yechim

### 1. Frontend API Interceptor

Frontend `api.ts` faylida response interceptor qo'shildi:
- 401 xatolikda token va user ni localStorage dan o'chirish
- Login sahifasiga avtomatik redirect

### 2. Tekshirish

```bash
# Browser console da
localStorage.getItem('token')

# Yoki
# Browser da Application > Local Storage > crm24.soundz.uz
```

### 3. Login Qilish

1. Browser da `/login` sahifasiga kiring
2. Username va password kiriting
3. Login qiling
4. Token localStorage ga saqlanadi
5. `/settings` sahifasiga qaytib kiring

## Serverda Qilish

```bash
ssh root@152.53.229.176
cd /var/www/call-center

# Git pull
git pull origin main

# Frontend rebuild
cd frontend
npm run build

# PM2 restart
pm2 restart call-center-frontend
```

## Tekshirish

1. Browser da `/login` sahifasiga kiring
2. Login qiling
3. `/settings` sahifasiga kiring
4. 401 xatolik bo'lmasligi kerak

## Xatoliklar

### Token localStorage da yo'q

**Yechim:**
- Login qiling
- Token localStorage ga saqlanadi

### Token eskirgan

**Yechim:**
- Logout qiling
- Qayta login qiling

### API interceptor ishlamayapti

**Yechim:**
- Frontend ni rebuild qiling
- Browser cache ni tozalang

