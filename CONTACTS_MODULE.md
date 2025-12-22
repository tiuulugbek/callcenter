# Contacts Moduli - To'liq Qo'llanma

## ✅ Yaratildi

Contact moduli to'liq qo'shildi:

### Backend:
- ✅ `ContactsModule` - Contacts moduli
- ✅ `ContactsService` - Contacts service
- ✅ `ContactsController` - Contacts controller
- ✅ API endpoints:
  - `GET /contacts` - Barcha mijozlar
  - `GET /contacts/:id` - Mijoz ma'lumotlari
  - `POST /contacts` - Yangi mijoz yaratish
  - `PUT /contacts/:id` - Mijozni yangilash
  - `DELETE /contacts/:id` - Mijozni o'chirish
  - `POST /contacts/:id/link-call` - Qo'ng'iroqni bog'lash
  - `POST /contacts/:id/link-chat` - Chatni bog'lash

### Frontend:
- ✅ `Contacts` page - Mijozlar sahifasi
- ✅ `Contacts.css` - Stil fayli
- ✅ `contactsApi` - API service
- ✅ Navigation link qo'shildi

### Database:
- ✅ `Contact` modeli qo'shildi
- ✅ `Call` va `Chat` modellariga `contactId` qo'shildi

## 📋 Funksiyalar

1. **Mijozlar Ro'yxati:**
   - Barcha mijozlar
   - Qidirish (ism, telefon, email, kompaniya)
   - Qo'ng'iroqlar va chatlar soni

2. **Mijoz Yaratish/Tahrirlash:**
   - Ism
   - Telefon
   - Email
   - Kompaniya
   - Eslatmalar

3. **Mijoz Ma'lumotlari:**
   - Qo'ng'iroqlar tarixi
   - Chatlar tarixi
   - Barcha aloqa

4. **Integratsiya:**
   - Qo'ng'iroqlarni mijozga bog'lash
   - Chatlarni mijozga bog'lash

## 🔧 O'rnatish

### 1. Database Migration

```bash
cd backend
npx prisma migrate dev --name add_contacts
# yoki
npx prisma db push
```

### 2. Backend Restart

```bash
npm run build
pm2 restart call-center-backend
```

### 3. Frontend Build

```bash
cd frontend
npm install
npm run build
```

## 📱 Ishlatish

1. **Mijozlar sahifasiga o'ting:**
   - Navigation da "Mijozlar" linkini bosing

2. **Yangi mijoz yaratish:**
   - "+ Yangi Mijoz" tugmasini bosing
   - Ma'lumotlarni kiriting
   - "Saqlash" tugmasini bosing

3. **Mijozni qidirish:**
   - Qidirish maydoniga yozing
   - Avtomatik qidiriladi

4. **Mijozni tahrirlash:**
   - "Tahrirlash" tugmasini bosing
   - Ma'lumotlarni o'zgartiring
   - "Saqlash" tugmasini bosing

5. **Mijozni o'chirish:**
   - "O'chirish" tugmasini bosing
   - Tasdiqlang

## 🎯 Keyingi Qadamlar

1. **Qo'ng'iroqlarni avtomatik bog'lash:**
   - Qo'ng'iroq kelganda telefon raqamiga qarab mijozni topish
   - Avtomatik bog'lash

2. **Chatlarni avtomatik bog'lash:**
   - Chat kelganda telefon/email ga qarab mijozni topish
   - Avtomatik bog'lash

3. **Mijoz profil sahifasi:**
   - To'liq ma'lumotlar
   - Qo'ng'iroqlar va chatlar tarixi
   - Statistika

## 📚 API Endpoints

### GET /contacts
Qidirish parametri bilan:
```
GET /contacts?search=john
```

### GET /contacts/:id
Mijoz ma'lumotlari:
```
GET /contacts/123
```

### POST /contacts
Yangi mijoz:
```json
{
  "name": "John Doe",
  "phone": "+998901234567",
  "email": "john@example.com",
  "company": "Company Name",
  "notes": "Notes"
}
```

### PUT /contacts/:id
Mijozni yangilash:
```json
{
  "name": "John Doe Updated",
  "phone": "+998901234567"
}
```

### DELETE /contacts/:id
Mijozni o'chirish:
```
DELETE /contacts/123
```

### POST /contacts/:id/link-call
Qo'ng'iroqni bog'lash:
```json
{
  "callId": "call-123"
}
```

### POST /contacts/:id/link-chat
Chatni bog'lash:
```json
{
  "chatId": "chat-123"
}
```

