# 401 Unauthorized va Console Xatoliklarni Tuzatish

## Muammolar

1. `GET https://crm24.soundz.uz/settings 401 (Unauthorized)`
2. `Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist.`
3. `vite.svg` 404 xatolik

## Yechimlar

### 1. 401 Unauthorized

**Sabab:**
- Token localStorage da yo'q
- Token eskirgan
- Token noto'g'ri

**Yechim:**
- Settings.tsx da token tekshirish qo'shildi
- Token yo'q bo'lsa, login sahifasiga redirect
- API interceptor 401 xatolikda login sahifasiga redirect

### 2. "Could not establish connection"

**Sabab:**
- Browser extension muammosi (odatda)
- WebSocket muammosi (kamdan-kam)

**Yechim:**
- Bu xatolik browser extension dan keladi, dasturga ta'sir qilmaydi
- E'tibor bermaslik mumkin

### 3. vite.svg 404

**Sabab:**
- `index.html` da `/vite.svg` favicon yo'q

**Yechim:**
- `index.html` da favicon path o'zgartirildi
- Yoki favicon.ico yaratish

## Tekshirish

### Browser Console da

```javascript
// Token mavjudligini tekshirish
localStorage.getItem('token')

// Token yo'q bo'lsa, login qiling
```

### Login Qilish

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

## Xatoliklar

### Token localStorage da yo'q

**Yechim:**
- Login qiling
- Token localStorage ga saqlanadi

### Token eskirgan

**Yechim:**
- Logout qiling
- Qayta login qiling

### vite.svg 404

**Yechim:**
- Favicon yaratish yoki
- `index.html` da favicon path ni o'zgartirish

