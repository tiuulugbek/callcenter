# Extension Feature ni Deploy Qilish

## QADAM 1: Serverda Deploy Scriptini Ishlatish

```bash
cd /var/www/call-center

# Scriptni yaratish
cat > deploy_extensions_feature.sh << 'EOFSCRIPT'
#!/bin/bash

PROJECT_ROOT="/var/www/call-center"
cd "$PROJECT_ROOT" || exit 1

echo "1. Git Pull..."
git pull origin main

echo "2. Backend Dependencies..."
cd backend
npm install

echo "3. Prisma Generate..."
npx prisma generate

echo "4. Database Migration..."
npx prisma db push

echo "5. Backend Build..."
npm run build

echo "6. Frontend Dependencies..."
cd ../frontend
npm install

echo "7. Frontend Build..."
npm run build

echo "8. PM2 Restart..."
cd ..
pm2 restart call-center-backend

echo "9. Nginx Reload..."
sudo systemctl reload nginx

echo "✅ Deploy yakunlandi!"
EOFSCRIPT

chmod +x deploy_extensions_feature.sh
./deploy_extensions_feature.sh
```

---

## QADAM 2: Browser Cache ni Tozalash

Browser da:
1. `Ctrl+Shift+R` (Windows/Linux) yoki `Cmd+Shift+R` (Mac) - Hard refresh
2. Yoki Developer Tools ochib, "Disable cache" ni yoqib, sahifani yangilang

---

## QADAM 3: UI da Tekshirish

1. `https://crm24.soundz.uz/settings` ga kiring
2. "SIP Extensions" tab ko'rinishini tekshiring
3. Agar ko'rinmasa, browser console da xatoliklarni tekshiring (F12)

---

## QADAM 4: Agar Hali Ham Ko'rinmasa

### Frontend Build Tekshirish:

```bash
cd /var/www/call-center/frontend

# Build fayllarini tekshirish
ls -lh dist/

# Agar dist/ bo'sh bo'lsa, qayta build qiling
npm run build
```

### Nginx Konfiguratsiyasini Tekshirish:

```bash
# Nginx konfiguratsiyasini tekshirish
sudo nginx -t

# Nginx ni qayta ishga tushirish
sudo systemctl restart nginx
```

---

## QADAM 5: Browser Console da Xatoliklarni Tekshirish

Browser da F12 ni bosing va Console tab da quyidagilarni qidiring:
- `404` xatoliklar
- `extensionsApi` xatoliklar
- JavaScript xatoliklar

---

## QADAM 6: Backend API ni Tekshirish

```bash
# Backend loglarni tekshirish
pm2 logs call-center-backend --lines 50

# API ni test qilish
curl -H "Authorization: Bearer YOUR_TOKEN" https://crm24.soundz.uz/api/extensions
```

---

## Muammo Bo'lsa

1. Backend loglarini tekshiring: `pm2 logs call-center-backend --lines 50`
2. Frontend build ni tekshiring: `ls -lh /var/www/call-center/frontend/dist/`
3. Browser console da xatoliklarni tekshiring
4. Nginx loglarini tekshiring: `sudo tail -f /var/log/nginx/error.log`

