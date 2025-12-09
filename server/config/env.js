// Environment configuration
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI,
  // SMTP Email Configuration
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT || 587,
  smtpSecure: process.env.SMTP_SECURE === 'true' || false,
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  adminEmail: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
  // Authentication Configuration
  jwt_secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  // User Configuration
  user: {
    email: process.env.USER_EMAIL,
    password: process.env.USER_PASSWORD, // Should be hashed in production
  },
};

