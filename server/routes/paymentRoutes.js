import express from 'express';
import * as paymentController from '../controllers/paymentController.js';

const router = express.Router();

// POST /api/payments/create-order - Create a payment order (public)
router.post('/create-order', paymentController.createOrder);

// POST /api/payments/verify - Verify payment (public)
router.post('/verify', paymentController.verifyPayment);

// GET /api/payments/status/:bookingId - Get payment status (public)
router.get('/status/:bookingId', paymentController.getPaymentStatus);

export default router;

