import * as bookingService from '../services/bookingService.js';
import * as paymentBookingService from '../services/paymentBookingService.js';
import { logger } from '../utils/logger.js';

// Get combined dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Get booking stats
    const bookingsResult = await bookingService.getBookings({ page: 1, limit: 1000 });

    // Get payment booking stats
    const paymentStats = await paymentBookingService.getPaymentBookingStats();

    // Calculate booking stats
    const allBookings = bookingsResult.bookings || [];
    const bookingStats = {
      total: bookingsResult.total || 0,
      pending: allBookings.filter(b => !b.status || b.status === 'pending').length || 0,
      contacted: allBookings.filter(b => b.status === 'contacted').length || 0,
      confirmed: allBookings.filter(b => b.status === 'confirmed').length || 0,
    };

    // Get recent bookings (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentBookings = allBookings.filter(
      b => new Date(b.createdAt) >= sevenDaysAgo
    ).length || 0;

    // Get recent payment bookings (last 7 days)
    const allPaymentBookings = await paymentBookingService.getAllPaymentBookings({
      page: 1,
      limit: 10000,
    });
    const recentPaymentBookings = (allPaymentBookings.bookings || []).filter(
      b => new Date(b.createdAt) >= sevenDaysAgo
    ).length || 0;

    // Calculate revenue trends (last 7 days)
    const revenueData = await calculateRevenueTrends();

    res.json({
      success: true,
      data: {
        inquiries: bookingStats,
        paymentBookings: {
          total: paymentStats.totalBookings || 0,
          confirmed: paymentStats.confirmedBookings || 0,
          pending: paymentStats.pendingBookings || 0,
          cancelled: paymentStats.cancelledBookings || 0,
          totalRevenue: paymentStats.totalRevenue || 0,
          sessionBookings: paymentStats.sessionBookings || 0,
          retreatBookings: paymentStats.retreatBookings || 0,
        },
        recent: {
          inquiries: recentBookings,
          paymentBookings: recentPaymentBookings,
        },
        revenueTrends: revenueData,
      },
    });
  } catch (error) {
    logger.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics',
    });
  }
};

// Calculate revenue trends for the last 7 days
const calculateRevenueTrends = async () => {
  try {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      // Get payment bookings for this day
      const allBookings = await paymentBookingService.getAllPaymentBookings({
        page: 1,
        limit: 10000,
      });
      
      const dayBookings = allBookings.bookings?.filter(booking => {
        const bookingDate = new Date(booking.createdAt);
        return bookingDate >= date && bookingDate < nextDate && 
               booking.paymentStatus === 'completed' && 
               booking.status === 'confirmed';
      }) || [];
      
      const dayRevenue = dayBookings.reduce((sum, booking) => sum + (booking.amount || 0), 0);
      
      days.push({
        date: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        revenue: dayRevenue,
        bookings: dayBookings.length,
      });
    }
    
    return days;
  } catch (error) {
    logger.error('Error calculating revenue trends:', error);
    return [];
  }
};

