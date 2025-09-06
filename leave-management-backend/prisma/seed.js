import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. Upsert roles
  const roles = ['employee', 'hr', 'boss'];
  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { role_name: roleName },
      update: {},
      create: { role_name: roleName },
    });
  }

  // 2. Fetch roles
  const employeeRole = await prisma.role.findUnique({ where: { role_name: 'employee' } });
  const hrRole       = await prisma.role.findUnique({ where: { role_name: 'hr' } });
  const bossRole     = await prisma.role.findUnique({ where: { role_name: 'boss' } });

  // 3. Initial users
  const users = [
    { name: 'Manoj',    email: 'manoj@rolaface.com',    pwd: 'manoj',    role: employeeRole },
    { name: 'Akhilesh', email: 'akhilesh@rolaface.com', pwd: 'akhilesh', role: employeeRole },
    { name: 'Dixant',   email: 'dixant@rolaface.com',   pwd: 'dixant',   role: employeeRole },
    { name: 'Shivangi', email: 'shivangi@rolaface.com', pwd: 'shivangi', role: employeeRole },
    { name: 'Rahul',    email: 'rahul@rolaface.com',    pwd: 'rahul',    role: employeeRole },
    { name: 'Hemwant',  email: 'hemwant@rolaface.com',  pwd: 'hemwant',  role: hrRole },
    { name: 'Madhav',   email: 'madhav@rolaface.com',   pwd: 'madhav',   role: employeeRole },
    { name: 'Rishab',   email: 'rishab@rolaface.com',   pwd: 'rishab',   role: employeeRole },
    { name: 'Manish',   email: 'manish@rolaface.com',   pwd: 'manish',   role: employeeRole },
    { name: 'Admin',    email: 'admin@rolaface.com',    pwd: 'admin',    role: bossRole },
  ];

  // 4. Upsert users and leaveBalance
  for (const u of users) {
    const hash = await bcrypt.hash(u.pwd, 10);

    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { role_id: u.role.role_id },
      create: {
        name:          u.name,
        email:         u.email,
        password_hash: hash,
        role_id:       u.role.role_id,
      },
    });

    await prisma.leaveBalance.upsert({
      where: { user_id: user.user_id },
      update: {}, 
      create: {
        user_id:      user.user_id,
        total_leaves: 30,
        used_leaves:  0,
      },
    });
  }

  console.log('Seeding completed successfully.');
}
import url from "url";

const __filename = url.fileURLToPath(import.meta.url);

if (__filename === process.argv[1]) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}