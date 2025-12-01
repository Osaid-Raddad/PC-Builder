import colors from '../../config/colors';

const RequestCard = ({ title, value, icon: Icon, color, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-4xl font-bold mt-2" style={{ color: color || colors.primary }}>
            {value}
          </h3>
        </div>
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${color || colors.primary}20` }}
        >
          <Icon className="text-3xl" style={{ color: color || colors.primary }} />
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
