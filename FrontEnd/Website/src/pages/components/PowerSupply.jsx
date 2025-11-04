import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import colors from '../../config/colors';
import { FaBolt } from 'react-icons/fa';
import { FiArrowLeft, FiFilter } from 'react-icons/fi';

const PowerSupply = () => {
  const navigate = useNavigate();
  const [selectedPSU, setSelectedPSU] = useState(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const psuList = [
    { id: 1, name: 'Corsair RM1000x', brand: 'Corsair', wattage: '1000W', efficiency: '80+ Gold', modular: 'Fully Modular', price: 189.99 },
    { id: 2, name: 'EVGA SuperNOVA 850 G6', brand: 'EVGA', wattage: '850W', efficiency: '80+ Gold', modular: 'Fully Modular', price: 149.99 },
    { id: 3, name: 'Seasonic Focus GX-850', brand: 'Seasonic', wattage: '850W', efficiency: '80+ Gold', modular: 'Fully Modular', price: 139.99 },
    { id: 4, name: 'be quiet! Straight Power 11', brand: 'be quiet!', wattage: '750W', efficiency: '80+ Platinum', modular: 'Fully Modular', price: 159.99 },
    { id: 5, name: 'Thermaltake Toughpower GF1', brand: 'Thermaltake', wattage: '750W', efficiency: '80+ Gold', modular: 'Fully Modular', price: 119.99 },
    { id: 6, name: 'Cooler Master V850 SFX', brand: 'Cooler Master', wattage: '850W', efficiency: '80+ Gold', modular: 'Fully Modular', price: 169.99 },
  ];

  const handleSelectPSU = (psu) => {
    setSelectedPSU(psu);
    console.log('Selected PSU:', psu);
  };

  const handleConfirm = () => {
    if (selectedPSU) {
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
            <FaBolt size={32} style={{ color: colors.mainYellow }} />
            <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
              Choose Power Supply
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

        {selectedPSU && (
          <div 
            className="rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center"
            style={{ backgroundColor: colors.mainYellow }}
          >
            <div>
              <p className="text-sm font-semibold text-white">Selected:</p>
              <p className="text-lg font-bold text-white">{selectedPSU.name}</p>
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
          {psuList.map((psu) => (
            <div
              key={psu.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer ${
                selectedPSU?.id === psu.id ? 'ring-4' : ''
              }`}
              style={{ 
                border: `2px solid ${selectedPSU?.id === psu.id ? colors.mainYellow : colors.platinum}`,
                ringColor: colors.mainYellow
              }}
              onClick={() => handleSelectPSU(psu)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ 
                      backgroundColor: psu.efficiency.includes('Platinum') ? '#9C27B0' : '#FFC107',
                      color: psu.efficiency.includes('Platinum') ? 'white' : 'black'
                    }}
                  >
                    {psu.efficiency}
                  </span>
                  {selectedPSU?.id === psu.id && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                  {psu.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Brand:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{psu.brand}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Wattage:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{psu.wattage}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Modular:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{psu.modular}</span>
                  </div>
                </div>

                <div className="pt-4 border-t" style={{ borderColor: colors.platinum }}>
                  <p className="text-2xl font-bold text-center" style={{ color: colors.mainYellow }}>
                    ${psu.price.toFixed(2)}
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

export default PowerSupply;
