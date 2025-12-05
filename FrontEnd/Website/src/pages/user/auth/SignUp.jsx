import { useState } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser, FaPhone } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { FaSquareFacebook, FaApple } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import colors from '../../../config/colors';

const SignUp = ({ onSwitchToSignIn }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (!formData.agreeToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }
    
    toast.success('Account created successfully!');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-lg shadow-xl p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2" style={{ color: '#242423' }}>
        Create Account
      </h2>
      <p className="text-center mb-4 sm:mb-6 text-sm sm:text-base" style={{ color: '#333533' }}>
        Sign up to get started
      </p>

      <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: '#242423' }}>
            Full Name
          </label>
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#F5CB5C' }} />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 sm:py-3 border-2 rounded-lg focus:outline-none focus:border-[#F5CB5C] transition-colors text-sm sm:text-base"
              style={{ borderColor: '#CFDBD5', backgroundColor: '#E8EDDF' }}
              placeholder="Enter your full name"
            />
          </div>
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
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 sm:py-3 border-2 rounded-lg focus:outline-none focus:border-[#F5CB5C] transition-colors text-sm sm:text-base"
              style={{ borderColor: '#CFDBD5', backgroundColor: '#E8EDDF' }}
              placeholder="Enter your email"
            />
          </div>
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-12 py-2 sm:py-3 border-2 rounded-lg focus:outline-none focus:border-[#F5CB5C] transition-colors text-sm sm:text-base"
              style={{ borderColor: '#CFDBD5', backgroundColor: '#E8EDDF' }}
              placeholder="Create a password"
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
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-12 py-2 sm:py-3 border-2 rounded-lg focus:outline-none focus:border-[#F5CB5C] transition-colors text-sm sm:text-base"
              style={{ borderColor: '#CFDBD5', backgroundColor: '#E8EDDF' }}
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
        </div>

        <div>
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
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
          className="w-full py-2 sm:py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity shadow-lg text-sm sm:text-base cursor-pointer"
          style={{ backgroundColor: '#F5CB5C' }}
        >
          Sign Up
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
