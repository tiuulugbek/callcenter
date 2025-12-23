# Cache Muammosini Hal Qilish

## Muammo
- 401 Unauthorized xatosi
- Eski ma'lumotlar ko'rsatilmoqda
- Frontend cache muammosi

## Yechim

### 1. Serverni SSH orqali ulang va quyidagi buyruqlarni bajaring:

```bash
cd /var/www/call-center

# Git pull
git pull origin main

# Cache fix scriptni ishga tushirish
chmod +x fix_cache_and_deploy.sh
bash fix_cache_and_deploy.sh
```

### 2. Yoki qo'lda:

```bash
cd /var/www/call-center

# Frontend build papkasini tozalash
rm -rf frontend/dist
rm -rf frontend/node_modules/.vite

# Frontend dependencies
cd frontend
npm install

# Frontend build
npm run build

# PM2 restart
cd ..
pm2 restart ecosystem.config.js
```

### 3. Browser cache ni tozalash:

**Windows/Linux:**
- `Ctrl + Shift + R` (Hard refresh)
- Yoki `Ctrl + F5`

**Mac:**
- `Cmd + Shift + R` (Hard refresh)

**Yoki Browser DevTools:**
1. F12 ni bosing
2. Network tab ni oching
3. "Disable cache" ni belgilang
4. Sahifani yangilang

### 4. Backend CORS tekshirish:

Backend `.env` faylida quyidagilar bo'lishi kerak:

```env
FRONTEND_URL=https://crm24.soundz.uz
PORT=4000
```

### 5. Nginx cache tozalash (agar kerak bo'lsa):

```bash
sudo nginx -s reload
```

## Tekshirish

1. Browser console ni oching (F12)
2. Network tab ni oching
3. Settings sahifasiga kiring
4. API so'rovlarini tekshiring:
   - URL: `https://crm24.soundz.uz/settings` bo'lishi kerak
   - Token Authorization header da bo'lishi kerak
   - 200 OK status bo'lishi kerak

## Muammo davom etsa:

1. **Token tekshirish:**
   ```javascript
   // Browser console da
   localStorage.getItem('token')
   ```

2. **API URL tekshirish:**
   ```javascript
   // Browser console da
   console.log(import.meta.env.VITE_API_URL)
   ```

3. **Backend loglarini tekshirish:**
   ```bash
   pm2 logs call-center-backend
   ```

4. **Frontend loglarini tekshirish:**
   ```bash
   pm2 logs call-center-frontend
   ```

