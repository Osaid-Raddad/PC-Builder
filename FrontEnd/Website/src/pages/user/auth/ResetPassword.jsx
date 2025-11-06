import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
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
    setIsLoading(true);
    try {
      // Replace with your API call
      // await axios.post('/api/auth/reset-password', {
      //   email,
      //   verificationCode: data.code,
      //   newPassword: data.password,
      // });
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success('Password reset successfully!');
      navigate('/signin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2c2c2c] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Wavy Background - Matching SignIn/SignUp */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute bottom-0 left-0 w-full h-full"
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Dark Gold Wave - Bottom */}
          <path
            d="M0,400 C240,500 480,300 720,400 C960,500 1200,300 1440,400 L1440,800 L0,800 Z"
            fill="#8B7355"
            opacity="1"
          />
          {/* Medium Gold Wave - Middle */}
          <path
            d="M0,450 C240,550 480,350 720,450 C960,550 1200,350 1440,450 L1440,800 L0,800 Z"
            fill="#B8956A"
            opacity="1"
          />
          {/* Light Gold Wave - Top */}
          <path
            d="M0,500 C240,600 480,400 720,500 C960,600 1200,400 1440,500 L1440,800 L0,800 Z"
            fill="#D4AF37"
            opacity="1"
          />
          {/* Brightest Gold Wave - Front */}
          <path
            d="M0,550 C240,650 480,450 720,550 C960,650 1200,450 1440,550 L1440,800 L0,800 Z"
            fill="#F5CB5C"
            opacity="1"
          />
        </svg>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to Sign In */}
        <Link
          to="/signin"
          className="inline-flex items-center gap-2 text-white hover:text-[#F5CB5C] transition-colors mb-8"
        >
          <FiArrowLeft size={20} />
          <span>Back to Sign In</span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F5CB5C]/10 rounded-full mb-4">
              <FiShield className="text-[#F5CB5C]" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-[#2c2c2c] mb-2">
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
              <label className="block text-[#2c2c2c] font-medium mb-2">
                Verification Code
              </label>
              <input
                type="text"
                {...register('code', {
                  required: 'Verification code is required',
                  minLength: {
                    value: 6,
                    message: 'Code must be at least 6 characters',
                  },
                })}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-[#2c2c2c] placeholder-gray-400 focus:outline-none focus:border-[#F5CB5C] focus:bg-white transition-colors"
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-500">{errors.code.message}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-[#2c2c2c] font-medium mb-2">
                New Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F5CB5C]" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Password must contain uppercase, lowercase, and number',
                    },
                  })}
                  className="w-full pl-12 pr-12 py-3 bg-gray-100 border border-gray-200 rounded-lg text-[#2c2c2c] placeholder-gray-400 focus:outline-none focus:border-[#F5CB5C] focus:bg-white transition-colors"
                  placeholder="Create new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#F5CB5C] transition-colors"
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
              <label className="block text-[#2c2c2c] font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F5CB5C]" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === password || 'Passwords do not match',
                  })}
                  className="w-full pl-12 pr-12 py-3 bg-gray-100 border border-gray-200 rounded-lg text-[#2c2c2c] placeholder-gray-400 focus:outline-none focus:border-[#F5CB5C] focus:bg-white transition-colors"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#F5CB5C] transition-colors"
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
              className="w-full bg-[#F5CB5C] text-white py-3 rounded-lg font-semibold hover:bg-[#e6bc4a] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
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
                className="text-[#F5CB5C] hover:underline font-medium"
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
