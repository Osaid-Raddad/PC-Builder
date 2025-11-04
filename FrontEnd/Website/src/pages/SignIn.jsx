import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { FaSquareFacebook, FaApple } from 'react-icons/fa6';
import toast from 'react-hot-toast';

const SignIn = ({ onSwitchToSignUp }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.success('Signed in successfully!');
    // Navigate to home page after successful sign in
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2" style={{ color: '#242423' }}>
        Welcome Back
      </h2>
      <p className="text-center mb-4 sm:mb-6 md:mb-8 text-sm sm:text-base" style={{ color: '#333533' }}>
        Sign in to continue
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform"
              style={{ color: '#333533' }}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 rounded focus:ring-2 focus:ring-[#F5CB5C]"
              style={{ accentColor: '#F5CB5C' }}
            />
            <span className="ml-2 text-sm" style={{ color: '#333533' }}>
              Remember me
            </span>
          </label>
          <a href="#" className="text-sm hover:underline" style={{ color: '#F5CB5C' }}>
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full py-2 sm:py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity shadow-lg text-sm sm:text-base"
          style={{ backgroundColor: '#F5CB5C' }}
        >
          Sign In
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
          className="flex items-center justify-center py-2 sm:py-3 border-2 rounded-lg hover:shadow-md transition-shadow"
          style={{ borderColor: '#CFDBD5', backgroundColor: '#E8EDDF' }}
        >
          <FcGoogle className="text-xl sm:text-2xl" />
        </button>
        <button
          type="button"
          className="flex items-center justify-center py-2 sm:py-3 border-2 rounded-lg hover:shadow-md transition-shadow"
          style={{ borderColor: '#CFDBD5', backgroundColor: '#E8EDDF' }}
        >
          <FaSquareFacebook className="text-xl sm:text-2xl" color="#1877F2" />
        </button>
        <button
          type="button"
          className="flex items-center justify-center py-2 sm:py-3 border-2 rounded-lg hover:shadow-md transition-shadow"
          style={{ borderColor: '#CFDBD5', backgroundColor: '#E8EDDF' }}
        >
          <FaApple className="text-xl sm:text-2xl" color="#000000" />
        </button>
      </div>

      <p className="text-center text-sm" style={{ color: '#333533' }}>
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="font-semibold hover:underline"
          style={{ color: '#F5CB5C' }}
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default SignIn;
