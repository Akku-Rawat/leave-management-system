import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function loginUser(email, password) {
  // User ko role ke saath fetch karo
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true }, // role object bhi saath me laao
  });

  if (!user) throw new Error('Invalid email or password');

  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) throw new Error('Invalid email or password');

  const { password_hash, ...userData } = user;

  return userData; // userData mein ab role bhi included hoga
}
