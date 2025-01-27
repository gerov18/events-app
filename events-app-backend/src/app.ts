import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import eventRoutes from './routes/events';

const app: Application = express();

app.use('/events', eventRoutes);

export default app;
