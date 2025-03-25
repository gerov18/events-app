import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import eventRoutes from './routes/events';
import userRoutes from './routes/users';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/events', eventRoutes);
app.use('/users', userRoutes);

export default app;
