# GitHub ga Push Qilish

## Repository
git@github.com:tiuulugbek/callcenter.git

## Qadamlari

```bash
cd /Users/tiuulugbek/asterisk-call-center

# Git init (agar yo'q bo'lsa)
git init

# Remote qo'shish
git remote add origin git@github.com:tiuulugbek/callcenter.git

# Yoki agar remote allaqachon bo'lsa, yangilash
git remote set-url origin git@github.com:tiuulugbek/callcenter.git

# Barcha fayllarni qo'shish
git add .

# Commit qilish
git commit -m "Initial commit: Asterisk Call Center MVP"

# Branch nomini o'zgartirish
git branch -M main

# Push qilish
git push -u origin main
```

## Agar SSH Key Sozlanmagan Bo'lsa

HTTPS ishlatish:
```bash
git remote set-url origin https://github.com/tiuulugbek/callcenter.git
git push -u origin main
```

Yoki SSH key sozlash:
```bash
# SSH key yaratish (agar yo'q bo'lsa)
ssh-keygen -t ed25519 -C "your_email@example.com"

# SSH key ni ko'rish
cat ~/.ssh/id_ed25519.pub

# GitHub ga qo'shish: https://github.com/settings/keys
```

