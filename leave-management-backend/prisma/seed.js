import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Roles (enum values are lowercase!)
  const bossRole = await prisma.role.upsert({
    where: { role_name: "boss" },
    update: {},
    create: { role_name: "boss" },
  });

  const hrRole = await prisma.role.upsert({
    where: { role_name: "hr" },
    update: {},
    create: { role_name: "hr" },
  });

  const employeeRole = await prisma.role.upsert({
    where: { role_name: "employee" },
    update: {},
    create: { role_name: "employee" },
  });

  // Boss user
  const hashedPassword = await bcrypt.hash("Boss@123", 10);

  await prisma.user.upsert({
    where: { email: "boss@company.com" },
    update: {},
    create: {
      name: "Boss",
      email: "boss@company.com",
      password_hash: hashedPassword,
      role_id: bossRole.role_id, // 👈 correctly using role_id
    },
  });

  console.log("✅ Seeding complete!");
  console.log("HR Role ID:", hrRole.role_id);
  console.log("Employee Role ID:", employeeRole.role_id);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
