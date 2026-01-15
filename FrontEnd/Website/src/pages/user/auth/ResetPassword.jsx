import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FiLock, FiEye, FiEyeOff, FiArrowLeft, FiShield } from 'react-icons/fi';

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    if (!email) {
      toast.error('Email is missing. Please restart the password reset process.');
      navigate('/forgot-password');
      return;
    }

    setIsLoading(true);
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/Identity/Account/Reset-Password`,
        {
          email: email,
          Code: data.code,
          newPassword: data.password,
        }
      );
      
      toast.success('Password reset successfully!');
      navigate('/signin');
    } catch (error) {
      console.error('Reset password error:', error);
      console.error('Error response:', error.response);
      
      // Handle network errors
      if (!error.response) {
        toast.error('Unable to connect to the server. Please check your internet connection.');
        return;
      }
      
      const errorData = error.response?.data;
      const status = error.response?.status;
      
      // Handle the backend response - can be a string or object
      let errorMessage = '';
      if (typeof errorData === 'string') {
        errorMessage = errorData;
      } else if (errorData) {
        errorMessage = errorData.message || errorData.error || errorData.title || '';
      }
      
      console.log('Error status:', status);
      console.log('Error message:', errorMessage);
      console.log('Error data:', errorData);
      
      // Show specific error messages
      if (errorMessage) {
        toast.error(errorMessage);
      } else if (status === 400) {
        toast.error('Invalid verification code or password. Please try again.');
      } else {
        toast.error('Failed to reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#1A1A1A' }}>
      {/* Wave Background - Matching SignIn/SignUp */}
      <div className="absolute inset-0 z-0">
        <svg
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ height: '100%' }}
        >
          <path
            fill="#F3BD4A"
            fillOpacity="0.3"
            d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,197.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
          <path
            fill="#F3BD4A"
            fillOpacity="0.5"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,197.3C672,192,768,160,864,154.7C960,149,1056,171,1152,165.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
          <path
            fill="#F3BD4A"
            fillOpacity="0.7"
            d="M0,256L48,234.7C96,213,192,171,288,170.7C384,171,480,213,576,229.3C672,245,768,235,864,208C960,181,1056,139,1152,138.7C1248,139,1344,181,1392,202.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to Sign In */}
        <Link
          to="/signin"
          className="inline-flex items-center gap-2 text-white hover:text-[#F3BD4A] transition-colors mb-8"
        >
          <FiArrowLeft size={20} />
          <span>Back to Sign In</span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F3BD4A]/10 rounded-full mb-4">
              <FiShield className="text-[#F3BD4A]" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2">
              Reset Password
            </h2>
            <p className="text-gray-600">
              Enter the verification code sent to {email || 'your email'} and create a new password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Verification Code */}
            <div>
              <label className="block text-[#1A1A1A] font-medium mb-2">
                Verification Code
              </label>
              <input
                type="text"
                {...register('code', {
                  required: 'Verification code is required',
                  pattern: {
                    value: /^[0-9]{4}$/,
                    message: 'Code must be exactly 4 digits',
                  },
                })}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-[#1A1A1A] placeholder-gray-400 focus:outline-none focus:border-[#F3BD4A] focus:bg-white transition-colors"
                placeholder="Enter 4-digit code"
                maxLength={4}
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-500">{errors.code.message}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-[#1A1A1A] font-medium mb-2">
                New Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F3BD4A]" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 9,
                      message: 'Password must be at least 9 characters',
                    },
                    validate: {
                      hasUpperCase: (value) =>
                        /[A-Z]/.test(value) || 'Password must contain at least one uppercase letter',
                      hasLowerCase: (value) =>
                        /[a-z]/.test(value) || 'Password must contain at least one lowercase letter',
                      hasNumber: (value) =>
                        /\d/.test(value) || 'Password must contain at least one number',
                      hasSymbol: (value) =>
                        /[!@#$%^&*(),.?":{}|<>]/.test(value) || 'Password must contain at least one symbol (!@#$%^&*...)',
                    },
                  })}
                  className="w-full pl-12 pr-12 py-3 bg-gray-100 border border-gray-200 rounded-lg text-[#1A1A1A] placeholder-gray-400 focus:outline-none focus:border-[#F3BD4A] focus:bg-white transition-colors"
                  placeholder="Create new password (min 9 chars, uppercase, symbol)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#F3BD4A] transition-colors"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[#1A1A1A] font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F3BD4A]" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === password || 'Passwords do not match',
                  })}
                  className="w-full pl-12 pr-12 py-3 bg-gray-100 border border-gray-200 rounded-lg text-[#1A1A1A] placeholder-gray-400 focus:outline-none focus:border-[#F3BD4A] focus:bg-white transition-colors"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#F3BD4A] transition-colors"
                >
                  {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#F3BD4A] text-white py-3 rounded-lg font-semibold hover:bg-[#e6bc4a] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl cursor-pointer"
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Didn't receive the code?{' '}
              <Link
                to="/forgot-password"
                className="text-[#F3BD4A] hover:underline font-medium"
              >
                Resend Code
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
