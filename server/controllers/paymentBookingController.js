import * as paymentBookingService from '../services/paymentBookingService.js';
import { logger } from '../utils/logger.js';

// Get all payment bookings with pagination and filters
export const getPaymentBookings = async (req, res) => {
  try {
    const { page, limit, status, paymentStatus, type } = req.query;

    const result = await paymentBookingService.getAllPaymentBookings({
      page,
      limit,
      status,
      paymentStatus,
      type,
    });

    res.json({
      success: true,
      data: result.bookings,
      pagination: {
        currentPage: result.page,
        itemsPerPage: result.limit,
        totalItems: result.total,
        totalPages: result.totalPages,
        hasNextPage: result.page < result.totalPages,
        hasPreviousPage: result.page > 1,
      },
    });
  } catch (error) {
    logger.error('Error fetching payment bookings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payment bookings',
    });
  }
};

// Get payment booking statistics
export const getPaymentBookingStats = async (req, res) => {
  try {
    const stats = await paymentBookingService.getPaymentBookingStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error('Error fetching payment booking stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payment booking statistics',
    });
  }
};

// Get a single payment booking by ID
export const getPaymentBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await paymentBookingService.getPaymentBookingById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Payment booking not found',
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    logger.error(`Error fetching payment booking with ID ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payment booking',
    });
  }
};

