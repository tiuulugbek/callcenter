# Kerio Control - Tezkor Qo'llanma

## 🔧 Kerio Control da Qoidalar

### 1. Firewall Rules

**SIP Signaling (Port 5060):**
- Action: Allow
- Direction: Inbound
- Protocol: UDP va TCP
- Port: 5060
- Destination: 152.53.229.176

**RTP Media (Ports 10000-20000):**
- Action: Allow
- Direction: Inbound
- Protocol: UDP
- Ports: 10000-20000
- Destination: 152.53.229.176

### 2. SIP ALG

**Kerio Control → Firewall → Advanced:**
- SIP ALG: ✅ Enable
- RTP NAT Helper: ✅ Enable

### 3. Port Forwarding (Agar NAT bo'lsa)

**SIP:**
- External Port: 5060 → Internal IP: Asterisk Server → Internal Port: 5060

**RTP:**
- External Port: 10000-20000 → Internal IP: Asterisk Server → Internal Port: 10000-20000

## 📋 Checklist

- [ ] SIP Signaling (5060) - Allow
- [ ] RTP Media (10000-20000) - Allow
- [ ] SIP ALG - Enable
- [ ] RTP NAT Helper - Enable
- [ ] Port Forwarding (agar NAT bo'lsa)

## 🧪 Test

```bash
# Asterisk da
asterisk -rx "pjsip show endpoints Kerio"

# Qo'ng'iroq test
asterisk -rx "core show channels"
```

