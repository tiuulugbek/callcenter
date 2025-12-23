// Admin Foydalanuvchi Yaratish Script (Node.js)

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('Admin foydalanuvchi yaratilmoqda...');
    
    // Parolni hash qilish
    const hashedPassword = await bcrypt.hash('admin123', 10);
    console.log('Parol hash qilindi');
    
    // Admin yaratish yoki yangilash
    const admin = await prisma.operator.upsert({
      where: { username: 'admin' },
      update: {
        password: hashedPassword,
        role: 'admin',
        status: 'onlayn',
      },
      create: {
        name: 'Admin',
        extension: '1001',
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        status: 'onlayn',
      },
    });
    
    console.log('✅ Admin foydalanuvchi yaratildi/yangilandi:');
    console.log('Username:', admin.username);
    console.log('Password: admin123');
    console.log('Role:', admin.role);
    
  } catch (error) {
    console.error('❌ Xatolik:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

