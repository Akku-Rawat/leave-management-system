import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const roles = ["employee", "hr", "boss"];
  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { role_name: roleName },
      update: {},
      create: { role_name: roleName },
    });
  }
  console.log("Roles seeded!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
