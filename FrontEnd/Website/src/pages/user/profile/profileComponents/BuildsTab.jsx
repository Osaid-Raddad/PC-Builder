import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaDesktop } from 'react-icons/fa';
import BounceCard from '../../../../components/animations/BounceCard/BounceCard';
import colors from '../../../../config/colors';
import toast from 'react-hot-toast';

const BuildsTab = ({ builds }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {builds.map((build, index) => (
        <BounceCard key={build.id} index={index}>
          <div 
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer"
            style={{ border: `2px solid ${colors.platinum}` }}
            onClick={() => navigate(`/build/${build.id}`)}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = colors.mainYellow}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = colors.platinum}
          >
            <div 
              className="h-48 bg-cover bg-center relative"
              style={{ backgroundImage: `url(${build.image})` }}
            >
              <div 
                className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold"
                style={{ backgroundColor: colors.mainYellow, color: 'white' }}
              >
                {build.category}
              </div>
            </div>
            <div className="p-4">
              <h4 className="text-xl font-bold mb-2" style={{ color: colors.mainBlack }}>
                {build.name}
              </h4>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold" style={{ color: colors.mainYellow }}>
                  {build.price}
                </span>
                <span className="text-sm" style={{ color: colors.jet }}>
                  {build.lastModified}
                </span>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/builder?edit=${build.id}`);
                  }}
                  className="flex-1 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ backgroundColor: colors.mainYellow, color: 'white' }}
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.success('Build shared!');
                  }}
                  className="flex-1 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ 
                    backgroundColor: 'white',
                    color: colors.mainYellow,
                    border: `2px solid ${colors.mainYellow}`
                  }}
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        </BounceCard>
      ))}
      
      {/* Add New Build Card */}
      <BounceCard index={builds.length}>
        <div 
          className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer h-full flex items-center justify-center min-h-[300px]"
          style={{ border: `2px dashed ${colors.mainYellow}` }}
          onClick={() => navigate('/builder')}
        >
          <div className="text-center p-6">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: colors.mainYellow + '20' }}
            >
              <FaDesktop size={40} style={{ color: colors.mainYellow }} />
            </div>
            <p className="text-xl font-bold" style={{ color: colors.mainBlack }}>
              Start New Build
            </p>
            <p className="text-sm mt-2" style={{ color: colors.jet }}>
              Create your dream PC
            </p>
          </div>
        </div>
      </BounceCard>
    </div>
  );
};

export default BuildsTab;
