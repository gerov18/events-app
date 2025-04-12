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
      title: 'React conf',
      description: 'This is a sample event',
      date: new Date(),
      location: 'Sofia',
      capacity: 100,
      createdBy: 3,
      price: 35.0,
      createdAt: new Date(),
      availableTickets: 450,
    },
  });
  console.log('Event created', event);
}

// seedEvents()
//   .catch(e => {
//     console.log(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

async function seedReservation() {
  const event = await prisma.reservation.create({
    data: { userId: 1, eventId: 1, createdAt: new Date(), status: 'CONFIRMED' },
  });
  console.log('reservation created', event);
}

seedReservation()
  .catch(e => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
