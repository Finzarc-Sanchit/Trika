// Payment utility functions for Razorpay integration

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentOrderData {
  type: 'session' | 'retreat';
  sessionType?: string;
  retreatId?: string;
  numberOfPeople: number;
  name: string;
  mobile: string;
  // Note: amount is calculated server-side for security
}

export interface CreateOrderResponse {
  success: boolean;
  orderId?: string;
  amount?: number;
  currency?: string;
  keyId?: string;
  bookingId?: string;
  error?: string;
}

// Load Razorpay script dynamically
export const loadRazorpayScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay script'));
    document.body.appendChild(script);
  });
};

// Create payment order
export const createPaymentOrder = async (data: PaymentOrderData): Promise<CreateOrderResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to create payment order. Please try again.',
        details: result.details,
      };
    }
    
    return result;
  } catch (error) {
    return {
      success: false,
      error: 'Failed to create payment order. Please try again.',
    };
  }
};

// Verify payment
export const verifyPayment = async (
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
  bookingId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const requestBody = {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    };
    
    const response = await fetch(`${API_BASE_URL}/payments/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to verify payment. Please contact support.',
        details: result.details,
      };
    }
    
    return result;
  } catch (error) {
    return {
      success: false,
      error: 'Failed to verify payment. Please contact support.',
    };
  }
};

// Initialize Razorpay payment
export const initializeRazorpayPayment = (
  orderData: CreateOrderResponse,
  onSuccess: () => void,
  onError: (error: string) => void,
  prefillData?: { name?: string; contact?: string; email?: string }
) => {
  if (!window.Razorpay) {
    onError('Razorpay SDK not loaded. Please refresh the page.');
    return;
  }

  if (!orderData.orderId || !orderData.keyId) {
    onError('Invalid order data. Please try again.');
    return;
  }

  if (!orderData.amount || orderData.amount <= 0) {
    onError('Invalid payment amount. Please try again.');
    return;
  }

  const options = {
    key: orderData.keyId,
    amount: orderData.amount.toString(), // Razorpay expects amount as string
    currency: orderData.currency || 'INR',
    name: 'Trika Sound Sanctuary',
    description: 'Sound Healing Session Booking',
    order_id: orderData.orderId,
    // Configure payment methods - all Indian payment methods enabled
    method: {
      card: true,
      netbanking: true,
      wallet: true,
      upi: true,
      emi: false,
    },
    handler: async function (response: any) {
      try {
        // Validate response data
        if (!response.razorpay_order_id || !response.razorpay_payment_id || !response.razorpay_signature) {
          onError('Invalid payment response. Please contact support.');
          return;
        }
        
        const verification = await verifyPayment(
          response.razorpay_order_id,
          response.razorpay_payment_id,
          response.razorpay_signature,
          orderData.bookingId || ''
        );

        if (verification.success) {
          onSuccess();
        } else {
          onError(verification.error || 'Payment verification failed');
        }
      } catch (error) {
        onError('Payment verification failed. Please contact support.');
      }
    },
    prefill: {
      name: prefillData?.name || '',
      contact: prefillData?.contact || '',
      email: prefillData?.email || '',
    },
    theme: {
      color: '#967BB6',
    },
    modal: {
      ondismiss: function () {
        onError('Payment cancelled by user');
      },
    },
    // Additional options for better error handling
    retry: {
      enabled: true,
      max_count: 3,
    },
  };

  try {
    const razorpay = new window.Razorpay(options);
    
    // Add error handler for Razorpay payment failures
    razorpay.on('payment.failed', function (response: any) {
      const errorCode = response.error?.code;
      const errorDescription = response.error?.description || response.error?.reason || 'Payment failed';
      const errorReason = response.error?.reason;
      
      // Provide helpful message based on error type
      let errorMessage = errorDescription;
      
      if (errorDescription.toLowerCase().includes('international') || errorReason === 'international_transaction_not_allowed') {
        errorMessage = 'International cards are not supported. Please use Indian payment methods:\n\n' +
          '✅ UPI (Recommended for testing)\n' +
          '✅ Netbanking\n' +
          '✅ Wallets (Paytm, PhonePe, etc.)\n\n' +
          'Note: Cards are disabled to avoid international card issues. ' +
          'If you need to test with cards, please contact Razorpay support to enable international transactions for your test account.';
      } else if (errorCode === 'BAD_REQUEST_ERROR') {
        errorMessage = `Payment failed: ${errorDescription}. Please try using UPI, Netbanking, or Wallets instead.`;
      } else if (errorCode === 'GATEWAY_ERROR') {
        errorMessage = `Payment gateway error: ${errorDescription}. Please try again in a moment.`;
      } else if (errorReason) {
        errorMessage = `Payment failed: ${errorDescription} (${errorReason})`;
      }
      
      onError(errorMessage);
    });

    razorpay.open();
  } catch (error) {
    onError('Failed to initialize payment gateway. Please try again.');
  }
};

