import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { FaSquareFacebook, FaApple } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import axios from 'axios';
import colors from '../../../config/colors';

const SignIn = ({ onSwitchToSignUp }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/Identity/Account/Login`,
        {
          email: data.email,
          password: data.password,
        }
      );

      // Store the token in localStorage
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      
      // Store email for password verification
      localStorage.setItem('email', data.email);
      
      // Store full name if available
      if (response.data.fullName) {
        localStorage.setItem('fullName', response.data.fullName);
      }
      
      // Store user role if available
      if (response.data.role) {
        localStorage.setItem('userRole', response.data.role);
      }
      
      // Store all user data as a single object
      /*const userData = {
        fullName: response.data.fullName,
        role: response.data.role,
        token: response.data.token,
      };*/
      //localStorage.setItem('userData', JSON.stringify(userData));

      toast.success('Signed in successfully!');
      
      // Navigate to home page after successful sign in
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error('Sign in error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to sign in. Please check your credentials.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2" style={{ color: colors.mainBlack }}>
        Welcome Back
      </h2>
      <p className="text-center mb-4 sm:mb-6 md:mb-8 text-sm sm:text-base" style={{ color: colors.jet }}>
        Sign in to continue
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: colors.mainBlack }}>
            Email
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.mainYellow }} />
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
              className="w-full pl-10 pr-4 py-2 sm:py-3 border-2 rounded-lg focus:outline-none transition-colors text-sm sm:text-base"
              style={{ borderColor: errors.email ? '#ef4444' : colors.platinum, backgroundColor: colors.alabaster, outlineColor: colors.mainYellow }}
              onFocus={(e) => e.target.style.borderColor = colors.mainYellow}
              onBlur={(e) => e.target.style.borderColor = errors.email ? '#ef4444' : colors.platinum}
              placeholder="Enter your email"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: colors.mainBlack }}>
            Password
          </label>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.mainYellow }} />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 9,
                  message: 'Password must be at least 9 characters',
                },
              })}
              className="w-full pl-10 pr-12 py-2 sm:py-3 border-2 rounded-lg focus:outline-none transition-colors text-sm sm:text-base"
              style={{ borderColor: errors.password ? '#ef4444' : colors.platinum, backgroundColor: colors.alabaster }}
              onFocus={(e) => e.target.style.borderColor = colors.mainYellow}
              onBlur={(e) => e.target.style.borderColor = errors.password ? '#ef4444' : colors.platinum}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform cursor-pointer"
              style={{ color: colors.jet }}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...register('rememberMe')}
              className="w-4 h-4 rounded"
              style={{ accentColor: colors.mainYellow }}
            />
            <span className="ml-2 text-sm" style={{ color: colors.jet }}>
              Remember me
            </span>
          </label>
          <Link to="/forgot-password" className="text-sm hover:underline" style={{ color: colors.mainYellow }}>
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 sm:py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity shadow-lg text-sm sm:text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: colors.mainYellow }}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="my-4 sm:my-6 flex items-center">
        <div className="flex-1 border-t" style={{ borderColor: colors.platinum }}></div>
        <span className="px-4 text-sm" style={{ color: colors.jet }}>
          Or continue with
        </span>
        <div className="flex-1 border-t" style={{ borderColor: colors.platinum }}></div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <button
          type="button"
          className="flex items-center justify-center py-2 sm:py-3 border-2 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
          style={{ borderColor: colors.platinum, backgroundColor: colors.alabaster }}
        >
          <FcGoogle className="text-xl sm:text-2xl" />
        </button>
        <button
          type="button"
          className="flex items-center justify-center py-2 sm:py-3 border-2 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
          style={{ borderColor: colors.platinum, backgroundColor: colors.alabaster }}
        >
          <FaSquareFacebook className="text-xl sm:text-2xl" color="#1877F2" />
        </button>
        <button
          type="button"
          className="flex items-center justify-center py-2 sm:py-3 border-2 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
          style={{ borderColor: colors.platinum, backgroundColor: colors.alabaster }}
        >
          <FaApple className="text-xl sm:text-2xl" color="#000000" />
        </button>
      </div>

      <p className="text-center text-sm" style={{ color: colors.jet }}>
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="font-semibold hover:underline cursor-pointer"
          style={{ color: colors.mainYellow }}
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default SignIn;
