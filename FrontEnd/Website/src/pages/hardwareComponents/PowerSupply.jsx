import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBuild } from '../../context/BuildContext';
import { useCompare } from '../../context/CompareContext';
import toast from 'react-hot-toast';
import Navbar from '../../components/user/navbar/Navbar.jsx';
import Footer from '../../components/user/footer/Footer.jsx';
import BounceCard from '../../components/animations/BounceCard/BounceCard';
import colors from '../../config/colors';
import { FaBolt } from 'react-icons/fa';
import { FiArrowLeft, FiSearch } from 'react-icons/fi';
import powerSuppliesData from '../../data/components/powerSupplies.json';

const PowerSupply = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const source = searchParams.get('source'); // 'builder' or 'comparator'
  const { addComponent } = useBuild();
  const { compareList, addToCompare, isInCompare, removeFromCompare, getCategory } = useCompare();
  const [selectedPSU, setSelectedPSU] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [animationKey, setAnimationKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 500 },
    manufacturers: [],
    rating: null,
    type: [],
    efficiencyRating: [],
    wattage: [],
    length: { min: 0, max: 250 },
    modular: [],
    color: [],
    fanless: null,
    epsAtxConnectors: [],
    pcie16pin12VHPWR: [],
    pcie12pin: [],
    pcie8pin: [],
    pcie6plus2pin: [],
    pcie6pin: [],
    sataConnectors: [],
    molex4pin: []
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const psuList = powerSuppliesData.powerSupplies.map(psu => ({
    ...psu,
    name: `${psu.brand} ${psu.model}`, // Combine brand and model for display
    wattage: `${psu.wattage}W`,
    efficiency: psu.efficiency,
    modular: psu.modular
  }));
  
  console.log('PSU List loaded:', psuList.length, 'items');

  const filteredPSUs = psuList.filter(psu => {
    // Search term
    const matchesSearch = searchTerm === '' || 
      psu.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      psu.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Price range
    const matchesPrice = psu.price >= filters.priceRange.min && psu.price <= filters.priceRange.max;
    
    // Manufacturers
    const matchesManufacturer = filters.manufacturers.length === 0 || 
      filters.manufacturers.includes(psu.brand);
    
    // Rating
    const matchesRating = filters.rating === null || 
      (psu.rating && psu.rating >= filters.rating);
    
    // Type
    const matchesType = filters.type.length === 0 || 
      !psu.type ||
      filters.type.includes(psu.type);
    
    // Efficiency Rating
    const matchesEfficiency = filters.efficiencyRating.length === 0 || 
      !psu.efficiency ||
      filters.efficiencyRating.includes(psu.efficiency);
    
    // Wattage
    const matchesWattage = filters.wattage.length === 0 || 
      !psu.wattage ||
      filters.wattage.includes(psu.wattage);
    
    // Length
    const matchesLength = !psu.length || 
      (psu.length >= filters.length.min && psu.length <= filters.length.max);
    
    // Modular
    const matchesModular = filters.modular.length === 0 || 
      !psu.modular ||
      filters.modular.includes(psu.modular);
    
    // Color
    const matchesColor = filters.color.length === 0 || 
      !psu.color ||
      filters.color.includes(psu.color);
    
    // Fanless
    const matchesFanless = filters.fanless === null || 
      !psu.hasOwnProperty('fanless') ||
      psu.fanless === filters.fanless;
    
    // Connector filters
    const matchesEpsAtx = filters.epsAtxConnectors.length === 0 || 
      !psu.epsAtxConnectors ||
      filters.epsAtxConnectors.includes(psu.epsAtxConnectors);
    
    const matchesPcie16pin = filters.pcie16pin12VHPWR.length === 0 || 
      !psu.pcie16pin12VHPWR ||
      filters.pcie16pin12VHPWR.includes(psu.pcie16pin12VHPWR.toString());
    
    const matchesPcie12pin = filters.pcie12pin.length === 0 || 
      !psu.pcie12pin ||
      filters.pcie12pin.includes(psu.pcie12pin.toString());
    
    const matchesPcie8pin = filters.pcie8pin.length === 0 || 
      !psu.pcie8pin ||
      filters.pcie8pin.includes(psu.pcie8pin.toString());
    
    const matchesPcie6plus2 = filters.pcie6plus2pin.length === 0 || 
      !psu.pcie6plus2pin ||
      filters.pcie6plus2pin.includes(psu.pcie6plus2pin.toString());
    
    const matchesPcie6pin = filters.pcie6pin.length === 0 || 
      !psu.pcie6pin ||
      filters.pcie6pin.includes(psu.pcie6pin.toString());
    
    const matchesSata = filters.sataConnectors.length === 0 || 
      !psu.sataConnectors ||
      filters.sataConnectors.includes(psu.sataConnectors.toString());
    
    const matchesMolex = filters.molex4pin.length === 0 || 
      !psu.molex4pin ||
      filters.molex4pin.includes(psu.molex4pin.toString());
    
    return matchesSearch && matchesPrice && matchesManufacturer && matchesRating &&
           matchesType && matchesEfficiency && matchesWattage && matchesLength &&
           matchesModular && matchesColor && matchesFanless && matchesEpsAtx &&
           matchesPcie16pin && matchesPcie12pin && matchesPcie8pin && matchesPcie6plus2 &&
           matchesPcie6pin && matchesSata && matchesMolex;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPSUs = filteredPSUs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPSUs.length / itemsPerPage);

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
      type: [],
      efficiencyRating: [],
      wattage: [],
      length: { min: 0, max: 250 },
      modular: [],
      color: [],
      fanless: null,
      epsAtxConnectors: [],
      pcie16pin12VHPWR: [],
      pcie12pin: [],
      pcie8pin: [],
      pcie6plus2pin: [],
      pcie6pin: [],
      sataConnectors: [],
      molex4pin: []
    });
  };

  const handleSelectPSU = (psu) => {
    setSelectedPSU(psu);
    console.log('Selected PSU:', psu);
  };

  const handleConfirm = () => {
    if (selectedPSU) {
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
            <FaBolt size={32} style={{ color: colors.mainYellow }} />
            <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
              Choose Power Supply
            </h1>
          </div>
          
          <div className="w-32"></div>
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
                {['Corsair', 'EVGA', 'Seasonic', 'be quiet!', 'Thermaltake', 'Cooler Master', 'Silverstone', 'NZXT'].map(manufacturer => (
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

            {/* Type Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Type
              </h3>
              <div className="space-y-2">
                {['ATX', 'SFX', 'SFX-L', 'TFX', 'Flex ATX'].map(type => (
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

            {/* Efficiency Rating Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Efficiency Rating
              </h3>
              <div className="space-y-2">
                {['80+ Titanium', '80+ Platinum', '80+ Gold', '80+ Silver', '80+ Bronze'].map(efficiency => (
                  <label key={efficiency} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.efficiencyRating.includes(efficiency)}
                      onChange={() => handleCheckboxToggle('efficiencyRating', efficiency)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{efficiency}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Wattage Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Wattage
              </h3>
              <div className="space-y-2">
                {['450W', '500W', '550W', '650W', '750W', '850W', '1000W', '1200W', '1500W+'].map(wattage => (
                  <label key={wattage} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.wattage.includes(wattage)}
                      onChange={() => handleCheckboxToggle('wattage', wattage)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{wattage}</span>
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
                  max="250"
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

            {/* Modular Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Modular
              </h3>
              <div className="space-y-2">
                {['Fully Modular', 'Semi-Modular', 'Non-Modular'].map(modular => (
                  <label key={modular} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.modular.includes(modular)}
                      onChange={() => handleCheckboxToggle('modular', modular)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{modular}</span>
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
                {['Black', 'White', 'Silver', 'Gray', 'RGB'].map(color => (
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

            {/* Fanless Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Fanless
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="fanless"
                    checked={filters.fanless === true}
                    onChange={() => handleFilterChange('fanless', true)}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="fanless"
                    checked={filters.fanless === false}
                    onChange={() => handleFilterChange('fanless', false)}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>No</span>
                </label>
              </div>
            </div>

            {/* EPS/ATX Connectors Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                EPS/ATX Connectors
              </h3>
              <div className="space-y-2">
                {['1 x 4+4-pin', '1 x 8-pin', '2 x 4+4-pin', '2 x 8-pin'].map(connector => (
                  <label key={connector} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.epsAtxConnectors.includes(connector)}
                      onChange={() => handleCheckboxToggle('epsAtxConnectors', connector)}
                      className="cursor-pointer"
                    />
                    <span className="text-xs" style={{ color: colors.jet }}>{connector}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* PCIe 16-pin 12VHPWR Connectors Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                PCIe 16-pin 12VHPWR/12V-2x6
              </h3>
              <div className="space-y-2">
                {['0', '1', '2', '3+'].map(count => (
                  <label key={count} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.pcie16pin12VHPWR.includes(count)}
                      onChange={() => handleCheckboxToggle('pcie16pin12VHPWR', count)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* PCIe 12-pin Connectors Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                PCIe 12-pin Connectors
              </h3>
              <div className="space-y-2">
                {['0', '1', '2', '3+'].map(count => (
                  <label key={count} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.pcie12pin.includes(count)}
                      onChange={() => handleCheckboxToggle('pcie12pin', count)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* PCIe 8-pin Connectors Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                PCIe 8-pin Connectors
              </h3>
              <div className="space-y-2">
                {['0', '1', '2', '3', '4', '5+'].map(count => (
                  <label key={count} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.pcie8pin.includes(count)}
                      onChange={() => handleCheckboxToggle('pcie8pin', count)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* PCIe 6+2-pin Connectors Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                PCIe 6+2-pin Connectors
              </h3>
              <div className="space-y-2">
                {['0', '1', '2', '3', '4', '5+'].map(count => (
                  <label key={count} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.pcie6plus2pin.includes(count)}
                      onChange={() => handleCheckboxToggle('pcie6plus2pin', count)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* PCIe 6-pin Connectors Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                PCIe 6-pin Connectors
              </h3>
              <div className="space-y-2">
                {['0', '1', '2', '3+'].map(count => (
                  <label key={count} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.pcie6pin.includes(count)}
                      onChange={() => handleCheckboxToggle('pcie6pin', count)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* SATA Connectors Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                SATA Connectors
              </h3>
              <div className="space-y-2">
                {['0', '2', '4', '6', '8', '10', '12+'].map(count => (
                  <label key={count} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.sataConnectors.includes(count)}
                      onChange={() => handleCheckboxToggle('sataConnectors', count)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* AMP/Molex 4-pin Connectors Filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                AMP/Molex 4-pin Connectors
              </h3>
              <div className="space-y-2">
                {['0', '1', '2', '3', '4+'].map(count => (
                  <label key={count} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.molex4pin.includes(count)}
                      onChange={() => handleCheckboxToggle('molex4pin', count)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{count}</span>
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
                  placeholder="Search power supplies..."
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
                Showing {filteredPSUs.length} of {psuList.length} power supplies
              </p>
            </div>

            {selectedPSU && (
          <div 
            className="rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center"
            style={{ backgroundColor: colors.mainYellow }}
          >
            <div>
              <p className="text-sm font-semibold text-white">Selected:</p>
              <p className="text-lg font-bold text-white">{selectedPSU.name}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedPSU(null)}
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
          {currentPSUs.map((psu, index) => (
            <BounceCard
              key={`${psu.id}-${animationKey}`}
              delay={index * 0.1}
              animationKey={animationKey}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all"
              style={{ border: `2px solid ${colors.platinum}` }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = colors.mainYellow}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = colors.platinum}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ 
                      backgroundColor: psu.efficiency.includes('Platinum') ? '#9C27B0' : '#FFC107',
                      color: psu.efficiency.includes('Platinum') ? 'white' : 'black'
                    }}
                  >
                    {psu.efficiency}
                  </span>
                  {selectedPSU?.id === psu.id && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                  {psu.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Brand:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{psu.brand}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Wattage:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{psu.wattage}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Modular:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{psu.modular}</span>
                  </div>
                </div>

                <div className="pt-4 border-t mb-4" style={{ borderColor: colors.platinum }}>
                  <p className="text-2xl font-bold text-center" style={{ color: colors.mainYellow }}>
                    ${psu.price.toFixed(2)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-between">
                  {/* Only show action buttons if source exists (from builder or comparator) */}
                  {source && (
                    <>
                      {/* Add to Build button - hide if from comparator */}
                      {source !== 'comparator' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addComponent('psu', psu);
                            navigate('/builder');
                          }}
                          className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer flex-1"
                          style={{
                            backgroundColor: selectedPSU?.id === psu.id ? colors.mainYellow : 'white',
                            color: selectedPSU?.id === psu.id ? 'white' : colors.mainYellow,
                            border: `2px solid ${colors.mainYellow}`
                          }}
                        >
                          {selectedPSU?.id === psu.id ? 'Selected' : 'Select'}
                        </button>
                      )}
                      
                      {/* Compare button - hide if from builder */}
                      {source !== 'builder' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const currentCategory = getCategory();
                            if (currentCategory && currentCategory !== 'psu') {
                              toast.error(`You can only compare Power Supplies together. Clear the ${currentCategory} comparison first.`, { duration: 3000 });
                              return;
                            }
                            if (isInCompare(psu.id)) {
                              removeFromCompare(psu.id);
                            } else {
                              if (compareList.length >= 4) {
                                toast.error('You can compare up to 4 products at once.', { duration: 3000 });
                                return;
                              }
                              addToCompare(psu, 'psu');
                            }
                          }}
                          className="px-3 py-2 rounded-lg font-bold transition-all hover:opacity-90 cursor-pointer"
                          style={{
                            backgroundColor: isInCompare(psu.id) ? colors.mainYellow : 'white',
                            color: isInCompare(psu.id) ? 'white' : colors.mainYellow,
                            border: `2px solid ${colors.mainYellow}`
                          }}
                        >
                          {isInCompare(psu.id) ? '✓' : '+'}
                        </button>
                      )}
                    </>
                  )}
                  
                  {/* Details button - always show */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/powersupply/${psu.id}`);
                    }}
                    className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer flex-1"
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
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                currentPage === 1
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: colors.accent,
                color: colors.mainWhite
              }}
            >
              Previous
            </button>
            <span className="font-semibold" style={{ color: colors.mainBlack }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                currentPage === totalPages
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: colors.accent,
                color: colors.mainWhite
              }}
            >
              Next
            </button>
          </div>
        )}

            {/* Empty State */}
            {filteredPSUs.length === 0 && (
              <div className="text-center py-12">
                <FaBolt size={64} style={{ color: colors.platinum }} className="mx-auto mb-4" />
                <p className="text-2xl font-bold mb-2" style={{ color: colors.mainBlack }}>No power supplies found</p>
                <p className="text-lg" style={{ color: colors.jet }}>Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
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

      <Footer />
    </div>
  );
};

export default PowerSupply;
