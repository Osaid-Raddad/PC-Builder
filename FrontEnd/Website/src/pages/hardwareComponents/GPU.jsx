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
import { getGPUImage } from '../../utils/imageMapper';

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
    priceRange: { min: 99, max: 2500 },
    manufacturers: [],
    rating: null,
    memory: [],
    memoryType: [],
    coreClock: { min: 0, max: 3000 },
    boostClock: { min: 0, max: 3500 },
    interface: [],
    frameSync: [],
    lengthMM: { min: 0, max: 400 },
    tdp: { min: 0, max: 600 },
    hdmiPorts: [],
    displayPortPorts: [],
    cooling: [],
    externalPower: []
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const gpuList = gpusData.gpus.map(gpu => {
    // Determine brand from chipset
    const brand = gpu.chipset?.includes('GeForce') || gpu.chipset?.includes('GTX') || gpu.chipset?.includes('RTX') 
      ? 'NVIDIA' 
      : gpu.chipset?.includes('Radeon') || gpu.chipset?.includes('RX') 
      ? 'AMD' 
      : gpu.chipset?.includes('Arc') 
      ? 'Intel' 
      : 'Unknown';
    
    return {
      ...gpu,
      brand, // Add brand field
      name: `${gpu.manufacturer} ${gpu.model}`, // Combine manufacturer and model for display
      memory: `${gpu.memoryGB}GB ${gpu.memoryType}`,
      tdp: `${gpu.tdpWatts}W`
    };
  });
  
  console.log('GPU List loaded:', gpuList.length, 'items');
  console.log('First GPU:', gpuList[0]);

  const filteredGPUs = gpuList.filter(gpu => {
    // Search term
    const matchesSearch = searchTerm === '' ||
      gpu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (gpu.brand && gpu.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (gpu.model && gpu.model.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Price range
    const matchesPrice = gpu.price >= filters.priceRange.min && gpu.price <= filters.priceRange.max;
    
    // Manufacturers
    const matchesManufacturer = filters.manufacturers.length === 0 || 
      filters.manufacturers.includes(gpu.manufacturer);
    
    // Rating (optional field)
    const matchesRating = filters.rating === null || 
      !filters.rating ||
      (gpu.rating && gpu.rating >= filters.rating);
    
    // Memory - direct number comparison
    const matchesMemory = filters.memory.length === 0 || 
      filters.memory.includes(gpu.memoryGB);
    
    // Memory Type
    const matchesMemoryType = filters.memoryType.length === 0 || 
      filters.memoryType.includes(gpu.memoryType);
    
    // Core Clock
    const matchesCoreClock = gpu.coreClockMHz >= filters.coreClock.min && 
                             gpu.coreClockMHz <= filters.coreClock.max;
    
    // Boost Clock
    const matchesBoostClock = gpu.boostClockMHz >= filters.boostClock.min && 
                              gpu.boostClockMHz <= filters.boostClock.max;
    
    // Interface
    const matchesInterface = filters.interface.length === 0 || 
      filters.interface.includes(gpu.interface);
    
    // Frame Sync
    const matchesFrameSync = filters.frameSync.length === 0 || 
      filters.frameSync.includes(gpu.frameSync);
    
    // Length
    const matchesLength = !gpu.lengthMM || 
      (gpu.lengthMM >= filters.lengthMM.min && gpu.lengthMM <= filters.lengthMM.max);
    
    // TDP
    const matchesTdp = gpu.tdpWatts >= filters.tdp.min && 
                       gpu.tdpWatts <= filters.tdp.max;
    
    // HDMI Ports - direct number comparison from ports.hdmi
    const matchesHdmiPorts = filters.hdmiPorts.length === 0 || 
      (gpu.ports && gpu.ports.hdmi !== undefined &&
       filters.hdmiPorts.includes(gpu.ports.hdmi));
    
    // DisplayPort Ports - direct number comparison from ports.displayPort
    const matchesDisplayPortPorts = filters.displayPortPorts.length === 0 || 
      (gpu.ports && gpu.ports.displayPort !== undefined &&
       filters.displayPortPorts.includes(gpu.ports.displayPort));
    
    // Cooling
    const matchesCooling = filters.cooling.length === 0 || 
      filters.cooling.includes(gpu.cooling);
    
    // External Power
    const matchesExternalPower = filters.externalPower.length === 0 || 
      filters.externalPower.includes(gpu.externalPower);
    
    return matchesSearch && matchesPrice && matchesManufacturer && matchesRating &&
           matchesMemory && matchesMemoryType && matchesCoreClock &&
           matchesBoostClock && matchesInterface &&
           matchesFrameSync && matchesLength && matchesTdp &&
           matchesHdmiPorts && matchesDisplayPortPorts &&
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
      priceRange: { min: 99, max: 2500 },
      manufacturers: [],
      rating: null,
      memory: [],
      memoryType: [],
      coreClock: { min: 0, max: 3000 },
      boostClock: { min: 0, max: 3500 },
      interface: [],
      frameSync: [],
      lengthMM: { min: 0, max: 400 },
      tdp: { min: 0, max: 600 },
      hdmiPorts: [],
      displayPortPorts: [],
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
                  min="99"
                  max="2500"
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

            {/* Memory Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Memory
              </h3>
              <div className="space-y-2">
                {[4, 6, 8, 10, 11, 12, 16, 20, 24].map(memory => (
                  <label key={memory} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.memory.includes(memory)}
                      onChange={() => handleCheckboxToggle('memory', memory)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{memory}GB</span>
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
                {['PCIe 5.0', 'PCIe 4.0', 'PCIe 3.0'].map(interfaceType => (
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
                  value={filters.lengthMM.max}
                  onChange={(e) => handleFilterChange('lengthMM', { ...filters.lengthMM, max: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm" style={{ color: colors.jet }}>
                  <span>{filters.lengthMM.min} mm</span>
                  <span>{filters.lengthMM.max} mm</span>
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

            {/* HDMI Ports Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                HDMI Ports
              </h3>
              <div className="space-y-2">
                {[0, 1, 2, 3].map(ports => (
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

            {/* DisplayPort Ports Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                DisplayPort Ports
              </h3>
              <div className="space-y-2">
                {[1, 2, 3, 4].map(ports => (
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
                      backgroundColor: 
                        (gpu.manufacturer === 'ASUS' || gpu.manufacturer === 'Asus') ? '#1e3a8a' :
                        (gpu.manufacturer === 'MSI') ? '#ed1c24' :
                        (gpu.manufacturer === 'Gigabyte') ? '#ff6600' :
                        (gpu.manufacturer === 'Zotac') ? '#000000' :
                        (gpu.manufacturer === 'Sapphire') ? '#0066cc' :
                        (gpu.manufacturer === 'PowerColor') ? '#dc2626' :
                        (gpu.manufacturer === 'XFX') ? '#7c3aed' :
                        (gpu.manufacturer === 'EVGA') ? '#059669' :
                        (gpu.manufacturer === 'PNY') ? '#fbbf24' :
                        (gpu.manufacturer === 'Palit') ? '#3b82f6' :
                        gpu.brand === 'NVIDIA' ? '#76B900' : 
                        gpu.brand === 'AMD' ? '#ED1C24' : '#0071C5',
                      color: 'white'
                    }}
                  >
                    {gpu.manufacturer || gpu.brand}
                  </span>
                  {selectedGPU?.id === gpu.id && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>

                {/* GPU Image */}
                <div className="flex justify-center mb-4 h-48 items-center">
                  {getGPUImage(gpu.manufacturer, gpu.model) ? (
                    <img 
                      src={getGPUImage(gpu.manufacturer, gpu.model)} 
                      alt={gpu.name}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="text-center text-gray-400"
                    style={{ display: getGPUImage(gpu.manufacturer, gpu.model) ? 'none' : 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}
                  >
                    <FaMicrochip size={64} style={{ color: colors.platinum, marginBottom: '8px' }} />
                    <span className="text-sm">Image not found</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                  {gpu.name}
                </h3>

                {/* Feature Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {(gpu.chipset || gpu.architecture) && (
                    <span 
                      className="px-2 py-1 rounded text-xs font-semibold"
                      style={{ 
                        backgroundColor: colors.platinum,
                        color: colors.jet
                      }}
                    >
                      {gpu.chipset || gpu.architecture}
                    </span>
                  )}
                  {gpu.cooling && (
                    <span 
                      className="px-2 py-1 rounded text-xs font-semibold"
                      style={{ 
                        backgroundColor: '#3b82f6',
                        color: 'white'
                      }}
                    >
                      {gpu.cooling}
                    </span>
                  )}
                  {gpu.rgb && (
                    <span 
                      className="px-2 py-1 rounded text-xs font-semibold"
                      style={{ 
                        backgroundColor: '#ec4899',
                        color: 'white'
                      }}
                    >
                      RGB
                    </span>
                  )}
                  {gpu.rayTracing && (
                    <span 
                      className="px-2 py-1 rounded text-xs font-semibold"
                      style={{ 
                        backgroundColor: '#10b981',
                        color: 'white'
                      }}
                    >
                      Ray Tracing
                    </span>
                  )}
                  {gpu.dlssOrFsr && (
                    <span 
                      className="px-2 py-1 rounded text-xs font-semibold"
                      style={{ 
                        backgroundColor: '#8b5cf6',
                        color: 'white'
                      }}
                    >
                      DLSS/FSR
                    </span>
                  )}
                  {gpu.interface && (
                    <span 
                      className="px-2 py-1 rounded text-xs font-semibold"
                      style={{ 
                        backgroundColor: colors.mainYellow,
                        color: 'white'
                      }}
                    >
                      {gpu.interface}
                    </span>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  {gpu.manufacturer && (
                    <div className="flex justify-between text-sm">
                      <span style={{ color: colors.jet }}>Manufacturer:</span>
                      <span className="font-semibold" style={{ color: colors.mainBlack }}>{gpu.manufacturer}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Memory:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{gpu.memory}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Boost Clock:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{gpu.boostClockMHz} MHz</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>TDP:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{gpu.tdp}</span>
                  </div>
                  {gpu.rating && (
                    <div className="flex justify-between text-sm">
                      <span style={{ color: colors.jet }}>Rating:</span>
                      <span className="font-semibold" style={{ color: colors.mainYellow }}>
                        ⭐ {gpu.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
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
