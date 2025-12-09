import * as bookingService from '../services/bookingService.js';
import { logger } from '../utils/logger.js';

export const createBooking = async (req, res) => {
  try {
    const { name, email, phone, serviceInterest, message } = req.body;

    // Validation
    if (!name || !email || !phone || !serviceInterest) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, phone and service interest are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    // Phone validation
    const validatePhone = (phoneNumber) => {
      const cleaned = phoneNumber.replace(/\D/g, '');
      if (cleaned.startsWith('91') && cleaned.length === 12) {
        return true; // +91XXXXXXXXXX format
      }
      return cleaned.length === 10; // Standard 10-digit Indian number
    };

    if (!validatePhone(phone)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid 10-digit Indian phone number'
      });
    }

    const bookingData = { name, email, phone, serviceInterest, message };
    const booking = await bookingService.createBooking(bookingData);

    res.status(201).json({
      success: true,
      message: 'Booking inquiry received successfully',
      data: booking
    });
  } catch (error) {
    logger.error('Error creating booking:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: Object.values(error.errors).map(e => e.message).join(', ')
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to process booking inquiry'
    });
  }
};

export const getBookings = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const result = await bookingService.getBookings({ page, limit });

    res.json({
      success: true,
      data: result.bookings,
      pagination: {
        currentPage: result.page,
        itemsPerPage: result.limit,
        totalItems: result.total,
        totalPages: result.totalPages,
        hasNextPage: result.page < result.totalPages,
        hasPreviousPage: result.page > 1
      }
    });
  } catch (error) {
    logger.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings'
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Booking ID is required'
      });
    }

    const booking = await bookingService.getBookingById(id);

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    logger.error('Error fetching booking:', error);

    if (error.message === 'Booking not found') {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to fetch booking'
    });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Booking ID is required'
      });
    }

    // Validate status if provided
    if (updateData.status) {
      const validStatuses = ['pending', 'contacted', 'confirmed', 'cancelled'];
      if (!validStatuses.includes(updateData.status)) {
        return res.status(400).json({
          success: false,
          error: `Status must be one of: ${validStatuses.join(', ')}`
        });
      }
    }

    const booking = await bookingService.updateBooking(id, updateData);

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    });
  } catch (error) {
    logger.error('Error updating booking:', error);

    if (error.message === 'Booking not found') {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: Object.values(error.errors).map(e => e.message).join(', ')
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update booking'
    });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Booking ID is required'
      });
    }

    const booking = await bookingService.deleteBooking(id);

    res.json({
      success: true,
      message: 'Booking deleted successfully',
      data: booking
    });
  } catch (error) {
    logger.error('Error deleting booking:', error);

    if (error.message === 'Booking not found') {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to delete booking'
    });
  }
};

