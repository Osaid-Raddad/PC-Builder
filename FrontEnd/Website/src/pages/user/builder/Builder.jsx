import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuild } from '../../../context/BuildContext';
import Navbar from '../../../components/user/navbar/Navbar.jsx';
import Footer from '../../../components/user/footer/Footer.jsx';
import BounceCard from '../../../components/animations/BounceCard/BounceCard.jsx';
import QRCodeModal from '../../../components/user/builder/QRCodeModal.jsx';
import colors from '../../../config/colors';
import { 
  FaMemory, 
  FaHdd, 
  FaBolt,
  FaTv,
  FaNetworkWired,
  FaKeyboard,
  FaPlus,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle
} from 'react-icons/fa';
import { BsCpuFill, BsMotherboard, BsGpuCard} from 'react-icons/bs';
import { GiComputerFan } from 'react-icons/gi';
import { PiDesktopTowerFill } from 'react-icons/pi';

const Builder = () => {
  const navigate = useNavigate();
  const { 
    selectedComponents, 
    removeComponent, 
    clearBuild, 
    calculateTotalPrice, 
    calculateTotalPower, 
    checkCompatibility: checkCompat, 
    getPerformanceScore 
  } = useBuild();
  const [showQRModal, setShowQRModal] = useState(false);

  const components = [
    { id: 'cpu', name: 'CPU', icon: <BsCpuFill size={24} />, description: 'Choose your processor' },
    { id: 'cooler', name: 'CPU Cooler', icon: <GiComputerFan size={24} />, description: 'Keep your CPU cool' },
    { id: 'motherboard', name: 'Motherboard', icon: <BsMotherboard size={24} />, description: 'The backbone of your PC' },
    { id: 'memory', name: 'Memory', icon: <FaMemory size={24} />, description: 'RAM for multitasking' },
    { id: 'storage', name: 'Storage', icon: <FaHdd size={24} />, description: 'HDD/SSD for your data' },
    { id: 'gpu', name: 'GPU', icon: <BsGpuCard size={24} />, description: 'Graphics card for gaming' },
    { id: 'case', name: 'Case', icon: <PiDesktopTowerFill size={24} />, description: 'House your components' },
    { id: 'psu', name: 'Power Supply', icon: <FaBolt size={24} />, description: 'Power your build' },
    { id: 'monitor', name: 'Monitor', icon: <FaTv size={24} />, description: 'Display your visuals' },
    { id: 'expansion', name: 'Expansion Cards / Networking', icon: <FaNetworkWired size={24} />, description: 'Wi-Fi, sound cards, etc.' },
    { id: 'peripherals', name: 'Peripherals', icon: <FaKeyboard size={24} />, description: 'Keyboard, mouse, etc.' },
    { id: 'accessories', name: 'Accessories / Other', icon: <FaPlus size={24} />, description: 'Extra items' },
  ];

  const handleComponentClick = (componentId) => {
    console.log(`Selecting component: ${componentId}`);
    // Navigate to products page for the specific component
    const routeMap = {
      'cpu': '/products/cpu',
      'cooler': '/products/cooler',
      'motherboard': '/products/motherboard',
      'memory': '/products/memory',
      'storage': '/products/storage',
      'gpu': '/products/gpu',
      'case': '/products/case',
      'psu': '/products/power-supply',
      'monitor': '/products/monitor',
      'expansion': '/products/expansion',
      'peripherals': '/products/peripherals',
      'accessories': '/products/accessories'
    };
    
    navigate(routeMap[componentId] || `/products/${componentId}`);
  };

  const calculateTotal = () => {
    return calculateTotalPrice();
  };

  const getCompatibilityStatus = () => {
    try {
      const compatCheck = checkCompat();
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
      
      // Use compatibility check from context
      if (!compatCheck.isCompatible) {
        return { 
          status: 'incompatible', 
          message: `${compatCheck.issues.length} Issues Found`, 
          icon: <FaTimesCircle size={20} />,
          color: '#F44336'
        };
      } else if (compatCheck.hasWarnings) {
        return { 
          status: 'warning', 
          message: `${compatCheck.warnings.length} Warnings`, 
          icon: <FaExclamationTriangle size={20} />,
          color: '#FF9800'
        };
      } else {
        return { 
          status: 'compatible', 
          message: 'All Compatible', 
          icon: <FaCheckCircle size={20} />,
          color: '#4CAF50'
        };
      }
    } catch (error) {
      console.error('Error checking compatibility:', error);
      return { 
        status: 'error', 
        message: 'Error checking compatibility', 
        icon: <FaExclamationTriangle size={20} />,
        color: '#FF9800'
      };
    }
  };

  const handleShareBuild = () => {
    // Generate a unique URL for this build
    // In production, you would save the build to backend and get a real ID
    const buildId = Math.random().toString(36).substring(7);
    const buildUrl = `${window.location.origin}/shared-build/${buildId}`;
    
    setShowQRModal(true);
  };

  const getBuildUrl = () => {
    // Generate build URL with current components
    const buildId = Math.random().toString(36).substring(7);
    return `${window.location.origin}/shared-build/${buildId}`;
  };

  const compatibility = getCompatibilityStatus();

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
          {components.map((component, index) => (
            <BounceCard
              key={component.id}
              delay={index * 0.1}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer"
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
                  <div>
                    <div 
                      className="p-3 rounded-lg mb-2"
                      style={{ backgroundColor: colors.mainYellow + '20' }}
                    >
                      <p className="text-sm font-medium" style={{ color: colors.mainBlack }}>
                        {selectedComponents[component.id].name || 
                         `${selectedComponents[component.id].brand || ''} ${selectedComponents[component.id].model || ''}`.trim() ||
                         'Unknown Component'}
                      </p>
                      <p className="text-xs" style={{ color: colors.jet }}>
                        ${selectedComponents[component.id].price || 0}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleComponentClick(component.id);
                        }}
                        className="flex-1 py-2 rounded-lg font-semibold text-sm hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: colors.mainYellow, color: 'white' }}
                      >
                        Change
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeComponent(component.id);
                        }}
                        className="flex-1 py-2 rounded-lg font-semibold text-sm hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: '#F44336', color: 'white' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="w-full py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity cursor-pointer"
                    style={{ backgroundColor: colors.mainYellow }}
                  >
                    Choose {component.name}
                  </button>
                )}
              </div>
            </BounceCard>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <button
            className="px-8 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity shadow-lg cursor-pointer"
            style={{ backgroundColor: colors.mainYellow }}
            disabled={Object.keys(selectedComponents).length === 0}
          >
            Save Build
          </button>
          <button
            onClick={clearBuild}
            className="px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: 'white',
              color: colors.mainYellow,
              border: `2px solid ${colors.mainYellow}`
            }}
            disabled={Object.keys(selectedComponents).length === 0}
          >
            Clear Build
          </button>
          <button
            onClick={handleShareBuild}
            className="px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-lg cursor-pointer"
            style={{ 
              backgroundColor: colors.jet,
              color: 'white'
            }}
          >
            Share Build
          </button>
        </div>

        {/* Compatibility Details & Performance */}
        {Object.keys(selectedComponents).length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* Compatibility Issues */}
            <div 
              className="rounded-lg shadow-lg p-6"
              style={{ backgroundColor: 'white', border: `2px solid ${colors.platinum}` }}
            >
              <h3 className="text-xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                Compatibility Check
              </h3>
              {(() => {
                const compatCheck = checkCompat();
                return (
                  <div>
                    {compatCheck.issues.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-sm mb-2" style={{ color: '#F44336' }}>
                          ⚠️ Critical Issues:
                        </h4>
                        {compatCheck.issues.map((issue, idx) => (
                          <div key={idx} className="p-2 mb-2 rounded" style={{ backgroundColor: '#FFEBEE' }}>
                            <p className="text-sm" style={{ color: '#C62828' }}>{issue.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {compatCheck.warnings.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-sm mb-2" style={{ color: '#FF9800' }}>
                          ⚡ Warnings:
                        </h4>
                        {compatCheck.warnings.map((warning, idx) => (
                          <div key={idx} className="p-2 mb-2 rounded" style={{ backgroundColor: '#FFF3E0' }}>
                            <p className="text-sm" style={{ color: '#E65100' }}>{warning.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {compatCheck.isCompatible && !compatCheck.hasWarnings && (
                      <div className="p-4 rounded" style={{ backgroundColor: '#E8F5E9' }}>
                        <p className="text-center font-semibold" style={{ color: '#2E7D32' }}>
                          ✅ All components are compatible!
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Performance Score */}
            <div 
              className="rounded-lg shadow-lg p-6"
              style={{ backgroundColor: 'white', border: `2px solid ${colors.platinum}` }}
            >
              <h3 className="text-xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                Performance Score
              </h3>
              {(() => {
                const perfScore = getPerformanceScore();
                return (
                  <div className="text-center">
                    <div className="mb-4">
                      <div className="text-6xl font-bold mb-2" style={{ color: colors.mainYellow }}>
                        {perfScore.score}
                      </div>
                      <div className="text-2xl font-semibold" style={{ color: colors.mainBlack }}>
                        {perfScore.category}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span style={{ color: colors.jet }}>Estimated Power:</span>
                        <span className="font-semibold" style={{ color: colors.mainBlack }}>
                          {calculateTotalPower()}W
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: colors.jet }}>PSU Recommendation:</span>
                        <span className="font-semibold" style={{ color: colors.mainBlack }}>
                          {Math.round(calculateTotalPower() * 1.3)}W+
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <QRCodeModal
          buildUrl={getBuildUrl()}
          onClose={() => setShowQRModal(false)}
        />
      )}

      <Footer />
    </div>
  );
};

export default Builder;
