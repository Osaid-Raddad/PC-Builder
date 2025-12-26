import React from 'react';
import { FiMail, FiPhone, FiMapPin, FiCalendar, FiEdit, FiTrash2, FiAward } from 'react-icons/fi';
import BounceCard from '../../../../components/animations/BounceCard/BounceCard';
import colors from '../../../../config/colors';

const TechSupportHeader = ({ userData, onEditClick, onDeleteAccountClick }) => {
  return (
    <BounceCard>
      <div 
        className="bg-white rounded-lg shadow-lg p-8 mb-8"
        style={{ border: `2px solid ${colors.mainYellow}` }}
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <img 
              src={userData.avatar}
              alt={userData.name}
              className="w-32 h-32 rounded-full border-4"
              style={{ borderColor: colors.mainYellow }}
            />
            <div 
              className="absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white"
              style={{ backgroundColor: userData.isOnline ? '#10b981' : '#6b7280' }}
            >
              <span className="text-xs font-bold text-white">
                {userData.isOnline ? '✓' : '●'}
              </span>
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
                {userData.name}
              </h1>
              <div 
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ backgroundColor: colors.mainYellow, color: 'white' }}
              >
                {userData.role}
              </div>
            </div>
            
            {/* Specialization Badge */}
            {userData.specialization && userData.specialization !== '-' && (
              <div className="mb-3 flex justify-center md:justify-start">
                <span 
                  className="px-4 py-2 rounded-full text-sm font-semibold"
                  style={{ 
                    backgroundColor: `${colors.mainYellow}20`,
                    color: colors.mainYellow,
                    border: `1px solid ${colors.mainYellow}`
                  }}
                >
                  {userData.specialization}
                </span>
              </div>
            )}
            
            <p className="text-sm mb-3" style={{ color: colors.jet }}>
              {userData.bio}
            </p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
              <div className="flex items-center gap-2">
                <FiMail size={16} style={{ color: colors.mainYellow }} />
                <span className="text-sm" style={{ color: colors.jet }}>{userData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiPhone size={16} style={{ color: colors.mainYellow }} />
                <span className="text-sm" style={{ color: colors.jet }}>{userData.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiMapPin size={16} style={{ color: colors.mainYellow }} />
                <span className="text-sm" style={{ color: colors.jet }}>{userData.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar size={16} style={{ color: colors.mainYellow }} />
                <span className="text-sm" style={{ color: colors.jet }}>Since {userData.joinDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiAward size={16} style={{ color: colors.mainYellow }} />
                <span className="text-sm font-semibold" style={{ color: colors.jet }}>
                  {userData.experience} experience
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center md:justify-start gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: colors.mainYellow }}>
                  {userData.stats.totalAppointments}
                </p>
                <p className="text-sm" style={{ color: colors.jet }}>Completed Sessions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: colors.mainYellow }}>
                  {userData.stats.rating || 0}⭐
                </p>
                <p className="text-sm" style={{ color: colors.jet }}>Rating</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: colors.mainYellow }}>
                  {userData.stats.reviews}
                </p>
                <p className="text-sm" style={{ color: colors.jet }}>Reviews</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onEditClick}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              style={{ backgroundColor: colors.mainYellow, color: 'white' }}
            >
              <FiEdit size={18} />
              Edit Profile
            </button>
            <button
              onClick={onDeleteAccountClick}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              style={{ 
                backgroundColor: '#dc2626',
                color: 'white',
                border: '2px solid #dc2626'
              }}
            >
              <FiTrash2 size={18} />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </BounceCard>
  );
};

export default TechSupportHeader;
