import express, { Application } from 'express';
import passport from 'passport';
import eventRoutes from './routes/events';
import userRoutes from './routes/users';
import reservationRoutes from './routes/reservations';
import authenticationRoutes from './routes/authentication';
import authorizationRoutes from './routes/authorization';
import { errorHandler } from './middlewares/errorHanlder';
import googleAuth from './routes/googleAuth';
import './passport';

const app: Application = express();

app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);

app.use('/events', eventRoutes);
app.use('/users', userRoutes);
app.use('/users/:userId/reservations', reservationRoutes);
app.use('/', authenticationRoutes);
app.use('/', authorizationRoutes);
app.use('/authentication', googleAuth);
export default app;
