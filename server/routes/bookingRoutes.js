import express from 'express';
import * as bookingController from '../controllers/bookingController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/booking - Create a new booking inquiry (public, no auth required)
router.post('/', bookingController.createBooking);

// All other routes require authentication
// GET /api/booking - Get all bookings (for admin use)
router.get('/', authenticate, bookingController.getBookings);

// GET /api/booking/:id - Get a specific booking by ID
router.get('/:id', authenticate, bookingController.getBookingById);

// PUT /api/booking/:id - Update a booking (e.g., update status)
router.put('/:id', authenticate, bookingController.updateBooking);

// DELETE /api/booking/:id - Delete a booking
router.delete('/:id', authenticate, bookingController.deleteBooking);

export default router;

