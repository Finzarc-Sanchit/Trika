import React, { useState, FormEvent } from 'react';
import { X } from 'lucide-react';
import { createBooking } from '../lib/api/booking';

interface BookingModalProps {
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  serviceInterest: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  serviceInterest?: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    serviceInterest: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return false; // Phone is required
    // Indian phone number: 10 digits, optionally prefixed with +91
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      return true; // +91XXXXXXXXXX format
    }
    return cleaned.length === 10; // Standard 10-digit Indian number
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (required)
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian phone number';
    }

    // Service interest validation
    if (!formData.serviceInterest) {
      newErrors.serviceInterest = 'Please select a service interest';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    // Clear submit error when user starts typing
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleBlur = (field: keyof FormErrors) => {
    // Validate individual field on blur
    const newErrors: FormErrors = { ...errors };

    if (field === 'name') {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      } else if (formData.name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      } else {
        delete newErrors.name;
      }
    }

    if (field === 'email') {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      } else {
        delete newErrors.email;
      }
    }

    if (field === 'phone') {
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = 'Please enter a valid 10-digit Indian phone number';
      } else {
        delete newErrors.phone;
      }
    }

    if (field === 'serviceInterest') {
      if (!formData.serviceInterest) {
        newErrors.serviceInterest = 'Please select a service interest';
      } else {
        delete newErrors.serviceInterest;
      }
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await createBooking({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        serviceInterest: formData.serviceInterest,
        message: formData.message.trim() || undefined,
      });

      if (response.success) {
        setIsSubmitted(true);
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          phone: '',
          serviceInterest: '',
          message: '',
        });
      } else {
        setSubmitError(response.error || 'Failed to submit booking. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error instanceof Error
        ? error.message
        : 'There was an error submitting your information. Please try again.';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
        <div className="bg-[#FDFBF9] w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-300">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-500 hover:text-stone-900 transition-colors"
          >
            <X size={24} />
          </button>

          <div className="p-8 md:p-12 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="font-serif text-3xl text-[#1c1917] mb-4">Thank You!</h3>
            <p className="text-stone-600 font-light mb-6 leading-relaxed text-lg">
              We've received your inquiry. Sonia or her team will reach out to you within 24 hours to discuss your sound healing journey.
            </p>
            <button
              onClick={onClose}
              className="bg-[#1c1917] text-white px-8 py-3 tracking-wider hover:bg-stone-800 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
      <div className="bg-[#FDFBF9] w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-500 hover:text-stone-900 transition-colors z-10"
        >
          <X size={24} />
        </button>

        <div className="p-8 md:p-12">
          <h2 className="font-serif text-3xl text-[#1c1917] mb-2">Begin Your Journey</h2>
          <p className="text-stone-600 mb-8 font-light leading-relaxed">Connect with us to explore how sound healing can transform your life.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-xs uppercase tracking-widest text-stone-500 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => handleBlur('name')}
                className={`w-full bg-[#F3F0EB] border-none p-3 text-stone-900 focus:ring-2 focus:ring-stone-400 placeholder-stone-400/50 transition-all ${errors.name ? 'ring-2 ring-red-500' : ''
                  }`}
                placeholder="Priya Sharma"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-widest text-stone-500 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                className={`w-full bg-[#F3F0EB] border-none p-3 text-stone-900 focus:ring-2 focus:ring-stone-400 placeholder-stone-400/50 transition-all ${errors.email ? 'ring-2 ring-red-500' : ''
                  }`}
                placeholder="priya@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-xs uppercase tracking-widest text-stone-500 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={() => handleBlur('phone')}
                className={`w-full bg-[#F3F0EB] border-none p-3 text-stone-900 focus:ring-2 focus:ring-stone-400 placeholder-stone-400/50 transition-all ${errors.phone ? 'ring-2 ring-red-500' : ''
                  }`}
                placeholder="9876543210"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Service Interest Field */}
            <div>
              <label htmlFor="serviceInterest" className="block text-xs uppercase tracking-widest text-stone-500 mb-2">
                Service Interest <span className="text-red-500">*</span>
              </label>
              <select
                id="serviceInterest"
                name="serviceInterest"
                value={formData.serviceInterest}
                onChange={handleChange}
                onBlur={() => handleBlur('serviceInterest')}
                className={`w-full bg-[#F3F0EB] border-none p-3 text-stone-900 focus:ring-2 focus:ring-stone-400 transition-all font-light ${errors.serviceInterest ? 'ring-2 ring-red-500' : ''
                  }`}
              >
                <option value="">Select a service...</option>
                <option value="chakra-therapy">Chakra Therapy</option>
                <option value="organ-therapy">Organ Therapy</option>
                <option value="clinical-protocols">Clinical Protocols</option>
                <option value="corporate-wellness">Corporate Wellness</option>
                <option value="retreats-festivals">Retreats & Festivals</option>
                <option value="lunar-sound-baths">New Moon / Full Moon Sound Baths</option>
                <option value="workshops">Sound Healing Workshops</option>
                <option value="gong-bowl-training">Gong and Bowl Learning Modules</option>
                <option value="other">Other</option>
              </select>
              {errors.serviceInterest && (
                <p className="text-red-500 text-xs mt-1">{errors.serviceInterest}</p>
              )}
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-xs uppercase tracking-widest text-stone-500 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full bg-[#F3F0EB] border-none p-3 text-stone-900 focus:ring-2 focus:ring-stone-400 placeholder-stone-400/50 transition-all resize-none"
                placeholder="Tell us about your interest in sound healing, any specific concerns, or questions you may have..."
              />
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-4">
                <p className="text-sm">{submitError}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1c1917] text-white py-3 mt-6 tracking-wider hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;