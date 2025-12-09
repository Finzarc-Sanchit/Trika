// Booking API service
import { apiPost, apiGet, apiPut, apiDelete, ApiResponse } from '../api';

export interface BookingData {
    name: string;
    email: string;
    phone: string;
    serviceInterest: string;
    message?: string;
}

export interface Booking {
    _id: string;
    name: string;
    email: string;
    phone: string;
    serviceInterest: string;
    message?: string;
    status: 'pending' | 'contacted' | 'confirmed' | 'cancelled';
    createdAt: string;
    updatedAt: string;
}

export interface BookingsResponse {
    data: Booking[];
    pagination: {
        currentPage: number;
        itemsPerPage: number;
        totalItems: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

// Create a new booking
export const createBooking = async (bookingData: BookingData): Promise<ApiResponse<Booking>> => {
    return apiPost<Booking>('/booking', bookingData);
};

// Get all bookings with pagination
export const getBookings = async (
    page: number = 1,
    limit: number = 10
): Promise<ApiResponse<BookingsResponse>> => {
    return apiGet<BookingsResponse>(`/booking?page=${page}&limit=${limit}`);
};

// Get a single booking by ID
export const getBookingById = async (id: string): Promise<ApiResponse<Booking>> => {
    return apiGet<Booking>(`/booking/${id}`);
};

// Update a booking
export const updateBooking = async (
    id: string,
    updateData: Partial<BookingData & { status: string; }>
): Promise<ApiResponse<Booking>> => {
    return apiPut<Booking>(`/booking/${id}`, updateData);
};

// Delete a booking
export const deleteBooking = async (id: string): Promise<ApiResponse<Booking>> => {
    return apiDelete<Booking>(`/booking/${id}`);
};

