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

export default { sendToAdmin, sendConfirmationToUser };

