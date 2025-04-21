import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const userEmail = 'admin@gmail.com'; // Cambia al email del usuario objetivo
  const updatedUser = await prisma.user.update({
    where: { email: userEmail },
    data: { role: 'admin' }, // Asigna el rol 'admin'
  });
  console.log('✅ Usuario actualizado:', updatedUser);
}

main()
  .catch((e) => console.error('❌ Error:', e))
  .finally(async () => await prisma.$disconnect());