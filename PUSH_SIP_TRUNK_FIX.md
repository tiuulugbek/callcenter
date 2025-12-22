# SIP Trunk Fix - GitHub Push

## 📤 Lokal Mashinada - Push Qilish

Terminal da quyidagi buyruqlarni bajaring:

```bash
cd /Users/tiuulugbek/asterisk-call-center

# Git status
git status

# Barcha o'zgarishlarni qo'shish
git add .

# Commit qilish
git commit -m "Fix: SIP Trunk avtomatik yangilash va permissions fix

- SipTrunkService da sudo orqali yozish qo'shildi
- Permissions fix script yaratildi
- Frontend formani yaxshilash (required fields, labels)
- SIP_TRUNK_FIX.md qo'llanma qo'shildi
- Avtomatik pjsip.conf yangilash yaxshilandi"

# GitHub ga push qilish
git push origin main
```

## 📥 Serverda - Pull va Fix

Push qilgandan keyin serverda:

```bash
ssh root@152.53.229.176
cd /var/www/call-center
git pull origin main

# Permissions fix scriptni ishga tushirish
chmod +x fix_sip_trunk_permissions.sh
./fix_sip_trunk_permissions.sh

# Backend rebuild va restart
cd backend
npm run build
pm2 restart call-center-backend

# Frontend rebuild
cd ../frontend
npm run build
cp -r dist/* /var/www/crm24/
```

## ✅ Tekshirish

1. **Permissions:**
   ```bash
   groups $(ps aux | grep "node.*main.js" | grep -v grep | head -1 | awk '{print $1}')
   ls -la /etc/asterisk/pjsip.conf
   ```

2. **Frontend:**
   - Browser da: `https://crm24.soundz.uz/settings`
   - "SIP Trunk (Provayder)" tab ni oching
   - Trunk yarating va tekshiring

3. **Backend:**
   ```bash
   pm2 logs call-center-backend --err --lines 30
   ```
