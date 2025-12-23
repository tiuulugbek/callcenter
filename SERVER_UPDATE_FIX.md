# Serverni Yangilash va Tuzatish

## Muammo
Serverda eski kod ishlayapti. `state` field muammosi hali ham bor.

## Yechim

### 1. Git Pull

```bash
cd /var/www/call-center
git pull origin main
```

### 2. Backend Build va Restart

```bash
cd backend

# Dependencies ni yangilash
npm install

# Build
npm run build

# Restart
pm2 restart call-center-backend

# Loglarni tekshirish
pm2 logs call-center-backend --lines 30
```

### 3. Test Qo'ng'iroq

```bash
cd ..
./test_call_api.sh 998909429271 998909429271
```

## Agar Git Pull Ishlamasa

Agar git pull ishlamasa, quyidagilarni qo'lda yangilash:

```bash
cd /var/www/call-center/backend/src/asterisk

# asterisk.service.ts ni yangilash
nano asterisk.service.ts
```

**128-136 qatorlarni quyidagicha o'zgartirish:**

```typescript
        const call = await callsService.create({
          direction,
          fromNumber,
          toNumber,
          callId,
          recordingPath,
          startTime: new Date(),
          status: 'javob berildi',
        });
```

**193-197 qatorlarni quyidagicha o'zgartirish:**

```typescript
        const call = await callsService.updateByCallId(callId, {
          endTime,
          status: 'yakunlandi',
        });
```

**202-206 qatorlarni quyidagicha o'zgartirish:**

```typescript
          await callsService.update(call.id, {
            duration: duration > 0 ? duration : 0,
            status: 'yakunlandi',
          });
```

Keyin:
```bash
npm run build
pm2 restart call-center-backend
```

## Tekshirish

```bash
# Backend loglar
pm2 logs call-center-backend --lines 20

# Test qo'ng'iroq
cd /var/www/call-center
./test_call_api.sh 998909429271 998909429271
```

## Muhim

- `state` field Prisma schema da yo'q
- Faqat `status` field ishlatilishi kerak
- WebSocket eventlarda `state` saqlanadi (frontend uchun), lekin Prisma ga yozilmaydi

