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

// run()
//   .catch(e => {
//     console.log(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

async function seedEvents() {
  const event = await prisma.event.create({
    data: {
      title: 'Sample Event',
      description: 'This is a sample event',
      date: new Date(),
      location: 'Sofia',
      capacity: 100,
      createdBy: 3,
      price: 20.0,
      createdAt: new Date(),
      availableTickets: 100,
    },
  });
  console.log('Event created', event);
}

seedEvents()
  .catch(e => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
