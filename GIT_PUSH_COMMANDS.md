# Git Push Buyruqlari

## Terminal da Quyidagi Buyruqlarni Bajaring

```bash
cd /Users/tiuulugbek/asterisk-call-center

# Barcha o'zgarishlarni qo'shish
git add backend/CREATE_ADMIN.js backend/CREATE_ADMIN.sh backend/src/auth/auth.service.ts backend/FIX_LOGIN.md DEBUG_TEKSHRISH_BUTTON.md backend/FIX_PRISMA_MIGRATION.md frontend/src/pages/Settings.tsx frontend/src/services/api.ts frontend/index.html

# Commit
git commit -m "Fix: Login muammosini tuzatish va admin yaratish scriptlar

- CREATE_ADMIN.js - Admin yaratish script
- CREATE_ADMIN.sh - Admin yaratish shell script
- auth.service.ts - Debug loglar qo'shildi
- Settings.tsx - Soddalashtirildi (faqat Telegram va Kerio Operator)
- API interceptor - 401 xatolikda login sahifasiga redirect
- FIX_LOGIN.md - Login muammosini tuzatish qo'llanmasi"

# Push
git push origin main
```

## Yoki Barcha O'zgarishlarni Qo'shish

```bash
cd /Users/tiuulugbek/asterisk-call-center

# Barcha o'zgarishlarni qo'shish
git add .

# Commit
git commit -m "Fix: Login muammosini tuzatish va admin yaratish scriptlar"

# Push
git push origin main
```

