import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/navbar/Navbar.jsx';
import Footer from '../../components/user/footer/Footer.jsx';
import BounceCard from '../../components/animations/BounceCard/BounceCard';
import colors from '../../config/colors';
import { FaMicrochip } from 'react-icons/fa';
import { FiArrowLeft, FiSearch } from 'react-icons/fi';

const GPU = () => {
  const navigate = useNavigate();
  const [selectedGPU, setSelectedGPU] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [animationKey, setAnimationKey] = useState(0);
  
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 2000 },
    manufacturers: [],
    rating: null,
    chipset: [],
    memory: [],
    memoryType: [],
    coreClock: { min: 0, max: 3000 },
    boostClock: { min: 0, max: 3500 },
    interface: [],
    color: [],
    sliCrossfire: [],
    frameSync: [],
    length: { min: 0, max: 400 },
    tdp: { min: 0, max: 600 },
    dviPorts: [],
    hdmiPorts: [],
    miniHdmiPorts: [],
    displayPortPorts: [],
    miniDisplayPortPorts: [],
    caseExpansionSlotWidth: [],
    totalSlotWidth: [],
    cooling: [],
    externalPower: []
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const gpuList = [
    { id: 1, name: 'NVIDIA RTX 4090', brand: 'NVIDIA', memory: '24GB GDDR6X', price: 1599.99, tdp: '450W' },
    { id: 2, name: 'AMD Radeon RX 7900 XTX', brand: 'AMD', memory: '24GB GDDR6', price: 999.99, tdp: '355W' },
    { id: 3, name: 'NVIDIA RTX 4080', brand: 'NVIDIA', memory: '16GB GDDR6X', price: 1199.99, tdp: '320W' },
    { id: 4, name: 'AMD Radeon RX 7900 XT', brand: 'AMD', memory: '20GB GDDR6', price: 849.99, tdp: '315W' },
    { id: 5, name: 'NVIDIA RTX 4070 Ti', brand: 'NVIDIA', memory: '12GB GDDR6X', price: 799.99, tdp: '285W' },
    { id: 6, name: 'AMD Radeon RX 7800 XT', brand: 'AMD', memory: '16GB GDDR6', price: 499.99, tdp: '263W' },
  ];

  const filteredGPUs = gpuList.filter(gpu => {
    // Search term
    const matchesSearch = searchTerm === '' ||
      gpu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gpu.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Price range
    const matchesPrice = gpu.price >= filters.priceRange.min && gpu.price <= filters.priceRange.max;
    
    // Manufacturers
    const matchesManufacturer = filters.manufacturers.length === 0 || 
      filters.manufacturers.includes(gpu.brand);
    
    // Rating
    const matchesRating = filters.rating === null || 
      (gpu.rating && gpu.rating >= filters.rating);
    
    // Chipset
    const matchesChipset = filters.chipset.length === 0 || 
      !gpu.chipset ||
      filters.chipset.includes(gpu.chipset);
    
    // Memory
    const matchesMemory = filters.memory.length === 0 || 
      !gpu.memory ||
      filters.memory.includes(gpu.memory);
    
    // Memory Type
    const matchesMemoryType = filters.memoryType.length === 0 || 
      !gpu.memoryType ||
      filters.memoryType.includes(gpu.memoryType);
    
    // Core Clock
    const matchesCoreClock = !gpu.coreClock || 
      (gpu.coreClock >= filters.coreClock.min && gpu.coreClock <= filters.coreClock.max);
    
    // Boost Clock
    const matchesBoostClock = !gpu.boostClock || 
      (gpu.boostClock >= filters.boostClock.min && gpu.boostClock <= filters.boostClock.max);
    
    // Interface
    const matchesInterface = filters.interface.length === 0 || 
      !gpu.interface ||
      filters.interface.includes(gpu.interface);
    
    // Color
    const matchesColor = filters.color.length === 0 || 
      !gpu.color ||
      filters.color.includes(gpu.color);
    
    // SLI/Crossfire
    const matchesSliCrossfire = filters.sliCrossfire.length === 0 || 
      !gpu.sliCrossfire ||
      filters.sliCrossfire.includes(gpu.sliCrossfire);
    
    // Frame Sync
    const matchesFrameSync = filters.frameSync.length === 0 || 
      !gpu.frameSync ||
      filters.frameSync.includes(gpu.frameSync);
    
    // Length
    const matchesLength = !gpu.length || 
      (gpu.length >= filters.length.min && gpu.length <= filters.length.max);
    
    // TDP
    const matchesTdp = !gpu.tdp || 
      (gpu.tdp >= filters.tdp.min && gpu.tdp <= filters.tdp.max);
    
    // Port filters
    const matchesDvi = filters.dviPorts.length === 0 || 
      !gpu.dviPorts ||
      filters.dviPorts.includes(gpu.dviPorts.toString());
    
    const matchesHdmi = filters.hdmiPorts.length === 0 || 
      !gpu.hdmiPorts ||
      filters.hdmiPorts.includes(gpu.hdmiPorts.toString());
    
    const matchesMiniHdmi = filters.miniHdmiPorts.length === 0 || 
      !gpu.miniHdmiPorts ||
      filters.miniHdmiPorts.includes(gpu.miniHdmiPorts.toString());
    
    const matchesDisplayPort = filters.displayPortPorts.length === 0 || 
      !gpu.displayPortPorts ||
      filters.displayPortPorts.includes(gpu.displayPortPorts.toString());
    
    const matchesMiniDisplayPort = filters.miniDisplayPortPorts.length === 0 || 
      !gpu.miniDisplayPortPorts ||
      filters.miniDisplayPortPorts.includes(gpu.miniDisplayPortPorts.toString());
    
    // Expansion Slots
    const matchesCaseExpansion = filters.caseExpansionSlotWidth.length === 0 || 
      !gpu.caseExpansionSlotWidth ||
      filters.caseExpansionSlotWidth.includes(gpu.caseExpansionSlotWidth.toString());
    
    const matchesTotalSlot = filters.totalSlotWidth.length === 0 || 
      !gpu.totalSlotWidth ||
      filters.totalSlotWidth.includes(gpu.totalSlotWidth.toString());
    
    // Cooling
    const matchesCooling = filters.cooling.length === 0 || 
      !gpu.cooling ||
      filters.cooling.includes(gpu.cooling);
    
    // External Power
    const matchesExternalPower = filters.externalPower.length === 0 || 
      !gpu.externalPower ||
      filters.externalPower.includes(gpu.externalPower);
    
    return matchesSearch && matchesPrice && matchesManufacturer && matchesRating &&
           matchesChipset && matchesMemory && matchesMemoryType && matchesCoreClock &&
           matchesBoostClock && matchesInterface && matchesColor && matchesSliCrossfire &&
           matchesFrameSync && matchesLength && matchesTdp && matchesDvi && matchesHdmi &&
           matchesMiniHdmi && matchesDisplayPort && matchesMiniDisplayPort && matchesCaseExpansion &&
           matchesTotalSlot && matchesCooling && matchesExternalPower;
  });

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const handleCheckboxToggle = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: prev[filterName].includes(value)
        ? prev[filterName].filter(item => item !== value)
        : [...prev[filterName], value]
    }));
  };

  const resetFilters = () => {
    setFilters({
      priceRange: { min: 0, max: 2000 },
      manufacturers: [],
      rating: null,
      chipset: [],
      memory: [],
      memoryType: [],
      coreClock: { min: 0, max: 3000 },
      boostClock: { min: 0, max: 3500 },
      interface: [],
      color: [],
      sliCrossfire: [],
      frameSync: [],
      length: { min: 0, max: 400 },
      tdp: { min: 0, max: 600 },
      dviPorts: [],
      hdmiPorts: [],
      miniHdmiPorts: [],
      displayPortPorts: [],
      miniDisplayPortPorts: [],
      caseExpansionSlotWidth: [],
      totalSlotWidth: [],
      cooling: [],
      externalPower: []
    });
  };

  const handleSelectGPU = (gpu) => {
    setSelectedGPU(gpu);
    console.log('Selected GPU:', gpu);
  };

  const handleConfirm = () => {
    if (selectedGPU) {
      navigate('/builder');
    }
  };

  const handleProductClick = (productId, e) => {
    e.stopPropagation();
    navigate(`/product/gpu/${productId}`);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity  cursor-pointer"
            style={{ backgroundColor: colors.mainYellow, color: 'white' }}
          >
            <FiArrowLeft size={20} />
            Back
          </button>
          
          <div className="flex items-center gap-3">
            <FaMicrochip size={32} style={{ color: colors.mainYellow }} />
            <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
              Choose GPU
            </h1>
          </div>
          
          <div style={{ width: '150px' }}></div>
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div 
            className="w-64 rounded-lg p-6 shadow-md overflow-y-auto"
            style={{ 
              backgroundColor: 'white',
              maxHeight: 'calc(120vh - 250px)',
              position: 'sticky',
              top: '20px'
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{ color: colors.mainBlack }}>
                Filters
              </h2>
              <button
                onClick={resetFilters}
                className="text-sm hover:opacity-80 transition-opacity cursor-pointer"
                style={{ color: colors.mainYellow }}
              >
                Reset
              </button>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Price
              </h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="2000"
                  value={filters.priceRange.max}
                  onChange={(e) => handleFilterChange('priceRange', { ...filters.priceRange, max: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm" style={{ color: colors.jet }}>
                  <span>${filters.priceRange.min}</span>
                  <span>${filters.priceRange.max}</span>
                </div>
              </div>
            </div>

            {/* Manufacturer Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Manufacturer
              </h3>
              <div className="space-y-2">
                {['ASUS', 'MSI', 'Gigabyte', 'EVGA', 'Zotac', 'Sapphire', 'XFX', 'PowerColor'].map(manufacturer => (
                  <label key={manufacturer} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.manufacturers.includes(manufacturer)}
                      onChange={() => handleCheckboxToggle('manufacturers', manufacturer)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{manufacturer}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Rating
              </h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(rating => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === rating}
                      onChange={() => handleFilterChange('rating', rating)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>
                      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)} & Up
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Chipset Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Chipset
              </h3>
              <div className="space-y-2">
                {['NVIDIA GeForce RTX 4090', 'NVIDIA GeForce RTX 4080', 'NVIDIA GeForce RTX 4070 Ti', 'AMD Radeon RX 7900 XTX', 'AMD Radeon RX 7900 XT', 'AMD Radeon RX 7800 XT'].map(chipset => (
                  <label key={chipset} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.chipset.includes(chipset)}
                      onChange={() => handleCheckboxToggle('chipset', chipset)}
                      className="cursor-pointer"
                    />
                    <span className="text-xs" style={{ color: colors.jet }}>{chipset}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Memory Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Memory
              </h3>
              <div className="space-y-2">
                {['4GB', '6GB', '8GB', '10GB', '12GB', '16GB', '20GB', '24GB'].map(memory => (
                  <label key={memory} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.memory.includes(memory)}
                      onChange={() => handleCheckboxToggle('memory', memory)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{memory}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Memory Type Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Memory Type
              </h3>
              <div className="space-y-2">
                {['GDDR6X', 'GDDR6', 'GDDR5', 'HBM2'].map(memoryType => (
                  <label key={memoryType} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.memoryType.includes(memoryType)}
                      onChange={() => handleCheckboxToggle('memoryType', memoryType)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{memoryType}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Core Clock Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Core Clock
              </h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="3000"
                  step="50"
                  value={filters.coreClock.max}
                  onChange={(e) => handleFilterChange('coreClock', { ...filters.coreClock, max: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm" style={{ color: colors.jet }}>
                  <span>{filters.coreClock.min} MHz</span>
                  <span>{filters.coreClock.max} MHz</span>
                </div>
              </div>
            </div>

            {/* Boost Clock Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Boost Clock
              </h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="3500"
                  step="50"
                  value={filters.boostClock.max}
                  onChange={(e) => handleFilterChange('boostClock', { ...filters.boostClock, max: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm" style={{ color: colors.jet }}>
                  <span>{filters.boostClock.min} MHz</span>
                  <span>{filters.boostClock.max} MHz</span>
                </div>
              </div>
            </div>

            {/* Interface Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Interface
              </h3>
              <div className="space-y-2">
                {['PCIe 4.0 x16', 'PCIe 3.0 x16', 'PCIe 5.0 x16'].map(interfaceType => (
                  <label key={interfaceType} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.interface.includes(interfaceType)}
                      onChange={() => handleCheckboxToggle('interface', interfaceType)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{interfaceType}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Color
              </h3>
              <div className="space-y-2">
                {['Black', 'White', 'Silver', 'RGB', 'Red', 'Blue'].map(color => (
                  <label key={color} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.color.includes(color)}
                      onChange={() => handleCheckboxToggle('color', color)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{color}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* SLI/CrossFire Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                SLI/CrossFire
              </h3>
              <div className="space-y-2">
                {['SLI', 'CrossFire', 'None'].map(option => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.sliCrossfire.includes(option)}
                      onChange={() => handleCheckboxToggle('sliCrossfire', option)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Frame Sync Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Frame Sync
              </h3>
              <div className="space-y-2">
                {['G-Sync', 'FreeSync', 'None'].map(frameSync => (
                  <label key={frameSync} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.frameSync.includes(frameSync)}
                      onChange={() => handleCheckboxToggle('frameSync', frameSync)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{frameSync}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Length Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Length
              </h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="400"
                  step="10"
                  value={filters.length.max}
                  onChange={(e) => handleFilterChange('length', { ...filters.length, max: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm" style={{ color: colors.jet }}>
                  <span>{filters.length.min} mm</span>
                  <span>{filters.length.max} mm</span>
                </div>
              </div>
            </div>

            {/* TDP Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                TDP
              </h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="600"
                  step="10"
                  value={filters.tdp.max}
                  onChange={(e) => handleFilterChange('tdp', { ...filters.tdp, max: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm" style={{ color: colors.jet }}>
                  <span>{filters.tdp.min} W</span>
                  <span>{filters.tdp.max} W</span>
                </div>
              </div>
            </div>

            {/* DVI Ports Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                DVI Ports
              </h3>
              <div className="space-y-2">
                {['0', '1', '2', '3+'].map(ports => (
                  <label key={ports} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.dviPorts.includes(ports)}
                      onChange={() => handleCheckboxToggle('dviPorts', ports)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{ports}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* HDMI Ports Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                HDMI Ports
              </h3>
              <div className="space-y-2">
                {['0', '1', '2', '3', '4+'].map(ports => (
                  <label key={ports} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.hdmiPorts.includes(ports)}
                      onChange={() => handleCheckboxToggle('hdmiPorts', ports)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{ports}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Mini-HDMI Ports Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Mini-HDMI Ports
              </h3>
              <div className="space-y-2">
                {['0', '1', '2+'].map(ports => (
                  <label key={ports} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.miniHdmiPorts.includes(ports)}
                      onChange={() => handleCheckboxToggle('miniHdmiPorts', ports)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{ports}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* DisplayPort Ports Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                DisplayPort Ports
              </h3>
              <div className="space-y-2">
                {['0', '1', '2', '3', '4+'].map(ports => (
                  <label key={ports} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.displayPortPorts.includes(ports)}
                      onChange={() => handleCheckboxToggle('displayPortPorts', ports)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{ports}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Mini-DisplayPort Ports Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Mini-DisplayPort Ports
              </h3>
              <div className="space-y-2">
                {['0', '1', '2+'].map(ports => (
                  <label key={ports} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.miniDisplayPortPorts.includes(ports)}
                      onChange={() => handleCheckboxToggle('miniDisplayPortPorts', ports)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{ports}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Case Expansion Slot Width Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Case Expansion Slot Width
              </h3>
              <div className="space-y-2">
                {['1', '2', '2.5', '3', '3.5', '4'].map(width => (
                  <label key={width} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.caseExpansionSlotWidth.includes(width)}
                      onChange={() => handleCheckboxToggle('caseExpansionSlotWidth', width)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{width} Slots</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Total Slot Width Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Total Slot Width
              </h3>
              <div className="space-y-2">
                {['1', '2', '2.5', '3', '3.5', '4'].map(width => (
                  <label key={width} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.totalSlotWidth.includes(width)}
                      onChange={() => handleCheckboxToggle('totalSlotWidth', width)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{width} Slots</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Cooling Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Cooling
              </h3>
              <div className="space-y-2">
                {['Single Fan', 'Dual Fan', 'Triple Fan', 'Water Cooled', 'Passive'].map(cooling => (
                  <label key={cooling} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.cooling.includes(cooling)}
                      onChange={() => handleCheckboxToggle('cooling', cooling)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{cooling}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* External Power Filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                External Power
              </h3>
              <div className="space-y-2">
                {['None', '1 x 6-Pin', '1 x 8-Pin', '2 x 8-Pin', '3 x 8-Pin', '1 x 12+4-Pin'].map(power => (
                  <label key={power} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.externalPower.includes(power)}
                      onChange={() => handleCheckboxToggle('externalPower', power)}
                      className="cursor-pointer"
                    />
                    <span className="text-xs" style={{ color: colors.jet }}>{power}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Products Area */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <FiSearch 
                  size={20} 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                  style={{ color: colors.platinum }}
                />
                <input
                  type="text"
                  placeholder="Search GPUs by name or brand..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:border-opacity-80"
                  style={{ 
                    backgroundColor: 'white', 
                    borderColor: colors.platinum,
                    color: colors.mainBlack 
                  }}
                />
              </div>
            </div>

            {/* Results Counter */}
            <div className="mb-4">
              <p className="text-lg font-semibold" style={{ color: colors.jet }}>
                Showing {filteredGPUs.length} of {gpuList.length} GPUs
              </p>
            </div>

            {selectedGPU && (
          <div 
            className="rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center"
            style={{ backgroundColor: colors.mainYellow }}
          >
            <div>
              <p className="text-sm font-semibold text-white">Selected:</p>
              <p className="text-lg font-bold text-white">{selectedGPU.name}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedGPU(null)}
                className="px-6 py-2 rounded-lg font-semibold hover:opacity-80 transition-opacity cursor-pointer"
                style={{ backgroundColor: 'transparent', color: 'white', border: '2px solid white' }}
              >
                Cancel Selection
              </button>
              <button
                onClick={handleConfirm}
                className="px-6 py-2 rounded-lg font-semibold hover:opacity-80 transition-opacity cursor-pointer"
                style={{ backgroundColor: 'white', color: colors.mainYellow }}
              >
                Confirm Selection
              </button>
            </div>
          </div>
        )}

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGPUs.map((gpu, index) => (
            <BounceCard
              key={gpu.id}
              delay={index * 0.1}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all"
              style={{ border: `2px solid ${colors.platinum}` }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = colors.mainYellow}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = colors.platinum}
              animationKey={animationKey}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ 
                      backgroundColor: gpu.brand === 'NVIDIA' ? '#76B900' : '#ED1C24',
                      color: 'white'
                    }}
                  >
                    {gpu.brand}
                  </span>
                  {selectedGPU?.id === gpu.id && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                  {gpu.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Memory:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{gpu.memory}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>TDP:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{gpu.tdp}</span>
                  </div>
                </div>

                <div className="pt-4 border-t mb-4" style={{ borderColor: colors.platinum }}>
                  <p className="text-2xl font-bold text-center" style={{ color: colors.mainYellow }}>
                    ${gpu.price.toFixed(2)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectGPU(gpu);
                    }}
                    className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer"
                    style={{
                      backgroundColor: selectedGPU?.id === gpu.id ? colors.mainYellow : 'white',
                      color: selectedGPU?.id === gpu.id ? 'white' : colors.mainYellow,
                      border: `2px solid ${colors.mainYellow}`
                    }}
                  >
                    {selectedGPU?.id === gpu.id ? 'Selected' : 'Select'}
                  </button>
                  <button
                    onClick={(e) => handleProductClick(gpu.id, e)}
                    className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer"
                    style={{
                      backgroundColor: selectedGPU?.id === gpu.id ? 'white' : colors.mainYellow,
                      color: selectedGPU?.id === gpu.id ? colors.mainYellow : 'white',
                      border: selectedGPU?.id === gpu.id ? `2px solid ${colors.mainYellow}` : 'none'
                    }}
                  >
                    Details
                  </button>
                </div>
              </div>
            </BounceCard>
          ))}
        </div>

            {/* Empty State */}
            {filteredGPUs.length === 0 && (
              <div className="text-center py-12">
                <FaMicrochip size={64} style={{ color: colors.platinum }} className="mx-auto mb-4" />
                <p className="text-2xl font-bold mb-2" style={{ color: colors.mainBlack }}>
                  No GPUs found
                </p>
                <p className="text-lg" style={{ color: colors.jet }}>
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default GPU;
