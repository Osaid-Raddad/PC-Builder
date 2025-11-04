import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import colors from '../../config/colors';
import { FaWindows } from 'react-icons/fa';
import { FiArrowLeft, FiFilter } from 'react-icons/fi';

const OperatingSystem = () => {
  const navigate = useNavigate();
  const [selectedOS, setSelectedOS] = useState(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const osList = [
    { id: 1, name: 'Windows 11 Pro', brand: 'Microsoft', edition: 'Professional', price: 199.99, type: 'License' },
    { id: 2, name: 'Windows 11 Home', brand: 'Microsoft', edition: 'Home', price: 139.99, type: 'License' },
    { id: 3, name: 'Ubuntu 22.04 LTS', brand: 'Canonical', edition: 'Desktop', price: 0, type: 'Free' },
    { id: 4, name: 'Linux Mint', brand: 'Linux Mint', edition: 'Cinnamon', price: 0, type: 'Free' },
    { id: 5, name: 'Windows 10 Pro', brand: 'Microsoft', edition: 'Professional', price: 149.99, type: 'License' },
    { id: 6, name: 'Fedora Workstation', brand: 'Red Hat', edition: 'Workstation', price: 0, type: 'Free' },
  ];

  const handleSelectOS = (os) => {
    setSelectedOS(os);
    console.log('Selected OS:', os);
  };

  const handleConfirm = () => {
    if (selectedOS) {
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
            <FaWindows size={32} style={{ color: colors.mainYellow }} />
            <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
              Choose Operating System
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

        {selectedOS && (
          <div 
            className="rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center"
            style={{ backgroundColor: colors.mainYellow }}
          >
            <div>
              <p className="text-sm font-semibold text-white">Selected:</p>
              <p className="text-lg font-bold text-white">{selectedOS.name}</p>
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
          {osList.map((os) => (
            <div
              key={os.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer ${
                selectedOS?.id === os.id ? 'ring-4' : ''
              }`}
              style={{ 
                border: `2px solid ${selectedOS?.id === os.id ? colors.mainYellow : colors.platinum}`,
                ringColor: colors.mainYellow
              }}
              onClick={() => handleSelectOS(os)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: os.price === 0 ? '#4CAF50' : '#2196F3' }}
                  >
                    {os.type}
                  </span>
                  {selectedOS?.id === os.id && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                  {os.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Provider:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{os.brand}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Edition:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{os.edition}</span>
                  </div>
                </div>

                <div className="pt-4 border-t" style={{ borderColor: colors.platinum }}>
                  <p className="text-2xl font-bold text-center" style={{ color: colors.mainYellow }}>
                    {os.price === 0 ? 'FREE' : `$${os.price.toFixed(2)}`}
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

export default OperatingSystem;
