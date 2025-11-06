import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/navbar/Navbar.jsx';
import Footer from '../../components/user/footer/Footer.jsx';
import colors from '../../config/colors';
import { FaFan } from 'react-icons/fa';
import { FiArrowLeft, FiFilter } from 'react-icons/fi';

const CPUCooler = () => {
  const navigate = useNavigate();
  const [selectedCooler, setSelectedCooler] = useState(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // TODO: Replace with actual data from backend
  const coolerList = [
    { id: 1, name: 'Noctua NH-D15', brand: 'Noctua', type: 'Air', price: 109.99, compatibility: ['Intel', 'AMD'] },
    { id: 2, name: 'Corsair iCUE H150i Elite', brand: 'Corsair', type: 'Liquid', price: 189.99, compatibility: ['Intel', 'AMD'] },
    { id: 3, name: 'be quiet! Dark Rock Pro 4', brand: 'be quiet!', type: 'Air', price: 89.99, compatibility: ['Intel', 'AMD'] },
    { id: 4, name: 'NZXT Kraken X63', brand: 'NZXT', type: 'Liquid', price: 149.99, compatibility: ['Intel', 'AMD'] },
    { id: 5, name: 'Cooler Master Hyper 212', brand: 'Cooler Master', type: 'Air', price: 44.99, compatibility: ['Intel', 'AMD'] },
    { id: 6, name: 'Arctic Liquid Freezer II 280', brand: 'Arctic', type: 'Liquid', price: 119.99, compatibility: ['Intel', 'AMD'] },
  ];

  const handleSelectCooler = (cooler) => {
    setSelectedCooler(cooler);
    console.log('Selected Cooler:', cooler);
  };

  const handleConfirm = () => {
    if (selectedCooler) {
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
            <FaFan size={32} style={{ color: colors.mainYellow }} />
            <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
              Choose CPU Cooler
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

        {selectedCooler && (
          <div 
            className="rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center"
            style={{ backgroundColor: colors.mainYellow }}
          >
            <div>
              <p className="text-sm font-semibold text-white">Selected:</p>
              <p className="text-lg font-bold text-white">{selectedCooler.name}</p>
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
          {coolerList.map((cooler) => (
            <div
              key={cooler.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer ${
                selectedCooler?.id === cooler.id ? 'ring-4' : ''
              }`}
              style={{ 
                border: `2px solid ${selectedCooler?.id === cooler.id ? colors.mainYellow : colors.platinum}`,
                ringColor: colors.mainYellow
              }}
              onClick={() => handleSelectCooler(cooler)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: cooler.type === 'Air' ? '#4CAF50' : '#2196F3' }}
                  >
                    {cooler.type} Cooling
                  </span>
                  {selectedCooler?.id === cooler.id && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                  {cooler.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Brand:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{cooler.brand}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Type:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{cooler.type}</span>
                  </div>
                  <div className="text-sm">
                    <span style={{ color: colors.jet }}>Compatible:</span>
                    <div className="flex gap-2 mt-1">
                      {cooler.compatibility.map((comp) => (
                        <span 
                          key={comp}
                          className="px-2 py-1 rounded text-xs"
                          style={{ backgroundColor: colors.mainBeige, color: colors.mainBlack }}
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t" style={{ borderColor: colors.platinum }}>
                  <p className="text-2xl font-bold text-center" style={{ color: colors.mainYellow }}>
                    ${cooler.price.toFixed(2)}
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

export default CPUCooler;
