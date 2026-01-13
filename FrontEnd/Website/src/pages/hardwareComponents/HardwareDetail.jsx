import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/user/navbar/Navbar';
import Footer from '../../components/user/footer/Footer';
import colors from '../../config/colors';
import { FiArrowLeft, FiShoppingCart, FiCheck, FiX } from 'react-icons/fi';
import { BsCpuFill } from 'react-icons/bs';
import { FaMicrochip, FaMemory, FaHdd, FaDesktop } from 'react-icons/fa';
import { useBuild } from '../../context/BuildContext';
import toast from 'react-hot-toast';

// Import all hardware data
import cpusData from '../../data/components/cpus.json';
import gpusData from '../../data/components/gpus.json';
import motherboardsData from '../../data/components/motherboards.json';
import memoryData from '../../data/components/memory.json';
import storageData from '../../data/components/storage.json';
import casesData from '../../data/components/cases.json';
import psusData from '../../data/components/powerSupplies.json';
import monitorsData from '../../data/components/monitors.json';
import coolersData from '../../data/components/cpuCoolers.json';
import accessoriesData from '../../data/components/accessories.json';
import expansionData from '../../data/components/expansion.json';
import peripheralsData from '../../data/components/peripherals.json';

const HardwareDetail = () => {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addComponent } = useBuild();
  const fromPage = location.state?.fromPage || 1;
  const [selectedImage, setSelectedImage] = useState(0);

  // Get the appropriate data based on category
  const getHardwareData = () => {
    switch(category) {
      case 'cpu':
        return cpusData.cpus;
      case 'gpu':
        return gpusData.gpus;
      case 'motherboard':
        return motherboardsData.motherboards;
      case 'memory':
        return memoryData.memory;
      case 'storage':
        return storageData.storage;
      case 'case':
        return casesData.cases;
      case 'power-supply':
        return psusData.powerSupplies;
      case 'monitor':
        return monitorsData.monitors;
      case 'cooler':
        return coolersData.cpuCoolers;
      case 'accessories':
        return accessoriesData.accessories;
      case 'expansion':
        return expansionData.expansion;
      case 'peripherals':
        return peripheralsData.peripherals;
      default:
        return [];
    }
  };

  const hardware = getHardwareData().find(item => item.id === parseInt(id));

  if (!hardware) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4" style={{ color: colors.mainBlack }}>
              Product Not Found
            </h1>
            <button
              onClick={() => navigate(`/products/${category}`, { state: { initialPage: fromPage } })}
              className="px-6 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity cursor-pointer"
              style={{ backgroundColor: colors.mainYellow }}
            >
              Back to Products
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Generate mock images array (in production, these would come from the database)
  const images = [
    hardware.image || '/images/placeholder.jpg',
    hardware.image || '/images/placeholder.jpg',
    hardware.image || '/images/placeholder.jpg',
    hardware.image || '/images/placeholder.jpg'
  ];

  const getTypeDisplayName = () => {
    const names = {
      'cpu': 'Processor',
      'gpu': 'Graphics Card',
      'motherboard': 'Motherboard',
      'memory': 'Memory (RAM)',
      'storage': 'Storage',
      'case': 'Case',
      'power-supply': 'Power Supply',
      'monitor': 'Monitor',
      'cooler': 'CPU Cooler',
      'accessories': 'Accessories',
      'expansion': 'Expansion Card',
      'peripherals': 'Peripherals'
    };
    return names[category] || category;
  };

  const getTypeIcon = () => {
    const icons = {
      'cpu': <BsCpuFill size={24} style={{ color: colors.mainYellow }} />,
      'gpu': <FaMicrochip size={24} style={{ color: colors.mainYellow }} />,
      'motherboard': <BsCpuFill size={24} style={{ color: colors.mainYellow }} />,
      'memory': <FaMemory size={24} style={{ color: colors.mainYellow }} />,
      'storage': <FaHdd size={24} style={{ color: colors.mainYellow }} />,
      'case': <FaDesktop size={24} style={{ color: colors.mainYellow }} />,
      'power-supply': <BsCpuFill size={24} style={{ color: colors.mainYellow }} />,
      'monitor': <FaDesktop size={24} style={{ color: colors.mainYellow }} />,
      'cooler': <BsCpuFill size={24} style={{ color: colors.mainYellow }} />
    };
    return icons[category] || <BsCpuFill size={24} style={{ color: colors.mainYellow }} />;
  };

  const renderSpecs = () => {
    switch(category) {
      case 'cpu':
        return (
          <>
            <SpecItem label="Brand" value={hardware.brand} />
            <SpecItem label="Cores" value={hardware.cores} />
            <SpecItem label="Threads" value={hardware.threads} />
            <SpecItem label="Base Clock" value={`${hardware.baseClockGHz} GHz`} />
            <SpecItem label="Boost Clock" value={`${hardware.boostClockGHz} GHz`} />
            <SpecItem label="TDP" value={`${hardware.tdpWatts}W`} />
            <SpecItem label="Socket" value={hardware.socket} />
            <SpecItem label="Integrated Graphics" value={hardware.integratedGraphics || 'No'} icon={hardware.integratedGraphics ? <FiCheck /> : <FiX />} />
            {hardware.performanceScore && <SpecItem label="Performance Score" value={hardware.performanceScore} />}
          </>
        );
      case 'gpu':
        return (
          <>
            <SpecItem label="Brand" value={hardware.brand} />
            <SpecItem label="Chipset" value={hardware.chipset} />
            <SpecItem label="Memory" value={`${hardware.memoryGB} GB ${hardware.memoryType}`} />
            <SpecItem label="Core Clock" value={`${hardware.coreClockMHz} MHz`} />
            <SpecItem label="Boost Clock" value={`${hardware.boostClockMHz} MHz`} />
            <SpecItem label="TDP" value={`${hardware.tdpWatts}W`} />
            <SpecItem label="Length" value={`${hardware.lengthMM} mm`} />
            {hardware.performanceScore && <SpecItem label="Performance Score" value={hardware.performanceScore} />}
          </>
        );
      case 'motherboard':
        return (
          <>
            <SpecItem label="Brand" value={hardware.brand} />
            <SpecItem label="Socket" value={hardware.socket} />
            <SpecItem label="Form Factor" value={hardware.formFactor} />
            <SpecItem label="Chipset" value={hardware.chipset} />
            <SpecItem label="Memory Max" value={`${hardware.memoryMaxGB} GB`} />
            <SpecItem label="Memory Slots" value={hardware.memorySlots} />
            <SpecItem label="Memory Type" value={hardware.memoryType} />
          </>
        );
      case 'memory':
        return (
          <>
            <SpecItem label="Brand" value={hardware.brand} />
            <SpecItem label="Capacity" value={`${hardware.capacityGB} GB`} />
            <SpecItem label="Speed" value={`${hardware.speedMHz} MHz`} />
            <SpecItem label="Type" value={hardware.type} />
            <SpecItem label="Modules" value={`${hardware.modules}x${hardware.capacityGB / hardware.modules}GB`} />
            <SpecItem label="CAS Latency" value={hardware.casLatency} />
            {hardware.color && <SpecItem label="Color" value={hardware.color} />}
          </>
        );
      case 'storage':
        return (
          <>
            <SpecItem label="Brand" value={hardware.brand} />
            <SpecItem label="Capacity" value={`${hardware.capacityGB} GB`} />
            <SpecItem label="Type" value={hardware.type} />
            <SpecItem label="Interface" value={hardware.interface} />
            {hardware.cacheMB && <SpecItem label="Cache" value={`${hardware.cacheMB} MB`} />}
            {hardware.readSpeedMBps && <SpecItem label="Read Speed" value={`${hardware.readSpeedMBps} MB/s`} />}
            {hardware.writeSpeedMBps && <SpecItem label="Write Speed" value={`${hardware.writeSpeedMBps} MB/s`} />}
          </>
        );
      case 'case':
        return (
          <>
            <SpecItem label="Brand" value={hardware.brand} />
            <SpecItem label="Type" value={hardware.type} />
            {hardware.color && <SpecItem label="Color" value={hardware.color} />}
            {hardware.sidePanel && <SpecItem label="Side Panel" value={hardware.sidePanel} />}
            {hardware.externalBays && <SpecItem label="External Bays" value={hardware.externalBays} />}
            {hardware.internalBays && <SpecItem label="Internal Bays" value={hardware.internalBays} />}
          </>
        );
      case 'power-supply':
        return (
          <>
            <SpecItem label="Brand" value={hardware.brand} />
            <SpecItem label="Wattage" value={`${hardware.wattage}W`} />
            <SpecItem label="Efficiency" value={hardware.efficiency} />
            {hardware.modular && <SpecItem label="Modular" value={hardware.modular} />}
            {hardware.formFactor && <SpecItem label="Form Factor" value={hardware.formFactor} />}
          </>
        );
      case 'monitor':
        return (
          <>
            <SpecItem label="Brand" value={hardware.brand} />
            <SpecItem label="Screen Size" value={`${hardware.screenSizeInches}"`} />
            <SpecItem label="Resolution" value={hardware.resolution} />
            <SpecItem label="Refresh Rate" value={`${hardware.refreshRateHz} Hz`} />
            <SpecItem label="Response Time" value={`${hardware.responseTimeMs} ms`} />
            <SpecItem label="Panel Type" value={hardware.panelType} />
          </>
        );
      case 'cooler':
        return (
          <>
            <SpecItem label="Brand" value={hardware.brand} />
            <SpecItem label="Model" value={hardware.model} />
            <SpecItem label="Type" value={hardware.type} />
            {hardware.fanSize && <SpecItem label="Fan Size" value={`${hardware.fanSize} mm`} />}
            {hardware.fanCount && <SpecItem label="Fan Count" value={hardware.fanCount} />}
            {hardware.height && <SpecItem label="Height" value={`${hardware.height} mm`} />}
            {hardware.tdpRating && <SpecItem label="TDP Rating" value={`${hardware.tdpRating}W`} />}
          </>
        );
      default:
        return (
          <>
            <SpecItem label="Brand" value={hardware.brand} />
            <SpecItem label="Model" value={hardware.model || hardware.name} />
          </>
        );
    }
  };

  const handleAddToBuild = () => {
    // Map category names to component keys used in BuildContext
    const componentKeyMap = {
      'cpu': 'cpu',
      'gpu': 'gpu',
      'motherboard': 'motherboard',
      'memory': 'memory',
      'storage': 'storage',
      'case': 'case',
      'power-supply': 'psu',
      'monitor': 'monitor',
      'cooler': 'cooler',
      'accessories': 'accessories',
      'expansion': 'expansion',
      'peripherals': 'peripherals'
    };
    
    const componentKey = componentKeyMap[category] || category;
    addComponent(componentKey, hardware);
    toast.success(`${hardware.model || hardware.name || 'Product'} added to your build!`);
    navigate('/builder');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/products/${category}`, { state: { initialPage: fromPage } })}
          className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
          style={{ backgroundColor: 'white', color: colors.mainYellow, border: `2px solid ${colors.platinum}` }}
        >
          <FiArrowLeft size={20} />
          <span className="font-semibold">Back to {getTypeDisplayName()}s</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Header */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getTypeIcon()}
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{ backgroundColor: colors.mainYellow, color: 'white' }}
                    >
                      {getTypeDisplayName()}
                    </span>
                  </div>
                  <h1 className="text-4xl font-bold mb-2" style={{ color: colors.mainBlack }}>
                    {hardware.brand && `${hardware.brand} `}{hardware.model || hardware.name}
                  </h1>
                </div>
                <div 
                  className="px-6 py-3 rounded-lg font-bold text-2xl"
                  style={{ backgroundColor: colors.mainYellow, color: 'white' }}
                >
                  ${hardware.price}
                </div>
              </div>

              {/* Product Images Gallery */}
              <div className="mb-6">
                {/* Main Image */}
                <div 
                  className="h-96 bg-contain bg-center bg-no-repeat rounded-lg mb-3 transition-all duration-300"
                  style={{ 
                    backgroundColor: colors.platinum,
                    backgroundImage: `url(${images[selectedImage]})`
                  }}
                />
                
                {/* Thumbnail Gallery */}
                {images.length > 1 && (
                  <div className="flex gap-3">
                    {images.map((img, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className="h-20 w-20 bg-contain bg-center bg-no-repeat rounded-lg cursor-pointer transition-all duration-300"
                        style={{
                          backgroundColor: colors.platinum,
                          backgroundImage: `url(${img})`,
                          border: selectedImage === index ? `3px solid ${colors.mainYellow}` : `3px solid ${colors.platinum}`,
                          opacity: selectedImage === index ? 1 : 0.6,
                          transform: selectedImage === index ? 'scale(1.05)' : 'scale(1)'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3" style={{ color: colors.mainBlack }}>
                  Product Description
                </h2>
                <p className="text-base leading-relaxed" style={{ color: colors.jet }}>
                  {hardware.description || `High-performance ${getTypeDisplayName().toLowerCase()} designed for demanding tasks and optimal system performance. Features cutting-edge technology and reliable build quality.`}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4" style={{ borderTop: `2px solid ${colors.platinum}` }}>
                <button
                  onClick={handleAddToBuild}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-bold text-white hover:opacity-90 transition-all cursor-pointer"
                  style={{ backgroundColor: colors.mainYellow }}
                >
                  <FiShoppingCart size={20} />
                  <span>Add to Build</span>
                </button>

                <button
                  onClick={() => navigate('/builder')}
                  className="px-6 py-4 rounded-lg font-bold hover:opacity-90 transition-all cursor-pointer"
                  style={{
                    backgroundColor: 'white',
                    color: colors.mainYellow,
                    border: `2px solid ${colors.mainYellow}`
                  }}
                >
                  View Builder
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - Specifications */}
          <div className="space-y-6">
            {/* Full Specs Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              <h2 className="text-2xl font-bold mb-6" style={{ color: colors.mainBlack }}>
                Specifications
              </h2>
              
              <div className="space-y-3">
                {renderSpecs()}
              </div>

              {/* Performance Badge */}
              {hardware.performanceScore && (
                <div 
                  className="mt-6 p-4 rounded-lg text-center"
                  style={{ backgroundColor: colors.mainBeige }}
                >
                  <div className="text-sm font-semibold mb-1" style={{ color: colors.jet }}>
                    Performance Score
                  </div>
                  <div className="text-3xl font-bold" style={{ color: colors.mainYellow }}>
                    {hardware.performanceScore}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

// Helper component for spec items
const SpecItem = ({ label, value, icon }) => (
  <div className="p-3 rounded-lg flex items-center justify-between" style={{ backgroundColor: colors.mainBeige }}>
    <span className="font-semibold text-sm" style={{ color: colors.mainBlack }}>
      {label}
    </span>
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-sm" style={{ color: colors.jet }}>
        {value}
      </span>
    </div>
  </div>
);

export default HardwareDetail;
