import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import colors from '../../config/colors';
import { FaMemory } from 'react-icons/fa';
import { FiArrowLeft, FiFilter } from 'react-icons/fi';

const Memory = () => {
  const navigate = useNavigate();
  const [selectedMemory, setSelectedMemory] = useState(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const memoryList = [
    { id: 1, name: 'Corsair Vengeance RGB DDR5', brand: 'Corsair', capacity: '32GB (2x16GB)', speed: 'DDR5-6000', price: 149.99 },
    { id: 2, name: 'G.Skill Trident Z5 RGB', brand: 'G.Skill', capacity: '32GB (2x16GB)', speed: 'DDR5-6400', price: 169.99 },
    { id: 3, name: 'Kingston Fury Beast DDR5', brand: 'Kingston', capacity: '32GB (2x16GB)', speed: 'DDR5-5600', price: 129.99 },
    { id: 4, name: 'Corsair Dominator Platinum RGB', brand: 'Corsair', capacity: '64GB (2x32GB)', speed: 'DDR5-6000', price: 289.99 },
    { id: 5, name: 'Crucial DDR5', brand: 'Crucial', capacity: '32GB (2x16GB)', speed: 'DDR5-5200', price: 109.99 },
    { id: 6, name: 'G.Skill Ripjaws S5', brand: 'G.Skill', capacity: '32GB (2x16GB)', speed: 'DDR5-6000', price: 139.99 },
  ];

  const handleSelectMemory = (memory) => {
    setSelectedMemory(memory);
    console.log('Selected Memory:', memory);
  };

  const handleConfirm = () => {
    if (selectedMemory) {
      navigate('/builder');
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/builder')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
            style={{ backgroundColor: colors.mainYellow, color: 'white' }}
          >
            <FiArrowLeft size={20} />
            Back to Builder
          </button>
          
          <div className="flex items-center gap-3">
            <FaMemory size={32} style={{ color: colors.mainYellow }} />
            <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
              Choose Memory (RAM)
            </h1>
          </div>
          
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
            style={{ backgroundColor: 'white', color: colors.mainYellow, border: `2px solid ${colors.mainYellow}` }}
          >
            <FiFilter size={20} />
            Filters
          </button>
        </div>

        {selectedMemory && (
          <div 
            className="rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center"
            style={{ backgroundColor: colors.mainYellow }}
          >
            <div>
              <p className="text-sm font-semibold text-white">Selected:</p>
              <p className="text-lg font-bold text-white">{selectedMemory.name}</p>
            </div>
            <button
              onClick={handleConfirm}
              className="px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: 'white', color: colors.mainYellow }}
            >
              Confirm Selection
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memoryList.map((memory) => (
            <div
              key={memory.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer ${
                selectedMemory?.id === memory.id ? 'ring-4' : ''
              }`}
              style={{ 
                border: `2px solid ${selectedMemory?.id === memory.id ? colors.mainYellow : colors.platinum}`,
                ringColor: colors.mainYellow
              }}
              onClick={() => handleSelectMemory(memory)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: colors.mainYellow }}
                  >
                    {memory.brand}
                  </span>
                  {selectedMemory?.id === memory.id && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                  {memory.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Capacity:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{memory.capacity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Speed:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{memory.speed}</span>
                  </div>
                </div>

                <div className="pt-4 border-t" style={{ borderColor: colors.platinum }}>
                  <p className="text-2xl font-bold text-center" style={{ color: colors.mainYellow }}>
                    ${memory.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Memory;
