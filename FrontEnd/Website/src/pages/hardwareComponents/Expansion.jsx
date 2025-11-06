import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/navbar/Navbar.jsx';
import Footer from '../../components/user/footer/Footer.jsx';
import colors from '../../config/colors';
import { FaNetworkWired } from 'react-icons/fa';
import { FiArrowLeft, FiFilter } from 'react-icons/fi';

const Expansion = () => {
  const navigate = useNavigate();
  const [selectedExpansion, setSelectedExpansion] = useState(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const expansionList = [
    { id: 1, name: 'TP-Link WiFi 6E AX5400', brand: 'TP-Link', type: 'WiFi Adapter', interface: 'PCIe', price: 69.99 },
    { id: 2, name: 'Creative Sound BlasterX AE-5', brand: 'Creative', type: 'Sound Card', interface: 'PCIe', price: 149.99 },
    { id: 3, name: 'Intel Wi-Fi 6 AX200', brand: 'Intel', type: 'WiFi Adapter', interface: 'M.2', price: 29.99 },
    { id: 4, name: 'ASUS PCE-AC88', brand: 'ASUS', type: 'WiFi Adapter', interface: 'PCIe', price: 99.99 },
    { id: 5, name: 'Elgato Game Capture 4K60 Pro', brand: 'Elgato', type: 'Capture Card', interface: 'PCIe', price: 299.99 },
    { id: 6, name: 'StarTech 4-Port USB 3.0', brand: 'StarTech', type: 'USB Expansion', interface: 'PCIe', price: 39.99 },
  ];

  const handleSelectExpansion = (expansion) => {
    setSelectedExpansion(expansion);
    console.log('Selected Expansion:', expansion);
  };

  const handleConfirm = () => {
    if (selectedExpansion) {
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
            <FaNetworkWired size={32} style={{ color: colors.mainYellow }} />
            <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
              Choose Expansion Cards
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

        {selectedExpansion && (
          <div 
            className="rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center"
            style={{ backgroundColor: colors.mainYellow }}
          >
            <div>
              <p className="text-sm font-semibold text-white">Selected:</p>
              <p className="text-lg font-bold text-white">{selectedExpansion.name}</p>
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
          {expansionList.map((expansion) => (
            <div
              key={expansion.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer ${
                selectedExpansion?.id === expansion.id ? 'ring-4' : ''
              }`}
              style={{ 
                border: `2px solid ${selectedExpansion?.id === expansion.id ? colors.mainYellow : colors.platinum}`,
                ringColor: colors.mainYellow
              }}
              onClick={() => handleSelectExpansion(expansion)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ 
                      backgroundColor: expansion.type.includes('WiFi') ? '#2196F3' :
                                      expansion.type.includes('Sound') ? '#9C27B0' :
                                      expansion.type.includes('Capture') ? '#F44336' : '#4CAF50'
                    }}
                  >
                    {expansion.type}
                  </span>
                  {selectedExpansion?.id === expansion.id && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                  {expansion.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Brand:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{expansion.brand}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Interface:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{expansion.interface}</span>
                  </div>
                </div>

                <div className="pt-4 border-t" style={{ borderColor: colors.platinum }}>
                  <p className="text-2xl font-bold text-center" style={{ color: colors.mainYellow }}>
                    ${expansion.price.toFixed(2)}
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

export default Expansion;
