import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import articleRoutes from './routes/article.routes';
import analyticsRoutes from './routes/analytics.routes';
import { errorResponse } from './utils/response';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/articles', articleRoutes);
app.use('/api/v1/author', analyticsRoutes);

// Centralized Error Handler (Basic)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json(errorResponse('Something went wrong!', [err.message]));
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json(errorResponse('Endpoint not found', [`The requested URL ${req.originalUrl} was not found on this server.`]));
});

export default app;
