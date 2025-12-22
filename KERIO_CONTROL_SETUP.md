# Kerio Control SIP Qoidalari - To'liq Qo'llanma

## 📋 Kerio Control da SIP Traffic uchun Qoidalar

Kerio Control orqali SIP qo'ng'iroqlar kelayotgan bo'lsa, quyidagi qoidalarni sozlash kerak:

## 🔧 1. SIP Portlari

### SIP Signaling (Port 5060)

**Kerio Control → Firewall Rules → Add Rule**

- **Name:** `SIP Signaling (5060)`
- **Action:** Allow
- **Direction:** Inbound
- **Protocol:** UDP (va TCP)
- **Destination Port:** 5060
- **Source:** Any (yoki Kerio SIP provider IP)
- **Destination:** Asterisk Server IP (152.53.229.176)

### RTP Media (Ports 10000-20000)

**Kerio Control → Firewall Rules → Add Rule**

- **Name:** `RTP Media (10000-20000)`
- **Action:** Allow
- **Direction:** Inbound
- **Protocol:** UDP
- **Destination Port:** 10000-20000
- **Source:** Any (yoki Kerio SIP provider IP)
- **Destination:** Asterisk Server IP (152.53.229.176)

## 🔄 2. NAT Traversal (Agar Kerio Control NAT qilayotgan bo'lsa)

### SIP ALG (Application Layer Gateway)

**Kerio Control → Firewall → Advanced**

- **SIP ALG:** Enable (yoqilishi kerak)
- Bu SIP signaling da IP manzillarni to'g'ri translate qiladi

### RTP NAT Helper

- **RTP NAT Helper:** Enable
- Bu RTP media paketlarida IP/port larni to'g'ri translate qiladi

## 📞 3. SIP Trunk Qoidalari

### Outbound SIP (Chiquvchi Qo'ng'iroqlar)

**Kerio Control → Firewall Rules → Add Rule**

- **Name:** `SIP Outbound`
- **Action:** Allow
- **Direction:** Outbound
- **Protocol:** UDP (va TCP)
- **Source Port:** 5060
- **Destination:** Kerio SIP Provider IP (90.156.199.92)
- **Destination Port:** 5060

### Outbound RTP

**Kerio Control → Firewall Rules → Add Rule**

- **Name:** `RTP Outbound`
- **Action:** Allow
- **Direction:** Outbound
- **Protocol:** UDP
- **Source Port:** 10000-20000
- **Destination:** Kerio SIP Provider IP (90.156.199.92)
- **Destination Port:** 10000-20000

## 🌐 4. Network Configuration

### Asterisk Server IP

- **Internal IP:** Asterisk server ichki IP (masalan: 192.168.1.100)
- **External IP:** 152.53.229.176
- **Port Forwarding:** Agar Kerio Control NAT qilayotgan bo'lsa

### Port Forwarding (Agar Kerio Control NAT qilayotgan bo'lsa)

**Kerio Control → Firewall → Port Forwarding**

1. **SIP Signaling:**
   - **External Port:** 5060
   - **Internal IP:** Asterisk Server Internal IP
   - **Internal Port:** 5060
   - **Protocol:** UDP/TCP

2. **RTP Media:**
   - **External Port:** 10000-20000
   - **Internal IP:** Asterisk Server Internal IP
   - **Internal Port:** 10000-20000
   - **Protocol:** UDP

## 🔍 5. SIP Provider Settings (Kerio Control ichida)

### SIP Trunk Configuration

Agar Kerio Control ichida SIP trunk sozlangan bo'lsa:

- **SIP Server:** Asterisk Server IP (152.53.229.176)
- **SIP Port:** 5060
- **Username:** 21441
- **Password:** Ni3bz8iYDTaH9qME
- **Transport:** UDP
- **NAT Mode:** Enable (agar NAT orqali kelayotgan bo'lsa)

## 📝 6. Qo'shimcha Sozlamalar

### SIP Registration

- **Registration Interval:** 3600 seconds (1 hour)
- **Registration Retry:** 60 seconds

### Codec Settings

- **Preferred Codecs:** ulaw, alaw, g729
- **DTMF Mode:** RFC2833 yoki SIP INFO

## 🧪 7. Test Qilish

### Kerio Control da Test

1. **Firewall Logs:**
   - Kerio Control → Logs → Firewall
   - SIP traffic ko'rinishi kerak

2. **SIP Logs:**
   - Kerio Control → Logs → SIP
   - Registration va call logs ko'rinishi kerak

### Asterisk da Test

```bash
# SIP registration tekshirish
asterisk -rx "pjsip show endpoints Kerio"

# SIP trunk status
asterisk -rx "pjsip show endpoints"

# Qo'ng'iroq test
asterisk -rx "core show channels"
```

## ⚠️ 8. Muammolar va Yechimlar

### Qo'ng'iroq Kelmayapti

1. **Firewall qoidalarini tekshirish:**
   - Kerio Control → Firewall Rules
   - SIP va RTP qoidalari yoqilganligini tekshirish

2. **NAT muammosi:**
   - SIP ALG yoqilganligini tekshirish
   - Port forwarding to'g'ri sozlanganligini tekshirish

3. **Asterisk loglar:**
   ```bash
   asterisk -rvvv
   ```

### Audio Yo'q

1. **RTP portlari:**
   - 10000-20000 portlari ochiqligini tekshirish
   - Firewall da RTP qoidasi yoqilganligini tekshirish

2. **NAT traversal:**
   - RTP NAT Helper yoqilganligini tekshirish
   - Asterisk da `nat=force_rport,comedia` sozlanganligini tekshirish

## 📋 9. Qisqa Checklist

- [ ] SIP Signaling (5060 UDP/TCP) - Allow
- [ ] RTP Media (10000-20000 UDP) - Allow
- [ ] SIP ALG - Enable
- [ ] RTP NAT Helper - Enable
- [ ] Port Forwarding (agar NAT bo'lsa)
- [ ] SIP Trunk Registration - Success
- [ ] Test qo'ng'iroq - Working

## 🔗 10. Asterisk Configuration

Asterisk da ham to'g'ri sozlanganligini tekshirish:

```bash
# /etc/asterisk/pjsip.conf
[Kerio]
type = endpoint
context = from-external
disallow = all
allow = ulaw
allow = alaw
allow = g729
direct_media = no
transport = transport-udp
aors = Kerio
auth = Kerio-auth
outbound_auth = Kerio-auth
rtp_symmetric = yes
force_rport = yes
rewrite_contact = yes
```

Bu sozlamalar NAT orqali ishlash uchun zarur.

