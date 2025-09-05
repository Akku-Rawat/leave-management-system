import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Seed roles
  await prisma.role.upsert({
    where: { role_name: 'employee' },
    update: {},
    create: { role_name: 'employee' },
  });
  await prisma.role.upsert({
    where: { role_name: 'hr' },
    update: {},
    create: { role_name: 'hr' },
  });
  await prisma.role.upsert({
    where: { role_name: 'boss' },
    update: {},
    create: { role_name: 'boss' },
  });

  // Roles fetch karo
  const employeeRole = await prisma.role.findUnique({ where: { role_name: 'employee' } });
  const hrRole = await prisma.role.findUnique({ where: { role_name: 'hr' } });
  const bossRole = await prisma.role.findUnique({ where: { role_name: 'boss' } });

  // Users list
  const users = [
    { name: 'Manoj', email: 'manoj@rolaface.com', password: 'manoj', role: employeeRole },
    { name: 'Akhilesh', email: 'akhilesh@rolaface.com', password: 'akhilesh', role: employeeRole },
    { name: 'Dixant', email: 'dixant@rolaface.com', password: 'dixant', role: employeeRole },
    { name: 'Shivangi', email: 'shivangi@rolaface.com', password: 'shivangi', role: employeeRole },
    { name: 'Rahul', email: 'rahul@rolaface.com', password: 'rahul', role: employeeRole },
    { name: 'Hemwant', email: 'hemwant@rolaface.com', password: 'hemwant', role: hrRole },
    { name: 'Madhav', email: 'madhav@rolaface.com', password: 'madhav', role: employeeRole },
    { name: 'Rishab', email: 'rishab@rolaface.com', password: 'rishab', role: employeeRole },
    { name: 'Manish', email: 'manish@rolaface.com', password: 'manish', role: employeeRole },
    { name: 'Admin', email: 'admin@rolaface.com', password: 'admin', role: bossRole },
  ];

  // Users aur unke leaveBalance insert/ update karo
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const upsertedUser = await prisma.user.upsert({
      where: { email: user.email },
      update: { role_id: user.role.role_id },
      create: {
        name: user.name,
        email: user.email,
        password_hash: hashedPassword,
        role_id: user.role.role_id,
      },
    });

    const leaveBalanceExists = await prisma.leaveBalance.findFirst({
      where: { user_id: upsertedUser.user_id },
    });

    if (!leaveBalanceExists) {
      await prisma.leaveBalance.create({
        data: {
          user_id: upsertedUser.user_id,
          total_leaves: 30,
          used_leaves: 0,
        },
      });
    }
  }

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
