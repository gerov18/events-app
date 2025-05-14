import {
  PrismaClient,
  Role,
  RoleRequestStatus,
  ReservationStatus,
} from '@prisma/client';
const prisma = new PrismaClient();

const firstNames = [
  'Ivan',
  'Petar',
  'Maria',
  'Gergana',
  'Nikolay',
  'Mira',
  'Kiril',
  'Diana',
  'Stanislav',
  'Raya',
];
const lastNames = [
  'Ivanov',
  'Petrova',
  'Georgiev',
  'Stoyanova',
  'Dimitrov',
  'Genova',
  'Yordanov',
  'Hristova',
];
const locations = [
  'Sofia',
  'Plovdiv',
  'Varna',
  'Burgas',
  'Ruse',
  'Veliko Tarnovo',
];
const categoryNames = ['Music', 'Tech', 'Art', 'Food', 'Sport'];

const eventNames = [
  'Summer Music Fest',
  'Tech Conference 2025',
  'Art & Culture Expo',
  'Food Festival 2025',
  'Sport Championships',
  'Guitar Night',
  'AI Summit',
  'Painting Masterclass',
  'Gourmet Cuisine Fair',
  'Football League Finals',
  'Jazz Under the Stars',
  'Future of Robotics',
  'Modern Art Show',
  'Street Food Gala',
  'Basketball Tournament',
  'Rock Concert',
  'Blockchain Bootcamp',
  'Sculpture Exhibition',
  'Wine & Dine Experience',
  'Tennis Open',
  'Indie Music Showcase',
  'Startup Pitch Competition',
  'Street Art Festival',
  'Chocolate Lovers Fair',
  'Running Marathon',
  'Classical Music Night',
  'Space Exploration Talks',
  'Photography Masterclass',
  'Pop-Up Market',
  'Football Training Camp',
  'Electronic Dance Party',
  'Smart Tech Expo',
  'Urban Art Jam',
  'Food & Wine Tasting',
  'Beach Volleyball',
  'Folk Music Gathering',
  'Virtual Reality Workshop',
  'Painting & Sculpture Exhibit',
  'Street Food Truck Rally',
  'CrossFit Competition',
  'Indie Games Showcase',
  'Data Science Workshop',
  'Gourmet Burger Fest',
  'Ultimate Frisbee Tournament',
  'Hip-Hop Dance Battle',
  'Rock & Roll Bash',
  'AI Hackathon',
  'Interactive Art Gallery',
  'Cooking Masterclass',
  'Table Tennis Championship',
  'Pop Music Festival',
  'Tech Startup Fair',
  'Live Sketching Show',
  'Sushi Making Class',
  'Cycling Race',
  'Blues & Jazz Jam',
  'DevOps Conference',
  'Graffiti Art Show',
  'Sushi & Sake Tasting',
  'Soccer League',
  'Indie Music Gathering',
  'VR Gaming Tournament',
  'Nature Photography Exhibit',
  'Craft Beer Festival',
  'Rugby Cup Finals',
  'Electronic Music Weekend',
  'Sustainable Tech Forum',
  'Street Photography Walk',
  'Art in Motion Exhibition',
  'Barbecue Cookout',
  'World Tech Expo',
  'Dance Performance',
  'Botanical Art Show',
  'Gastronomy Tour',
  'Cycling Adventure Race',
  'Alternative Music Festival',
  'Gaming Marathon',
  'Fine Dining Experience',
  'Djembe Drumming Workshop',
  'Rockabilly Night',
  'Robotics Demo Day',
  'Sculpture in the Park',
  'Baking Workshop',
  'Ultimate Fighting Championship',
  'Cultural Dance Showcase',
  'Science & Tech Fair',
  'Charity Run',
  'Jazz Festival',
  'Fashion Photography Workshop',
  'Candle Making Class',
  'Punk Rock Show',
  'Tech Innovators Meetup',
  'Art Auction',
  'Food Truck Frenzy',
  'Judo Championship',
  'Folk Music Concert',
  'Guitar Workshop',
  'AI & Machine Learning Symposium',
  'Craft Beer Tasting',
  'Athletic Meet',
  'Classical Piano Recital',
  'Drone Racing League',
  'Live Art Installations',
  'Food Pairing Event',
  'Mixed Martial Arts Fight',
  'Indie Art Exhibition',
  'Web Development Conference',
  'Digital Painting Workshop',
  'Vegan Food Fest',
  'Crossfit Gym Competition',
  'Urban Dance Party',
  'Startup Accelerator Demo',
  'Guitar Solo Night',
  'Tech Meet & Greet',
  'Wine Tasting Gala',
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(): Date {
  const days = Math.floor(Math.random() * 180);
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

  // Users
  for (let i = 1; i <= 100; i++) {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const username = `${firstName.toLowerCase()}${i}`;
    await prisma.user.create({
      data: {
        email: `${username}@test.com`,
        username,
        firstName,
        lastName,
        password: 'user123', // same password for all users
        role: i <= 50 ? Role.ORGANISER : Role.USER,
        createdAt: new Date(),
      },
    });
  }

  // Events
  for (let i = 1; i <= 100; i++) {
    const createdBy = Math.floor(Math.random() * 50) + 1; // Organiser user IDs
    const capacity = Math.floor(Math.random() * 200) + 50;
    await prisma.event.create({
      data: {
        title: randomItem(eventNames),
        description: `Description for Event ${i}`,
        date: randomDate(),
        location: randomItem(locations),
        capacity,
        availableTickets: capacity,
        price: [5, 10, 20, 30, 50][Math.floor(Math.random() * 5)],
        createdAt: new Date(),
        createdBy,
        categoryId: randomItem(categories).id,
      },
    });
  }

  // Reservations
  for (let i = 0; i < 100; i++) {
    await prisma.reservation.create({
      data: {
        userId: Math.floor(Math.random() * 50) + 51, // only users
        eventId: Math.floor(Math.random() * 100) + 1,
        createdAt: new Date(),
        status: randomItem([
          ReservationStatus.CONFIRMED,
          ReservationStatus.PENDING,
          ReservationStatus.CANCELLED,
        ]),
      },
    });
  }

  // Role Requests
  for (let i = 51; i <= 100; i++) {
    await prisma.roleRequest.create({
      data: {
        userId: i,
        role: Role.ORGANISER,
        status: randomItem([
          RoleRequestStatus.PENDING,
          RoleRequestStatus.ACCEPTED,
          RoleRequestStatus.REJECTED,
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
