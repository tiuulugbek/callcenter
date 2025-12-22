import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create default admin operator
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.operator.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      name: 'Admin',
      extension: '1001',
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
      status: 'onlayn',
    },
  });

  console.log('Default admin created:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

