import React from 'react';
import { FiUser, FiCalendar, FiClock, FiBarChart2 } from 'react-icons/fi';
import colors from '../../../../config/colors';

const TechSupportTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FiUser /> },
    { id: 'appointments', label: 'Appointments', icon: <FiCalendar /> },
    { id: 'schedule', label: 'My Schedule', icon: <FiClock /> },
    { id: 'stats', label: 'Statistics', icon: <FiBarChart2 /> }
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

export default TechSupportTabs;
