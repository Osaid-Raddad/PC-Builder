import React from 'react';
import BounceCard from '../../../../components/animations/BounceCard/BounceCard';
import colors from '../../../../config/colors';

const ActivityTab = ({ activities }) => {
  return (
    <BounceCard>
      <div 
        className="bg-white rounded-lg shadow-lg p-6"
        style={{ border: `2px solid ${colors.platinum}` }}
      >
        <h3 className="text-2xl font-bold mb-6" style={{ color: colors.mainBlack }}>
          Recent Activity
        </h3>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div 
              key={activity.id}
              className="flex items-center gap-4 p-4 rounded-lg hover:shadow-md transition-all cursor-pointer"
              style={{ border: `1px solid ${colors.platinum}` }}
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: colors.mainYellow + '20', color: colors.mainYellow }}
              >
                {activity.icon}
              </div>
              <div className="flex-1">
                <p className="font-semibold" style={{ color: colors.mainBlack }}>
                  {activity.action}
                </p>
                <p style={{ color: colors.jet }}>{activity.title}</p>
              </div>
              <span className="text-sm" style={{ color: colors.jet }}>
                {activity.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </BounceCard>
  );
};

export default ActivityTab;
