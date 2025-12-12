import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

interface PaymentDialogProps {
  type: 'success' | 'error';
  title: string;
  message: string;
  onClose: () => void;
  bookingDetails?: {
    type: string;
    name: string;
    numberOfPeople?: number;
  };
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  type,
  title,
  message,
  onClose,
  bookingDetails,
}) => {
  const isSuccess = type === 'success';
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm transition-opacity duration-300"
      style={{
        opacity: isVisible ? 1 : 0,
        animation: 'fadeIn 0.3s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-[#FDFBF9] w-full max-w-md shadow-2xl relative rounded-lg transform transition-all duration-500"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(-20px)',
          animation: 'scaleIn 0.5s ease-out',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-500 hover:text-stone-900 transition-all duration-300 z-10 hover:scale-110 active:scale-95 rounded-full p-1 hover:bg-stone-100"
        >
          <X size={24} />
        </button>

        <div className="p-8 md:p-12 text-center">
          {/* Icon */}
          <div 
            className={`mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-700 ${
              isSuccess 
                ? 'bg-[#967BB6]/10' 
                : 'bg-red-50'
            }`}
            style={{
              animation: 'fadeInUp 0.6s ease-out 0.2s both',
            }}
          >
            {isSuccess ? (
              <CheckCircle2 
                className="w-12 h-12 text-[#967BB6] transition-all duration-500"
                style={{
                  animation: 'scaleIn 0.5s ease-out 0.4s both',
                }}
              />
            ) : (
              <XCircle 
                className="w-12 h-12 text-red-500 transition-all duration-500"
                style={{
                  animation: 'scaleIn 0.5s ease-out 0.4s both',
                }}
              />
            )}
          </div>

          {/* Title */}
          <h2 
            className={`font-serif text-3xl mb-3 transition-all duration-500 ${
              isSuccess ? 'text-[#967BB6]' : 'text-red-600'
            }`}
            style={{
              animation: 'fadeInUp 0.6s ease-out 0.3s both',
            }}
          >
            {title}
          </h2>

          {/* Message */}
          <p 
            className="text-stone-600 mb-6 font-light leading-relaxed transition-all duration-500"
            style={{
              animation: 'fadeInUp 0.6s ease-out 0.4s both',
            }}
          >
            {message}
          </p>

          {/* Booking Details (only for success) */}
          {isSuccess && bookingDetails && (
            <div 
              className="bg-[#F3F0EB] rounded-lg p-4 mb-6 text-left transition-all duration-500"
              style={{
                animation: 'fadeInUp 0.6s ease-out 0.5s both',
              }}
            >
              <h3 className="font-serif text-lg text-[#1c1917] mb-3">Booking Details</h3>
              <div className="space-y-2 text-sm text-stone-600">
                <div className="flex justify-between">
                  <span className="font-medium">Service:</span>
                  <span>{bookingDetails.name}</span>
                </div>
                {bookingDetails.numberOfPeople && (
                  <div className="flex justify-between">
                    <span className="font-medium">Number of People:</span>
                    <span>{bookingDetails.numberOfPeople}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-medium">Booking Type:</span>
                  <span className="capitalize">{bookingDetails.type}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={onClose}
            className={`w-full py-3 px-6 tracking-wider transition-all duration-300 font-medium hover:scale-[1.02] active:scale-95 ${
              isSuccess
                ? 'bg-[#967BB6] text-white hover:bg-[#7A5F9F] hover:shadow-lg hover:shadow-[#967BB6]/30'
                : 'bg-[#1c1917] text-white hover:bg-stone-800 hover:shadow-lg hover:shadow-stone-900/20'
            }`}
            style={{
              animation: 'fadeInUp 0.6s ease-out 0.6s both',
            }}
          >
            {isSuccess ? 'Continue' : 'Try Again'}
          </button>

          {/* Additional help text for errors */}
          {!isSuccess && (
            <p className="text-xs text-stone-500 mt-4">
              If the problem persists, please contact our support team.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentDialog;

