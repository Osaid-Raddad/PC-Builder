import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser, FaPhone } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { FaSquareFacebook, FaApple } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import axios from 'axios';
import colors from '../../../config/colors';

const SignUp = ({ onSwitchToSignIn }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      userName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    if (!data.agreeToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/Identity/Account/Register`,
        {
          fullName: data.fullName,
          userName: data.userName,
          email: data.email,
          password: data.password,
          phoneNumber: data.phoneNumber,
        }
      );

      toast.success('Account created successfully!,PLease Check your email to verify your account.');
      
      // Navigate to sign in page after successful registration
      setTimeout(() => {
        if (onSwitchToSignIn) {
          onSwitchToSignIn();
        } else {
          navigate('/signin');
        }
      }, 1000);
    } catch (error) {
      console.error('Sign up error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to create account. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-lg shadow-xl p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2" style={{ color: '#242423' }}>
        Create Account
      </h2>
      <p className="text-center mb-4 sm:mb-6 text-sm sm:text-base" style={{ color: '#333533' }}>
        Sign up to get started
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 sm:space-y-5">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-2" style={{ color: '#242423' }}>
            Full Name
          </label>
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#F5CB5C' }} />
            <input
              type="text"
              id="fullName"
              {...register('fullName', {
                required: 'Full name is required',
                minLength: {
                  value: 3,
                  message: 'Full name must be at least 3 characters',
                },
              })}
              className="w-full pl-10 pr-4 py-2 sm:py-3 border-2 rounded-lg focus:outline-none focus:border-[#F5CB5C] transition-colors text-sm sm:text-base"
              style={{ borderColor: errors.fullName ? '#ef4444' : '#CFDBD5', backgroundColor: '#E8EDDF' }}
              placeholder="Enter your full name"
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="userName" className="block text-sm font-medium mb-2" style={{ color: '#242423' }}>
            Username
          </label>
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#F5CB5C' }} />
            <input
              type="text"
              id="userName"
              {...register('userName', {
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters',
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: 'Username can only contain letters, numbers, and underscores',
                },
              })}
              className="w-full pl-10 pr-4 py-2 sm:py-3 border-2 rounded-lg focus:outline-none focus:border-[#F5CB5C] transition-colors text-sm sm:text-base"
              style={{ borderColor: errors.userName ? '#ef4444' : '#CFDBD5', backgroundColor: '#E8EDDF' }}
              placeholder="Choose a username"
            />
          </div>
          {errors.userName && (
            <p className="mt-1 text-sm text-red-500">{errors.userName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#242423' }}>
            Email
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#F5CB5C' }} />
            <input
              type="email"
              id="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className="w-full pl-10 pr-4 py-2 sm:py-3 border-2 rounded-lg focus:outline-none focus:border-[#F5CB5C] transition-colors text-sm sm:text-base"
              style={{ borderColor: errors.email ? '#ef4444' : '#CFDBD5', backgroundColor: '#E8EDDF' }}
              placeholder="Enter your email"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium mb-2" style={{ color: '#242423' }}>
            Phone Number
          </label>
          <div className="relative">
            <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#F5CB5C' }} />
            <input
              type="tel"
              id="phoneNumber"
              {...register('phoneNumber', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Phone number must be 10 digits',
                },
              })}
              className="w-full pl-10 pr-4 py-2 sm:py-3 border-2 rounded-lg focus:outline-none focus:border-[#F5CB5C] transition-colors text-sm sm:text-base"
              style={{ borderColor: errors.phoneNumber ? '#ef4444' : '#CFDBD5', backgroundColor: '#E8EDDF' }}
              placeholder="0591234567"
            />
          </div>
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-500">{errors.phoneNumber.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: '#242423' }}>
            Password
          </label>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#F5CB5C' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 9,
                  message: 'Password must be at least 9 characters',
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{9,}$/,
                  message: 'Password must contain uppercase, lowercase, number, and symbol',
                },
              })}
              className="w-full pl-10 pr-12 py-2 sm:py-3 border-2 rounded-lg focus:outline-none focus:border-[#F5CB5C] transition-colors text-sm sm:text-base"
              style={{ borderColor: errors.password ? '#ef4444' : '#CFDBD5', backgroundColor: '#E8EDDF' }}
              placeholder="Create a password (e.g., pE23%trnd)"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform cursor-pointer"
              style={{ color: '#333533' }}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2" style={{ color: '#242423' }}>
            Confirm Password
          </label>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#F5CB5C' }} />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
              className="w-full pl-10 pr-12 py-2 sm:py-3 border-2 rounded-lg focus:outline-none focus:border-[#F5CB5C] transition-colors text-sm sm:text-base"
              style={{ borderColor: errors.confirmPassword ? '#ef4444' : '#CFDBD5', backgroundColor: '#E8EDDF' }}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform cursor-pointer"
              style={{ color: '#333533' }}
            >
              {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div>
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              {...register('agreeToTerms')}
              className="w-4 h-4 mt-1 rounded focus:ring-2 focus:ring-[#F5CB5C]"
              style={{ accentColor: '#F5CB5C' }}
            />
            <span className="mt-1 ml-2 text-sm" style={{ color: '#333533' }}>
              I agree to the{' '}
              <a href="#" className="hover:underline" style={{ color: '#F5CB5C' }}>
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a href="#" className="hover:underline" style={{ color: '#F5CB5C' }}>
                Privacy Policy
              </a>
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 sm:py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity shadow-lg text-sm sm:text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#F5CB5C' }}
        >
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <div className="my-4 sm:my-6 flex items-center">
        <div className="flex-1 border-t" style={{ borderColor: '#CFDBD5' }}></div>
        <span className="px-4 text-sm" style={{ color: '#333533' }}>
          Or continue with
        </span>
        <div className="flex-1 border-t" style={{ borderColor: '#CFDBD5' }}></div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <button
          type="button"
          className="flex items-center justify-center py-2 sm:py-3 border-2 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
          style={{ borderColor: '#CFDBD5', backgroundColor: '#E8EDDF' }}
        >
          <FcGoogle className="text-xl sm:text-2xl" />
        </button>
        <button
          type="button"
          className="flex items-center justify-center py-2 sm:py-3 border-2 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
          style={{ borderColor: '#CFDBD5', backgroundColor: '#E8EDDF' }}
        >
          <FaSquareFacebook className="text-xl sm:text-2xl" color="#1877F2" />
        </button>
        <button
          type="button"
          className="flex items-center justify-center py-2 sm:py-3 border-2 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
          style={{ borderColor: '#CFDBD5', backgroundColor: '#E8EDDF' }}
        >
          <FaApple className="text-xl sm:text-2xl" color="#000000" />
        </button>
      </div>

      <p className="text-center text-sm" style={{ color: '#333533' }}>
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="font-semibold hover:underline cursor-pointer"
          style={{ color: '#F5CB5C' }}
        >
          Sign In
        </button>
      </p>
    </div>
  );
};

export default SignUp;
