import React, { useState, FormEvent, useEffect } from 'react';
import { X } from 'lucide-react';
import { loadRazorpayScript, createPaymentOrder, initializeRazorpayPayment } from '../lib/payment';
import PaymentDialog from './PaymentDialog';

interface PaymentSessionModalProps {
  onClose: () => void;
}

interface SessionFormData {
  sessionType: string;
  numberOfPeople: string;
  name: string;
  mobile: string;
  email?: string;
}

interface FormErrors {
  sessionType?: string;
  numberOfPeople?: string;
  name?: string;
  mobile?: string;
  email?: string;
}

interface Session {
  _id: string;
  value: string;
  label: string;
  price: number;
  description?: string;
  duration?: string;
  category?: string;
}

const PaymentSessionModal: React.FC<PaymentSessionModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<SessionFormData>({
    sessionType: '',
    numberOfPeople: '1',
    name: '',
    mobile: '',
    email: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [paymentDialog, setPaymentDialog] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
    bookingDetails?: { type: string; name: string; numberOfPeople?: number; };
  } | null>(null);

  useEffect(() => {
    // Load Razorpay script on component mount
    loadRazorpayScript()
      .then(() => {
        setIsRazorpayLoaded(true);
      })
      .catch((error) => {
        console.error('Failed to load Razorpay:', error);
      });

    // Fetch sessions from API
    const fetchSessions = async () => {
      try {
        setIsLoadingSessions(true);
        const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';
        const response = await fetch(`${API_BASE_URL}/sessions`);
        const result = await response.json();

        if (result.success && result.sessions) {
          setSessions(result.sessions);
        }
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
      } finally {
        setIsLoadingSessions(false);
      }
    };

    fetchSessions();
  }, []);

  const selectedSession = sessions.find(s => s.value === formData.sessionType);
  const numberOfPeople = parseInt(formData.numberOfPeople) || 1;
  const totalAmount = selectedSession ? selectedSession.price * numberOfPeople : 0;

  const validatePhone = (phone: string): boolean => {
    if (!phone) return false;
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      return true;
    }
    return cleaned.length === 10;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.sessionType) {
      newErrors.sessionType = 'Please select a session type';
    }

    if (!formData.numberOfPeople || parseInt(formData.numberOfPeople) < 1) {
      newErrors.numberOfPeople = 'Please enter number of people (minimum 1)';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!validatePhone(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit Indian phone number';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    if (!isRazorpayLoaded) {
      alert('Payment gateway is loading. Please wait a moment and try again.');
      return;
    }

    try {
      const bookingData = {
        type: 'session' as const,
        sessionType: formData.sessionType,
        numberOfPeople: numberOfPeople,
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email?.trim() || '',
        // Amount is calculated server-side for security
      };

      // Create payment order
      const orderResponse = await createPaymentOrder(bookingData);

      if (orderResponse.success && orderResponse.orderId) {
        // Initialize Razorpay payment with prefill data
        initializeRazorpayPayment(
          orderResponse,
          () => {
            // Payment success
            setPaymentDialog({
              type: 'success',
              title: 'Payment Successful!',
              message: `Your booking for ${selectedSession?.label} has been confirmed. We'll send you a confirmation email shortly.`,
              bookingDetails: {
                type: 'session',
                name: selectedSession?.label || '',
                numberOfPeople,
              },
            });
            setIsProcessing(false);
          },
          (error) => {
            // Payment error
            setPaymentDialog({
              type: 'error',
              title: 'Payment Failed',
              message: error || 'Payment could not be processed. Please try again or use a different payment method.',
            });
            setIsProcessing(false);
          },
          {
            name: formData.name.trim(),
            contact: formData.mobile.trim(),
            email: formData.email?.trim() || '',
          }
        );
      } else {
        setPaymentDialog({
          type: 'error',
          title: 'Booking Failed',
          message: orderResponse.error || 'Failed to create booking. Please try again.',
        });
        setIsProcessing(false);
      }
    } catch (error) {
      setPaymentDialog({
        type: 'error',
        title: 'Error',
        message: 'An unexpected error occurred. Please try again.',
      });
      setIsProcessing(false);
    }
  };

  const handleDialogClose = () => {
    setPaymentDialog(null);
    if (paymentDialog?.type === 'success') {
      onClose();
    }
  };

  return (
    <>
      {paymentDialog && (
        <PaymentDialog
          type={paymentDialog.type}
          title={paymentDialog.title}
          message={paymentDialog.message}
          bookingDetails={paymentDialog.bookingDetails}
          onClose={handleDialogClose}
        />
      )}
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-[#FDFBF9] w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-500 max-h-[90vh] overflow-y-auto rounded-lg">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-500 hover:text-stone-900 transition-all duration-300 z-10 hover:scale-110 active:scale-95 rounded-full p-1 hover:bg-stone-100"
          >
            <X size={24} />
          </button>

          <div className="p-8 md:p-12">
            <h2 className="font-serif text-3xl text-[#1c1917] mb-2">Book A Session</h2>
            <p className="text-stone-600 mb-8 font-light leading-relaxed">Select your session type and complete your booking.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Session Type */}
              <div>
                <label htmlFor="sessionType" className="block text-xs uppercase tracking-widest text-stone-500 mb-2">
                  Session Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="sessionType"
                  name="sessionType"
                  value={formData.sessionType}
                  onChange={handleChange}
                  disabled={isLoadingSessions}
                  className={`w-full bg-[#F3F0EB] border-none p-3 text-stone-900 focus:ring-2 focus:ring-stone-400 transition-all duration-300 font-light hover:bg-[#EBE7E0] disabled:opacity-50 disabled:cursor-not-allowed ${errors.sessionType ? 'ring-2 ring-red-500' : ''}`}
                >
                  <option value="">
                    {isLoadingSessions ? 'Loading sessions...' : 'Select a session type...'}
                  </option>
                  {sessions.map((session) => (
                    <option key={session._id} value={session.value}>
                      {session.label} - ₹{session.price}
                    </option>
                  ))}
                </select>
                {errors.sessionType && (
                  <p className="text-red-500 text-xs mt-1">{errors.sessionType}</p>
                )}
              </div>

              {/* Number of People */}
              <div>
                <label htmlFor="numberOfPeople" className="block text-xs uppercase tracking-widest text-stone-500 mb-2">
                  Number of People <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="numberOfPeople"
                  name="numberOfPeople"
                  min="1"
                  max="10"
                  value={formData.numberOfPeople}
                  onChange={handleChange}
                  className={`w-full bg-[#F3F0EB] border-none p-3 text-stone-900 focus:ring-2 focus:ring-stone-400 placeholder-stone-400/50 transition-all duration-300 hover:bg-[#EBE7E0] ${errors.numberOfPeople ? 'ring-2 ring-red-500' : ''}`}
                  placeholder="1"
                />
                {errors.numberOfPeople && (
                  <p className="text-red-500 text-xs mt-1">{errors.numberOfPeople}</p>
                )}
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-xs uppercase tracking-widest text-stone-500 mb-2">
                  Booking Person's Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full bg-[#F3F0EB] border-none p-3 text-stone-900 focus:ring-2 focus:ring-stone-400 placeholder-stone-400/50 transition-all duration-300 hover:bg-[#EBE7E0] ${errors.name ? 'ring-2 ring-red-500' : ''}`}
                  placeholder="Priya Sharma"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label htmlFor="mobile" className="block text-xs uppercase tracking-widest text-stone-500 mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={`w-full bg-[#F3F0EB] border-none p-3 text-stone-900 focus:ring-2 focus:ring-stone-400 placeholder-stone-400/50 transition-all duration-300 hover:bg-[#EBE7E0] ${errors.mobile ? 'ring-2 ring-red-500' : ''}`}
                  placeholder="9876543210"
                />
                {errors.mobile && (
                  <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs uppercase tracking-widest text-stone-500 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className={`w-full bg-[#F3F0EB] border-none p-3 text-stone-900 focus:ring-2 focus:ring-stone-400 placeholder-stone-400/50 transition-all duration-300 hover:bg-[#EBE7E0] ${errors.email ? 'ring-2 ring-red-500' : ''}`}
                  placeholder="priya@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Total Amount Display */}
              {selectedSession && (
                <div className="bg-stone-100 p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-stone-600">Session:</span>
                    <span className="font-semibold">{selectedSession.label}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-stone-600">Price per person:</span>
                    <span className="font-semibold">₹{selectedSession.price}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-stone-600">Number of people:</span>
                    <span className="font-semibold">{numberOfPeople}</span>
                  </div>
                  <div className="border-t border-stone-300 pt-2 mt-2 flex justify-between items-center">
                    <span className="text-lg font-semibold text-[#1c1917]">Total Amount:</span>
                    <span className="text-2xl font-bold text-[#967BB6]">₹{totalAmount}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing || !selectedSession}
                className="w-full bg-[#967BB6] text-white py-3 mt-6 tracking-wider hover:bg-[#7A5F9F] transition-all duration-300 hover:shadow-lg hover:shadow-[#967BB6]/30 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none font-medium"
              >
                {isProcessing ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentSessionModal;

