// Email service for sending booking notifications
import { config } from '../config/env.js';
import { logger } from './logger.js';
import transporter from '../config/mailer.js';
import { renderTemplate } from './template.js';

/**
 * Send booking inquiry email to admin
 * @param {Object} booking - Booking data object
 * @returns {Promise<boolean>} - Success status
 */
export const sendToAdmin = async (booking) => {
  try {
    const htmlTemplate = renderTemplate('booking-email', {
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      serviceInterest: booking.serviceInterest,
      message: booking.message || 'No message provided',
      year: new Date().getFullYear(),
    });

    const mailOptions = {
      from: `"Trika Sound Sanctuary" <${config.smtpUser}>`,
      to: config.adminEmail,
      subject: 'New Booking Inquiry Received',
      html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
    logger.info('✅ Booking inquiry email sent to admin');
    return true;
  } catch (error) {
    logger.error(`❌ Failed to send email to admin: ${error.message}`);
    return false;
  }
};

/**
 * Send confirmation email to user
 * @param {Object} booking - Booking data object
 * @returns {Promise<boolean>} - Success status
 */
export const sendConfirmationToUser = async (booking) => {
  try {
    const messageText = booking.message 
      ? `Message: ${booking.message}` 
      : '';
    
    const htmlTemplate = renderTemplate('confirmation-email', {
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      serviceInterest: booking.serviceInterest,
      message: messageText,
      year: new Date().getFullYear(),
    });

    const mailOptions = {
      from: `"Trika Sound Sanctuary" <${config.smtpUser}>`,
      to: booking.email,
      subject: "Thank You for Your Inquiry - We'll Be In Touch Soon!",
      html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`✅ Confirmation email sent to user: ${booking.email}`);
    return true;
  } catch (error) {
    logger.error(`❌ Failed to send confirmation email to user: ${error.message}`);
    return false;
  }
};

/**
 * Send payment confirmation email to user
 * @param {Object} booking - Payment booking data object
 * @param {Object} sessionData - Session data (if type is session)
 * @param {Object} retreatData - Retreat data (if type is retreat)
 * @returns {Promise<boolean>} - Success status
 */
export const sendPaymentConfirmation = async (booking, sessionData = null, retreatData = null) => {
  try {
    const serviceName = booking.type === 'session' 
      ? (sessionData?.label || 'Session')
      : (retreatData?.name || 'Retreat');
    
    const location = retreatData?.location || '';
    const bookingType = booking.type === 'session' ? 'Session' : 'Retreat';
    
    // Build location row HTML conditionally
    const locationRow = location 
      ? `<div class="detail-row">
          <span class="detail-label">Location:</span>
          <span class="detail-value">${location}</span>
        </div>`
      : '';
    
    // Amount is already stored in rupees, format it for display
    const amountInRupees = booking.amount.toFixed(2);
    
    const htmlTemplate = renderTemplate('payment-confirmation-email', {
      name: booking.name,
      email: booking.email,
      mobile: booking.mobile,
      serviceName,
      bookingType,
      locationRow,
      numberOfPeople: booking.numberOfPeople,
      amount: amountInRupees,
      bookingId: booking._id.toString().substring(0, 8),
      paymentId: booking.razorpayPaymentId?.substring(0, 12) || 'N/A',
      year: new Date().getFullYear(),
    });

    const mailOptions = {
      from: `"Trika Sound Sanctuary" <${config.smtpUser}>`,
      to: booking.email,
      subject: `Payment Confirmed - Your ${serviceName} Booking is Confirmed!`,
      html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`✅ Payment confirmation email sent to user: ${booking.email}`);
    return true;
  } catch (error) {
    logger.error(`❌ Failed to send payment confirmation email: ${error.message}`);
    return false;
  }
};

export default { sendToAdmin, sendConfirmationToUser, sendPaymentConfirmation };

