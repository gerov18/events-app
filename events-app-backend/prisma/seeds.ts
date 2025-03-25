import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  const user = await prisma.user.create({
    data: {
      username: 'foo',
      firstName: 'John',
      lastName: 'Doe',
      email: 'foo@bar.com',
      password: 'password',
      role: 'USER',
      createdAt: new Date(),
    },
  });
  console.log('User created', user);
}

run()
  .catch(e => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
