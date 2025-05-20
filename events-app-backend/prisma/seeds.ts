import {
  PrismaClient,
  Role,
  ReservationStatus,
  Organiser,
} from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const firstNames = ['Ivan', 'Maria', 'Nikolay', 'Gergana', 'Kiril'];
const lastNames = ['Ivanov', 'Petrova', 'Georgiev', 'Stoyanova', 'Dimitrov'];
const locations = ['Sofia', 'Plovdiv', 'Varna', 'Burgas', 'Ruse'];
const categoryNames = ['Music', 'Tech', 'Art', 'Food', 'Other'];
const eventTitles = [
  'Tech Conference',
  'Music Fest',
  'Art Fair',
  'Food Expo',
  'Startup Meetup',
  'VR Showcase',
  'Dance Show',
  'Wine Tasting',
  'Photography Workshop',
  'Jazz Night',
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(): Date {
  const days = Math.floor(Math.random() * 90);
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

async function main() {
  console.log('🌱 Starting seed...');

  // Categories
  const categories = await Promise.all(
    categoryNames.map(name =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  // Organisers
  const organisers: Organiser[] = [];
  for (let i = 1; i <= 5; i++) {
    const organiser = await prisma.organiser.create({
      data: {
        name: `Organiser ${i}`,
        email: `organiser${i}@mail.com`,
        password: await bcrypt.hash('organiser123', 10),
        description: `Organizer profile ${i}`,
        phone: `088800000${i}`,
        website: `https://organiser${i}.bg`,
        createdAt: new Date(),
      },
    });
    organisers.push(organiser);
  }

  // Users
  for (let i = 1; i <= 30; i++) {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const username = `${firstName.toLowerCase()}${i}`;
    const hashedPass = await bcrypt.hash('pass123', 10);
    await prisma.user.create({
      data: {
        email: `${username}@test.com`,
        username,
        firstName,
        lastName,
        password: hashedPass,
        role: Role.USER,
        createdAt: new Date(),
      },
    });
  }

  // Events
  for (let i = 1; i <= 30; i++) {
    const organiser = randomItem(organisers);
    const capacity = Math.floor(Math.random() * 150) + 50;
    await prisma.event.create({
      data: {
        title: `${randomItem(eventTitles)} #${i}`,
        description: `Description for Event ${i}`,
        date: randomDate(),
        location: randomItem(locations),
        capacity,
        availableTickets: capacity,
        price: [5, 10, 15, 20][Math.floor(Math.random() * 4)],
        createdAt: new Date(),
        createdBy: organiser.id,
        categoryId: randomItem(categories).id,
      },
    });
  }

  // Reservations
  for (let i = 0; i < 30; i++) {
    await prisma.reservation.create({
      data: {
        userId: Math.floor(Math.random() * 30) + 1,
        eventId: Math.floor(Math.random() * 30) + 1,
        createdAt: new Date(),
        status: randomItem([
          ReservationStatus.CONFIRMED,
          ReservationStatus.PENDING,
          ReservationStatus.CANCELLED,
        ]),
      },
    });
  }

  console.log('✅ Seed completed.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
