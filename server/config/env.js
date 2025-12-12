// Environment configuration
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  client_url: process.env.CLIENT_URL || 'http://localhost:3000',
  mongodbUri: process.env.MONGODB_URI,
  // SMTP Email Configuration
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT || 587,
  smtpSecure: process.env.SMTP_SECURE === 'true' || false,
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  adminEmail: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
  // Authentication Configuration
  jwt_secret: process.env.JWT_SECRET,
  // Razorpay Configuration
  // Note: Test mode is determined by API keys - test keys start with "rzp_test_", live keys start with "rzp_live_"
  // To use test mode, ensure RAZORPAY_KEY_ID starts with "rzp_test_"
  // IMPORTANT: If you get "International cards not supported" error:
  //   1. Cards are disabled in the payment options - use UPI, Netbanking, or Wallets instead
  //   2. To enable cards, contact Razorpay support to enable international transactions for your test account
  // Test Payment Methods (Recommended):
  //   - UPI: Use any UPI ID (e.g., test@razorpay)
  //   - Netbanking: Select any test bank
  //   - Wallets: Use test wallet credentials
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    // Explicit test mode flag (optional, for documentation purposes)
    // Set to true to ensure test keys are being used
    testMode: process.env.RAZORPAY_TEST_MODE === 'true' || process.env.NODE_ENV === 'development',
  },
  // User Configuration
  user: {
    email: process.env.USER_EMAIL,
    password: process.env.USER_PASSWORD, // Should be hashed in production
  },
};

