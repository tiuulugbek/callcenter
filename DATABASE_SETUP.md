# Database Sozlash

## Muammo

Agar quyidagi xatolikni ko'rsangiz:
```
PrismaClientInitializationError: User `user` was denied access on the database `callcenter.public`
```

Bu database ulanish muammosi.

## Yechim

### 1. PostgreSQL O'rnatish (agar yo'q bo'lsa)

```bash
# macOS
brew install postgresql@14
brew services start postgresql@14

# Ubuntu
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Database va Foydalanuvchi Yaratish

PostgreSQL ga kirish:
```bash
# macOS
psql postgres

# Ubuntu
sudo -u postgres psql
```

PostgreSQL CLI da quyidagi buyruqlarni bajaring:

```sql
-- Ma'lumotlar bazasini yaratish
CREATE DATABASE callcenter;

-- Foydalanuvchi yaratish (parolni o'zgartiring)
CREATE USER callcenter_user WITH PASSWORD 'your_secure_password';

-- Huquqlarni berish
GRANT ALL PRIVILEGES ON DATABASE callcenter TO callcenter_user;

-- PostgreSQL 15+ uchun
ALTER DATABASE callcenter OWNER TO callcenter_user;

-- Chiqish
\q
```

### 3. .env Faylini Sozlash

`backend/.env` faylida:

```env
DATABASE_URL="postgresql://callcenter_user:your_secure_password@localhost:5432/callcenter?schema=public"
```

**Muhim:** 
- `callcenter_user` - yaratgan foydalanuvchi nomingiz
- `your_secure_password` - yaratgan parolingiz
- `callcenter` - database nomi

### 4. Migratsiyalarni Ishga Tushirish

```bash
cd backend
npm run prisma:generate
npm run migration:run
```

### 5. Seed (Default Admin)

```bash
npm run prisma:seed
```

Bu quyidagi ma'lumotlarni yaratadi:
- **Username:** admin
- **Password:** admin123

## Tekshirish

```bash
# PostgreSQL ga ulanishni tekshirish
psql -U callcenter_user -d callcenter -h localhost

# Yoki
psql postgresql://callcenter_user:your_secure_password@localhost:5432/callcenter
```

## Muammolarni Hal Qilish

### Database topilmayapti
```sql
-- Database mavjudligini tekshirish
\l

-- Agar yo'q bo'lsa, yaratish
CREATE DATABASE callcenter;
```

### Foydalanuvchi topilmayapti
```sql
-- Foydalanuvchilarni ko'rish
\du

-- Agar yo'q bo'lsa, yaratish
CREATE USER callcenter_user WITH PASSWORD 'your_password';
```

### Huquqlar yo'q
```sql
-- Huquqlarni qayta berish
GRANT ALL PRIVILEGES ON DATABASE callcenter TO callcenter_user;
ALTER DATABASE callcenter OWNER TO callcenter_user;
```

### Localhost ulanishi ishlamayapti
`.env` faylida `localhost` o'rniga `127.0.0.1` ishlatib ko'ring:

```env
DATABASE_URL="postgresql://callcenter_user:password@127.0.0.1:5432/callcenter?schema=public"
```

