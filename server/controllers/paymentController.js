import Razorpay from 'razorpay';
import crypto from 'crypto';
import { config } from '../config/env.js';
import * as paymentBookingService from '../services/paymentBookingService.js';
import * as sessionService from '../models/Session.js';
import * as retreatService from '../models/Retreat.js';
import { sendPaymentConfirmation } from '../utils/emailService.js';
import { logger } from '../utils/logger.js';

// Initialize Razorpay
// Validate test mode: test keys start with "rzp_test_", live keys start with "rzp_live_"
if (config.razorpay.testMode && config.razorpay.keyId && !config.razorpay.keyId.startsWith('rzp_test_')) {
  logger.warn('⚠️  Razorpay test mode is enabled but live keys detected! Ensure RAZORPAY_KEY_ID starts with "rzp_test_"');
}

if (!config.razorpay.testMode && config.razorpay.keyId && config.razorpay.keyId.startsWith('rzp_test_')) {
  logger.warn('⚠️  Razorpay test keys detected in production mode! Switch to live keys for production.');
}

// Validate Razorpay keys are configured
if (!config.razorpay.keyId || !config.razorpay.keySecret) {
  logger.error('❌ Razorpay keys are not configured! Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET');
}

const razorpay = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret,
});

// Create payment order
export const createOrder = async (req, res) => {
  try {
    // Validate Razorpay keys are configured
    if (!config.razorpay.keyId || !config.razorpay.keySecret) {
      return res.status(500).json({
        success: false,
        error: 'Payment gateway is not configured. Please contact support.',
      });
    }

    const { type, sessionType, retreatId, numberOfPeople, name, mobile, email } = req.body;

    // Validation
    if (!type || !['session', 'retreat'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid booking type. Must be "session" or "retreat"'
      });
    }

    if (type === 'session' && !sessionType) {
      return res.status(400).json({
        success: false,
        error: 'Session type is required for session bookings'
      });
    }

    if (type === 'retreat' && !retreatId) {
      return res.status(400).json({
        success: false,
        error: 'Retreat ID is required for retreat bookings'
      });
    }

    if (!numberOfPeople || numberOfPeople < 1 || numberOfPeople > 10) {
      return res.status(400).json({
        success: false,
        error: 'Number of people must be between 1 and 10'
      });
    }

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Valid name is required'
      });
    }

    if (!mobile) {
      return res.status(400).json({
        success: false,
        error: 'Mobile number is required'
      });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Valid email address is required'
      });
    }

    // SECURITY: Fetch session or retreat from database and calculate amount server-side
    // This prevents price manipulation attacks - amount is NEVER trusted from frontend
    let session = null;
    let retreat = null;
    let amount = 0;
    let sessionData = null;
    let retreatData = null;

    if (type === 'session') {
      session = await sessionService.getSessionByValue(sessionType);
      if (!session || !session.isActive) {
        return res.status(404).json({
          success: false,
          error: 'Session not found or inactive'
        });
      }
      amount = session.price * numberOfPeople;
      sessionData = {
        value: session.value,
        label: session.label,
        price: session.price,
      };
    } else if (type === 'retreat') {
      retreat = await retreatService.getRetreatById(retreatId);
      if (!retreat || !retreat.isActive) {
        return res.status(404).json({
          success: false,
          error: 'Retreat not found or inactive'
        });
      }
      amount = retreat.price * numberOfPeople;
      retreatData = {
        _id: retreat._id,
        name: retreat.name,
        price: retreat.price,
        location: retreat.location,
      };
    }

    // Validate calculated amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount calculated from booking details'
      });
    }

    // Create Razorpay order with server-calculated amount
    const amountInPaise = Math.round(amount * 100); // Razorpay expects amount in paise

    // Validate minimum amount (Razorpay minimum is 1 INR = 100 paise)
    if (amountInPaise < 100) {
      return res.status(400).json({
        success: false,
        error: 'Minimum payment amount is ₹1'
      });
    }

    const orderOptions = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `booking_${Date.now()}`,
      notes: {
        type,
        sessionType: sessionType || '',
        retreatId: retreatId || '',
        numberOfPeople,
        name: name.trim(),
        mobile: mobile.trim(),
      },
    };

    logger.info('Creating Razorpay order:', {
      type,
      sessionType: sessionType || null,
      retreatId: retreatId || null,
      numberOfPeople,
      amount: amountInPaise,
      calculatedAmount: amount,
      currency: 'INR',
      keyId: config.razorpay.keyId?.substring(0, 10) + '...',
      testMode: config.razorpay.testMode,
    });

    const razorpayOrder = await razorpay.orders.create(orderOptions);
    logger.info('Razorpay order created successfully:', {
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      status: razorpayOrder.status,
    });

    // Save booking to database
    const bookingData = {
      type,
      sessionType: sessionType || undefined,
      retreatId: retreatId || undefined,
      numberOfPeople,
      name: name.trim(),
      mobile: mobile.trim(),
      email: email.trim().toLowerCase(),
      amount,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: 'pending',
      status: 'pending',
    };

    const booking = await paymentBookingService.createPaymentBooking(bookingData);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount, // Amount in paise (calculated server-side for security)
      currency: razorpayOrder.currency || 'INR',
      keyId: config.razorpay.keyId,
      bookingId: booking._id.toString(),
      // Include booking details for frontend display
      bookingDetails: {
        type,
        session: sessionData,
        retreat: retreatData,
        numberOfPeople,
        calculatedAmount: amount, // Amount in INR (for display)
      },
    });
  } catch (error) {
    logger.error('Error creating payment order:', error);
    const errorMessage = error?.error?.description || error?.message || 'Failed to create payment order';
    res.status(500).json({
      success: false,
      error: errorMessage,
      details: error?.error || error,
    });
  }
};

