// Email transporter configuration using Nodemailer
import nodemailer from 'nodemailer';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

// Create transporter with SMTP configuration
const transporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: Number(config.smtpPort),
  secure: config.smtpSecure, // true for 465, false for other ports
  auth: {
    user: config.smtpUser,
    pass: config.smtpPass,
  },
});

// Connection check
transporter.verify((error, success) => {
  if (error) {
    logger.error('❌ Email server connection failed:', error.message);
  } else {
    logger.info('✅ Email server is ready to send messages');
  }
});

export default transporter;

