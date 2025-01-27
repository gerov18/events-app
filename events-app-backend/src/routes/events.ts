import { Router, Request, Response } from 'express';

const router = Router();

const events = [
  {
    id: 1,
    title: 'Tech Conference 2025',
    description: 'Annual tech conference for developers.',
    date: '2025-03-15',
    location: 'Sofia, Bulgaria',
    ticketsAvailable: 100,
    price: 50,
  },
  {
    id: 2,
    title: 'Hiking Adventure',
    description: 'Weekend hiking trip in the mountains.',
    date: '2025-04-22',
    location: 'Rila National Park',
    ticketsAvailable: 20,
    price: 30,
  },
];

router.get('/', (req, res) => {
  res.json(events);
});

export default router;
