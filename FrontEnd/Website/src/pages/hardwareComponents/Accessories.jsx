import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/navbar/Navbar.jsx';
import Footer from '../../components/user/footer/Footer.jsx';
import colors from '../../config/colors';
import { FaPlus } from 'react-icons/fa';
import { FiArrowLeft, FiFilter } from 'react-icons/fi';

const Accessories = () => {
  const navigate = useNavigate();
  const [selectedAccessory, setSelectedAccessory] = useState(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const accessoryList = [
    { id: 1, name: 'Cable Management Kit', brand: 'Generic', type: 'Cable Management', price: 19.99 },
    { id: 2, name: 'RGB LED Strip 2M', brand: 'Corsair', type: 'RGB Lighting', price: 39.99 },
    { id: 3, name: 'Thermal Paste Arctic MX-5', brand: 'Arctic', type: 'Thermal Compound', price: 12.99 },
    { id: 4, name: 'Anti-Static Wrist Strap', brand: 'Rosewill', type: 'Safety Equipment', price: 7.99 },
    { id: 5, name: 'PC Tool Kit', brand: 'iFixit', type: 'Tools', price: 29.99 },
    { id: 6, name: 'Fan Hub Controller', brand: 'Thermaltake', type: 'Fan Controller', price: 24.99 },
  ];

  const handleSelectAccessory = (accessory) => {
    setSelectedAccessory(accessory);
    console.log('Selected Accessory:', accessory);
  };

  const handleConfirm = () => {
    if (selectedAccessory) {
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
            <FaPlus size={32} style={{ color: colors.mainYellow }} />
            <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
              Choose Accessories
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

        {selectedAccessory && (
          <div 
            className="rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center"
            style={{ backgroundColor: colors.mainYellow }}
          >
            <div>
              <p className="text-sm font-semibold text-white">Selected:</p>
              <p className="text-lg font-bold text-white">{selectedAccessory.name}</p>
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
          {accessoryList.map((accessory) => (
            <div
              key={accessory.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer ${
                selectedAccessory?.id === accessory.id ? 'ring-4' : ''
              }`}
              style={{ 
                border: `2px solid ${selectedAccessory?.id === accessory.id ? colors.mainYellow : colors.platinum}`,
                ringColor: colors.mainYellow
              }}
              onClick={() => handleSelectAccessory(accessory)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: colors.mainYellow }}
                  >
                    {accessory.brand}
                  </span>
                  {selectedAccessory?.id === accessory.id && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                  {accessory.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Type:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{accessory.type}</span>
                  </div>
                </div>

                <div className="pt-4 border-t" style={{ borderColor: colors.platinum }}>
                  <p className="text-2xl font-bold text-center" style={{ color: colors.mainYellow }}>
                    ${accessory.price.toFixed(2)}
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

export default Accessories;
