import colors from '../../config/colors';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color }) => {
  return (
    <div 
      className="rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2"
      style={{ 
        backgroundColor: '#FFFFFF',
        borderColor: colors.mainYellow
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="font-medium mb-1" style={{ color: colors.jet }}>
            {title}
          </p>
          <h3 
            className="text-3xl font-bold"
            style={{ color: colors.mainBlack }}
          >
            {value}
          </h3>
          {trend && (
            <div className="flex items-center gap-2 mt-3">
              <span 
                className={`text-sm font-semibold px-2 py-1 rounded-full`}
                style={{ 
                  backgroundColor: trend === 'up' ? `${colors.success}20` : `${colors.error}20`,
                  color: trend === 'up' ? colors.success : colors.error 
                }}
              >
                {trend === 'up' ? '↑' : '↓'} {trendValue}%
              </span>
              <span className="text-xs" style={{ color: colors.jet }}>
                from last month
              </span>
            </div>
          )}
        </div>
        <div 
          className="w-16 h-16 rounded-xl flex items-center justify-center shadow-md"
          style={{ 
            backgroundColor: colors.mainYellow,
          }}
        >
          <Icon className="text-3xl" style={{ color: colors.mainBlack }} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
