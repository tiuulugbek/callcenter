# API 405 Method Not Allowed Muammosini Hal Qilish

## Muammo
- `POST https://crm24.soundz.uz/settings/sip-trunks` → 405 Method Not Allowed
- API so'rovlar `/api/` prefix siz yuborilmoqda
- Nginx `/api/` location ni kutmoqda

## Yechim

### 1. Frontend .env fayllarini yangilash:

```bash
cd /var/www/call-center/frontend

# .env.production faylida:
VITE_API_URL=https://crm24.soundz.uz/api
VITE_WS_URL=https://crm24.soundz.uz

# .env faylida ham:
VITE_API_URL=https://crm24.soundz.uz/api
VITE_WS_URL=https://crm24.soundz.uz
```

### 2. Frontend ni rebuild qilish:

```bash
cd /var/www/call-center/frontend
rm -rf dist node_modules/.vite
npm install
npm run build
```

### 3. PM2 restart:

```bash
cd /var/www/call-center
pm2 restart ecosystem.config.js
```

### 4. Browser cache ni tozalash:

- `Ctrl + Shift + R` (Windows/Linux)
- `Cmd + Shift + R` (Mac)

## Tekshirish:

Browser console da (F12):
```javascript
// API URL tekshirish
console.log('API URL:', import.meta.env.VITE_API_URL)
// Natija: https://crm24.soundz.uz/api bo'lishi kerak
```

Network tab da:
- `POST https://crm24.soundz.uz/api/settings/sip-trunks` bo'lishi kerak
- 200 OK yoki 201 Created status bo'lishi kerak
- 405 Method Not Allowed bo'lmasligi kerak

## Muammo davom etsa:

1. **Nginx loglarini tekshirish:**
   ```bash
   sudo tail -f /var/log/nginx/crm24.soundz.uz.error.log
   ```

2. **Backend loglarini tekshirish:**
   ```bash
   pm2 logs call-center-backend --lines 50
   ```

3. **Nginx konfiguratsiyasini tekshirish:**
   ```bash
   sudo nginx -t
   sudo cat /etc/nginx/sites-available/crm24.soundz.uz | grep -A 10 "location /api"
   ```

