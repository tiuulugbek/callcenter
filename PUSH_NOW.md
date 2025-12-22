# GitHub ga Push Qilish - Hozir

## 📤 Lokal Mashinada - Push Qilish

Terminal da quyidagi buyruqlarni bajaring:

```bash
cd /Users/tiuulugbek/asterisk-call-center

# Git status tekshirish
git status

# Barcha o'zgarishlarni qo'shish
git add .

# Commit qilish
git commit -m "Fix: Source map muammosini hal qilish

- fix_source_map.sh script qo'shildi
- FIX_SOURCE_MAP.md qo'llanma qo'shildi
- Source map fayllarni o'chirish
- tsconfig.json da sourceMap ni false qilish
- PM2 cache tozalash"

# GitHub ga push qilish
git push origin main
```

## ✅ Tekshirish

Push qilgandan keyin:

```bash
# Git status
git status

# Oxirgi commit
git log -1

# Remote repository ni tekshirish
git remote -v
```

## 📥 Serverda - Pull Qilish

Push qilgandan keyin serverda:

```bash
ssh root@152.53.229.176
cd /var/www/call-center
git pull origin main
cd backend
chmod +x fix_source_map.sh
./fix_source_map.sh
```

## 📋 Checklist

- [ ] Git status tekshirildi
- [ ] Barcha fayllar qo'shildi (git add .)
- [ ] Commit qilindi
- [ ] GitHub ga push qilindi
- [ ] Serverda pull qilindi
- [ ] Script ishga tushirildi

