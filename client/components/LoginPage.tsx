import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Github } from 'lucide-react';
import { login, setToken } from '../lib/api/auth';

interface LoginPageProps {
  onSignUp?: () => void;
  onForgotPassword?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSignUp, onForgotPassword }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<{ email?: string; password?: string; }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    // Clear login error when user starts typing
    if (loginError) {
      setLoginError(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string; } = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setLoginError(null);

    try {
      const response = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (response.success) {
        // Backend returns: { success: true, message: "...", token: "..." }
        // The response interceptor returns the data directly, so token is at top level
        const token = (response as any).token || response.data?.token;

        if (token) {
          // Store token in localStorage
          setToken(token);

          // Redirect to dashboard
          navigate('/dashboard');
        } else {
          // If no token but success, still redirect (token might be handled elsewhere)
          navigate('/dashboard');
        }
      } else {
        setLoginError(response.error || response.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error
        ? error.message
        : 'An error occurred during login. Please try again.';
      setLoginError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // TODO: Implement social login
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Login Form */}
      <div className="w-full lg:w-1/2 bg-[#FDFBF9] flex flex-col items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <img
              src="/assets/images/logo.png"
              alt="Trika Sound Sanctuary Logo"
              className="h-10 w-auto"
            />
            <span className="text-[#1c1917] font-serif text-2xl font-semibold tracking-widest uppercase">TRIKA</span>
          </div>

          {/* Sign In Title */}
          <h1 className="font-serif text-4xl font-bold text-[#1c1917] mb-8">Sign in</h1>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-widest text-stone-500 mb-2 font-bold">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-[#F3F0EB] border-none pl-12 pr-4 py-3 text-stone-900 focus:ring-2 focus:ring-[#967BB6] placeholder-stone-400/50 transition-all ${errors.email ? 'ring-2 ring-red-500' : ''
                    }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs uppercase tracking-widest text-stone-500 mb-2 font-bold">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" size={20} />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full bg-[#F3F0EB] border-none pl-12 pr-4 py-3 text-stone-900 focus:ring-2 focus:ring-[#967BB6] placeholder-stone-400/50 transition-all ${errors.password ? 'ring-2 ring-red-500' : ''
                    }`}
                  placeholder="Enter your password"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 text-[#967BB6] bg-[#F3F0EB] border-stone-300 rounded focus:ring-[#967BB6]"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-stone-600 font-light">
                Remember me
              </label>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-4">
                <p className="text-sm">{loginError}</p>
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1c1917] text-white py-3 mt-6 tracking-wider hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>

            {/* Links */}
            <div className="flex flex-col items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => onSignUp ? onSignUp() : navigate('/signup')}
                className="text-sm text-stone-600 font-light hover:text-[#967BB6] transition-colors"
              >
                Don't have an account? <span className="font-medium">Sign up</span>
              </button>
              <button
                type="button"
                onClick={() => onForgotPassword ? onForgotPassword() : navigate('/forgot-password')}
                className="text-sm text-stone-600 font-light hover:text-[#967BB6] transition-colors"
              >
                Forgot Password
              </button>
            </div>

            {/* Social Login */}
            <div className="mt-8 pt-8 border-t border-stone-200">
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors shadow-sm"
                  aria-label="Sign in with Google"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('github')}
                  className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors shadow-sm"
                  aria-label="Sign in with GitHub"
                >
                  <Github className="w-5 h-5 text-stone-700" />
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('facebook')}
                  className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors shadow-sm"
                  aria-label="Sign in with Facebook"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Right Section - Promotional Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1c1917] to-[#2A2624] relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 border-2 border-[#967BB6] rounded-full"></div>
          <div className="absolute top-40 right-40 w-48 h-48 border-2 border-[#967BB6] rounded-full"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 border-2 border-[#967BB6] rounded-full"></div>
        </div>

        {/* Geometric Shapes */}
        <div className="absolute top-10 left-10 w-32 h-32">
          <div className="w-full h-full border-2 border-[#967BB6] transform rotate-45 opacity-20"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between h-full p-12 text-white">
          {/* Top Section */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <img
                src="/assets/images/logo.png"
                alt="Trika Sound Sanctuary Logo"
                className="h-12 w-auto"
              />
              <span className="text-white font-serif text-3xl font-semibold tracking-widest uppercase">TRIKA</span>
            </div>

            <h2 className="font-serif text-5xl font-bold mb-6">Welcome to Trika</h2>
            <p className="text-stone-300 font-light text-lg leading-relaxed mb-4 max-w-md">
              Trika Sound Sanctuary helps you discover the transformative power of sound healing.
              Join our community and begin your journey toward inner peace and holistic wellness today.
            </p>
            <p className="text-stone-400 font-light text-base">
              More than 1,000 people have found healing with us, it's your turn.
            </p>
          </div>

          {/* Bottom Card */}
          <div className="bg-stone-800/50 backdrop-blur-sm rounded-2xl p-8 border border-stone-700/50">
            <h3 className="font-serif text-2xl font-bold mb-3">Begin Your Sound Healing Journey</h3>
            <p className="text-stone-300 font-light leading-relaxed mb-6">
              Experience the easiest way to start your path toward wellness and inner harmony through the power of sound.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#967BB6] to-[#7A5F9F] border-2 border-stone-800"></div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-400 to-stone-600 border-2 border-stone-800"></div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-500 to-stone-700 border-2 border-stone-800"></div>
                <div className="w-10 h-10 rounded-full bg-stone-700 border-2 border-stone-800 flex items-center justify-center text-xs font-medium">
                  +2
                </div>
              </div>
              <span className="text-stone-400 text-sm font-light">Join our community</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

