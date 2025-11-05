import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import colors from '../../config/colors';
import { BsCpuFill } from 'react-icons/bs';
import { FiArrowLeft, FiFilter } from 'react-icons/fi';

const CPU = () => {
  const navigate = useNavigate();
  const [selectedCPU, setSelectedCPU] = useState(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // TODO: Replace with actual data from backend
  const cpuList = [
    { id: 1, name: 'Intel Core i9-14900K', brand: 'Intel', cores: 24, threads: 32, price: 589.99, socket: 'LGA1700' },
    { id: 2, name: 'AMD Ryzen 9 7950X', brand: 'AMD', cores: 16, threads: 32, price: 549.99, socket: 'AM5' },
    { id: 3, name: 'Intel Core i7-14700K', brand: 'Intel', cores: 20, threads: 28, price: 409.99, socket: 'LGA1700' },
    { id: 4, name: 'AMD Ryzen 7 7800X3D', brand: 'AMD', cores: 8, threads: 16, price: 449.99, socket: 'AM5' },
    { id: 5, name: 'Intel Core i5-14600K', brand: 'Intel', cores: 14, threads: 20, price: 319.99, socket: 'LGA1700' },
    { id: 6, name: 'AMD Ryzen 5 7600X', brand: 'AMD', cores: 6, threads: 12, price: 249.99, socket: 'AM5' },
  ];

  const handleSelectCPU = (cpu) => {
    setSelectedCPU(cpu);
    // TODO: Save selection to context/state management
    console.log('Selected CPU:', cpu);
  };

  const handleConfirm = () => {
    if (selectedCPU) {
      // TODO: Save to build state
      navigate('/builder');
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
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
            <BsCpuFill size={32} style={{ color: colors.mainYellow }} />
            <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
              Choose CPU
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

        {/* Selected Component Bar */}
        {selectedCPU && (
          <div 
            className="rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center"
            style={{ backgroundColor: colors.mainYellow }}
          >
            <div>
              <p className="text-sm font-semibold text-white">Selected:</p>
              <p className="text-lg font-bold text-white">{selectedCPU.name}</p>
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

        {/* CPU List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cpuList.map((cpu) => (
            <div
              key={cpu.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer ${
                selectedCPU?.id === cpu.id ? 'ring-4' : ''
              }`}
              style={{ 
                border: `2px solid ${selectedCPU?.id === cpu.id ? colors.mainYellow : colors.platinum}`,
                ringColor: colors.mainYellow
              }}
              onClick={() => handleSelectCPU(cpu)}
            >
              <div className="p-6">
                {/* Brand Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ 
                      backgroundColor: cpu.brand === 'Intel' ? '#0071C5' : '#ED1C24',
                      color: 'white'
                    }}
                  >
                    {cpu.brand}
                  </span>
                  {selectedCPU?.id === cpu.id && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>

                {/* CPU Name */}
                <h3 className="text-xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                  {cpu.name}
                </h3>

                {/* Specifications */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Cores:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{cpu.cores}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Threads:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{cpu.threads}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Socket:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{cpu.socket}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="pt-4 border-t" style={{ borderColor: colors.platinum }}>
                  <p className="text-2xl font-bold text-center" style={{ color: colors.mainYellow }}>
                    ${cpu.price.toFixed(2)}
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

export default CPU;
