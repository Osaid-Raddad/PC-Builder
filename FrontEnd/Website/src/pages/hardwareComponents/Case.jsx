import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuild } from '../../context/BuildContext';
import Navbar from '../../components/user/navbar/Navbar.jsx';
import Footer from '../../components/user/footer/Footer.jsx';
import BounceCard from '../../components/animations/BounceCard/BounceCard';
import colors from '../../config/colors';
import { FaDesktop } from 'react-icons/fa';
import { FiArrowLeft, FiSearch } from 'react-icons/fi';
import casesData from '../../data/components/cases.json';

const Case = () => {
  const navigate = useNavigate();
  const { addComponent } = useBuild();
  const [selectedCase, setSelectedCase] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [animationKey, setAnimationKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 500 },
    manufacturers: [],
    rating: null,
    type: [],
    color: [],
    powerSupply: null,
    sidePanel: [],
    powerSupplyShroud: null,
    frontPanelUSB: [],
    motherboardFormFactor: [],
    supportedRadiatorSizes: [],
    externalVolume: { min: 0, max: 100 },
    external525Bays: [],
    external35Bays: [],
    internal35Bays: [],
    internal25Bays: [],
    fullHeightExpansionSlots: [],
    halfHeightExpansionSlots: [],
    fullHeightRiserExpansionSlots: [],
    maximumVideoCardLength: { min: 0, max: 500 }
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const caseList = casesData.cases.map(caseItem => ({
    ...caseItem,
    name: `${caseItem.brand} ${caseItem.model}`, // Combine brand and model for display
    type: 'Mid Tower'
  }));
  
  console.log('Case List loaded:', caseList.length, 'items');

  const filteredCases = caseList.filter(caseItem => {
    // Search term
    const matchesSearch = searchTerm === '' || 
      caseItem.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      caseItem.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Price range
    const matchesPrice = caseItem.price >= filters.priceRange.min && caseItem.price <= filters.priceRange.max;
    
    // Manufacturers
    const matchesManufacturer = filters.manufacturers.length === 0 || 
      filters.manufacturers.includes(caseItem.brand);
    
    // Rating
    const matchesRating = filters.rating === null || 
      (caseItem.rating && caseItem.rating >= filters.rating);
    
    // Type
    const matchesType = filters.type.length === 0 || 
      !caseItem.type ||
      filters.type.includes(caseItem.type);
    
    // Color
    const matchesColor = filters.color.length === 0 || 
      !caseItem.color ||
      filters.color.includes(caseItem.color);
    
    // Power Supply Included
    const matchesPowerSupply = filters.powerSupply === null || 
      !caseItem.hasOwnProperty('powerSupplyIncluded') ||
      caseItem.powerSupplyIncluded === filters.powerSupply;
    
    // Side Panel
    const matchesSidePanel = filters.sidePanel.length === 0 || 
      !caseItem.sidePanel ||
      filters.sidePanel.includes(caseItem.sidePanel);
    
    // PSU Shroud
    const matchesPsuShroud = filters.powerSupplyShroud === null || 
      !caseItem.hasOwnProperty('powerSupplyShroud') ||
      caseItem.powerSupplyShroud === filters.powerSupplyShroud;
    
    // Front Panel USB
    const matchesFrontPanelUsb = filters.frontPanelUSB.length === 0 || 
      !caseItem.frontPanelUSB ||
      filters.frontPanelUSB.some(usb => 
        Array.isArray(caseItem.frontPanelUSB) ? caseItem.frontPanelUSB.includes(usb) : caseItem.frontPanelUSB === usb
      );
    
    // Motherboard Form Factor
    const matchesMoboFormFactor = filters.motherboardFormFactor.length === 0 || 
      !caseItem.motherboardFormFactor ||
      filters.motherboardFormFactor.some(ff => 
        Array.isArray(caseItem.motherboardFormFactor) ? caseItem.motherboardFormFactor.includes(ff) : caseItem.motherboardFormFactor === ff
      );
    
    // Radiator Sizes
    const matchesRadiatorSizes = filters.supportedRadiatorSizes.length === 0 || 
      !caseItem.supportedRadiatorSizes ||
      filters.supportedRadiatorSizes.some(size => 
        Array.isArray(caseItem.supportedRadiatorSizes) ? caseItem.supportedRadiatorSizes.includes(size) : caseItem.supportedRadiatorSizes === size
      );
    
    // External Volume
    const matchesExternalVolume = !caseItem.externalVolume || 
      (caseItem.externalVolume >= filters.externalVolume.min && 
       caseItem.externalVolume <= filters.externalVolume.max);
    
    // Bay filters
    const matchesExternal525 = filters.external525Bays.length === 0 || 
      !caseItem.external525Bays ||
      filters.external525Bays.includes(caseItem.external525Bays.toString());
    
    const matchesExternal35 = filters.external35Bays.length === 0 || 
      !caseItem.external35Bays ||
      filters.external35Bays.includes(caseItem.external35Bays.toString());
    
    const matchesInternal35 = filters.internal35Bays.length === 0 || 
      !caseItem.internal35Bays ||
      filters.internal35Bays.includes(caseItem.internal35Bays.toString());
    
    const matchesInternal25 = filters.internal25Bays.length === 0 || 
      !caseItem.internal25Bays ||
      filters.internal25Bays.includes(caseItem.internal25Bays.toString());
    
    // Expansion Slot filters
    const matchesFullHeight = filters.fullHeightExpansionSlots.length === 0 || 
      !caseItem.fullHeightExpansionSlots ||
      filters.fullHeightExpansionSlots.includes(caseItem.fullHeightExpansionSlots.toString());
    
    const matchesHalfHeight = filters.halfHeightExpansionSlots.length === 0 || 
      !caseItem.halfHeightExpansionSlots ||
      filters.halfHeightExpansionSlots.includes(caseItem.halfHeightExpansionSlots.toString());
    
    const matchesFullHeightRiser = filters.fullHeightRiserExpansionSlots.length === 0 || 
      !caseItem.fullHeightRiserExpansionSlots ||
      filters.fullHeightRiserExpansionSlots.includes(caseItem.fullHeightRiserExpansionSlots.toString());
    
    // Maximum Video Card Length
    const matchesMaxGpuLength = !caseItem.maximumVideoCardLength || 
      (caseItem.maximumVideoCardLength >= filters.maximumVideoCardLength.min && 
       caseItem.maximumVideoCardLength <= filters.maximumVideoCardLength.max);
    
    return matchesSearch && matchesPrice && matchesManufacturer && matchesRating &&
           matchesType && matchesColor && matchesPowerSupply && matchesSidePanel &&
           matchesPsuShroud && matchesFrontPanelUsb && matchesMoboFormFactor && matchesRadiatorSizes &&
           matchesExternalVolume && matchesExternal525 && matchesExternal35 && matchesInternal35 &&
           matchesInternal25 && matchesFullHeight && matchesHalfHeight && matchesFullHeightRiser &&
           matchesMaxGpuLength;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCases = filteredCases.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCases.length / itemsPerPage);

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
      color: [],
      powerSupply: null,
      sidePanel: [],
      powerSupplyShroud: null,
      frontPanelUSB: [],
      motherboardFormFactor: [],
      supportedRadiatorSizes: [],
      externalVolume: { min: 0, max: 100 },
      external525Bays: [],
      external35Bays: [],
      internal35Bays: [],
      internal25Bays: [],
      fullHeightExpansionSlots: [],
      halfHeightExpansionSlots: [],
      fullHeightRiserExpansionSlots: [],
      maximumVideoCardLength: { min: 0, max: 500 }
    });
  };

  const handleSelectCase = (caseItem) => {
    setSelectedCase(caseItem);
    console.log('Selected Case:', caseItem);
  };

  const handleConfirm = () => {
    if (selectedCase) {
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
            <FaDesktop size={32} style={{ color: colors.mainYellow }} />
            <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
              Choose Case
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
                {['Lian Li', 'NZXT', 'Corsair', 'Fractal Design', 'Phanteks', 'be quiet!', 'Cooler Master', 'Thermaltake'].map(manufacturer => (
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
                {['Full Tower', 'Mid Tower', 'Mini Tower', 'Desktop', 'HTPC'].map(type => (
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

            {/* Color Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Color
              </h3>
              <div className="space-y-2">
                {['Black', 'White', 'Silver', 'Gray', 'RGB', 'Red', 'Blue'].map(color => (
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

            {/* Power Supply Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Power Supply
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="powerSupply"
                    checked={filters.powerSupply === 'Included'}
                    onChange={() => handleFilterChange('powerSupply', 'Included')}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>Included</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="powerSupply"
                    checked={filters.powerSupply === 'Not Included'}
                    onChange={() => handleFilterChange('powerSupply', 'Not Included')}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>Not Included</span>
                </label>
              </div>
            </div>

            {/* Side Panel Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Side Panel
              </h3>
              <div className="space-y-2">
                {['Tempered Glass', 'Acrylic', 'Mesh', 'Solid', 'None'].map(panel => (
                  <label key={panel} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.sidePanel.includes(panel)}
                      onChange={() => handleCheckboxToggle('sidePanel', panel)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{panel}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Power Supply Shroud Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Power Supply Shroud
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="powerSupplyShroud"
                    checked={filters.powerSupplyShroud === true}
                    onChange={() => handleFilterChange('powerSupplyShroud', true)}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="powerSupplyShroud"
                    checked={filters.powerSupplyShroud === false}
                    onChange={() => handleFilterChange('powerSupplyShroud', false)}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>No</span>
                </label>
              </div>
            </div>

            {/* Front Panel USB Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Front Panel USB
              </h3>
              <div className="space-y-2">
                {['USB 3.2 Gen 2 Type-C', 'USB 3.2 Gen 2 Type-A', 'USB 3.2 Gen 1 Type-A', 'USB 2.0'].map(usb => (
                  <label key={usb} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.frontPanelUSB.includes(usb)}
                      onChange={() => handleCheckboxToggle('frontPanelUSB', usb)}
                      className="cursor-pointer"
                    />
                    <span className="text-xs" style={{ color: colors.jet }}>{usb}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Motherboard Form Factor Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Motherboard Form Factor
              </h3>
              <div className="space-y-2">
                {['E-ATX', 'ATX', 'Micro-ATX', 'Mini-ITX', 'Mini-DTX'].map(formFactor => (
                  <label key={formFactor} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.motherboardFormFactor.includes(formFactor)}
                      onChange={() => handleCheckboxToggle('motherboardFormFactor', formFactor)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{formFactor}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Supported Radiator Sizes Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Supported Radiator Sizes
              </h3>
              <div className="space-y-2">
                {['120mm', '140mm', '240mm', '280mm', '360mm', '420mm'].map(size => (
                  <label key={size} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.supportedRadiatorSizes.includes(size)}
                      onChange={() => handleCheckboxToggle('supportedRadiatorSizes', size)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{size}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* External Volume Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                External Volume
              </h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.externalVolume.max}
                  onChange={(e) => handleFilterChange('externalVolume', { ...filters.externalVolume, max: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm" style={{ color: colors.jet }}>
                  <span>{filters.externalVolume.min} L</span>
                  <span>{filters.externalVolume.max} L</span>
                </div>
              </div>
            </div>

            {/* External 5.25" Bays Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                External 5.25" Bays
              </h3>
              <div className="space-y-2">
                {['0', '1', '2', '3', '4+'].map(bays => (
                  <label key={bays} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.external525Bays.includes(bays)}
                      onChange={() => handleCheckboxToggle('external525Bays', bays)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{bays}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* External 3.5" Bays Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                External 3.5" Bays
              </h3>
              <div className="space-y-2">
                {['0', '1', '2', '3+'].map(bays => (
                  <label key={bays} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.external35Bays.includes(bays)}
                      onChange={() => handleCheckboxToggle('external35Bays', bays)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{bays}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Internal 3.5" Bays Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Internal 3.5" Bays
              </h3>
              <div className="space-y-2">
                {['0', '1', '2', '3', '4', '5+'].map(bays => (
                  <label key={bays} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.internal35Bays.includes(bays)}
                      onChange={() => handleCheckboxToggle('internal35Bays', bays)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{bays}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Internal 2.5" Bays Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Internal 2.5" Bays
              </h3>
              <div className="space-y-2">
                {['0', '1', '2', '3', '4', '5+'].map(bays => (
                  <label key={bays} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.internal25Bays.includes(bays)}
                      onChange={() => handleCheckboxToggle('internal25Bays', bays)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{bays}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Full-Height Expansion Slots Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Full-Height Expansion Slots
              </h3>
              <div className="space-y-2">
                {['0', '1', '2', '3', '4', '5', '6', '7+'].map(slots => (
                  <label key={slots} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.fullHeightExpansionSlots.includes(slots)}
                      onChange={() => handleCheckboxToggle('fullHeightExpansionSlots', slots)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{slots}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Half-Height Expansion Slots Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Half-Height Expansion Slots
              </h3>
              <div className="space-y-2">
                {['0', '1', '2', '3+'].map(slots => (
                  <label key={slots} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.halfHeightExpansionSlots.includes(slots)}
                      onChange={() => handleCheckboxToggle('halfHeightExpansionSlots', slots)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{slots}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Full-Height Riser Expansion Slots Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Full-Height Riser Expansion Slots
              </h3>
              <div className="space-y-2">
                {['0', '1', '2', '3+'].map(slots => (
                  <label key={slots} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.fullHeightRiserExpansionSlots.includes(slots)}
                      onChange={() => handleCheckboxToggle('fullHeightRiserExpansionSlots', slots)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{slots}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Maximum Video Card Length Filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Maximum Video Card Length
              </h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={filters.maximumVideoCardLength.max}
                  onChange={(e) => handleFilterChange('maximumVideoCardLength', { ...filters.maximumVideoCardLength, max: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm" style={{ color: colors.jet }}>
                  <span>{filters.maximumVideoCardLength.min} mm</span>
                  <span>{filters.maximumVideoCardLength.max} mm</span>
                </div>
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
                  placeholder="Search cases..."
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
                Showing {filteredCases.length} of {caseList.length} cases
              </p>
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
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedCase(null)}
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
          {currentCases.map((caseItem, index) => (
            <BounceCard
              key={`${caseItem.id}-${animationKey}`}
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

                <div className="pt-4 border-t mb-4" style={{ borderColor: colors.platinum }}>
                  <p className="text-2xl font-bold text-center" style={{ color: colors.mainYellow }}>
                    ${caseItem.price.toFixed(2)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addComponent('case', caseItem);
                      navigate('/builder');
                    }}
                    className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer"
                    style={{
                      backgroundColor: selectedCase?.id === caseItem.id ? colors.mainYellow : 'white',
                      color: selectedCase?.id === caseItem.id ? 'white' : colors.mainYellow,
                      border: `2px solid ${colors.mainYellow}`
                    }}
                  >
                    {selectedCase?.id === caseItem.id ? 'Selected' : 'Select'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/case/${caseItem.id}`);
                    }}
                    className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer"
                    style={{
                      backgroundColor: selectedCase?.id === caseItem.id ? 'white' : colors.mainYellow,
                      color: selectedCase?.id === caseItem.id ? colors.mainYellow : 'white',
                      border: selectedCase?.id === caseItem.id ? `2px solid ${colors.mainYellow}` : 'none'
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
            {filteredCases.length === 0 && (
              <div className="text-center py-12">
                <FaDesktop size={64} style={{ color: colors.platinum }} className="mx-auto mb-4" />
                <p className="text-2xl font-bold mb-2" style={{ color: colors.mainBlack }}>No cases found</p>
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

export default Case;
