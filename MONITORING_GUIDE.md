# Monitoring Qo'llanmasi

## Asterisk CLI da Monitoring

Asterisk CLI da (`asterisk -rvvv`):

```
# Faol qo'ng'iroqlarni ko'rish
core show channels

# PJSIP endpoint status
pjsip show endpoints Kerio

# Dialplan tekshirish
dialplan show from-external

# ARI status
ari show status

# Stasis applications
stasis show applications

# Chiqish
exit
```

## Terminalda Monitoring

### 1. Asterisk Loglar

```bash
# Real-time loglar
tail -f /var/log/asterisk/full

# Yoki
sudo journalctl -u asterisk -f
```

### 2. Backend Loglar

```bash
# Real-time loglar
pm2 logs call-center-backend

# Yoki oxirgi 100 qator
pm2 logs call-center-backend --lines 100

# Yoki faqat error loglar
pm2 logs call-center-backend --err
```

### 3. Database Monitoring

```bash
# Qo'ng'iroqlar soni
sudo -u postgres psql -d callcenter -c "SELECT COUNT(*) FROM calls;"

# Oxirgi qo'ng'iroqlar
sudo -u postgres psql -d callcenter -c "SELECT id, direction, from_number, to_number, status, created_at FROM calls ORDER BY created_at DESC LIMIT 10;"

# Real-time monitoring (watch)
watch -n 1 'sudo -u postgres psql -d callcenter -c "SELECT COUNT(*) FROM calls;"'
```

## Qo'ng'iroq Kelganda

### Asterisk CLI da:

```
# Faol qo'ng'iroqlarni ko'rish
core show channels

# Qo'ng'iroq loglar
pjsip set logger on
```

### Terminalda:

```bash
# Asterisk loglar (bitta terminal)
tail -f /var/log/asterisk/full

# Backend loglar (ikkinchi terminal)
pm2 logs call-center-backend

# Database monitoring (uchinchi terminal)
watch -n 1 'sudo -u postgres psql -d callcenter -c "SELECT COUNT(*) FROM calls;"'
```

## Qo'ng'iroq Kelganda Ko'rinadigan Loglar

### Asterisk Loglarda:
```
[Dec 22 15:00:00] NOTICE: Channel PJSIP/Kerio-00000001 created
[Dec 22 15:00:00] NOTICE: Stasis app call-center started
```

### Backend Loglarda:
```
[Nest] LOG [AsteriskGateway] StasisStart event received
[Nest] LOG [CallsService] Call created: {id: ..., from: ..., to: ...}
```

## Tezkor Monitoring

```bash
# 1. Asterisk CLI da
asterisk -rvvv
# CLI da: core show channels

# 2. Backend loglar (yangi terminal)
pm2 logs call-center-backend

# 3. Database (yangi terminal)
sudo -u postgres psql -d callcenter -c "SELECT * FROM calls ORDER BY created_at DESC LIMIT 5;"
```

