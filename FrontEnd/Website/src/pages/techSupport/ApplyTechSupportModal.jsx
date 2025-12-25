import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import colors from '../../config/colors';
import { FiX, FiUser, FiMail, FiPhone, FiFileText, FiBriefcase } from 'react-icons/fi';

const ApplyTechSupportModal = ({ onClose, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const specializations = [
    'Gaming PCs & Hardware',
    'Software & Troubleshooting',
    'Network & Servers',
    'Custom Builds',
    'Upgrades & Maintenance',
    'Data Recovery',
    'General Support'
  ];

  const onSubmitForm = async (data) => {
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        toast.error('You must be logged in to apply');
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/Public/Public/upgrade-to-tech-support`,
        {
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          areaOfSpecialization: data.areaOfSpecialization,
          yearsOfExperience: parseInt(data.yearsOfExperience),
          reason: data.reason
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success('Application submitted successfully! We will review it shortly.');
      onSubmit && onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Error submitting application:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                           error.response.data?.title || 
                           'Failed to submit application. Please try again.';
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ border: `3px solid ${colors.mainYellow}` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="sticky top-0 bg-white p-6 border-b-2 flex items-center justify-between z-10"
          style={{ borderColor: colors.platinum }}
        >
          <h2 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
            Apply to Become Tech Support
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <FiX size={24} style={{ color: colors.jet }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmitForm)} className="p-6 space-y-6">
          {/* Full Name */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-semibold" style={{ color: colors.mainBlack }}>
              <FiUser size={18} style={{ color: colors.mainYellow }} />
              Full Name *
            </label>
            <input
              type="text"
              {...register('fullName', { 
                required: 'Full name is required',
                minLength: {
                  value: 3,
                  message: 'Name must be at least 3 characters'
                }
              })}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
              style={{
                border: `2px solid ${errors.fullName ? '#ef4444' : colors.platinum}`,
                backgroundColor: 'white',
                color: colors.jet
              }}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-semibold" style={{ color: colors.mainBlack }}>
              <FiMail size={18} style={{ color: colors.mainYellow }} />
              Email Address *
            </label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address'
                }
              })}
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
              style={{
                border: `2px solid ${errors.email ? '#ef4444' : colors.platinum}`,
                backgroundColor: 'white',
                color: colors.jet
              }}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-semibold" style={{ color: colors.mainBlack }}>
              <FiPhone size={18} style={{ color: colors.mainYellow }} />
              Phone Number *
            </label>
            <input
              type="tel"
              {...register('phoneNumber', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9+\-\s()]+$/,
                  message: 'Please enter a valid phone number'
                }
              })}
              placeholder="0599999999"
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
              style={{
                border: `2px solid ${errors.phoneNumber ? '#ef4444' : colors.platinum}`,
                backgroundColor: 'white',
                color: colors.jet
              }}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
            )}
          </div>

          {/* Specialization */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-semibold" style={{ color: colors.mainBlack }}>
              <FiBriefcase size={18} style={{ color: colors.mainYellow }} />
              Area of Specialization *
            </label>
            <select
              {...register('areaOfSpecialization', {
                required: 'Area of specialization is required'
              })}
              defaultValue="Gaming PCs & Hardware"
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
              style={{
                border: `2px solid ${errors.areaOfSpecialization ? '#ef4444' : colors.platinum}`,
                backgroundColor: 'white',
                color: colors.jet
              }}
            >
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
            {errors.areaOfSpecialization && (
              <p className="text-red-500 text-sm mt-1">{errors.areaOfSpecialization.message}</p>
            )}
          </div>

          {/* Experience */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-semibold" style={{ color: colors.mainBlack }}>
              <FiBriefcase size={18} style={{ color: colors.mainYellow }} />
              Years of Experience *
            </label>
            <input
              type="number"
              {...register('yearsOfExperience', {
                required: 'Years of experience is required',
                min: {
                  value: 0,
                  message: 'Years of experience cannot be negative'
                },
                max: {
                  value: 50,
                  message: 'Please enter a valid number of years'
                }
              })}
              placeholder="e.g., 4"
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
              style={{
                border: `2px solid ${errors.yearsOfExperience ? '#ef4444' : colors.platinum}`,
                backgroundColor: 'white',
                color: colors.jet
              }}
            />
            {errors.yearsOfExperience && (
              <p className="text-red-500 text-sm mt-1">{errors.yearsOfExperience.message}</p>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-semibold" style={{ color: colors.mainBlack }}>
              <FiFileText size={18} style={{ color: colors.mainYellow }} />
              Why do you want to become a Tech Support? *
            </label>
            <textarea
              {...register('reason', {
                required: 'Reason is required',
                minLength: {
                  value: 20,
                  message: 'Please provide at least 20 characters explaining your reason'
                }
              })}
              placeholder="Tell us why you're passionate about helping others with their PC problems..."
              rows="4"
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 resize-none"
              style={{
                border: `2px solid ${errors.reason ? '#ef4444' : colors.platinum}`,
                backgroundColor: 'white',
                color: colors.jet
              }}
            />
            {errors.reason && (
              <p className="text-red-500 text-sm mt-1">{errors.reason.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-lg font-bold border-2 hover:opacity-80 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: colors.platinum,
                color: colors.jet,
                backgroundColor: 'white'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-lg font-bold text-white hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: colors.mainYellow }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>

          <p className="text-sm text-center" style={{ color: colors.jet }}>
            * All applications will be reviewed by our admin team within 2-3 business days
          </p>
        </form>
      </div>
    </div>
  );
};

export default ApplyTechSupportModal;
