import express from 'express';
import bookingRoutes from './bookingRoutes.js';
import authRoutes from './authRoutes.js';

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

export default router;

