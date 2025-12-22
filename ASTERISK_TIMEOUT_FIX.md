# Asterisk Service Timeout Muammosi

## Muammo
```
Job for asterisk.service failed because a timeout was exceeded.
```

## Tekshirish

```bash
# Service status
systemctl status asterisk.service

# Loglarni ko'rish
journalctl -xeu asterisk.service

# Asterisk loglarni ko'rish
tail -f /var/log/asterisk/full

# Asterisk ishlayaptimi?
ps aux | grep asterisk
```

## Yechimlar

### 1. Asterisk ni Qo'lda Ishga Tushirish

```bash
# Service ni to'xtatish
systemctl stop asterisk

# Qo'lda ishga tushirish
/usr/sbin/asterisk -f

# Yoki background da
/usr/sbin/asterisk -f -vvv
```

Agar qo'lda ishga tushsa, konfiguratsiya muammosi bo'lishi mumkin.

### 2. Service Type ni O'zgartirish

```bash
nano /etc/systemd/system/asterisk.service
```

Service type ni `simple` ga o'zgartiring:

```ini
[Unit]
Description=Asterisk PBX
After=network.target

[Service]
Type=simple
User=root
Group=root
ExecStart=/usr/sbin/asterisk -f -vvv
ExecReload=/usr/sbin/asterisk -rx 'core reload'
ExecStop=/usr/sbin/asterisk -rx 'core stop now'
Restart=always
RestartSec=10
TimeoutStartSec=60

[Install]
WantedBy=multi-user.target
EOF
```

Keyin:
```bash
systemctl daemon-reload
systemctl restart asterisk
```

### 3. Konfiguratsiya Muammosini Tekshirish

```bash
# Asterisk konfiguratsiyasini tekshirish
asterisk -rx "core show settings"

# Xatoliklarni ko'rish
asterisk -rx "core show channels"
asterisk -rx "module show"
```

### 4. Minimal Konfiguratsiya

```bash
# Minimal konfiguratsiya bilan ishga tushirish
cp /etc/asterisk/asterisk.conf /etc/asterisk/asterisk.conf.backup
cp /etc/asterisk/extensions.conf /etc/asterisk/extensions.conf.backup

# Minimal asterisk.conf
cat > /etc/asterisk/asterisk.conf << 'EOF'
[directories]
astetcdir => /etc/asterisk
astmoddir => /usr/lib/asterisk/modules
astvarlibdir => /var/lib/asterisk
astdbdir => /var/lib/asterisk
astkeydir => /var/lib/asterisk
astdatadir => /var/lib/asterisk
astagidir => /var/lib/asterisk/agi-bin
astspooldir => /var/spool/asterisk
astrundir => /var/run/asterisk
astlogdir => /var/log/asterisk
astsbindir => /usr/sbin

[options]
verbose = 3
debug = 3
alwaysfork = yes
nofork = no
quiet = no
timestamp = yes
execincludes = yes
console = no
highpriority = yes
initcrypto = yes
nocolor = no
dontwarn = no
dumpcore = no
languageprefix = yes
systemname = asterisk
EOF

# Minimal extensions.conf
cat > /etc/asterisk/extensions.conf << 'EOF'
[general]
static=yes
writeprotect=no
clearglobalvars=no

[globals]

[default]
exten => _X.,1,NoOp(Call to ${EXTEN})
exten => _X.,n,Hangup()
EOF

systemctl restart asterisk
```

### 5. Agar Hali Ham Ishlamasa

```bash
# Asterisk ni to'g'ridan-to'g'ri ishga tushirish
/usr/sbin/asterisk -c

# Yoki
/usr/sbin/asterisk -vvv -c
```

Bu interaktiv rejimda ochadi va xatoliklarni ko'rsatadi.

