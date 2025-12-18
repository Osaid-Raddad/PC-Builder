import React from 'react';
import { FiTrendingUp, FiUsers, FiClock, FiStar } from 'react-icons/fi';
import BounceCard from '../../../../components/animations/BounceCard/BounceCard';
import colors from '../../../../config/colors';

const StatsTab = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Sessions',
      value: stats.totalSessions,
      icon: <FiUsers size={32} />,
      color: '#10b981',
      subtitle: `${stats.thisMonth} this month`
    },
    {
      title: 'Average Rating',
      value: `${stats.averageRating}⭐`,
      icon: <FiStar size={32} />,
      color: colors.mainYellow,
      subtitle: `Based on ${stats.totalReviews} reviews`
    },
    {
      title: 'Response Time',
      value: stats.avgResponseTime,
      icon: <FiClock size={32} />,
      color: '#3b82f6',
      subtitle: 'Average response time'
    },
    {
      title: 'Success Rate',
      value: `${stats.successRate}%`,
      icon: <FiTrendingUp size={32} />,
      color: '#8b5cf6',
      subtitle: 'Issues resolved'
    }
  ];

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <BounceCard key={index} index={index}>
            <div 
              className="bg-white rounded-lg shadow-lg p-6"
              style={{ border: `2px solid ${colors.platinum}` }}
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: stat.color + '20', color: stat.color }}
              >
                {stat.icon}
              </div>
              <p className="text-sm mb-1" style={{ color: colors.jet }}>
                {stat.title}
              </p>
              <p className="text-3xl font-bold mb-1" style={{ color: colors.mainBlack }}>
                {stat.value}
              </p>
              <p className="text-xs" style={{ color: colors.jet }}>
                {stat.subtitle}
              </p>
            </div>
          </BounceCard>
        ))}
      </div>

      {/* Recent Activity Chart */}
      <BounceCard>
        <div 
          className="bg-white rounded-lg shadow-lg p-6"
          style={{ border: `2px solid ${colors.platinum}` }}
        >
          <h3 className="text-2xl font-bold mb-6" style={{ color: colors.mainBlack }}>
            Monthly Performance
          </h3>
          
          <div className="space-y-4">
            {stats.monthlyData.map((month, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold" style={{ color: colors.mainBlack }}>
                    {month.month}
                  </span>
                  <span className="font-bold" style={{ color: colors.mainYellow }}>
                    {month.sessions} sessions
                  </span>
                </div>
                <div 
                  className="w-full h-3 rounded-full overflow-hidden"
                  style={{ backgroundColor: colors.platinum }}
                >
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(month.sessions / 50) * 100}%`,
                      backgroundColor: colors.mainYellow
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </BounceCard>

      {/* Recent Reviews */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4" style={{ color: colors.mainBlack }}>
          Recent Reviews
        </h3>
        <div className="space-y-4">
          {stats.recentReviews.map((review, index) => (
            <BounceCard key={index} index={index}>
              <div 
                className="bg-white rounded-lg shadow-lg p-6"
                style={{ border: `2px solid ${colors.platinum}` }}
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
                    style={{ backgroundColor: colors.mainYellow, color: 'white' }}
                  >
                    {review.userName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold" style={{ color: colors.mainBlack }}>
                        {review.userName}
                      </h4>
                      <div className="flex items-center gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <span key={i} style={{ color: colors.mainYellow }}>⭐</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm mb-2" style={{ color: colors.jet }}>
                      {review.comment}
                    </p>
                    <p className="text-xs" style={{ color: colors.jet }}>
                      {review.date}
                    </p>
                  </div>
                </div>
              </div>
            </BounceCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsTab;
