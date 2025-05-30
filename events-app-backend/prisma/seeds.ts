// prisma/seeds.ts
import {
  PrismaClient,
  Role,
  ReservationStatus,
  Organiser,
  TicketStatus,
} from '@prisma/client';
import bcrypt from 'bcrypt';
import QRCode from 'qrcode';

const prisma = new PrismaClient();

const firstNames = ['Ivan', 'Maria', 'Nikolay', 'Gergana', 'Kiril'];
const lastNames = ['Ivanov', 'Petrova', 'Georgiev', 'Stoyanova', 'Dimitrov'];
const locations = [
  'Sofia',
  'Plovdiv',
  'Varna',
  'Burgas',
  'Ruse',
  'Veliko Tarnovo',
];
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
  console.log('🌱 Starting seed…');

  // 1) Categories
  const categories = await Promise.all(
    categoryNames.map(name =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  // 2) Organisers
  const organisers: Organiser[] = [];
  for (let i = 1; i <= 5; i++) {
    const hashed = await bcrypt.hash('pass123', 10);
    const org = await prisma.organiser.create({
      data: {
        name: `Organiser ${i}`,
        email: `organiser${i}@example.com`,
        password: hashed,
        description: `This is organiser ${i}`,
        phone: `08880000${i}`,
        website: `https://organiser${i}.bg`,
        createdAt: new Date(),
      },
    });
    organisers.push(org);
  }

  // 3) Users
  for (let i = 1; i <= 30; i++) {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const username = `${firstName.toLowerCase()}${i}`;
    const hashed = await bcrypt.hash('pass123', 10);
    await prisma.user.create({
      data: {
        email: `${username}@test.com`,
        username,
        firstName,
        lastName,
        password: hashed,
        role: Role.USER,
        createdAt: new Date(),
      },
    });
  }

  // 4) Events
  for (let i = 1; i <= 30; i++) {
    const org = randomItem(organisers);
    const capacity = Math.floor(Math.random() * 150) + 50;
    await prisma.event.create({
      data: {
        title: `${randomItem(eventTitles)} #${i}`,
        description: `Description for event ${i}`,
        date: randomDate(),
        location: randomItem(locations),
        capacity,
        availableTickets: capacity,
        price: [5, 10, 15, 20][Math.floor(Math.random() * 4)],
        createdAt: new Date(),
        createdBy: org.id,
        categoryId: randomItem(categories).id,
      },
    });
  }

  // 5) Reservations & Tickets (with QR codes)
  const allEvents = await prisma.event.findMany();
  for (let i = 1; i <= 30; i++) {
    const event = randomItem(allEvents);
    const userId = Math.floor(Math.random() * 30) + 1;
    const status = randomItem([
      ReservationStatus.CONFIRMED,
      ReservationStatus.PENDING,
      ReservationStatus.CANCELLED,
    ]);

    // 5.a) Create reservation
    const reservation = await prisma.reservation.create({
      data: {
        userId,
        eventId: event.id,
        status,
        totalPrice: event.price,
        createdAt: new Date(),
      },
    });

    // 5.b) Create one ticket
    const ticket = await prisma.ticket.create({
      data: {
        reservationId: reservation.id,
        status: status as TicketStatus,
        // qrCode will be set next
      },
    });

    // 5.c) Generate QR-code Data-URL
    const payload = JSON.stringify({
      ticketId: ticket.id,
      reservationId: reservation.id,
    });
    const qrDataUrl = await QRCode.toDataURL(payload, {
      width: 1,
      margin: 1,
      errorCorrectionLevel: 'H',
    });

    // 5.d) Persist QR code on the ticket
    await prisma.ticket.update({
      where: { id: ticket.id },
      data: { qrCode: qrDataUrl },
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
