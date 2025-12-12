import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { getPaymentBookings, PaymentBooking } from '../lib/api/dashboard';

const PaymentBookingsTab: React.FC = () => {
  const [bookings, setBookings] = useState<PaymentBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
    itemsPerPage: 20,
  });
  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    type: '',
  });

  useEffect(() => {
    fetchBookings();
  }, [currentPage, filters, itemsPerPage]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getPaymentBookings(currentPage, itemsPerPage, filters);
      // Backend API returns: { success: true, data: [...], pagination: {...} }
      // Response interceptor returns the entire response object
      if (response.success) {
        // Access data and pagination from the response
        const responseData = response as any;
        const bookingsData = responseData.data || [];
        const paginationData = responseData.pagination;
        
        setBookings(bookingsData);
        
        if (paginationData) {
          setPagination({
            totalItems: paginationData.totalItems || 0,
            totalPages: paginationData.totalPages || 1,
            hasNextPage: paginationData.hasNextPage || false,
            hasPreviousPage: paginationData.hasPreviousPage || false,
            itemsPerPage: paginationData.itemsPerPage || 20,
          });
        } else {
          // Fallback if pagination is missing
          setPagination({
            totalItems: bookingsData.length,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
            itemsPerPage: 20,
          });
        }
      }
    } catch (err) {
      setError('Failed to load payment bookings');
      console.error('Payment bookings error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string, paymentStatus?: string) => {
    if (status === 'confirmed' && paymentStatus === 'completed') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Confirmed
        </span>
      );
    }
    if (status === 'pending') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </span>
      );
    }
    if (status === 'cancelled') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Cancelled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <AlertCircle className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const totalPages = pagination.totalPages;
    const current = currentPage;
    
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (current <= 4) {
        // Current page is near the start: show 1, 2, 3, 4, 5, ..., last
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (current >= totalPages - 3) {
        // Current page is near the end: show 1, ..., last-4, last-3, last-2, last-1, last
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Current page is in the middle: show 1, ..., current-1, current, current+1, ..., last
        pages.push('...');
        pages.push(current - 1);
        pages.push(current);
        pages.push(current + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex-1 bg-white min-h-screen">
      <div className="max-w-full mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#1c1917] mb-1">Payment Bookings</h1>
            <p className="text-sm text-stone-600">Manage all paid session and retreat bookings</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-stone-200 p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => {
                  setFilters({ ...filters, status: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full bg-[#F3F0EB] border-none p-3 text-stone-900 focus:ring-2 focus:ring-[#967BB6] rounded"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">
                Payment Status
              </label>
              <select
                value={filters.paymentStatus}
                onChange={(e) => {
                  setFilters({ ...filters, paymentStatus: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full bg-[#F3F0EB] border-none p-3 text-stone-900 focus:ring-2 focus:ring-[#967BB6] rounded"
              >
                <option value="">All Payment Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => {
                  setFilters({ ...filters, type: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full bg-[#F3F0EB] border-none p-3 text-stone-900 focus:ring-2 focus:ring-[#967BB6] rounded"
              >
                <option value="">All Types</option>
                <option value="session">Session</option>
                <option value="retreat">Retreat</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-200">
            <h3 className="text-lg font-semibold text-[#1c1917]">All Payment Bookings</h3>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 text-[#967BB6] animate-spin" />
            </div>
          ) : error ? (
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-stone-600">No payment bookings found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F3F0EB]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">
                        Booking
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {bookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-[#1c1917]">
                            {booking.type === 'session' ? booking.sessionType : 'Retreat'}
                          </div>
                          <div className="text-xs text-stone-500">
                            {booking.numberOfPeople} {booking.numberOfPeople === 1 ? 'person' : 'people'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-[#1c1917]">{booking.name}</div>
                          <div className="text-xs text-stone-500">{booking.email}</div>
                          <div className="text-xs text-stone-500">{booking.mobile}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-stone-700 capitalize">{booking.type}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-[#967BB6]">
                            {formatCurrency(booking.amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(booking.status, booking.paymentStatus)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                          {formatDate(booking.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalItems > 0 && (
                <div className="px-6 py-4 border-t border-stone-200">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-stone-600">
                        Showing {((currentPage - 1) * pagination.itemsPerPage) + 1} to {Math.min(currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} bookings
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-stone-600">Items per page:</label>
                        <select
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          className="px-3 py-1.5 text-sm border border-stone-300 rounded-lg bg-white focus:ring-2 focus:ring-[#967BB6] focus:border-[#967BB6]"
                        >
                          <option value="10">10</option>
                          <option value="20">20</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-sm text-stone-600">
                        Page <span className="font-semibold text-[#1c1917]">{currentPage}</span> of <span className="font-semibold text-[#1c1917]">{pagination.totalPages}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={!pagination.hasPreviousPage || pagination.totalPages <= 1}
                          className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-stone-300"
                          title="Previous"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        
                        <div className="flex items-center space-x-1">
                          {getPageNumbers().map((page, index) => (
                            <React.Fragment key={index}>
                              {page === '...' ? (
                                <span className="px-3 py-1 text-stone-500">...</span>
                              ) : (
                                <button
                                  onClick={() => setCurrentPage(page as number)}
                                  className={`px-3 py-1 text-sm rounded-lg transition-colors border ${
                                    currentPage === page
                                      ? 'bg-[#967BB6] text-white border-[#967BB6]'
                                      : 'text-stone-700 hover:bg-stone-100 border-stone-300'
                                  }`}
                                >
                                  {page}
                                </button>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                        
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                          disabled={!pagination.hasNextPage || pagination.totalPages <= 1}
                          className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-stone-300"
                          title="Next"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentBookingsTab;
