# Serverni Hozir Tuzatish

## Muammo
Backend .env da ARI password noto'g'ri. Default `secure_password`, lekin ARI config da `CallCenter2025`.

## Yechim (Serverni Yangilash)

```bash
cd /var/www/call-center/backend

# 1. .env ni yangilash
nano .env
```

**Quyidagilarni qo'shing/yangilang:**

```env
ASTERISK_ARI_URL=http://localhost:8088/ari
ASTERISK_ARI_USERNAME=backend
ASTERISK_ARI_PASSWORD=CallCenter2025
```

**Yoki bir qatorda:**

```bash
# .env ga qo'shish
echo "" >> .env
echo "ASTERISK_ARI_URL=http://localhost:8088/ari" >> .env
echo "ASTERISK_ARI_USERNAME=backend" >> .env
echo "ASTERISK_ARI_PASSWORD=CallCenter2025" >> .env
```

**Keyin:**

```bash
# 2. Backend ni restart qilish
pm2 restart call-center-backend

# 3. Loglarni tekshirish
pm2 logs call-center-backend --lines 20

# 4. Test qo'ng'iroq
cd ..
./test_call_api.sh 998909429271 998909429271
```

## Tekshirish

```bash
# Backend .env ni tekshirish
cd /var/www/call-center/backend
grep -i "ARI" .env

# ARI authentication test
curl -u backend:CallCenter2025 http://localhost:8088/ari/asterisk/info
```

## Muhim
- ARI config da password: `CallCenter2025`
- Backend .env da password: `CallCenter2025`
- **Ikkalasi ham bir xil bo'lishi kerak!**
