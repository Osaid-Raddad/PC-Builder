import React from 'react';
import { FiTrendingUp, FiAward } from 'react-icons/fi';
import BounceCard from '../../../../components/animations/BounceCard/BounceCard';
import colors from '../../../../config/colors';

const OverviewTab = () => {
  const achievements = [
    { title: 'First Build', desc: 'Created your first PC build', unlocked: true },
    { title: 'Hardware Expert', desc: 'Added 10+ products to favorites', unlocked: true },
    { title: 'Community Member', desc: 'Posted 5+ community posts', unlocked: true },
    { title: 'Budget Master', desc: 'Build under $1000', unlocked: false }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Quick Stats */}
      <BounceCard index={0}>
        <div 
          className="bg-white rounded-lg shadow-lg p-6"
          style={{ border: `2px solid ${colors.platinum}` }}
        >
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.mainBlack }}>
            <FiTrendingUp style={{ color: colors.mainYellow }} />
            Quick Stats
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: colors.mainBeige }}>
              <span style={{ color: colors.jet }}>Total Build Value</span>
              <span className="font-bold text-xl" style={{ color: colors.mainYellow }}>$6,500</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: colors.mainBeige }}>
              <span style={{ color: colors.jet }}>Avg Build Price</span>
              <span className="font-bold text-xl" style={{ color: colors.mainYellow }}>$1,300</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: colors.mainBeige }}>
              <span style={{ color: colors.jet }}>Profile Views</span>
              <span className="font-bold text-xl" style={{ color: colors.mainYellow }}>234</span>
            </div>
          </div>
        </div>
      </BounceCard>

      {/* Achievements */}
      <BounceCard index={1}>
        <div 
          className="bg-white rounded-lg shadow-lg p-6"
          style={{ border: `2px solid ${colors.platinum}` }}
        >
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.mainBlack }}>
            <FiAward style={{ color: colors.mainYellow }} />
            Achievements
          </h3>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ 
                  backgroundColor: achievement.unlocked ? colors.mainYellow + '20' : colors.platinum + '50'
                }}
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: achievement.unlocked ? colors.mainYellow : colors.platinum }}
                >
                  <FiAward size={24} color={achievement.unlocked ? 'white' : colors.jet} />
                </div>
                <div>
                  <p className="font-bold" style={{ color: colors.mainBlack }}>{achievement.title}</p>
                  <p className="text-sm" style={{ color: colors.jet }}>{achievement.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </BounceCard>
    </div>
  );
};

export default OverviewTab;
