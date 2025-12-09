// Database configuration
import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';
import { config } from './env.js';

export const connectDatabase = async () => {
  try {
    if (!config.mongodbUri) {
      logger.warn('MONGODB_URI not set. Using in-memory storage. Set MONGODB_URI in .env to use MongoDB.');
      return;
    }

    // Check if already connected (for Vercel serverless functions)
    if (mongoose.connection.readyState === 1) {
      logger.info('Database already connected');
      return;
    }

    await mongoose.connect(config.mongodbUri);
    logger.info('Database connected successfully');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });
  } catch (error) {
    logger.error('Database connection error:', error);
    // Don't exit process in Vercel serverless environment
    if (process.env.VERCEL !== '1') {
      process.exit(1);
    }
  }
};

