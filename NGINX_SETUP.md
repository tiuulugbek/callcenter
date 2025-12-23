# Nginx Setup - SPA Routing Muammosini Hal Qilish

## Muammo
- `https://crm24.soundz.uz/settings` so'rovi backend API ga borib qolmoqda
- 401 Unauthorized xatosi
- SPA routing ishlamayapti

## Yechim: Nginx konfiguratsiyasi

### 1. Nginx konfiguratsiyasini yaratish:

```bash
# Nginx sites-available papkasiga ko'chirish
sudo cp nginx.conf.example /etc/nginx/sites-available/crm24.soundz.uz

# SSL sertifikatlari yo'lini tekshirish va yangilash
sudo nano /etc/nginx/sites-available/crm24.soundz.uz
```

### 2. Muhim o'zgarishlar:

**Frontend location:**
```nginx
location / {
    root /var/www/call-center/frontend/dist;
    index index.html;
    try_files $uri $uri/ /index.html;  # ← Bu muhim! SPA routing uchun
}
```

**Backend API:**
```nginx
location /api/ {
    proxy_pass http://localhost:4000/;
    # ... proxy headers
}
```

### 3. Nginx ni aktivlashtirish:

```bash
# Symlink yaratish
sudo ln -s /etc/nginx/sites-available/crm24.soundz.uz /etc/nginx/sites-enabled/

# Nginx konfiguratsiyasini tekshirish
sudo nginx -t

# Nginx ni restart qilish
sudo systemctl restart nginx
```

### 4. PM2 konfiguratsiyasini yangilash:

Agar Nginx ishlatilsa, frontend PM2 da ishlamasligi mumkin. `ecosystem.config.js` dan frontend ni o'chirish yoki Nginx port 80/443 da ishlaydi.

### 5. Alternativ: Vite preview server ni to'g'ri sozlash

Agar Nginx ishlatmasangiz, Vite preview server ni to'g'ri sozlash kerak:

```bash
# ecosystem.config.js da frontend args ni yangilash:
args: 'vite preview --host 0.0.0.0 --port 4001 --strictPort'
```

Lekin eng yaxshi yechim - Nginx ishlatish!

## Tekshirish:

1. Browser da `https://crm24.soundz.uz/settings` ga kiring
2. Network tab da tekshiring:
   - `/settings` so'rovi `index.html` ni qaytarishi kerak
   - API so'rovlar `/api/` prefix bilan bo'lishi kerak
   - 200 OK status bo'lishi kerak

## Muammo davom etsa:

1. **Nginx loglarini tekshirish:**
   ```bash
   sudo tail -f /var/log/nginx/crm24.soundz.uz.error.log
   ```

2. **Frontend dist papkasini tekshirish:**
   ```bash
   ls -la /var/www/call-center/frontend/dist/
   ```

3. **Nginx konfiguratsiyasini reload qilish:**
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```
