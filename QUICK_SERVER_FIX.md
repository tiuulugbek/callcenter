# Tez Serverni Tuzatish

## Muammo
- `state` field muammosi hali ham bor
- 409 Conflict xatosi (call record allaqachon mavjud)

## Yechim

### 1. Git Pull va Yangilash

```bash
cd /var/www/call-center

# Git pull
git pull origin main

# Backend build
cd backend
npm install
npm run build

# PM2 restart
pm2 restart call-center-backend

# Loglarni tekshirish
pm2 logs call-center-backend --lines 30
```

### 2. Agar Git Pull Ishlamasa

```bash
cd /var/www/call-center/backend/src/asterisk

# Faylni tekshirish
grep -n "state:" asterisk.service.ts
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
cd /var/www/call-center/backend
npm run build
pm2 restart call-center-backend
```

### 3. 409 Conflict Muammosini Hal Qilish

409 xatosi call record allaqachon mavjud bo'lganda yuzaga keladi. Keling, `create` o'rniga `upsert` ishlatamiz:

```bash
cd /var/www/call-center/backend/src/calls
nano calls.service.ts
```

`create` funksiyasini quyidagicha o'zgartirish:

```typescript
  async create(data: {
    direction: string;
    fromNumber: string;
    toNumber: string;
    callId: string;
    recordingPath?: string;
    startTime?: Date;
    endTime?: Date;
    duration?: number;
    status?: string;
  }) {
    // Upsert - agar callId mavjud bo'lsa yangilash, yo'q bo'lsa yaratish
    return this.prisma.call.upsert({
      where: { callId: data.callId },
      update: {
        direction: data.direction,
        fromNumber: data.fromNumber,
        toNumber: data.toNumber,
        recordingPath: data.recordingPath,
        startTime: data.startTime,
        status: data.status,
      },
      create: data,
    });
  }
```

Keyin:
```bash
npm run build
pm2 restart call-center-backend
```

### 4. Test

```bash
cd /var/www/call-center
./test_call_api.sh 998909429271 998909429271
```

## Muhim

- `state` field Prisma schema da yo'q
- Faqat `status` field ishlatilishi kerak
- 409 Conflict muammosini hal qilish uchun `upsert` ishlatish kerak

