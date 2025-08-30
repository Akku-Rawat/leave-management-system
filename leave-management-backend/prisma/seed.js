import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Seed roles
  await prisma.role.upsert({
    where: { role_name: 'employee' },
    update: {},
    create: { role_name: 'employee' },
  })
  await prisma.role.upsert({
    where: { role_name: 'hr' },
    update: {},
    create: { role_name: 'hr' },
  })
  await prisma.role.upsert({
    where: { role_name: 'boss' },
    update: {},
    create: { role_name: 'boss' },
  })

  // Get employee role ID
  const employeeRole = await prisma.role.findUnique({ where: { role_name: 'employee' } })

  // Users to seed
  const users = [
    { name: 'Manoj', email: 'manoj@example.com', password: 'manoj' },
    { name: 'Akhilesh', email: 'akhilesh@example.com', password: 'akhilesh' },
    { name: 'Dixant', email: 'dixant@example.com', password: 'dixant' },
    { name: 'Shivangi', email: 'shivangi@example.com', password: 'shivangi' },
    { name: 'Rahul', email: 'rahul@example.com', password: 'rahul' },
    { name: 'Bhattsir', email: 'bhattsir@example.com', password: 'bhattsir' },
    { name: 'Madhav', email: 'madhav@example.com', password: 'madhav' },
    { name: 'Manish', email: 'manish@example.com', password: 'manish' },
    { name: 'Vinodsir', email: 'vinodsir@example.com', password: 'vinodsir' },
  ]

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10)
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        password_hash: hashedPassword,
        role_id: employeeRole.role_id,
      }
    })
  }

  console.log('Seeding completed successfully.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })