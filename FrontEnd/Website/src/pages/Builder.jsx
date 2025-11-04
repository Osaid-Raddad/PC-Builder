import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import colors from '../config/colors';
import { 
  FaMicrochip, 
  FaFan, 
  FaMemory, 
  FaHdd, 
  FaDesktop,
  FaExpand,
  FaBolt,
  FaWindows,
  FaTv,
  FaNetworkWired,
  FaKeyboard,
  FaPlus,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle
} from 'react-icons/fa';
import { HiCog } from 'react-icons/hi';
import { BsCpuFill, BsMotherboard } from 'react-icons/bs';

const Builder = () => {
  const navigate = useNavigate();
  const [selectedComponents, setSelectedComponents] = useState({});

  const components = [
    { id: 'cpu', name: 'CPU', icon: <BsCpuFill size={24} />, description: 'Choose your processor' },
    { id: 'cooler', name: 'CPU Cooler', icon: <FaFan size={24} />, description: 'Keep your CPU cool' },
    { id: 'motherboard', name: 'Motherboard', icon: <BsMotherboard size={24} />, description: 'The backbone of your PC' },
    { id: 'memory', name: 'Memory', icon: <FaMemory size={24} />, description: 'RAM for multitasking' },
    { id: 'storage', name: 'Storage', icon: <FaHdd size={24} />, description: 'HDD/SSD for your data' },
    { id: 'gpu', name: 'GPU', icon: <FaMicrochip size={24} />, description: 'Graphics card for gaming' },
    { id: 'case', name: 'Case', icon: <FaDesktop size={24} />, description: 'House your components' },
    { id: 'psu', name: 'Power Supply', icon: <FaBolt size={24} />, description: 'Power your build' },
    { id: 'monitor', name: 'Monitor', icon: <FaTv size={24} />, description: 'Display your visuals' },
    { id: 'expansion', name: 'Expansion Cards / Networking', icon: <FaNetworkWired size={24} />, description: 'Wi-Fi, sound cards, etc.' },
    { id: 'peripherals', name: 'Peripherals', icon: <FaKeyboard size={24} />, description: 'Keyboard, mouse, etc.' },
    { id: 'accessories', name: 'Accessories / Other', icon: <FaPlus size={24} />, description: 'Extra items' },
  ];

  const handleComponentClick = (componentId) => {
    console.log(`Selecting component: ${componentId}`);
    // Navigate to component selection page
    navigate(`/builder/${componentId}`);
  };

  const calculateTotal = () => {
    // TODO: Calculate total price from selected components
    return 0;
  };

  const checkCompatibility = () => {
    // TODO: Implement actual compatibility checking logic
    const selectedCount = Object.keys(selectedComponents).length;
    
    if (selectedCount === 0) {
      return { status: 'none', message: 'No components selected', icon: null };
    } else if (selectedCount < 5) {
      return { 
        status: 'incomplete', 
        message: 'Build Incomplete', 
        icon: <FaExclamationTriangle size={20} />,
        color: '#FF9800'
      };
    }
    
    // Simulate compatibility check
    const isCompatible = true; // Replace with actual logic
    
    if (isCompatible) {
      return { 
        status: 'compatible', 
        message: 'All Compatible', 
        icon: <FaCheckCircle size={20} />,
        color: '#4CAF50'
      };
    } else {
      return { 
        status: 'incompatible', 
        message: 'Issues Found', 
        icon: <FaTimesCircle size={20} />,
        color: '#F44336'
      };
    }
  };

  const compatibility = checkCompatibility();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/src/assets/Images/LogoBig.png"
              alt="PC Builder Logo" 
              className="h-40 object-contain"
            />
          </div>
          <p className="text-xl" style={{ color: colors.jet }}>
            Build your dream PC by selecting components below
          </p>
        </div>

        {/* Build Summary Card */}
        <div 
          className="rounded-lg shadow-lg p-6 mb-8 "
          style={{ backgroundColor: 'white', border: `2px solid ${colors.mainYellow}` }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: colors.mainBlack }}>
                Your Build
              </h2>
              <p className="text-sm" style={{ color: colors.jet }}>
                {Object.keys(selectedComponents).length} of {components.length} components selected
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Compatibility Status */}
              <div className="text-center sm:text-left">
                <p className="text-sm mb-1" style={{ color: colors.jet }}>Compatibility</p>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  {compatibility.icon && (
                    <span style={{ color: compatibility.color }}>
                      {compatibility.icon}
                    </span>
                  )}
                  <p className="text-lg font-semibold" style={{ color: compatibility.color || colors.jet }}>
                    {compatibility.message}
                  </p>
                </div>
              </div>
              
              {/* Total Price */}
              <div className="text-center sm:text-right">
                <p className="text-sm" style={{ color: colors.jet }}>Estimated Total</p>
                <p className="text-3xl font-bold" style={{ color: colors.mainYellow }}>
                  ${calculateTotal().toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Component Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {components.map((component) => (
            <div
              key={component.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => handleComponentClick(component.id)}
              style={{ border: `2px solid ${colors.platinum}` }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = colors.mainYellow}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = colors.platinum}
            >
              <div className="p-6">
                {/* Icon and Name */}
                <div className="flex items-center mb-4">
                  <div 
                    className="p-3 rounded-lg mr-4"
                    style={{ backgroundColor: colors.mainBeige, color: colors.mainYellow }}
                  >
                    {component.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold" style={{ color: colors.mainBlack }}>
                      {component.name}
                    </h3>
                    <p className="text-xs" style={{ color: colors.jet }}>
                      {component.description}
                    </p>
                  </div>
                </div>

                {/* Selection Status */}
                {selectedComponents[component.id] ? (
                  <div 
                    className="p-3 rounded-lg text-center"
                    style={{ backgroundColor: colors.mainYellow + '20' }}
                  >
                    <p className="text-sm font-medium" style={{ color: colors.mainBlack }}>
                      {selectedComponents[component.id].name}
                    </p>
                    <p className="text-xs" style={{ color: colors.jet }}>
                      ${selectedComponents[component.id].price}
                    </p>
                  </div>
                ) : (
                  <button
                    className="w-full py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: colors.mainYellow }}
                  >
                    Choose {component.name}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <button
            className="px-8 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity shadow-lg"
            style={{ backgroundColor: colors.mainYellow }}
            disabled={Object.keys(selectedComponents).length === 0}
          >
            Save Build
          </button>
          <button
            className="px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-lg"
            style={{ 
              backgroundColor: 'white',
              color: colors.mainYellow,
              border: `2px solid ${colors.mainYellow}`
            }}
          >
            Clear Build
          </button>
          <button
            className="px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-lg"
            style={{ 
              backgroundColor: colors.jet,
              color: 'white'
            }}
          >
            Share Build
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Builder;
