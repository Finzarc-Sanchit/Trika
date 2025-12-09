import * as bookingModel from '../models/Booking.js';
import { sendToAdmin, sendConfirmationToUser } from '../utils/emailService.js';
import { logger } from '../utils/logger.js';

export const createBooking = async (bookingData) => {
  // Add any business logic here before saving
  // e.g., send email notification, format data, etc.

  const booking = await bookingModel.createBooking(bookingData);

  // Send email notifications (non-blocking - don't wait for emails to complete)
  // This ensures booking creation is not delayed by email sending
  Promise.all([
    sendToAdmin(booking),
    sendConfirmationToUser(booking)
  ]).then((results) => {
    const [adminSent, userSent] = results;
    if (adminSent && userSent) {
      logger.info('✅ Both emails sent successfully for booking:', booking._id);
    } else {
      logger.warn('⚠️ Some emails failed to send for booking:', booking._id);
    }
  }).catch(error => {
    // Log error but don't fail the booking creation
    logger.error('❌ Email sending error for booking:', booking._id, error.message);
  });

  return booking;
};

export const getBookings = async (options = {}) => {
  // Validate and sanitize pagination options
  const page = Math.max(1, parseInt(options.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(options.limit) || 10)); // Max 100 items per page

  return await bookingModel.getBookings({ page, limit });
};

export const getBookingById = async (id) => {
  const booking = await bookingModel.getBookingById(id);
  if (!booking) {
    throw new Error('Booking not found');
  }
  return booking;
};

export const updateBooking = async (id, updateData) => {
  const booking = await bookingModel.getBookingById(id);
  if (!booking) {
    throw new Error('Booking not found');
  }

  // Add any business logic here before updating
  // e.g., validate status transitions, send notifications, etc.

  const updatedBooking = await bookingModel.updateBooking(id, updateData);

  // TODO: Send notification if status changed
  // if (updateData.status && updateData.status !== booking.status) {
  //   await sendStatusUpdateNotification(updatedBooking);
  // }

  return updatedBooking;
};

export const deleteBooking = async (id) => {
  const booking = await bookingModel.getBookingById(id);
  if (!booking) {
    throw new Error('Booking not found');
  }

  // Add any business logic here before deleting
  // e.g., archive data, send notifications, etc.

  await bookingModel.deleteBooking(id);
  return booking;
};

