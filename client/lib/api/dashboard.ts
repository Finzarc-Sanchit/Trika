// Dashboard API service
import { apiGet, ApiResponse } from '../api';

export interface PaymentBooking {
  _id: string;
  type: 'session' | 'retreat';
  sessionType?: string;
  retreatId?: string;
  numberOfPeople: number;
  name: string;
  mobile: string;
  email: string;
  amount: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// Note: The API returns { success: true, data: [...], pagination: {...} }
// The response interceptor returns the entire response object
export interface PaymentBookingsResponse {
  data: PaymentBooking[];
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface DashboardStats {
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  sessionBookings: number;
  retreatBookings: number;
}

export interface CombinedDashboardStats {
  inquiries: {
    total: number;
    pending: number;
    contacted: number;
    confirmed: number;
  };
  paymentBookings: {
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    totalRevenue: number;
    sessionBookings: number;
    retreatBookings: number;
  };
  recent: {
    inquiries: number;
    paymentBookings: number;
  };
  revenueTrends: Array<{
    date: string;
    label: string;
    revenue: number;
    bookings: number;
  }>;
}

// Get all payment bookings with pagination and filters
export const getPaymentBookings = async (
  page: number = 1,
  limit: number = 20,
  filters?: {
    status?: string;
    paymentStatus?: string;
    type?: string;
  }
): Promise<ApiResponse<PaymentBookingsResponse>> => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (filters?.status) queryParams.append('status', filters.status);
  if (filters?.paymentStatus) queryParams.append('paymentStatus', filters.paymentStatus);
  if (filters?.type) queryParams.append('type', filters.type);

  return apiGet<PaymentBookingsResponse>(`/payment-bookings?${queryParams.toString()}`);
};

// Get payment booking statistics
export const getPaymentBookingStats = async (): Promise<ApiResponse<DashboardStats>> => {
  return apiGet<DashboardStats>('/payment-bookings/stats');
};

// Get combined dashboard statistics
export const getDashboardStats = async (): Promise<ApiResponse<CombinedDashboardStats>> => {
  return apiGet<CombinedDashboardStats>('/dashboard/stats');
};

// Get a single payment booking by ID
export const getPaymentBookingById = async (id: string): Promise<ApiResponse<PaymentBooking>> => {
  return apiGet<PaymentBooking>(`/payment-bookings/${id}`);
};