// Verify payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    logger.info('Payment verification request received', {
      hasOrderId: !!razorpay_order_id,
      hasPaymentId: !!razorpay_payment_id,
      hasSignature: !!razorpay_signature,
      bookingId,
    });

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      logger.warn('Payment verification data is missing', {
        hasOrderId: !!razorpay_order_id,
        hasPaymentId: !!razorpay_payment_id,
        hasSignature: !!razorpay_signature,
      });
      return res.status(400).json({
        success: false,
        error: 'Payment verification data is missing'
      });
    }

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', config.razorpay.keySecret)
      .update(text)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      logger.error('Payment signature verification failed', {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        expected: generatedSignature,
        received: razorpay_signature,
      });
      return res.status(400).json({
        success: false,
        error: 'Payment verification failed - invalid signature'
      });
    }

    // Update booking with payment details
    const booking = await paymentBookingService.getPaymentBookingByOrderId(razorpay_order_id);
    logger.info('Booking found for payment verification', { orderId: razorpay_order_id });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Fetch session/retreat data for email
    let sessionData = null;
    let retreatData = null;

    if (booking.type === 'session' && booking.sessionType) {
      sessionData = await sessionService.getSessionByValue(booking.sessionType);
    } else if (booking.type === 'retreat' && booking.retreatId) {
      retreatData = await retreatService.getRetreatById(booking.retreatId);
    }

    // Update booking with payment information
    const updatedBooking = await paymentBookingService.updatePaymentBooking(booking._id, {
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      paymentStatus: 'completed',
      status: 'confirmed',
    });

    // Send payment confirmation email (non-blocking)
    if (updatedBooking.email) {
      sendPaymentConfirmation(updatedBooking, sessionData, retreatData)
        .then((sent) => {
          if (sent) {
            logger.info(`✅ Payment confirmation email sent for booking: ${updatedBooking._id}`);
          } else {
            logger.warn(`⚠️ Failed to send payment confirmation email for booking: ${updatedBooking._id}`);
          }
        })
        .catch((error) => {
          logger.error(`❌ Error sending payment confirmation email: ${error.message}`);
        });
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      booking: updatedBooking,
    });
  } catch (error) {
    logger.error('Error verifying payment:', error);
    const errorMessage = error?.message || 'Failed to verify payment';
    res.status(500).json({
      success: false,
      error: errorMessage,
      details: error,
    });
  }
};

// Get payment status
export const getPaymentStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        error: 'Booking ID is required'
      });
    }

    const booking = await paymentBookingService.getPaymentBookingById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    res.json({
      success: true,
      booking: {
        id: booking._id,
        type: booking.type,
        paymentStatus: booking.paymentStatus,
        status: booking.status,
        amount: booking.amount,
        numberOfPeople: booking.numberOfPeople,
      },
    });
  } catch (error) {
    logger.error('Error getting payment status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get payment status',
    });
  }
};

