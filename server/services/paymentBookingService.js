import * as paymentBookingModel from '../models/PaymentBooking.js';
import { logger } from '../utils/logger.js';

export const createPaymentBooking = async (bookingData) => {
  const booking = await paymentBookingModel.createPaymentBooking(bookingData);
  logger.info('Payment booking created:', booking._id);
  return booking;
};

export const getPaymentBookingById = async (id) => {
  return await paymentBookingModel.getPaymentBookingById(id);
};

export const updatePaymentBooking = async (id, updateData) => {
  return await paymentBookingModel.updatePaymentBooking(id, updateData);
};

export const getPaymentBookingByOrderId = async (orderId) => {
  return await paymentBookingModel.getPaymentBookingByOrderId(orderId);
};

export const getAllPaymentBookings = async (options = {}) => {
  return await paymentBookingModel.getAllPaymentBookings(options);
};

export const getPaymentBookingStats = async () => {
  return await paymentBookingModel.getPaymentBookingStats();
};

