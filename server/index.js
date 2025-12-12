import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/env.js';
import { connectDatabase } from './config/database.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';

const app = express();

// Middleware
app.use(helmet());
console.log(config.client_url);

app.use(
    cors({
        origin: config.client_url || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    morgan('combined', {
        stream: {
            write: (message) => logger.info(message.trim())
        }
    })
);

// Root route
app.get('/', (req, res) => {
    logger.info('Root route hit');
    res.status(200).json({
        msg: 'Trika Sound Sanctuary API is running',
        version: '1.0.0'
    });
});

// API routes
app.use('/api', routes);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Export app for Vercel serverless functions
export default app;

// Initialize database connection (for Vercel serverless - connection is cached)
if (process.env.VERCEL === '1') {
    connectDatabase().catch(err => {
        logger.error('Database connection failed on startup:', err);
    });
}

// Start server only if not in Vercel environment
if (process.env.VERCEL !== '1') {
    const startServer = async () => {
        try {
            // Connect to database
            await connectDatabase();

            // Start listening
            const PORT = config.port || 3001;
            app.listen(PORT, () => {
                logger.info(`🚀 Server running locally at http://localhost:${PORT}`);
                logger.info(`Environment: ${config.nodeEnv}`);
            });
        } catch (error) {
            logger.error('Failed to start server:', error);
            process.exit(1);
        }
    };

    startServer();
}
