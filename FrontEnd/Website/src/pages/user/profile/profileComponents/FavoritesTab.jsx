import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { FaMicrochip, FaMemory } from 'react-icons/fa';
import BounceCard from '../../../../components/animations/BounceCard/BounceCard';
import colors from '../../../../config/colors';
import toast from 'react-hot-toast';

const FavoritesTab = ({ products }) => {
  const navigate = useNavigate();

  const getIcon = (category) => {
    switch(category) {
      case 'CPU':
      case 'GPU':
        return <FaMicrochip size={40} style={{ color: colors.mainYellow }} />;
      case 'RAM':
        return <FaMemory size={40} style={{ color: colors.mainYellow }} />;
      default:
        return <FaMicrochip size={40} style={{ color: colors.mainYellow }} />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <BounceCard key={product.id} index={index}>
          <div 
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all"
            style={{ border: `2px solid ${colors.platinum}` }}
          >
            <div className="p-4">
              <div className="flex items-start gap-4 mb-4">
                <div 
                  className="w-24 h-24 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: colors.mainBeige }}
                >
                  {getIcon(product.category)}
                </div>
                <div className="flex-1">
                  <span 
                    className="px-2 py-1 rounded text-xs font-bold"
                    style={{ backgroundColor: colors.mainYellow + '20', color: colors.mainBlack }}
                  >
                    {product.category}
                  </span>
                  <h4 className="text-lg font-bold mt-2" style={{ color: colors.mainBlack }}>
                    {product.name}
                  </h4>
                </div>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-2xl font-bold" style={{ color: colors.mainYellow }}>
                  {product.price}
                </span>
                <span 
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/product/${product.category.toLowerCase()}/${product.id}`)}
                  className="flex-1 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ backgroundColor: colors.mainYellow, color: 'white' }}
                >
                  View Details
                </button>
                <button
                  onClick={() => toast.success('Removed from favorites')}
                  className="px-4 py-2 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ 
                    backgroundColor: 'white',
                    color: '#ef4444',
                    border: `2px solid #ef4444`
                  }}
                >
                  <FiHeart size={20} fill="#ef4444" />
                </button>
              </div>
            </div>
          </div>
        </BounceCard>
      ))}
    </div>
  );
};

export default FavoritesTab;
