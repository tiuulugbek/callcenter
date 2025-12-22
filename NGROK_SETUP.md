# Ngrok Sozlash

## Ngrok Ishga Tushirish

```bash
ngrok http 4000
```

Bu buyruq quyidagicha chiqadi:

```
ngrok                                                                              
                                                                                    
Session Status                online                                               
Account                       Your Account (Plan: Free)                            
Version                       3.x.x                                                
Region                        United States (us)                                   
Latency                       -                                                    
Web Interface                 http://127.0.0.1:4040                                
Forwarding                    https://abc123-def456.ngrok-free.app -> http://localhost:4000
                                                                                    
Connections                   ttl     opn     rt1     rt5     p50     p90          
                              0       0       0.00    0.00    0.00    0.00         
```

## Webhook URL

**Forwarding** qatorida ko'rsatilgan HTTPS URL ni oling:

```
https://abc123-def456.ngrok-free.app
```

Bu URL ni Settings sahifasida Webhook URL ga kiriting:

```
https://abc123-def456.ngrok-free.app/chats/webhook/telegram
```

## Web Interface

Ngrok web interface: http://127.0.0.1:4040

Bu yerda barcha so'rovlar va javoblar ko'rinadi.

## Telegram Webhook Sozlash

1. Ngrok ni ishga tushiring: `ngrok http 4000`
2. HTTPS URL ni oling (masalan: `https://abc123.ngrok-free.app`)
3. Settings sahifasida:
   - Bot Token: @BotFather dan olingan token
   - Webhook URL: `https://abc123.ngrok-free.app/chats/webhook/telegram`
   - "Saqlash" tugmasini bosing

## Test Qilish

1. Telegram da bot ga xabar yuboring
2. Ngrok web interface da so'rov ko'rinishi kerak
3. Backend loglarida "Telegram webhook received" ko'rinishi kerak
4. Frontend da Chats sahifasida xabar ko'rinishi kerak

