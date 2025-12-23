# Serverni To'liq Yangilash

## Muammo
- Eski kod hali ham ishlayapti
- 409 Conflict xatolari
- `state` field muammosi

## Yechim

### 1. Git Pull va Yangilash

```bash
cd /var/www/call-center

# Git pull
git pull origin main

# Backend dependencies va build
cd backend
rm -rf node_modules dist
npm install
npm run build

# PM2 restart
pm2 restart call-center-backend

# Loglarni tekshirish
pm2 logs call-center-backend --lines 50
```

### 2. Agar Git Pull Ishlamasa

```bash
cd /var/www/call-center/backend

# Dependencies ni to'liq yangilash
rm -rf node_modules package-lock.json
npm install

# Build
npm run build

# Restart
pm2 restart call-center-backend
```

### 3. Kodni Qo'lda Tekshirish

```bash
cd /var/www/call-center/backend/src/asterisk

# asterisk.service.ts ni tekshirish
grep -n "state:" asterisk.service.ts | grep -v "//" | grep -v "state:"

# Agar state field topilsa, uni olib tashlash kerak
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

**151-165 qatorlarni quyidagicha o'zgartirish:**

```typescript
    // Create call record via injected service
    // Faqat bir marta yaratish uchun - agar callId allaqachon mavjud bo'lsa, skip qilamiz
    if (callsService) {
      try {
        // Avval callId ni tekshiramiz - agar mavjud bo'lsa, skip qilamiz
        const existingCall = await callsService.findByCallId(callId);
        if (existingCall) {
          this.logger.log(`Call record already exists for callId: ${callId}, skipping creation`);
          return existingCall;
        }
        
        const recordingPath = `/var/spool/asterisk/recordings/call_${callId}.wav`;
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

### 4. Calls Service ni Tekshirish

```bash
cd /var/www/call-center/backend/src/calls

# calls.service.ts ni tekshirish
grep -n "findByCallId\|upsert" calls.service.ts
```

**findByCallId funksiyasini qo'shish:**

```typescript
  async findByCallId(callId: string) {
    return this.prisma.call.findUnique({
      where: { callId },
    });
  }
```

**create funksiyasini upsert ga o'zgartirish:**

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

### 5. Build va Restart

```bash
cd /var/www/call-center/backend
npm run build
pm2 restart call-center-backend
pm2 logs call-center-backend --lines 30
```

### 6. Test

```bash
cd /var/www/call-center
./test_call_api.sh 998909429271 998909429271
```

## Muhim

- `state` field Prisma schema da yo'q - faqat `status` ishlatilishi kerak
- `upsert` 409 Conflict muammosini hal qiladi
- `findByCallId` duplicate call record muammosini hal qiladi
- Backend ni to'liq rebuild qilish kerak (`rm -rf node_modules dist`)

