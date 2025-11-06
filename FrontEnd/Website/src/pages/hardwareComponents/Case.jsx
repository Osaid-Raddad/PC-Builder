import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/navbar/Navbar.jsx';
import Footer from '../../components/user/footer/Footer.jsx';
import colors from '../../config/colors';
import { FaDesktop } from 'react-icons/fa';
import { FiArrowLeft, FiFilter } from 'react-icons/fi';

const Case = () => {
  const navigate = useNavigate();
  const [selectedCase, setSelectedCase] = useState(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const caseList = [
    { id: 1, name: 'Lian Li O11 Dynamic EVO', brand: 'Lian Li', type: 'Mid Tower', formFactor: 'ATX', price: 169.99 },
    { id: 2, name: 'NZXT H510 Elite', brand: 'NZXT', type: 'Mid Tower', formFactor: 'ATX', price: 149.99 },
    { id: 3, name: 'Corsair 4000D Airflow', brand: 'Corsair', type: 'Mid Tower', formFactor: 'ATX', price: 104.99 },
    { id: 4, name: 'Fractal Design Meshify 2', brand: 'Fractal Design', type: 'Mid Tower', formFactor: 'ATX', price: 139.99 },
    { id: 5, name: 'Phanteks Eclipse P500A', brand: 'Phanteks', type: 'Mid Tower', formFactor: 'ATX', price: 159.99 },
    { id: 6, name: 'be quiet! Pure Base 500DX', brand: 'be quiet!', type: 'Mid Tower', formFactor: 'ATX', price: 109.99 },
  ];

  const handleSelectCase = (caseItem) => {
    setSelectedCase(caseItem);
    console.log('Selected Case:', caseItem);
  };

  const handleConfirm = () => {
    if (selectedCase) {
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
            <FaDesktop size={32} style={{ color: colors.mainYellow }} />
            <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
              Choose Case
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

        {selectedCase && (
          <div 
            className="rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center"
            style={{ backgroundColor: colors.mainYellow }}
          >
            <div>
              <p className="text-sm font-semibold text-white">Selected:</p>
              <p className="text-lg font-bold text-white">{selectedCase.name}</p>
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
          {caseList.map((caseItem) => (
            <div
              key={caseItem.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer ${
                selectedCase?.id === caseItem.id ? 'ring-4' : ''
              }`}
              style={{ 
                border: `2px solid ${selectedCase?.id === caseItem.id ? colors.mainYellow : colors.platinum}`,
                ringColor: colors.mainYellow
              }}
              onClick={() => handleSelectCase(caseItem)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: colors.mainYellow }}
                  >
                    {caseItem.brand}
                  </span>
                  {selectedCase?.id === caseItem.id && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                  {caseItem.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Type:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{caseItem.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Form Factor:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{caseItem.formFactor}</span>
                  </div>
                </div>

                <div className="pt-4 border-t" style={{ borderColor: colors.platinum }}>
                  <p className="text-2xl font-bold text-center" style={{ color: colors.mainYellow }}>
                    ${caseItem.price.toFixed(2)}
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

export default Case;
