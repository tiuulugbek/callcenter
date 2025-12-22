# Asterisk O'rnatish - Keyingi Qadamlar

## ✅ Configure Muvaffaqiyatli!

Configure yakunlandi. Endi quyidagi qadamlarni bajaring:

## 1. Menyu Konfiguratsiyasi

```bash
cd /usr/src/asterisk-20.*
make menuselect
```

**Muhim:** Quyidagilarni tanlang:

### Core Sound Packages
- `*` → `Core Sound Packages` → Enter
- `*` → `UZ` (Uzbek) - tanlang
- `*` → `EN` (English) - tanlang
- `X` → Chiqish va saqlash

### Music On Hold
- `*` → `Music On Hold` → Enter
- `*` → `Music On Hold File Based` - tanlang
- `X` → Chiqish va saqlash

### PJSIP (MUHIM!)
- `*` → `Resource Modules` → Enter
- `*` → `chan_pjsip` - tanlang (MUHIM!)
- `X` → Chiqish va saqlash

### ARI (MUHIM!)
- `*` → `Add-ons` → Enter
- `*` → `res_ari` - tanlang (MUHIM!)
- `*` → `res_ari_mailboxes` - tanlang
- `*` → `res_ari_model` - tanlang
- `X` → Chiqish va saqlash

### Menyu Navigatsiyasi:
- `Space` - tanlash/bekor qilish
- `Enter` - ichkariga kirish
- `X` - chiqish va saqlash
- `*` - tanlangan degani

## 2. Compile

```bash
make -j$(nproc)
```

Bu biroz vaqt olishi mumkin (10-30 daqiqa).

## 3. O'rnatish

```bash
make install
make samples
make config
```

## 4. Asterisk User Yaratish

```bash
useradd -r -d /var/lib/asterisk -s /bin/false asterisk
mkdir -p /var/lib/asterisk /var/spool/asterisk /var/log/asterisk
chown -R asterisk:asterisk /var/lib/asterisk /var/spool/asterisk /var/log/asterisk /etc/asterisk
```

## 5. Systemd Service Yaratish

```bash
cat > /etc/systemd/system/asterisk.service << 'EOF'
[Unit]
Description=Asterisk PBX
After=network.target

[Service]
Type=forking
User=root
Group=root
ExecStart=/usr/sbin/asterisk -f
ExecReload=/usr/sbin/asterisk -rx 'core reload'
ExecStop=/usr/sbin/asterisk -rx 'core stop now'
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable asterisk
systemctl start asterisk
```

## 6. Tekshirish

```bash
# Asterisk ishlayaptimi?
systemctl status asterisk

# Versiyani ko'rish
asterisk -rx "core show version"

# PJSIP moduli yuklanganmi?
asterisk -rx "module show like pjsip"

# ARI ishlayaptimi?
asterisk -rx "ari show status"
```

## 7. Konfiguratsiya Fayllarini Ko'chirish

```bash
# Kodni yuklab oling (agar hali qilmagan bo'lsangiz)
cd /var/www
git clone https://github.com/tiuulugbek/callcenter.git call-center

# Konfiguratsiya fayllarini ko'chirish
cp /var/www/call-center/asterisk-config/*.conf /etc/asterisk/

# Huquqlarni o'rnatish
chown -R asterisk:asterisk /etc/asterisk
chmod 640 /etc/asterisk/*.conf

# Asterisk ni qayta ishga tushirish
systemctl restart asterisk
```

## Muammolar

### Compile xatosi bo'lsa

```bash
# Loglarni ko'rish
make -j$(nproc) 2>&1 | tee compile.log

# Xatolikni topish
grep -i error compile.log
```

### PJSIP moduli topilmayapti

```bash
# Menuselect da qayta tekshirish
make menuselect
# chan_pjsip tanlanganligini tekshiring
```

### ARI ishlamayapti

```bash
# ARI modulini yuklash
asterisk -rx "module load res_ari.so"

# ARI status
asterisk -rx "ari show status"
```

