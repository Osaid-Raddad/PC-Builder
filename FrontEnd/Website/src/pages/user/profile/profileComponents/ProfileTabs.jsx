import React from 'react';
import { FiUser, FiActivity, FiHeart, FiCalendar, FiMessageSquare } from 'react-icons/fi';
import { FaDesktop } from 'react-icons/fa';
import colors from '../../../../config/colors';

const ProfileTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FiUser /> },
    { id: 'builds', label: 'My Builds', icon: <FaDesktop /> },
    { id: 'posts', label: 'My Posts', icon: <FiMessageSquare /> },
    { id: 'appointments', label: 'Appointments', icon: <FiCalendar /> },
    { id: 'favorites', label: 'Favorites', icon: <FiHeart /> },
    { id: 'activity', label: 'Activity', icon: <FiActivity /> }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all cursor-pointer"
          style={{
            backgroundColor: activeTab === tab.id ? colors.mainYellow : 'white',
            color: activeTab === tab.id ? 'white' : colors.jet,
            border: `2px solid ${activeTab === tab.id ? colors.mainYellow : colors.platinum}`
          }}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ProfileTabs;
