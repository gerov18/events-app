import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import eventRoutes from './routes/events';
import userRoutes from './routes/users';
import reservationRoutes from './routes/reservations';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/events', eventRoutes);
app.use('/users', userRoutes);
app.use('/reservations', reservationRoutes);

export default app;
