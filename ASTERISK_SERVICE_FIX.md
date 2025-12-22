# Asterisk Service Yaratish - To'g'ri Buyruq

## Xato
```bash
at > /etc/systemd/system/asterisk.service << 'EOF'
```

## To'g'ri
```bash
cat > /etc/systemd/system/asterisk.service << 'EOF'
```

## To'liq Buyruqlar

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

