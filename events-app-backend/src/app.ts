import express, { Application } from 'express';
import passport from 'passport';
import eventRoutes from './routes/events';
import userRoutes from './routes/users';
import reservationRoutes from './routes/reservations';
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
app.use(errorHandler);

app.use('/events', eventRoutes);
app.use('/users', userRoutes);
app.use('/users/:userId/reservations', reservationRoutes);
app.use('/', authenticationRoutes);
app.use('/', authorizationRoutes);
app.use('/', authorizationRoutes);
app.use('/authentication', googleAuth);
app.use('/categories', categoryRoutes);
app.use('/', organiserRoutes);
app.use('/', meRoute);

export default app;
