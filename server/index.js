import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { connectDatabase } from './config/database.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
    logger.info('Root route accessed');
    res.json({
        message: 'Trika Sound Sanctuary API is running',
        version: '1.0.0'
    });
});

// Initialize database connection (for Vercel serverless - connection is cached)
if (process.env.VERCEL === '1') {
    connectDatabase().catch(err => {
        logger.error('Database connection failed on startup:', err);
    });
}

// API routes
app.use('/api', routes);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Export app for Vercel serverless functions
export default app;

// Start server only if not in Vercel environment
if (process.env.VERCEL !== '1') {
    const startServer = async () => {
        try {
            // Connect to database
            await connectDatabase();

            // Start listening
            app.listen(config.port, () => {
                logger.info(`Server is running on http://localhost:${config.port}`);
                logger.info(`Environment: ${config.nodeEnv}`);
            });
        } catch (error) {
            logger.error('Failed to start server:', error);
            process.exit(1);
        }
    };

    startServer();
}
