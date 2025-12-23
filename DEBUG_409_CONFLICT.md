# 409 Conflict Muammosini Debug Qilish

## Muammo
409 Conflict xatosi hali ham kelmoqda, garchi `upsert` ishlatilgan bo'lsa ham.

## Yechim

### 1. Prisma Schema Tekshirish

```bash
cd /var/www/call-center/backend
cat prisma/schema.prisma | grep -A 5 "model Call"
```

`callId` `@unique` va nullable (`String?`) bo'lishi kerak.

### 2. Database Migration

```bash
cd /var/www/call-center/backend

# Prisma Client ni regenerate qilish
npx prisma generate

# Migration ni tekshirish
npx prisma migrate status
```

### 3. Error Handling Yaxshilash

Kodda `callId` null bo'lishi mumkinligini tekshirish va fallback qo'shish:

```typescript
const call = await callsService.create({
  direction,
  fromNumber,
  toNumber,
  callId: callId || channelId, // Agar callId null bo'lsa, channelId ni ishlatamiz
  recordingPath,
  startTime: new Date(),
  status: 'javob berildi',
});
```

### 4. Database ni Tekshirish

```bash
# PostgreSQL ga ulanish
sudo -u postgres psql callcenter

# CallId unique constraint ni tekshirish
\d calls

# Agar unique constraint yo'q bo'lsa, qo'shish:
ALTER TABLE calls ADD CONSTRAINT calls_call_id_key UNIQUE (call_id);
```

### 5. Test

```bash
cd /var/www/call-center
./test_call_api.sh 998909429271 998909429271
```

## Muhim

- `callId` `@unique` bo'lishi kerak
- `upsert` `where` da `callId` ishlatiladi
- Agar `callId` null bo'lsa, `channelId` ni ishlatish kerak
- Prisma Client ni regenerate qilish kerak

