# GitHub ga Push Qilish

## 📤 Lokal Mashinada - Push Qilish

Terminal da quyidagi buyruqlarni bajaring:

```bash
cd /Users/tiuulugbek/asterisk-call-center

# Barcha o'zgarishlarni qo'shish
git add .

# Commit qilish
git commit -m "Fix: Server fix scripts va qo'llanmalar qo'shildi

- server_fix_complete.sh script qo'shildi
- fix_extension_service.sh script qo'shildi
- check_and_fix_build.sh script qo'shildi
- SERVER_FIX_NOW.md qo'llanma qo'shildi
- FINAL_FIX_SERVER.md qo'llanma qo'shildi
- PUSH_AND_DEPLOY_COMPLETE.md qo'llanma yangilandi
- COMPLETE_FIX.md qo'llanma qo'shildi
- Prisma extension query fix (filter qilish usuli)"

# GitHub ga push qilish
git push origin main
```

## ✅ Tekshirish

Push qilgandan keyin GitHub da tekshiring:

```bash
# Git status
git status

# Git log (oxirgi commit)
git log -1
```

## 📥 Serverda - Pull Qilish

Push qilgandan keyin serverda pull qiling:

```bash
ssh root@152.53.229.176
cd /var/www/call-center
git pull origin main
```

Keyin `server_fix_complete.sh` scriptni ishga tushiring:

```bash
chmod +x server_fix_complete.sh
./server_fix_complete.sh
```

