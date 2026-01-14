import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBuild } from '../../context/BuildContext';
import { useCompare } from '../../context/CompareContext';
import toast from 'react-hot-toast';
import Navbar from '../../components/user/navbar/Navbar.jsx';
import Footer from '../../components/user/footer/Footer.jsx';
import BounceCard from '../../components/animations/BounceCard/BounceCard';
import colors from '../../config/colors';
import { FaMicrochip } from 'react-icons/fa';
import { FiArrowLeft, FiSearch } from 'react-icons/fi';
import gpusData from '../../data/components/gpus.json';

const GPU = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const source = searchParams.get('source'); // 'builder' or 'comparator'
  const { addComponent } = useBuild();
  const { compareList, addToCompare, isInCompare, removeFromCompare, getCategory } = useCompare();
  const [selectedGPU, setSelectedGPU] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [animationKey, setAnimationKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  
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

  const gpuList = gpusData.gpus.map(gpu => ({
    ...gpu,
    name: `${gpu.brand} ${gpu.model}`, // Combine brand and model for display
    memory: `${gpu.memoryGB}GB ${gpu.memoryType}`,
    tdp: `${gpu.tdpWatts}W`
  }));
  
  console.log('GPU List loaded:', gpuList.length, 'items');
  console.log('First GPU:', gpuList[0]);

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
    
    // Rating (optional field)
    const matchesRating = filters.rating === null || 
      !filters.rating ||
      (gpu.rating && gpu.rating >= filters.rating);
    
    // Chipset
    const matchesChipset = filters.chipset.length === 0 || 
      !gpu.chipset ||
      filters.chipset.includes(gpu.chipset);
    
    // Memory
    const matchesMemory = filters.memory.length === 0 || 
      !gpu.memoryGB ||
      filters.memory.includes(`${gpu.memoryGB}GB`);
    
    // Memory Type
    const matchesMemoryType = filters.memoryType.length === 0 || 
      !gpu.memoryType ||
      filters.memoryType.includes(gpu.memoryType);
    
    // Core Clock
    const matchesCoreClock = !gpu.coreClockMHz || 
      (gpu.coreClockMHz >= filters.coreClock.min && 
       gpu.coreClockMHz <= filters.coreClock.max);
    
    // Boost Clock
    const matchesBoostClock = !gpu.boostClockMHz || 
      (gpu.boostClockMHz >= filters.boostClock.min && 
       gpu.boostClockMHz <= filters.boostClock.max);
    
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
    const matchesLength = !gpu.lengthMm || 
      (gpu.lengthMm >= filters.length.min && 
       gpu.lengthMm <= filters.length.max);
    
    // TDP
    const matchesTdp = !gpu.tdpWatts || 
      (gpu.tdpWatts >= filters.tdp.min && 
       gpu.tdpWatts <= filters.tdp.max);
    
    // DVI Ports
    const matchesDviPorts = filters.dviPorts.length === 0 || 
      gpu.dviPorts === undefined ||
      filters.dviPorts.includes(gpu.dviPorts.toString());
    
    // HDMI Ports
    const matchesHdmiPorts = filters.hdmiPorts.length === 0 || 
      gpu.hdmiPorts === undefined ||
      filters.hdmiPorts.includes(gpu.hdmiPorts.toString());
    
    // Mini HDMI Ports
    const matchesMiniHdmiPorts = filters.miniHdmiPorts.length === 0 || 
      gpu.miniHdmiPorts === undefined ||
      filters.miniHdmiPorts.includes(gpu.miniHdmiPorts.toString());
    
    // DisplayPort Ports
    const matchesDisplayPortPorts = filters.displayPortPorts.length === 0 || 
      gpu.displayPortPorts === undefined ||
      filters.displayPortPorts.includes(gpu.displayPortPorts.toString());
    
    // Mini DisplayPort Ports
    const matchesMiniDisplayPortPorts = filters.miniDisplayPortPorts.length === 0 || 
      gpu.miniDisplayPortPorts === undefined ||
      filters.miniDisplayPortPorts.includes(gpu.miniDisplayPortPorts.toString());
    
    // Case Expansion Slot Width
    const matchesCaseExpansionSlotWidth = filters.caseExpansionSlotWidth.length === 0 || 
      !gpu.caseExpansionSlotWidth ||
      filters.caseExpansionSlotWidth.includes(gpu.caseExpansionSlotWidth.toString());
    
    // Total Slot Width
    const matchesTotalSlotWidth = filters.totalSlotWidth.length === 0 || 
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
           matchesFrameSync && matchesLength && matchesTdp && matchesDviPorts &&
           matchesHdmiPorts && matchesMiniHdmiPorts && matchesDisplayPortPorts &&
           matchesMiniDisplayPortPorts && matchesCaseExpansionSlotWidth && matchesTotalSlotWidth &&
           matchesCooling && matchesExternalPower;
  });
  
  console.log('Filtered GPUs:', filteredGPUs.length);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGPUs = filteredGPUs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredGPUs.length / itemsPerPage);

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
          {currentGPUs.map((gpu, index) => (
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
                <div className="flex gap-2 justify-end">
                  {/* Only show action buttons if source exists (from builder or comparator) */}
                  {source && (
                    <>
                      {/* Add to Build button - hide if from comparator */}
                      {source !== 'comparator' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addComponent('gpu', gpu);
                            navigate('/builder');
                          }}
                          className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer flex-1"
                          style={{
                            backgroundColor: selectedGPU?.id === gpu.id ? colors.mainYellow : 'white',
                            color: selectedGPU?.id === gpu.id ? 'white' : colors.mainYellow,
                            border: `2px solid ${colors.mainYellow}`
                          }}
                        >
                          {selectedGPU?.id === gpu.id ? 'Selected' : 'Select'}
                        </button>
                      )}
                      
                      {/* Compare button - hide if from builder */}
                      {source !== 'builder' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const currentCategory = getCategory();
                            if (currentCategory && currentCategory !== 'gpu') {
                              toast.error(`You can only compare GPUs together. Clear the ${currentCategory} comparison first.`, { duration: 3000 });
                              return;
                            }
                            if (isInCompare(gpu.id)) {
                              removeFromCompare(gpu.id);
                            } else {
                              if (compareList.length >= 4) {
                                toast.error('You can compare up to 4 products at once.', { duration: 3000 });
                                return;
                              }
                              addToCompare(gpu, 'gpu');
                            }
                          }}
                          className="px-3 py-2 rounded-lg font-bold transition-all hover:opacity-90 cursor-pointer"
                          style={{
                            backgroundColor: isInCompare(gpu.id) ? colors.mainYellow : 'white',
                            color: isInCompare(gpu.id) ? 'white' : colors.mainYellow,
                            border: `2px solid ${colors.mainYellow}`
                          }}
                        >
                          {isInCompare(gpu.id) ? '✓' : '+'}
                        </button>
                      )}
                    </>
                  )}
                  
                  {/* Details button - always show */}
                  <button
                    onClick={(e) => handleProductClick(gpu.id, e)}
                    className="px-6 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer"
                    style={{
                      backgroundColor: colors.mainYellow,
                      color: 'white'
                    }}
                  >
                    Details
                  </button>
                </div>
              </div>
            </BounceCard>
          ))}
        </div>

            {/* Pagination */}
            {filteredGPUs.length > itemsPerPage && (
              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: colors.mainYellow,
                    color: 'white',
                    border: 'none'
                  }}
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-lg font-semibold" style={{ color: colors.mainBlack }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: colors.mainYellow,
                    color: 'white',
                    border: 'none'
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Floating Compare Bar */}
        {compareList.length > 0 && (
          <div 
            className="fixed bottom-0 left-0 right-0 shadow-lg z-50"
            style={{ backgroundColor: colors.mainBlack, borderTop: `3px solid ${colors.mainYellow}` }}
          >
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                            <span className="text-white font-semibold">
                              Compare ({compareList.length}/4)
                            </span>
                            <div className="flex gap-2">
                              {compareList.map(item => (
                                <div 
                                  key={item.id}
                                  className="px-3 py-1 rounded flex items-center gap-2"
                                  style={{ backgroundColor: colors.mainYellow }}
                                >
                                  <span className="text-sm text-white">{item.name || `${item.brand} ${item.model}`}</span>
                                  <button
                                    onClick={() => removeFromCompare(item.id)}
                                    className="text-white hover:opacity-80"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    compareList.forEach(product => removeFromCompare(product.id));
                  }}
                  className="px-4 py-2 rounded-lg font-semibold hover:opacity-80"
                  style={{ backgroundColor: '#F44336', color: 'white' }}
                >
                  Clear All
                </button>
                <button
                  onClick={() => navigate('/comparator')}
                  className="px-6 py-2 rounded-lg font-semibold hover:opacity-80"
                  style={{ backgroundColor: colors.mainYellow, color: 'white' }}
                >
                  Compare Now
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
};

export default GPU;
