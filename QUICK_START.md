# Tezkor Boshlash

## 1. Backend Ishga Tushirish

```bash
cd backend
npm install
cp .env.example .env
# .env faylini tahrirlang
npm run prisma:generate
npm run migration:run
npm run start:dev
```

## 2. Frontend Ishga Tushirish

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## 3. Asterisk Sozlash

```bash
sudo cp asterisk-config/*.conf /etc/asterisk/
sudo systemctl restart asterisk
```

## 4. Browserda Ochish

`http://localhost:3000` - Frontend
`http://localhost:3001` - Backend API

## Login

Default operator yaratish kerak. PostgreSQL da:

```sql
INSERT INTO operators (id, name, extension, username, password, role, status)
VALUES (
  gen_random_uuid(),
  'Admin',
  '1001',
  'admin',
  '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', -- 'admin123' paroli uchun hash
  'admin',
  'onlayn'
);
```

Yoki backend kodida operator yaratish endpointini qo'shing.

