import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2,
  Clock,
  MessageSquare,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { getBookings, Booking } from '../lib/api/booking';

const InquiriesTab: React.FC = () => {
  const [inquiries, setInquiries] = useState<Booking[]>([]);
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

  useEffect(() => {
    fetchInquiries();
  }, [currentPage, itemsPerPage]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getBookings(currentPage, itemsPerPage);
      // Backend API returns: { success: true, data: [...], pagination: {...} }
      // Response interceptor returns the entire response object
      if (response.success) {
        // Access data and pagination from the response
        const responseData = response as any;
        const inquiriesData = responseData.data || [];
        const paginationData = responseData.pagination;
        
        setInquiries(inquiriesData);
        
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
            totalItems: inquiriesData.length,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
            itemsPerPage: 20,
          });
        }
      }
    } catch (err) {
      setError('Failed to load inquiries');
      console.error('Inquiries error:', err);
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

  const getStatusBadge = (status?: string) => {
    if (!status || status === 'pending') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </span>
      );
    }
    if (status === 'contacted') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <MessageSquare className="w-3 h-3 mr-1" />
          Contacted
        </span>
      );
    }
    if (status === 'confirmed') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Confirmed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        {status}
      </span>
    );
  };

  const getServiceLabel = (serviceInterest: string) => {
    const serviceMap: { [key: string]: string } = {
      'chakra-therapy': 'Chakra Therapy',
      'organ-therapy': 'Organ Therapy',
      'clinical-protocols': 'Clinical Protocols',
      'corporate-wellness': 'Corporate Wellness',
      'retreats-festivals': 'Retreats & Festivals',
      'lunar-sound-baths': 'Lunar Sound Baths',
      'workshops': 'Workshops',
      'gong-bowl-training': 'Gong & Bowl Training',
    };
    return serviceMap[serviceInterest] || serviceInterest;
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
            <h1 className="text-2xl font-semibold text-[#1c1917] mb-1">Inquiries</h1>
            <p className="text-sm text-stone-600">Manage all booking inquiries and customer messages</p>
          </div>
        </div>

        {/* Inquiries Table */}
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-200">
            <h3 className="text-lg font-semibold text-[#1c1917]">All Inquiries</h3>
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
          ) : inquiries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-stone-600">No inquiries found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F3F0EB]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">
                        Service Interest
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">
                        Message
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
                    {inquiries.map((inquiry) => (
                      <tr key={inquiry._id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-[#1c1917]">{inquiry.name}</div>
                          <div className="text-xs text-stone-500">{inquiry.email}</div>
                          <div className="text-xs text-stone-500">{inquiry.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-stone-700">
                            {getServiceLabel(inquiry.serviceInterest)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-stone-700 max-w-xs truncate">
                            {inquiry.message || 'No message'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(inquiry.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                          {formatDate(inquiry.createdAt)}
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
                        Showing {((currentPage - 1) * pagination.itemsPerPage) + 1} to {Math.min(currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} inquiries
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

export default InquiriesTab;
