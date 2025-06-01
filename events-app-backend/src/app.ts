import express, { Application } from 'express';
import passport from 'passport';
import eventRoutes from './routes/events';
import userRoutes from './routes/users';
import reservationRoutes from './routes/reservations.user';
import authenticationRoutes from './routes/authentication';
import authorizationRoutes from './routes/authorization';
import categoryRoutes from './routes/categories';
import organiserRoutes from './routes/organiser';
import meRoute from './routes/me';
import { errorHandler } from './middlewares/errorHanlder';
import googleAuth from './routes/googleAuth';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import './passport';
import eventReservationsRouter from './routes/reservation.event';
import userReservationsRouter from './routes/reservations.user';
import paymentRoutes from './routes/payments';
import { PrismaClient } from '@prisma/client';
import adminRoutes from './routes/admin';

const app: Application = express();

app.use(
  cors({
    origin: `http://localhost:5173`,
    credentials: true,
  })
);
app.use(cookieParser());

app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});
app.use('/events', eventRoutes);
app.use('/users', userRoutes);
app.use('/events/:eventId/reservations', eventReservationsRouter);
app.use('/reservations', eventReservationsRouter);
app.use('/users/:userId/reservations', userReservationsRouter);
app.use('/', authenticationRoutes);
app.use('/', authorizationRoutes);
app.use('/', authorizationRoutes);
app.use('/authentication', googleAuth);
app.use('/categories', categoryRoutes);
app.use('/organiser', organiserRoutes);
app.use('/payment', paymentRoutes);
app.use('/', meRoute);
app.use('/', adminRoutes);

const prisma = new PrismaClient();

app.use('/debug/reserv', async (_req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        user: true,
        event: true,
        tickets: true,
      },
    });
    res.json(reservations);
  } catch (error: any) {
    console.error('Failed to load all reservations:', error);
    res.status(500).json({ message: 'Error fetching all reservations', error });
  }
});

app.use(errorHandler);

export default app;
