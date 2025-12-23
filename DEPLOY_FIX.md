# 401 Unauthorized va Cache Muammosini Hal Qilish

## Muammo
- 401 Unauthorized xatosi
- Eski ma'lumotlar ko'rsatilmoqda
- Frontend cache muammosi

## Yechim - Serverni SSH orqali ulang va quyidagi buyruqlarni bajaring:

### 1. Git pull qilish:

```bash
cd /var/www/call-center
git pull origin main
```

### 2. Frontend cache ni tozalash va rebuild qilish:

```bash
# Frontend build papkasini tozalash
rm -rf frontend/dist
rm -rf frontend/node_modules/.vite

# Frontend dependencies
cd frontend
npm install

# Frontend build (yangi cache busting bilan)
npm run build

cd ..
```

### 3. Backend .env faylini yangilash:

```bash
cd backend

# .env faylida quyidagilar bo'lishi kerak:
# FRONTEND_URL=https://crm24.soundz.uz
# PORT=4000

# Agar yo'q bo'lsa, qo'shing:
echo "FRONTEND_URL=https://crm24.soundz.uz" >> .env

cd ..
```

### 4. PM2 restart:

```bash
pm2 restart ecosystem.config.js
pm2 list
```

### 5. Browser cache ni tozalash:

**Windows/Linux:** `Ctrl + Shift + R` yoki `Ctrl + F5`
**Mac:** `Cmd + Shift + R`

Yoki Browser DevTools:
1. F12 ni bosing
2. Network tab ni oching
3. "Disable cache" ni belgilang
4. Sahifani yangilang

## Tekshirish:

1. Browser console da (F12):
   ```javascript
   // Token tekshirish
   localStorage.getItem('token')
   
   // API URL tekshirish
   console.log('API URL:', import.meta.env.VITE_API_URL)
   ```

2. Network tab da:
   - Settings sahifasiga kiring
   - API so'rovlarini tekshiring
   - URL: `https://crm24.soundz.uz/settings` bo'lishi kerak
   - Authorization header da token bo'lishi kerak
   - 200 OK status bo'lishi kerak

3. Backend loglarini tekshirish:
   ```bash
   pm2 logs call-center-backend --lines 50
   ```

4. Frontend loglarini tekshirish:
   ```bash
   pm2 logs call-center-frontend --lines 50
   ```

## Muammo davom etsa:

1. **Token muammosi bo'lsa:**
   - Login sahifasiga qaytib, qayta login qiling
   - Token yangilanadi

2. **CORS muammosi bo'lsa:**
   - Backend .env da `FRONTEND_URL=https://crm24.soundz.uz` bo'lishi kerak
   - Backend ni restart qiling: `pm2 restart call-center-backend`

3. **Eski ma'lumotlar ko'rsatilsa:**
   - Browser cache ni to'liq tozalang
   - Hard refresh qiling (Ctrl+Shift+R)
   - Yoki browser ni to'liq yoping va qayta oching
