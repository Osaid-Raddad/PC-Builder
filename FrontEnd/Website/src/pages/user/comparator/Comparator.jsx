import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompare } from '../../../context/CompareContext';
import Navbar from '../../../components/user/navbar/Navbar.jsx';
import Footer from '../../../components/user/footer/Footer.jsx';
import colors from '../../../config/colors';
import { FiArrowLeft } from 'react-icons/fi';
import { MdCompareArrows } from 'react-icons/md';
import { BsCpuFill } from 'react-icons/bs';
import { FaMicrochip, FaMemory, FaHdd, FaBolt, FaBox, FaFan, FaDesktop, FaTools, FaNetworkWired, FaKeyboard } from 'react-icons/fa';
import { GiVideoCamera } from 'react-icons/gi';

const Comparator = () => {
  const navigate = useNavigate();
  const { compareList, removeFromCompare, clearCompare, getCategory } = useCompare();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const category = getCategory();
  
  // Map category names to display names
  const categoryNames = {
    'cpu': 'CPUs',
    'gpu': 'GPUs', 
    'motherboard': 'Motherboards',
    'memory': 'Memory',
    'storage': 'Storage',
    'psu': 'Power Supplies',
    'case': 'Cases',
    'cpucooler': 'CPU Coolers',
    'monitor': 'Monitors',
    'accessories': 'Accessories',
    'expansion': 'Expansion Cards',
    'peripherals': 'Peripherals'
  };

  // Get all spec keys from selected products
  const getAllSpecKeys = () => {
    const keys = new Set();
    compareList.forEach(product => {
      Object.keys(product).forEach(key => {
        if (key !== 'id' && key !== 'category' && key !== 'name' && key !== 'image') {
          keys.add(key);
        }
      });
    });
    return Array.from(keys);
  };

  const specKeys = getAllSpecKeys();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
              style={{ backgroundColor: colors.mainYellow, color: 'white' }}
            >
              <FiArrowLeft size={20} />
              Back
            </button>
            
            {compareList.length > 0 && (
              <button
                onClick={clearCompare}
                className="px-4 py-2 rounded-lg font-semibold hover:opacity-80 transition-opacity"
                style={{ backgroundColor: '#F44336', color: 'white' }}
              >
                Clear All
              </button>
            )}
          </div>
          
          <div className="flex items-center justify-center gap-3">
            <MdCompareArrows size={40} style={{ color: colors.mainYellow }} />
            <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
              Compare {category ? categoryNames[category] : 'Components'}
            </h1>
          </div>
        </div>

        {compareList.length === 0 ? (
          /* Empty State */
          <div 
            className="bg-white rounded-lg shadow-lg p-12 text-center"
            style={{ border: `2px solid ${colors.platinum}` }}
          >
            <MdCompareArrows size={80} style={{ color: colors.platinum }} className="mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2" style={{ color: colors.mainBlack }}>
              No Products Selected
            </h2>
            <p className="text-lg mb-6" style={{ color: colors.jet }}>
              Select a category below to browse products and add them for comparison
            </p>
            
            {/* Product Category Buttons - Horizontal Slide Bar */}
            <div className="relative max-w-5xl mx-auto">
              <div className="overflow-x-auto pb-4" style={{ scrollbarWidth: 'thin', scrollbarColor: `${colors.mainYellow} ${colors.platinum}` }}>
                <div className="flex gap-3 min-w-max px-2">
                  <button
                    onClick={() => navigate('/products/cpu?source=comparator')}
                    className="px-6 py-3 rounded-lg font-semibold hover:opacity-80 transition-all hover:scale-105 whitespace-nowrap flex items-center gap-2"
                    style={{ backgroundColor: colors.mainYellow, color: 'white', cursor: 'pointer' }}
                  >
                    <BsCpuFill size={20} />
                    CPUs
                  </button>
                  <button
                    onClick={() => navigate('/products/gpu?source=comparator')}
                    className="px-6 py-3 rounded-lg font-semibold hover:opacity-80 transition-all hover:scale-105 whitespace-nowrap flex items-center gap-2"
                    style={{ backgroundColor: colors.mainYellow, color: 'white', cursor: 'pointer' }}
                  >
                    <GiVideoCamera size={20} />
                    GPUs
                  </button>
                  <button
                    onClick={() => navigate('/products/motherboard?source=comparator')}
                    className="px-6 py-3 rounded-lg font-semibold hover:opacity-80 transition-all hover:scale-105 whitespace-nowrap flex items-center gap-2"
                    style={{ backgroundColor: colors.mainYellow, color: 'white', cursor: 'pointer' }}
                  >
                    <FaMicrochip size={20} />
                    Motherboards
                  </button>
                  <button
                    onClick={() => navigate('/products/memory?source=comparator')}
                    className="px-6 py-3 rounded-lg font-semibold hover:opacity-80 transition-all hover:scale-105 whitespace-nowrap flex items-center gap-2"
                    style={{ backgroundColor: colors.mainYellow, color: 'white', cursor: 'pointer' }}
                  >
                    <FaMemory size={20} />
                    Memory
                  </button>
                  <button
                    onClick={() => navigate('/products/storage?source=comparator')}
                    className="px-6 py-3 rounded-lg font-semibold hover:opacity-80 transition-all hover:scale-105 whitespace-nowrap flex items-center gap-2"
                    style={{ backgroundColor: colors.mainYellow, color: 'white', cursor: 'pointer' }}
                  >
                    <FaHdd size={20} />
                    Storage
                  </button>
                  <button
                    onClick={() => navigate('/products/power-supply?source=comparator')}
                    className="px-6 py-3 rounded-lg font-semibold hover:opacity-80 transition-all hover:scale-105 whitespace-nowrap flex items-center gap-2"
                    style={{ backgroundColor: colors.mainYellow, color: 'white', cursor: 'pointer' }}
                  >
                    <FaBolt size={20} />
                    Power Supplies
                  </button>
                  <button
                    onClick={() => navigate('/products/case?source=comparator')}
                    className="px-6 py-3 rounded-lg font-semibold hover:opacity-80 transition-all hover:scale-105 whitespace-nowrap flex items-center gap-2"
                    style={{ backgroundColor: colors.mainYellow, color: 'white', cursor: 'pointer' }}
                  >
                    <FaBox size={20} />
                    Cases
                  </button>
                  <button
                    onClick={() => navigate('/products/cooler?source=comparator')}
                    className="px-6 py-3 rounded-lg font-semibold hover:opacity-80 transition-all hover:scale-105 whitespace-nowrap flex items-center gap-2"
                    style={{ backgroundColor: colors.mainYellow, color: 'white', cursor: 'pointer' }}
                  >
                    <FaFan size={20} />
                    CPU Coolers
                  </button>
                  <button
                    onClick={() => navigate('/products/monitor?source=comparator')}
                    className="px-6 py-3 rounded-lg font-semibold hover:opacity-80 transition-all hover:scale-105 whitespace-nowrap flex items-center gap-2"
                    style={{ backgroundColor: colors.mainYellow, color: 'white', cursor: 'pointer' }}
                  >
                    <FaDesktop size={20} />
                    Monitors
                  </button>
                  <button
                    onClick={() => navigate('/products/accessories?source=comparator')}
                    className="px-6 py-3 rounded-lg font-semibold hover:opacity-80 transition-all hover:scale-105 whitespace-nowrap flex items-center gap-2"
                    style={{ backgroundColor: colors.mainYellow, color: 'white', cursor: 'pointer' }}
                  >
                    <FaTools size={20} />
                    Accessories
                  </button>
                  <button
                    onClick={() => navigate('/products/expansion?source=comparator')}
                    className="px-6 py-3 rounded-lg font-semibold hover:opacity-80 transition-all hover:scale-105 whitespace-nowrap flex items-center gap-2"
                    style={{ backgroundColor: colors.mainYellow, color: 'white', cursor: 'pointer' }}
                  >
                    <FaNetworkWired size={20} />
                    Expansion Cards
                  </button>
                  <button
                    onClick={() => navigate('/products/peripherals?source=comparator')}
                    className="px-6 py-3 rounded-lg font-semibold hover:opacity-80 transition-all hover:scale-105 whitespace-nowrap flex items-center gap-2"
                    style={{ backgroundColor: colors.mainYellow, color: 'white', cursor: 'pointer' }}
                  >
                    <FaKeyboard size={20} />
                    Peripherals
                  </button>
                </div>
              </div>
              <p className="text-sm mt-2" style={{ color: colors.jet }}>
                ← Scroll to see all categories →
              </p>
            </div>
          </div>
        ) : (
          /* Comparison Table */
          <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ border: `2px solid ${colors.platinum}` }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: colors.mainBeige }}>
                    <th className="p-4 text-left font-bold" style={{ color: colors.mainBlack, minWidth: '200px' }}>
                      Specification
                    </th>
                    {compareList.map(product => (
                      <th key={product.id} className="p-4 text-center" style={{ minWidth: '250px' }}>
                        <div className="flex flex-col items-center gap-2">
                          <div className="relative">
                            <button
                              onClick={() => removeFromCompare(product.id)}
                              className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center hover:opacity-80"
                              style={{ backgroundColor: '#F44336', color: 'white' }}
                            >
                              ×
                            </button>
                            <div 
                              className="w-20 h-20 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: colors.mainBeige }}
                            >
                              <span className="text-3xl">{category === 'cpu' ? '🖥️' : category === 'gpu' ? '🎮' : '💻'}</span>
                            </div>
                          </div>
                          <h3 className="font-bold text-sm" style={{ color: colors.mainBlack }}>
                            {product.name || `${product.brand} ${product.model}`}
                          </h3>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Price Row */}
                  <tr style={{ backgroundColor: 'white', borderBottom: `1px solid ${colors.platinum}` }}>
                    <td className="p-4 font-semibold" style={{ color: colors.mainBlack }}>
                      Price
                    </td>
                    {compareList.map(product => (
                      <td key={product.id} className="p-4 text-center">
                        <span className="text-xl font-bold" style={{ color: colors.mainYellow }}>
                          ${product.price}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Dynamic Spec Rows */}
                  {specKeys.map(key => (
                    <tr key={key} style={{ backgroundColor: 'white', borderBottom: `1px solid ${colors.platinum}` }}>
                      <td className="p-4 font-semibold capitalize" style={{ color: colors.mainBlack }}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </td>
                      {compareList.map(product => (
                        <td key={product.id} className="p-4 text-center" style={{ color: colors.jet }}>
                          {product[key] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add More Button */}
            {compareList.length < 4 && (
              <div className="p-4 text-center" style={{ backgroundColor: colors.mainBeige }}>
                <button
                  onClick={() => navigate(`/products/${category}?source=comparator`)}
                  className="px-6 py-2 rounded-lg font-semibold hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: colors.mainYellow, color: 'white' }}
                >
                  + Add More Products to Compare
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Comparator;
