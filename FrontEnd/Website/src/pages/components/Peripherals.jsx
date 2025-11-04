import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import colors from '../../config/colors';
import { FaKeyboard } from 'react-icons/fa';
import { FiArrowLeft, FiFilter } from 'react-icons/fi';

const Peripherals = () => {
  const navigate = useNavigate();
  const [selectedPeripheral, setSelectedPeripheral] = useState(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const peripheralList = [
    { id: 1, name: 'Logitech G Pro X Superlight', brand: 'Logitech', type: 'Mouse', connectivity: 'Wireless', price: 159.99 },
    { id: 2, name: 'Corsair K70 RGB TKL', brand: 'Corsair', type: 'Keyboard', connectivity: 'Wired', price: 139.99 },
    { id: 3, name: 'Razer DeathAdder V3 Pro', brand: 'Razer', type: 'Mouse', connectivity: 'Wireless', price: 149.99 },
    { id: 4, name: 'SteelSeries Apex Pro', brand: 'SteelSeries', type: 'Keyboard', connectivity: 'Wired', price: 199.99 },
    { id: 5, name: 'HyperX Cloud Alpha', brand: 'HyperX', type: 'Headset', connectivity: 'Wired', price: 99.99 },
    { id: 6, name: 'Blue Yeti X', brand: 'Blue', type: 'Microphone', connectivity: 'USB', price: 169.99 },
  ];

  const handleSelectPeripheral = (peripheral) => {
    setSelectedPeripheral(peripheral);
    console.log('Selected Peripheral:', peripheral);
  };

  const handleConfirm = () => {
    if (selectedPeripheral) {
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
            <FaKeyboard size={32} style={{ color: colors.mainYellow }} />
            <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
              Choose Peripherals
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

        {selectedPeripheral && (
          <div 
            className="rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center"
            style={{ backgroundColor: colors.mainYellow }}
          >
            <div>
              <p className="text-sm font-semibold text-white">Selected:</p>
              <p className="text-lg font-bold text-white">{selectedPeripheral.name}</p>
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
          {peripheralList.map((peripheral) => (
            <div
              key={peripheral.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer ${
                selectedPeripheral?.id === peripheral.id ? 'ring-4' : ''
              }`}
              style={{ 
                border: `2px solid ${selectedPeripheral?.id === peripheral.id ? colors.mainYellow : colors.platinum}`,
                ringColor: colors.mainYellow
              }}
              onClick={() => handleSelectPeripheral(peripheral)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ 
                      backgroundColor: peripheral.type === 'Mouse' ? '#F44336' :
                                      peripheral.type === 'Keyboard' ? '#2196F3' :
                                      peripheral.type === 'Headset' ? '#4CAF50' : '#FF9800'
                    }}
                  >
                    {peripheral.type}
                  </span>
                  {selectedPeripheral?.id === peripheral.id && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                  {peripheral.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Brand:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{peripheral.brand}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Connectivity:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{peripheral.connectivity}</span>
                  </div>
                </div>

                <div className="pt-4 border-t" style={{ borderColor: colors.platinum }}>
                  <p className="text-2xl font-bold text-center" style={{ color: colors.mainYellow }}>
                    ${peripheral.price.toFixed(2)}
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

export default Peripherals;
