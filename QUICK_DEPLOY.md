# Tezkor Deploy Qo'llanmasi

## Server Ma'lumotlari

- **Domain:** crm24.soundz.uz
- **IP:** 152.53.229.176
- **SSH:** root@152.53.229.176

## Qadamlar

### 1. Serverga Kirish va Sozlash

```bash
ssh root@152.53.229.176
```

Serverda:
```bash
# Sozlash skriptini yuklab olish va ishga tushirish
wget https://raw.githubusercontent.com/your-repo/server-setup.sh
chmod +x server-setup.sh
./server-setup.sh
```

Yoki qo'lda:
```bash
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs postgresql postgresql-contrib nginx git build-essential
npm install -g pm2
apt install -y certbot python3-certbot-nginx
```

### 2. Database Yaratish

```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE callcenter;
CREATE USER callcenter_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE callcenter TO callcenter_user;
ALTER DATABASE callcenter OWNER TO callcenter_user;
\q
```

### 3. Kodni Yuklab Olish

**Variant A: GitHub dan (tavsiya)**

```bash
cd /var/www
git clone https://github.com/your-username/asterisk-call-center.git call-center
cd call-center
```

**Variant B: Local dan yuklash**

Local mashinada:
```bash
cd /Users/tiuulugbek/asterisk-call-center
./deploy.sh
```

### 4. Backend Sozlash

```bash
cd /var/www/call-center/backend
npm install
nano .env
```

`.env` fayli:
```env
DATABASE_URL="postgresql://callcenter_user:your_secure_password@localhost:5432/callcenter?schema=public"
PORT=4000
FRONTEND_URL=https://crm24.soundz.uz
JWT_SECRET=your-production-secret-key-change-this

TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_WEBHOOK_URL=https://crm24.soundz.uz/chats/webhook/telegram

ASTERISK_ARI_URL=http://localhost:8088/ari
ASTERISK_ARI_WS_URL=ws://localhost:8088/ari/events
ASTERISK_ARI_USERNAME=backend
ASTERISK_ARI_PASSWORD=secure_password
```

```bash
npm run prisma:generate
npm run prisma db push
npm run prisma:seed
npm run build
pm2 start dist/main.js --name call-center-backend
pm2 save
```

### 5. Frontend Sozlash

```bash
cd /var/www/call-center/frontend
npm install
nano .env
```

`.env` fayli:
```env
VITE_API_URL=https://crm24.soundz.uz
VITE_WS_URL=https://crm24.soundz.uz
```

```bash
npm run build
mkdir -p /var/www/crm24
cp -r dist/* /var/www/crm24/
```

### 6. Nginx Sozlash

```bash
sudo nano /etc/nginx/sites-available/crm24.soundz.uz
```

```nginx
server {
    listen 80;
    server_name crm24.soundz.uz;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name crm24.soundz.uz;

    root /var/www/crm24;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~ ^/(auth|calls|chats|operators|settings|socket.io) {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/crm24.soundz.uz /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. SSL Sertifikat

```bash
sudo certbot --nginx -d crm24.soundz.uz
```

### 8. Tekshirish

- Frontend: https://crm24.soundz.uz
- Backend API: https://crm24.soundz.uz/auth/login
- Telegram Webhook: https://crm24.soundz.uz/chats/webhook/telegram

## GitHub ga Yuklash (Ixtiyoriy)

```bash
cd /Users/tiuulugbek/asterisk-call-center
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/asterisk-call-center.git
git push -u origin main
```

Batafsil qo'llanma: `DEPLOY_TO_SERVER.md`

