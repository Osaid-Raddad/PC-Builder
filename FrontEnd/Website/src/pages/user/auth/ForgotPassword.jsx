import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FiMail, FiArrowLeft } from 'react-icons/fi';

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/Identity/Account/Forgot-Password`,
        {
          email: data.email,
        }
      );
      
      toast.success('Verification code sent to your email!');
      // Navigate to reset password with email in state
      navigate('/reset-password', { state: { email: data.email } });
    } catch (error) {
      console.error('Forgot password error:', error);
      console.error('Error response:', error.response);
      
      // Handle network errors (CORS, connection issues, etc.)
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
      
      // Handle 400 error specifically for "This email is not signed up yet."
      if (status === 400 && errorMessage.includes('This email is not signed up yet')) {
        toast.error('This email is not signed up yet. Please create an account first.');
      } else if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error('Failed to send verification code. Please try again.');
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
              <FiMail className="text-[#F3BD4A]" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2">
              Forgot Password?
            </h2>
            <p className="text-gray-600">
              Enter your email address and we'll send you a verification code to reset your password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-[#1A1A1A] font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F3BD4A]" size={20} />
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-[#1A1A1A] placeholder-gray-400 focus:outline-none focus:border-[#F3BD4A] focus:bg-white transition-colors"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#F3BD4A] text-white py-3 rounded-lg font-semibold hover:bg-[#e6bc4a] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Remember your password?{' '}
              <Link
                to="/signin"
                className="text-[#F3BD4A] hover:underline font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;