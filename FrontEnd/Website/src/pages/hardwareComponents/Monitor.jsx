import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/navbar/Navbar.jsx';
import Footer from '../../components/user/footer/Footer.jsx';
import colors from '../../config/colors';
import { FaTv } from 'react-icons/fa';
import { FiArrowLeft, FiFilter } from 'react-icons/fi';

const Monitor = () => {
  const navigate = useNavigate();
  const [selectedMonitor, setSelectedMonitor] = useState(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const monitorList = [
    { id: 1, name: 'ASUS ROG Swift PG279QM', brand: 'ASUS', size: '27"', resolution: '2560x1440', refreshRate: '240Hz', price: 699.99 },
    { id: 2, name: 'LG 27GN950-B', brand: 'LG', size: '27"', resolution: '3840x2160', refreshRate: '144Hz', price: 799.99 },
    { id: 3, name: 'Samsung Odyssey G7', brand: 'Samsung', size: '32"', resolution: '2560x1440', refreshRate: '240Hz', price: 649.99 },
    { id: 4, name: 'Dell S2721DGF', brand: 'Dell', size: '27"', resolution: '2560x1440', refreshRate: '165Hz', price: 429.99 },
    { id: 5, name: 'AOC CU34G2X', brand: 'AOC', size: '34"', resolution: '3440x1440', refreshRate: '144Hz', price: 449.99 },
    { id: 6, name: 'BenQ EX2780Q', brand: 'BenQ', size: '27"', resolution: '2560x1440', refreshRate: '144Hz', price: 499.99 },
  ];

  const handleSelectMonitor = (monitor) => {
    setSelectedMonitor(monitor);
    console.log('Selected Monitor:', monitor);
  };

  const handleConfirm = () => {
    if (selectedMonitor) {
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
            <FaTv size={32} style={{ color: colors.mainYellow }} />
            <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
              Choose Monitor
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

        {selectedMonitor && (
          <div 
            className="rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center"
            style={{ backgroundColor: colors.mainYellow }}
          >
            <div>
              <p className="text-sm font-semibold text-white">Selected:</p>
              <p className="text-lg font-bold text-white">{selectedMonitor.name}</p>
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
          {monitorList.map((monitor) => (
            <div
              key={monitor.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer ${
                selectedMonitor?.id === monitor.id ? 'ring-4' : ''
              }`}
              style={{ 
                border: `2px solid ${selectedMonitor?.id === monitor.id ? colors.mainYellow : colors.platinum}`,
                ringColor: colors.mainYellow
              }}
              onClick={() => handleSelectMonitor(monitor)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: colors.mainYellow }}
                  >
                    {monitor.brand}
                  </span>
                  {selectedMonitor?.id === monitor.id && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                  {monitor.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Size:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{monitor.size}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Resolution:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{monitor.resolution}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Refresh Rate:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{monitor.refreshRate}</span>
                  </div>
                </div>

                <div className="pt-4 border-t" style={{ borderColor: colors.platinum }}>
                  <p className="text-2xl font-bold text-center" style={{ color: colors.mainYellow }}>
                    ${monitor.price.toFixed(2)}
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

export default Monitor;
