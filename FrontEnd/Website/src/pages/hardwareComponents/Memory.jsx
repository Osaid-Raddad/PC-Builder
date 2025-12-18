import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/navbar/Navbar.jsx';
import Footer from '../../components/user/footer/Footer.jsx';
import BounceCard from '../../components/animations/BounceCard/BounceCard';
import colors from '../../config/colors';
import { FaMemory } from 'react-icons/fa';
import { FiArrowLeft, FiSearch } from 'react-icons/fi';

const Memory = () => {
  const navigate = useNavigate();
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [animationKey, setAnimationKey] = useState(0);
  
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 500 },
    manufacturers: [],
    rating: null,
    formFactor: [],
    type: [],
    speed: [],
    modules: [],
    color: [],
    firstWordLatency: { min: 0, max: 20 },
    casLatency: [],
    voltage: [],
    timing: [],
    eccRegistered: null,
    heatSpreader: null
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const memoryList = [
    { id: 1, name: 'Corsair Vengeance RGB DDR5', brand: 'Corsair', capacity: '32GB (2x16GB)', speed: 'DDR5-6000', price: 149.99 },
    { id: 2, name: 'G.Skill Trident Z5 RGB', brand: 'G.Skill', capacity: '32GB (2x16GB)', speed: 'DDR5-6400', price: 169.99 },
    { id: 3, name: 'Kingston Fury Beast DDR5', brand: 'Kingston', capacity: '32GB (2x16GB)', speed: 'DDR5-5600', price: 129.99 },
    { id: 4, name: 'Corsair Dominator Platinum RGB', brand: 'Corsair', capacity: '64GB (2x32GB)', speed: 'DDR5-6000', price: 289.99 },
    { id: 5, name: 'Crucial DDR5', brand: 'Crucial', capacity: '32GB (2x16GB)', speed: 'DDR5-5200', price: 109.99 },
    { id: 6, name: 'G.Skill Ripjaws S5', brand: 'G.Skill', capacity: '32GB (2x16GB)', speed: 'DDR5-6000', price: 139.99 },
  ];

  const filteredMemory = memoryList.filter(mem => {
    // Search term
    const matchesSearch = searchTerm === '' || 
      mem.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      mem.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Price range
    const matchesPrice = mem.price >= filters.priceRange.min && mem.price <= filters.priceRange.max;
    
    // Manufacturers
    const matchesManufacturer = filters.manufacturers.length === 0 || 
      filters.manufacturers.includes(mem.brand);
    
    // Rating
    const matchesRating = filters.rating === null || 
      (mem.rating && mem.rating >= filters.rating);
    
    // Form Factor
    const matchesFormFactor = filters.formFactor.length === 0 || 
      !mem.formFactor ||
      filters.formFactor.includes(mem.formFactor);
    
    // Type
    const matchesType = filters.type.length === 0 || 
      !mem.type ||
      filters.type.includes(mem.type);
    
    // Speed
    const matchesSpeed = filters.speed.length === 0 || 
      !mem.speed ||
      filters.speed.includes(mem.speed);
    
    // Modules
    const matchesModules = filters.modules.length === 0 || 
      !mem.modules ||
      filters.modules.includes(mem.modules);
    
    // Color
    const matchesColor = filters.color.length === 0 || 
      !mem.color ||
      filters.color.includes(mem.color);
    
    // First Word Latency
    const matchesFirstWordLatency = !mem.firstWordLatency || 
      (mem.firstWordLatency >= filters.firstWordLatency.min && 
       mem.firstWordLatency <= filters.firstWordLatency.max);
    
    // CAS Latency
    const matchesCasLatency = filters.casLatency.length === 0 || 
      !mem.casLatency ||
      filters.casLatency.includes(mem.casLatency);
    
    // Voltage
    const matchesVoltage = filters.voltage.length === 0 || 
      !mem.voltage ||
      filters.voltage.includes(mem.voltage);
    
    // Timing
    const matchesTiming = filters.timing.length === 0 || 
      !mem.timing ||
      filters.timing.includes(mem.timing);
    
    // ECC / Registered
    const matchesEccRegistered = filters.eccRegistered === null || 
      !mem.eccRegistered ||
      mem.eccRegistered === filters.eccRegistered;
    
    // Heat Spreader
    const matchesHeatSpreader = filters.heatSpreader === null || 
      !mem.hasOwnProperty('heatSpreader') ||
      mem.heatSpreader === filters.heatSpreader;
    
    return matchesSearch && matchesPrice && matchesManufacturer && matchesRating &&
           matchesFormFactor && matchesType && matchesSpeed && matchesModules &&
           matchesColor && matchesFirstWordLatency && matchesCasLatency && matchesVoltage &&
           matchesTiming && matchesEccRegistered && matchesHeatSpreader;
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
      priceRange: { min: 0, max: 500 },
      manufacturers: [],
      rating: null,
      formFactor: [],
      type: [],
      speed: [],
      modules: [],
      color: [],
      firstWordLatency: { min: 0, max: 20 },
      casLatency: [],
      voltage: [],
      timing: [],
      eccRegistered: null,
      heatSpreader: null
    });
  };

  const handleSelectMemory = (memory) => {
    setSelectedMemory(memory);
    console.log('Selected Memory:', memory);
  };

  const handleConfirm = () => {
    if (selectedMemory) {
      navigate('/builder');
    }
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
            <FaMemory size={32} style={{ color: colors.mainYellow }} />
            <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
              Choose Memory (RAM)
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
                  max="500"
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
                {['Corsair', 'G.Skill', 'Kingston', 'Crucial', 'Team Group', 'ADATA'].map(manufacturer => (
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

            {/* Form Factor Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Form Factor
              </h3>
              <div className="space-y-2">
                {['DIMM 288-pin', 'SODIMM 260-pin', 'DIMM 240-pin', 'SODIMM 204-pin'].map(formFactor => (
                  <label key={formFactor} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.formFactor.includes(formFactor)}
                      onChange={() => handleCheckboxToggle('formFactor', formFactor)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{formFactor}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Type
              </h3>
              <div className="space-y-2">
                {['DDR5', 'DDR4', 'DDR3'].map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.type.includes(type)}
                      onChange={() => handleCheckboxToggle('type', type)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Speed Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Speed
              </h3>
              <div className="space-y-2">
                {['DDR5-6400', 'DDR5-6000', 'DDR5-5600', 'DDR4-3600', 'DDR4-3200'].map(speed => (
                  <label key={speed} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.speed.includes(speed)}
                      onChange={() => handleCheckboxToggle('speed', speed)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{speed}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Modules Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Modules
              </h3>
              <div className="space-y-2">
                {['1 x 16GB', '2 x 8GB', '2 x 16GB', '2 x 32GB', '4 x 8GB', '4 x 16GB'].map(modules => (
                  <label key={modules} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.modules.includes(modules)}
                      onChange={() => handleCheckboxToggle('modules', modules)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{modules}</span>
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

            {/* First Word Latency Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                First Word Latency
              </h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={filters.firstWordLatency.max}
                  onChange={(e) => handleFilterChange('firstWordLatency', { ...filters.firstWordLatency, max: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm" style={{ color: colors.jet }}>
                  <span>{filters.firstWordLatency.min} ns</span>
                  <span>{filters.firstWordLatency.max} ns</span>
                </div>
              </div>
            </div>

            {/* CAS Latency Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                CAS Latency
              </h3>
              <div className="space-y-2">
                {['CL14', 'CL16', 'CL18', 'CL30', 'CL32', 'CL36', 'CL40'].map(cas => (
                  <label key={cas} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.casLatency.includes(cas)}
                      onChange={() => handleCheckboxToggle('casLatency', cas)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{cas}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Voltage Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Voltage
              </h3>
              <div className="space-y-2">
                {['1.1V', '1.2V', '1.35V', '1.5V'].map(voltage => (
                  <label key={voltage} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.voltage.includes(voltage)}
                      onChange={() => handleCheckboxToggle('voltage', voltage)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{voltage}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Timing Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Timing
              </h3>
              <div className="space-y-2">
                {['14-14-14-34', '16-18-18-38', '18-22-22-42', '30-36-36-96', '32-38-38-96'].map(timing => (
                  <label key={timing} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.timing.includes(timing)}
                      onChange={() => handleCheckboxToggle('timing', timing)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{timing}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* ECC / Registered Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                ECC / Registered
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="eccRegistered"
                    checked={filters.eccRegistered === 'ECC'}
                    onChange={() => handleFilterChange('eccRegistered', 'ECC')}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>ECC</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="eccRegistered"
                    checked={filters.eccRegistered === 'Non-ECC'}
                    onChange={() => handleFilterChange('eccRegistered', 'Non-ECC')}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>Non-ECC</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="eccRegistered"
                    checked={filters.eccRegistered === 'Registered'}
                    onChange={() => handleFilterChange('eccRegistered', 'Registered')}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>Registered</span>
                </label>
              </div>
            </div>

            {/* Heat Spreader Filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Heat Spreader
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="heatSpreader"
                    checked={filters.heatSpreader === true}
                    onChange={() => handleFilterChange('heatSpreader', true)}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="heatSpreader"
                    checked={filters.heatSpreader === false}
                    onChange={() => handleFilterChange('heatSpreader', false)}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>No</span>
                </label>
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
                  placeholder="Search memory..."
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
                Showing {filteredMemory.length} of {memoryList.length} memory kits
              </p>
            </div>

            {selectedMemory && (
          <div 
            className="rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center"
            style={{ backgroundColor: colors.mainYellow }}
          >
            <div>
              <p className="text-sm font-semibold text-white">Selected:</p>
              <p className="text-lg font-bold text-white">{selectedMemory.name}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedMemory(null)}
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
          {filteredMemory.map((memory, index) => (
            <BounceCard
              key={memory.id}
              delay={index * 0.1}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all"
              style={{ border: `2px solid ${colors.platinum}` }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = colors.mainYellow}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = colors.platinum}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: colors.mainYellow }}
                  >
                    {memory.brand}
                  </span>
                  {selectedMemory?.id === memory.id && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                  {memory.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Capacity:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{memory.capacity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Speed:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{memory.speed}</span>
                  </div>
                </div>

                <div className="pt-4 border-t mb-4" style={{ borderColor: colors.platinum }}>
                  <p className="text-2xl font-bold text-center" style={{ color: colors.mainYellow }}>
                    ${memory.price.toFixed(2)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectMemory(memory);
                    }}
                    className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer"
                    style={{
                      backgroundColor: selectedMemory?.id === memory.id ? colors.mainYellow : 'white',
                      color: selectedMemory?.id === memory.id ? 'white' : colors.mainYellow,
                      border: `2px solid ${colors.mainYellow}`
                    }}
                  >
                    {selectedMemory?.id === memory.id ? 'Selected' : 'Select'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/memory/${memory.id}`);
                    }}
                    className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer"
                    style={{
                      backgroundColor: selectedMemory?.id === memory.id ? 'white' : colors.mainYellow,
                      color: selectedMemory?.id === memory.id ? colors.mainYellow : 'white',
                      border: selectedMemory?.id === memory.id ? `2px solid ${colors.mainYellow}` : 'none'
                    }}
                  >
                    Details
                  </button>
                </div>
              </div>
            </BounceCard>
          ))}
        </div>

            {filteredMemory.length === 0 && (
              <div className="text-center py-12">
                <FaMemory size={64} style={{ color: colors.platinum }} className="mx-auto mb-4" />
                <p className="text-2xl font-bold mb-2" style={{ color: colors.mainBlack }}>No memory kits found</p>
                <p className="text-lg" style={{ color: colors.jet }}>Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Memory;
