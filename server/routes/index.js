import express from 'express';
import bookingRoutes from './bookingRoutes.js';
import authRoutes from './authRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import sessionRoutes from './sessionRoutes.js';
import retreatRoutes from './retreatRoutes.js';
import paymentBookingRoutes from './paymentBookingRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Trika Sound Sanctuary API'
  });
});

// API routes
router.use('/booking', bookingRoutes);
router.use('/auth', authRoutes);
router.use('/payments', paymentRoutes);
router.use('/sessions', sessionRoutes);
router.use('/retreats', retreatRoutes);
router.use('/payment-bookings', paymentBookingRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;

