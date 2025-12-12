import express from 'express';
import * as paymentBookingController from '../controllers/paymentBookingController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.get('/', authenticate, paymentBookingController.getPaymentBookings);
router.get('/stats', authenticate, paymentBookingController.getPaymentBookingStats);
router.get('/:id', authenticate, paymentBookingController.getPaymentBookingById);

export default router;

