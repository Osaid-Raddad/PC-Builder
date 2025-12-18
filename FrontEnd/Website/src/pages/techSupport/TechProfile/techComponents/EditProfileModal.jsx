import React, { useState } from 'react';
import { FiX, FiUpload } from 'react-icons/fi';
import colors from '../../../../config/colors';
import toast from 'react-hot-toast';

const EditProfileModal = ({ userData, onClose, onSave }) => {
  const [editFormData, setEditFormData] = useState({ ...userData });
  const [avatarPreview, setAvatarPreview] = useState(null);

  const specializations = [
    'Gaming PCs & Hardware',
    'Software & Troubleshooting',
    'Network & Servers',
    'Custom Builds',
    'Upgrades & Maintenance',
    'Data Recovery',
    'General Support'
  ];

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Avatar size must be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setEditFormData({ ...editFormData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (avatarPreview) {
      editFormData.avatar = avatarPreview;
    }
    
    onSave(editFormData);
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ border: `3px solid ${colors.mainYellow}` }}
      >
        {/* Modal Header */}
        <div 
          className="sticky top-0 bg-white p-6 border-b-2 flex items-center justify-between"
          style={{ borderColor: colors.platinum }}
        >
          <h2 className="text-2xl font-bold" style={{ color: colors.mainBlack }}>
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <FiX size={24} style={{ color: colors.jet }} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Avatar Upload */}
          <div className="mb-6 text-center">
            <div className="relative inline-block">
              <img 
                src={avatarPreview || editFormData.avatar}
                alt="Avatar preview"
                className="w-32 h-32 rounded-full border-4 mx-auto"
                style={{ borderColor: colors.mainYellow }}
              />
              <label 
                className="absolute bottom-0 right-0 p-2 rounded-full cursor-pointer hover:opacity-90 transition-opacity"
                style={{ backgroundColor: colors.mainYellow }}
              >
                <FiUpload size={20} color="white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm mt-2" style={{ color: colors.jet }}>
              Click to upload new avatar (Max 2MB)
            </p>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                Full Name
              </label>
              <input
                type="text"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                style={{ borderColor: colors.platinum }}
                onFocus={(e) => e.target.style.borderColor = colors.mainYellow}
                onBlur={(e) => e.target.style.borderColor = colors.platinum}
              />
            </div>

            {/* Specialization */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                Specialization
              </label>
              <select
                value={editFormData.specialization}
                onChange={(e) => setEditFormData({ ...editFormData, specialization: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors cursor-pointer"
                style={{ borderColor: colors.platinum }}
                onFocus={(e) => e.target.style.borderColor = colors.mainYellow}
                onBlur={(e) => e.target.style.borderColor = colors.platinum}
              >
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                Years of Experience
              </label>
              <input
                type="text"
                value={editFormData.experience}
                onChange={(e) => setEditFormData({ ...editFormData, experience: e.target.value })}
                placeholder="e.g., 5 years"
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                style={{ borderColor: colors.platinum }}
                onFocus={(e) => e.target.style.borderColor = colors.mainYellow}
                onBlur={(e) => e.target.style.borderColor = colors.platinum}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                Email
              </label>
              <input
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                style={{ borderColor: colors.platinum }}
                onFocus={(e) => e.target.style.borderColor = colors.mainYellow}
                onBlur={(e) => e.target.style.borderColor = colors.platinum}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                Phone
              </label>
              <input
                type="tel"
                value={editFormData.phone}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                style={{ borderColor: colors.platinum }}
                onFocus={(e) => e.target.style.borderColor = colors.mainYellow}
                onBlur={(e) => e.target.style.borderColor = colors.platinum}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                Location
              </label>
              <input
                type="text"
                value={editFormData.location}
                onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                style={{ borderColor: colors.platinum }}
                onFocus={(e) => e.target.style.borderColor = colors.mainYellow}
                onBlur={(e) => e.target.style.borderColor = colors.platinum}
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                Bio
              </label>
              <textarea
                value={editFormData.bio}
                onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                rows="4"
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors resize-none"
                style={{ borderColor: colors.platinum }}
                onFocus={(e) => e.target.style.borderColor = colors.mainYellow}
                onBlur={(e) => e.target.style.borderColor = colors.platinum}
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg font-semibold transition-colors border-2 cursor-pointer"
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
              className="flex-1 px-6 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity cursor-pointer"
              style={{ backgroundColor: colors.mainYellow }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
