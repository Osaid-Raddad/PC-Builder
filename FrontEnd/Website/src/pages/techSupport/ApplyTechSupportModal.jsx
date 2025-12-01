import React, { useState } from 'react';
import colors from '../../config/colors';
import { FiX, FiUser, FiMail, FiPhone, FiFileText, FiBriefcase } from 'react-icons/fi';

const ApplyTechSupportModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialization: 'Gaming PCs & Hardware',
    experience: '',
    reason: '',
    additionalInfo: ''
  });

  const specializations = [
    'Gaming PCs & Hardware',
    'Software & Troubleshooting',
    'Network & Servers',
    'Custom Builds',
    'Upgrades & Maintenance',
    'Data Recovery',
    'General Support'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Full Name */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-semibold" style={{ color: colors.mainBlack }}>
              <FiUser size={18} style={{ color: colors.mainYellow }} />
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
              style={{
                border: `2px solid ${colors.platinum}`,
                backgroundColor: 'white',
                color: colors.jet
              }}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-semibold" style={{ color: colors.mainBlack }}>
              <FiMail size={18} style={{ color: colors.mainYellow }} />
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
              style={{
                border: `2px solid ${colors.platinum}`,
                backgroundColor: 'white',
                color: colors.jet
              }}
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-semibold" style={{ color: colors.mainBlack }}>
              <FiPhone size={18} style={{ color: colors.mainYellow }} />
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
              style={{
                border: `2px solid ${colors.platinum}`,
                backgroundColor: 'white',
                color: colors.jet
              }}
              required
            />
          </div>

          {/* Specialization */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-semibold" style={{ color: colors.mainBlack }}>
              <FiBriefcase size={18} style={{ color: colors.mainYellow }} />
              Area of Specialization *
            </label>
            <select
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
              style={{
                border: `2px solid ${colors.platinum}`,
                backgroundColor: 'white',
                color: colors.jet
              }}
              required
            >
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          {/* Experience */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-semibold" style={{ color: colors.mainBlack }}>
              <FiBriefcase size={18} style={{ color: colors.mainYellow }} />
              Years of Experience *
            </label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="e.g., 5 years"
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2"
              style={{
                border: `2px solid ${colors.platinum}`,
                backgroundColor: 'white',
                color: colors.jet
              }}
              required
            />
          </div>

          {/* Reason */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-semibold" style={{ color: colors.mainBlack }}>
              <FiFileText size={18} style={{ color: colors.mainYellow }} />
              Why do you want to become a Tech Support? *
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Tell us why you're passionate about helping others with their PC problems..."
              rows="4"
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 resize-none"
              style={{
                border: `2px solid ${colors.platinum}`,
                backgroundColor: 'white',
                color: colors.jet
              }}
              required
            />
          </div>

          {/* Additional Info */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-semibold" style={{ color: colors.mainBlack }}>
              <FiFileText size={18} style={{ color: colors.mainYellow }} />
              Additional Information
            </label>
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              placeholder="Certifications, special skills, portfolio links, or anything else you'd like us to know..."
              rows="4"
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 resize-none"
              style={{
                border: `2px solid ${colors.platinum}`,
                backgroundColor: 'white',
                color: colors.jet
              }}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg font-bold border-2 hover:opacity-80 transition-opacity cursor-pointer"
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
              className="flex-1 px-6 py-3 rounded-lg font-bold text-white hover:opacity-90 transition-opacity cursor-pointer"
              style={{ backgroundColor: colors.mainYellow }}
            >
              Submit Application
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
