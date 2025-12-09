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
    process.exit(1);
  }
};

