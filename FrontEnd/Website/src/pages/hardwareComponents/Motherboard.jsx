import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBuild } from '../../context/BuildContext';
import { useCompare } from '../../context/CompareContext';
import toast from 'react-hot-toast';
import Navbar from '../../components/user/navbar/Navbar.jsx';
import Footer from '../../components/user/footer/Footer.jsx';
import BounceCard from '../../components/animations/BounceCard/BounceCard';
import colors from '../../config/colors';
import { BsMotherboard } from 'react-icons/bs';
import { FiArrowLeft, FiSearch } from 'react-icons/fi';
import motherboardsData from '../../data/components/motherboards.json';

const Motherboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const source = searchParams.get('source'); // 'builder' or 'comparator'
  const { addComponent } = useBuild();
  const { compareList, addToCompare, isInCompare, removeFromCompare, getCategory } = useCompare();
  const [selectedMotherboard, setSelectedMotherboard] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [animationKey, setAnimationKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Filter states
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 1000 },
    manufacturers: [],
    rating: 0,
    socket: [],
    formFactor: [],
    chipset: [],
    memoryMax: { min: 0, max: 256 },
    memoryType: [],
    memorySlots: [],
    color: [],
    sliCrossfire: [],
    pcieX16Slots: [],
    pcieX8Slots: [],
    pcieX4Slots: [],
    pcieX1Slots: [],
    pciSlots: [],
    sata3Ports: [],
    sata6Ports: [],
    m2SlotsB: [],
    m2SlotsE: [],
    msataSlots: [],
    onboardEthernet: [],
    onboardVideo: null,
    usb2Headers: [],
    usb3Gen1Headers: [],
    usb3Gen2Headers: [],
    usb3Gen2x2Headers: [],
    supportsECC: null,
    wirelessNetworking: null,
    backConnectConnectors: null
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const motherboardList = motherboardsData.motherboards.map(mobo => ({
    ...mobo,
    name: `${mobo.brand} ${mobo.model}` // Combine brand and model for display
  }));
  
  console.log('Motherboard List loaded:', motherboardList.length, 'items');

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setAnimationKey(prev => prev + 1);
  };

  const handleCheckboxToggle = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: prev[filterName].includes(value)
        ? prev[filterName].filter(item => item !== value)
        : [...prev[filterName], value]
    }));
    setAnimationKey(prev => prev + 1);
  };

  const resetFilters = () => {
    setFilters({
      priceRange: { min: 0, max: 1000 },
      manufacturers: [],
      rating: 0,
      socket: [],
      formFactor: [],
      chipset: [],
      memoryMax: { min: 0, max: 256 },
      memoryType: [],
      memorySlots: [],
      color: [],
      sliCrossfeaders: [],
      usb3Gen2x2Headers: [],
      supportsECC: null,
      wirelessNetworking: null,
      backConnectConnectors: null
    });
    setAnimationKey(prev => prev + 1);
  };

  const filteredMotherboards = motherboardList.filter(mb => {
    // Search term
    const matchesSearch = searchTerm === '' ||
      mb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mb.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (mb.chipset && mb.chipset.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Price range
    const matchesPrice = mb.price >= filters.priceRange.min && mb.price <= filters.priceRange.max;
    
    // Manufacturers
    const matchesManufacturer = filters.manufacturers.length === 0 || 
      filters.manufacturers.includes(mb.brand);
    
    // Rating (optional)
    const matchesRating = filters.rating === null ||
      !filters.rating ||
      (mb.rating && mb.rating >= filters.rating);
    
    // Socket
    const matchesSocket = filters.socket.length === 0 || 
      !mb.socket ||
      filters.socket.includes(mb.socket);
    
    // Form Factor
    const matchesFormFactor = filters.formFactor.length === 0 || 
      !mb.formFactor ||
      filters.formFactor.includes(mb.formFactor);
    
    // Chipset
    const matchesChipset = filters.chipset.length === 0 || 
      !mb.chipset ||
      filters.chipset.includes(mb.chipset);
    
    // Memory Max
    const matchesMemoryMax = !mb.memoryMaxGB || 
      (mb.memoryMaxGB >= filters.memoryMax.min && 
       mb.memoryMaxGB <= filters.memoryMax.max);
    
    // Memory Type
    const matchesMemoryType = filters.memoryType.length === 0 || 
      !mb.memoryType ||
      filters.memoryType.includes(mb.memoryType);
    
    // Memory Slots
    const matchesMemorySlots = filters.memorySlots.length === 0 || 
      !mb.memorySlots ||
      filters.memorySlots.includes(mb.memorySlots.toString());
    
    // Color
    const matchesColor = filters.color.length === 0 || 
      !mb.color ||
      filters.color.includes(mb.color);
    
    // SLI/Crossfire
    const matchesSliCrossfire = filters.sliCrossfire.length === 0 || 
      !mb.sliCrossfire ||
      filters.sliCrossfire.includes(mb.sliCrossfire);
    
    // PCIe x16 Slots
    const matchesPcieX16 = filters.pcieX16Slots.length === 0 || 
      mb.pcieX16Slots === undefined ||
      filters.pcieX16Slots.includes(mb.pcieX16Slots.toString());
    
    // PCIe x8 Slots
    const matchesPcieX8 = filters.pcieX8Slots.length === 0 || 
      mb.pcieX8Slots === undefined ||
      filters.pcieX8Slots.includes(mb.pcieX8Slots.toString());
    
    // PCIe x4 Slots
    const matchesPcieX4 = filters.pcieX4Slots.length === 0 || 
      mb.pcieX4Slots === undefined ||
      filters.pcieX4Slots.includes(mb.pcieX4Slots.toString());
    
    // PCIe x1 Slots
    const matchesPcieX1 = filters.pcieX1Slots.length === 0 || 
      mb.pcieX1Slots === undefined ||
      filters.pcieX1Slots.includes(mb.pcieX1Slots.toString());
    
    // PCI Slots
    const matchesPciSlots = filters.pciSlots.length === 0 || 
      mb.pciSlots === undefined ||
      filters.pciSlots.includes(mb.pciSlots.toString());
    
    // SATA 3 Gb/s Ports
    const matchesSata3 = filters.sata3Ports.length === 0 || 
      mb.sata3GbsPorts === undefined ||
      filters.sata3Ports.includes(mb.sata3GbsPorts.toString());
    
    // SATA 6 Gb/s Ports
    const matchesSata6 = filters.sata6Ports.length === 0 || 
      mb.sata6GbsPorts === undefined ||
      filters.sata6Ports.includes(mb.sata6GbsPorts.toString());
    
    // M.2 Slots (B Key)
    const matchesM2B = filters.m2SlotsB.length === 0 || 
      mb.m2SlotsBKey === undefined ||
      filters.m2SlotsB.includes(mb.m2SlotsBKey.toString());
    
    // M.2 Slots (E Key)
    const matchesM2E = filters.m2SlotsE.length === 0 || 
      mb.m2SlotsEKey === undefined ||
      filters.m2SlotsE.includes(mb.m2SlotsEKey.toString());
    
    // mSATA Slots
    const matchesMsata = filters.msataSlots.length === 0 || 
      mb.msataSlots === undefined ||
      filters.msataSlots.includes(mb.msataSlots.toString());
    
    // Onboard Ethernet
    const matchesEthernet = filters.onboardEthernet.length === 0 || 
      !mb.onboardEthernet ||
      filters.onboardEthernet.includes(mb.onboardEthernet);
    
    // Onboard Video
    const matchesOnboardVideo = filters.onboardVideo === null || 
      !mb.hasOwnProperty('onboardVideo') ||
      mb.onboardVideo === filters.onboardVideo;
    
    // USB 2.0 Headers
    const matchesUsb2Headers = filters.usb2Headers.length === 0 || 
      mb.usb2Headers === undefined ||
      filters.usb2Headers.includes(mb.usb2Headers.toString());
    
    // USB 3.2 Gen 1 Headers
    const matchesUsb3Gen1Headers = filters.usb3Gen1Headers.length === 0 || 
      mb.usb3Gen1Headers === undefined ||
      filters.usb3Gen1Headers.includes(mb.usb3Gen1Headers.toString());
    
    // USB 3.2 Gen 2 Headers
    const matchesUsb3Gen2Headers = filters.usb3Gen2Headers.length === 0 || 
      mb.usb3Gen2Headers === undefined ||
      filters.usb3Gen2Headers.includes(mb.usb3Gen2Headers.toString());
    
    // USB 3.2 Gen 2x2 Headers
    const matchesUsb3Gen2x2Headers = filters.usb3Gen2x2Headers.length === 0 || 
      mb.usb3Gen2x2Headers === undefined ||
      filters.usb3Gen2x2Headers.includes(mb.usb3Gen2x2Headers.toString());
    
    // Supports ECC
    const matchesSupportsECC = filters.supportsECC === null || 
      !mb.hasOwnProperty('supportsECC') ||
      mb.supportsECC === filters.supportsECC;
    
    // Wireless Networking
    const matchesWirelessNetworking = filters.wirelessNetworking === null || 
      !mb.hasOwnProperty('wirelessNetworking') ||
      mb.wirelessNetworking === filters.wirelessNetworking;
    
    // Back Connect Connectors
    const matchesBackConnectConnectors = filters.backConnectConnectors === null || 
      !mb.hasOwnProperty('backConnectConnectors') ||
      mb.backConnectConnectors === filters.backConnectConnectors;
    
    return matchesSearch && matchesPrice && matchesManufacturer && matchesRating &&
           matchesSocket && matchesFormFactor && matchesChipset && matchesMemoryMax &&
           matchesMemoryType && matchesMemorySlots && matchesColor && matchesSliCrossfire &&
           matchesPcieX16 && matchesPcieX8 && matchesPcieX4 && matchesPcieX1 && matchesPciSlots &&
           matchesSata3 && matchesSata6 && matchesM2B && matchesM2E && matchesMsata &&
           matchesEthernet && matchesOnboardVideo && matchesUsb2Headers && matchesUsb3Gen1Headers &&
           matchesUsb3Gen2Headers && matchesUsb3Gen2x2Headers && matchesSupportsECC &&
           matchesWirelessNetworking && matchesBackConnectConnectors;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMotherboards = filteredMotherboards.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMotherboards.length / itemsPerPage);

  const handleSelectMotherboard = (motherboard) => {
    setSelectedMotherboard(motherboard);
    console.log('Selected Motherboard:', motherboard);
  };

  const handleConfirm = () => {
    if (selectedMotherboard) {
      navigate('/builder');
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/motherboard/${productId}`);
  };

  const handleSocketFilter = (socket) => {
    setSocketFilter(socket);
    setAnimationKey(prev => prev + 1);
  };

  const handleFormFactorFilter = (formFactor) => {
    setFormFactorFilter(formFactor);
    setAnimationKey(prev => prev + 1);
  };

  const handleBrandFilter = (brand) => {
    setBrandFilter(brand);
    setAnimationKey(prev => prev + 1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setAnimationKey(prev => prev + 1);
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
            <BsMotherboard size={32} style={{ color: colors.mainYellow }} />
            <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
              Choose Motherboard
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
                  max="1000"
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
                {['ASUS', 'MSI', 'Gigabyte', 'ASRock', 'EVGA', 'Biostar'].map(manufacturer => (
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

            {/* Socket / CPU Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Socket / CPU
              </h3>
              <div className="space-y-2">
                {['LGA1700', 'LGA1200', 'AM5', 'AM4', 'LGA1851', 'TR4'].map(socket => (
                  <label key={socket} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.socket.includes(socket)}
                      onChange={() => handleCheckboxToggle('socket', socket)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{socket}</span>
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
                {['ATX', 'Micro-ATX', 'Mini-ITX', 'E-ATX', 'XL-ATX'].map(formFactor => (
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

            {/* Chipset Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Chipset
              </h3>
              <div className="space-y-2">
                {['Z790', 'B760', 'H770', 'X670E', 'B650', 'A620'].map(chipset => (
                  <label key={chipset} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.chipset.includes(chipset)}
                      onChange={() => handleCheckboxToggle('chipset', chipset)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{chipset}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Memory Max Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Memory Max
              </h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="256"
                  step="16"
                  value={filters.memoryMax.max}
                  onChange={(e) => handleFilterChange('memoryMax', { ...filters.memoryMax, max: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm" style={{ color: colors.jet }}>
                  <span>{filters.memoryMax.min} GB</span>
                  <span>{filters.memoryMax.max} GB</span>
                </div>
              </div>
            </div>

            {/* Memory Type Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Memory Type
              </h3>
              <div className="space-y-2">
                {['DDR5', 'DDR4', 'DDR3'].map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.memoryType.includes(type)}
                      onChange={() => handleCheckboxToggle('memoryType', type)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Memory Slots Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Memory Slots
              </h3>
              <div className="space-y-2">
                {['2', '4', '6', '8'].map(slots => (
                  <label key={slots} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.memorySlots.includes(slots)}
                      onChange={() => handleCheckboxToggle('memorySlots', slots)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{slots} Slots</span>
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
                {['Black', 'White', 'Silver', 'Blue', 'Red', 'RGB'].map(color => (
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
                {['SLI', 'CrossFire', 'Both', 'None'].map(option => (
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

            {/* PCIe x16 Slots Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                PCIe x16 Slots
              </h3>
              <div className="space-y-2">
                {['1', '2', '3', '4+'].map(slots => (
                  <label key={slots} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.pcieX16Slots.includes(slots)}
                      onChange={() => handleCheckboxToggle('pcieX16Slots', slots)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{slots}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* PCIe x8 Slots Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                PCIe x8 Slots
              </h3>
              <div className="space-y-2">
                {['0', '1', '2', '3+'].map(slots => (
                  <label key={slots} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.pcieX8Slots.includes(slots)}
                      onChange={() => handleCheckboxToggle('pcieX8Slots', slots)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{slots}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* PCIe x4 Slots Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                PCIe x4 Slots
              </h3>
              <div className="space-y-2">
                {['0', '1', '2', '3+'].map(slots => (
                  <label key={slots} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.pcieX4Slots.includes(slots)}
                      onChange={() => handleCheckboxToggle('pcieX4Slots', slots)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{slots}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* PCIe x1 Slots Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                PCIe x1 Slots
              </h3>
              <div className="space-y-2">
                {['0', '1', '2', '3+'].map(slots => (
                  <label key={slots} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.pcieX1Slots.includes(slots)}
                      onChange={() => handleCheckboxToggle('pcieX1Slots', slots)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{slots}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* PCI Slots Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                PCI Slots
              </h3>
              <div className="space-y-2">
                {['0', '1', '2', '3+'].map(slots => (
                  <label key={slots} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.pciSlots.includes(slots)}
                      onChange={() => handleCheckboxToggle('pciSlots', slots)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{slots}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* SATA 3Gb/s Ports Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                SATA 3Gb/s Ports
              </h3>
              <div className="space-y-2">
                {['0', '2', '4', '6', '8+'].map(ports => (
                  <label key={ports} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.sata3Ports.includes(ports)}
                      onChange={() => handleCheckboxToggle('sata3Ports', ports)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{ports}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* SATA 6Gb/s Ports Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                SATA 6Gb/s Ports
              </h3>
              <div className="space-y-2">
                {['0', '2', '4', '6', '8+'].map(ports => (
                  <label key={ports} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.sata6Ports.includes(ports)}
                      onChange={() => handleCheckboxToggle('sata6Ports', ports)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{ports}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* M.2 Slots (B/M) Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                M.2 Slots (B/M)
              </h3>
              <div className="space-y-2">
                {['0', '1', '2', '3', '4+'].map(slots => (
                  <label key={slots} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.m2SlotsB.includes(slots)}
                      onChange={() => handleCheckboxToggle('m2SlotsB', slots)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{slots}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* M.2 Slots (E) Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                M.2 Slots (E)
              </h3>
              <div className="space-y-2">
                {['0', '1', '2', '3+'].map(slots => (
                  <label key={slots} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.m2SlotsE.includes(slots)}
                      onChange={() => handleCheckboxToggle('m2SlotsE', slots)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{slots}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* mSATA Slots Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                mSATA Slots
              </h3>
              <div className="space-y-2">
                {['0', '1', '2+'].map(slots => (
                  <label key={slots} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.msataSlots.includes(slots)}
                      onChange={() => handleCheckboxToggle('msataSlots', slots)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{slots}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Onboard Ethernet Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Onboard Ethernet
              </h3>
              <div className="space-y-2">
                {['1 Gbps', '2.5 Gbps', '5 Gbps', '10 Gbps'].map(speed => (
                  <label key={speed} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.onboardEthernet.includes(speed)}
                      onChange={() => handleCheckboxToggle('onboardEthernet', speed)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{speed}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Onboard Video Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Onboard Video
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="onboardVideo"
                    checked={filters.onboardVideo === true}
                    onChange={() => handleFilterChange('onboardVideo', true)}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="onboardVideo"
                    checked={filters.onboardVideo === false}
                    onChange={() => handleFilterChange('onboardVideo', false)}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>No</span>
                </label>
              </div>
            </div>

            {/* USB 2.0 Headers Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                USB 2.0 Headers
              </h3>
              <div className="space-y-2">
                {['0', '1', '2', '3', '4+'].map(headers => (
                  <label key={headers} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.usb2Headers.includes(headers)}
                      onChange={() => handleCheckboxToggle('usb2Headers', headers)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{headers}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* USB 3.2 Gen 1 Headers Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                USB 3.2 Gen 1 Headers
              </h3>
              <div className="space-y-2">
                {['0', '1', '2', '3+'].map(headers => (
                  <label key={headers} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.usb3Gen1Headers.includes(headers)}
                      onChange={() => handleCheckboxToggle('usb3Gen1Headers', headers)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{headers}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* USB 3.2 Gen 2 Headers Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                USB 3.2 Gen 2 Headers
              </h3>
              <div className="space-y-2">
                {['0', '1', '2', '3+'].map(headers => (
                  <label key={headers} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.usb3Gen2Headers.includes(headers)}
                      onChange={() => handleCheckboxToggle('usb3Gen2Headers', headers)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{headers}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* USB 3.2 Gen 2x2 Headers Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                USB 3.2 Gen 2x2 Headers
              </h3>
              <div className="space-y-2">
                {['0', '1', '2+'].map(headers => (
                  <label key={headers} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.usb3Gen2x2Headers.includes(headers)}
                      onChange={() => handleCheckboxToggle('usb3Gen2x2Headers', headers)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{headers}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Supports ECC Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Supports ECC
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="supportsECC"
                    checked={filters.supportsECC === true}
                    onChange={() => handleFilterChange('supportsECC', true)}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="supportsECC"
                    checked={filters.supportsECC === false}
                    onChange={() => handleFilterChange('supportsECC', false)}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>No</span>
                </label>
              </div>
            </div>

            {/* Wireless Networking Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Wireless Networking
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="wirelessNetworking"
                    checked={filters.wirelessNetworking === true}
                    onChange={() => handleFilterChange('wirelessNetworking', true)}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="wirelessNetworking"
                    checked={filters.wirelessNetworking === false}
                    onChange={() => handleFilterChange('wirelessNetworking', false)}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>No</span>
                </label>
              </div>
            </div>

            {/* Uses Back-Connect Connectors Filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Uses Back-Connect Connectors
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="backConnectConnectors"
                    checked={filters.backConnectConnectors === true}
                    onChange={() => handleFilterChange('backConnectConnectors', true)}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="backConnectConnectors"
                    checked={filters.backConnectConnectors === false}
                    onChange={() => handleFilterChange('backConnectConnectors', false)}
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
                  placeholder="Search motherboards..."
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
                Showing {filteredMotherboards.length} of {motherboardList.length} motherboards
              </p>
            </div>

            {selectedMotherboard && (
          <div 
            className="rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center"
            style={{ backgroundColor: colors.mainYellow }}
          >
            <div>
              <p className="text-sm font-semibold text-white">Selected:</p>
              <p className="text-lg font-bold text-white">{selectedMotherboard.name}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedMotherboard(null)}
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
          {currentMotherboards.map((motherboard, index) => (
            <BounceCard
              key={motherboard.id}
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
                    {motherboard.brand}
                  </span>
                  {selectedMotherboard?.id === motherboard.id && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                  {motherboard.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Chipset:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{motherboard.chipset}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Socket:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{motherboard.socket}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Form Factor:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{motherboard.formFactor}</span>
                  </div>
                </div>

                <div className="pt-4 border-t mb-4" style={{ borderColor: colors.platinum }}>
                  <p className="text-2xl font-bold text-center" style={{ color: colors.mainYellow }}>
                    ${motherboard.price.toFixed(2)}
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
                            addComponent('motherboard', motherboard);
                            navigate('/builder');
                          }}
                          className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer flex-1"
                          style={{
                            backgroundColor: selectedMotherboard?.id === motherboard.id ? colors.mainYellow : 'white',
                            color: selectedMotherboard?.id === motherboard.id ? 'white' : colors.mainYellow,
                            border: `2px solid ${colors.mainYellow}`
                          }}
                        >
                          {selectedMotherboard?.id === motherboard.id ? 'Selected' : 'Select'}
                        </button>
                      )}
                      
                      {/* Compare button - hide if from builder */}
                      {source !== 'builder' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const currentCategory = getCategory();
                            if (currentCategory && currentCategory !== 'motherboard') {
                              toast.error(`You can only compare motherboards together. Clear the ${currentCategory} comparison first.`, { duration: 3000 });
                              return;
                            }
                            if (isInCompare(motherboard.id)) {
                              removeFromCompare(motherboard.id);
                            } else {
                              if (compareList.length >= 4) {
                                toast.error('You can compare up to 4 products at once.', { duration: 3000 });
                                return;
                              }
                              addToCompare(motherboard, 'motherboard');
                            }
                          }}
                          className="px-3 py-2 rounded-lg font-bold transition-all hover:opacity-90 cursor-pointer"
                          style={{
                            backgroundColor: isInCompare(motherboard.id) ? colors.mainYellow : 'white',
                            color: isInCompare(motherboard.id) ? 'white' : colors.mainYellow,
                            border: `2px solid ${colors.mainYellow}`
                          }}
                        >
                          {isInCompare(motherboard.id) ? '✓' : '+'}
                        </button>
                      )}
                    </>
                  )}
                  
                  {/* Details button - always show */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(motherboard.id);
                    }}
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
        {filteredMotherboards.length > itemsPerPage && (
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

export default Motherboard;
