import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBuild } from '../../context/BuildContext';
import { useCompare } from '../../context/CompareContext';
import toast from 'react-hot-toast';
import Navbar from '../../components/user/navbar/Navbar.jsx';
import Footer from '../../components/user/footer/Footer.jsx';
import BounceCard from '../../components/animations/BounceCard/BounceCard';
import colors from '../../config/colors';
import { FaTv } from 'react-icons/fa';
import { FiArrowLeft, FiSearch } from 'react-icons/fi';
import monitorsData from '../../data/components/monitors.json';
import { getMonitorImage } from '../../utils/imageMapper';

const Monitor = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const source = searchParams.get('source'); // 'builder' or 'comparator'
  const { addComponent } = useBuild();
  const { compareList, addToCompare, isInCompare, removeFromCompare, getCategory } = useCompare();
  const [selectedMonitor, setSelectedMonitor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [animationKey, setAnimationKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 2000 },
    manufacturers: [],
    rating: null,
    screenSize: [],
    resolution: [],
    refreshRate: [],
    responseTime: { min: 0, max: 10 },
    panelType: [],
    aspectRatio: [],
    color: [],
    brightness: { min: 0, max: 1000 },
    pixelPitch: { min: 0, max: 1 },
    widescreen: null,
    curvedScreen: null,
    interface: [],
    frameSync: [],
    builtInSpeakers: null,
    vesaMounting: null,
    hdrTier: []
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const monitorList = monitorsData.map(monitor => ({
    ...monitor,
    size: `${monitor.screenSize}"`,
    refreshRate: `${monitor.refreshRate}Hz`
  }));

  const filteredMonitors = monitorList.filter(monitor => {
    // Search term
    const matchesSearch = searchTerm === '' || 
      monitor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      monitor.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Price range
    const matchesPrice = monitor.price >= filters.priceRange.min && monitor.price <= filters.priceRange.max;
    
    // Manufacturers
    const matchesManufacturer = filters.manufacturers.length === 0 || 
      filters.manufacturers.includes(monitor.brand);
    
    // Rating
    const matchesRating = filters.rating === null || 
      (monitor.rating && monitor.rating >= filters.rating);
    
    // Screen Size
    const matchesScreenSize = filters.screenSize.length === 0 || 
      !monitor.size ||
      filters.screenSize.includes(monitor.size);
    
    // Resolution
    const matchesResolution = filters.resolution.length === 0 || 
      !monitor.resolution ||
      filters.resolution.includes(monitor.resolution);
    
    // Refresh Rate
    const matchesRefreshRate = filters.refreshRate.length === 0 || 
      !monitor.refreshRate ||
      filters.refreshRate.includes(monitor.refreshRate);
    
    // Response Time
    const matchesResponseTime = !monitor.responseTime || 
      (monitor.responseTime >= filters.responseTime.min && 
       monitor.responseTime <= filters.responseTime.max);
    
    // Panel Type
    const matchesPanelType = filters.panelType.length === 0 || 
      !monitor.panelType ||
      filters.panelType.includes(monitor.panelType);
    
    // Aspect Ratio
    const matchesAspectRatio = filters.aspectRatio.length === 0 || 
      !monitor.aspectRatio ||
      filters.aspectRatio.includes(monitor.aspectRatio);
    
    // Color
    const matchesColor = filters.color.length === 0 || 
      !monitor.color ||
      filters.color.includes(monitor.color);
    
    // Brightness
    const matchesBrightness = !monitor.brightness || 
      (monitor.brightness >= filters.brightness.min && 
       monitor.brightness <= filters.brightness.max);
    
    // Pixel Pitch
    const matchesPixelPitch = !monitor.pixelPitch || 
      (monitor.pixelPitch >= filters.pixelPitch.min && 
       monitor.pixelPitch <= filters.pixelPitch.max);
    
    // Widescreen
    const matchesWidescreen = filters.widescreen === null || 
      !monitor.hasOwnProperty('widescreen') ||
      monitor.widescreen === filters.widescreen;
    
    // Curved Screen
    const matchesCurvedScreen = filters.curvedScreen === null || 
      !monitor.hasOwnProperty('curvedScreen') ||
      monitor.curvedScreen === filters.curvedScreen;
    
    // Interface
    const matchesInterface = filters.interface.length === 0 || 
      !monitor.interface ||
      filters.interface.some(iface => 
        Array.isArray(monitor.interface) ? monitor.interface.includes(iface) : monitor.interface === iface
      );
    
    // Frame Sync
    const matchesFrameSync = filters.frameSync.length === 0 || 
      !monitor.frameSync ||
      filters.frameSync.some(sync => 
        Array.isArray(monitor.frameSync) ? monitor.frameSync.includes(sync) : monitor.frameSync === sync
      );
    
    // Built-in Speakers
    const matchesSpeakers = filters.builtInSpeakers === null || 
      !monitor.hasOwnProperty('builtInSpeakers') ||
      monitor.builtInSpeakers === filters.builtInSpeakers;
    
    // VESA Mounting
    const matchesVesa = filters.vesaMounting === null || 
      !monitor.hasOwnProperty('vesaMounting') ||
      monitor.vesaMounting === filters.vesaMounting;
    
    // HDR Tier
    const matchesHdr = filters.hdrTier.length === 0 || 
      !monitor.hdrTier ||
      filters.hdrTier.includes(monitor.hdrTier);
    
    return matchesSearch && matchesPrice && matchesManufacturer && matchesRating &&
           matchesScreenSize && matchesResolution && matchesRefreshRate && matchesResponseTime &&
           matchesPanelType && matchesAspectRatio && matchesColor && matchesBrightness &&
           matchesPixelPitch && matchesWidescreen && matchesCurvedScreen && matchesInterface &&
           matchesFrameSync && matchesSpeakers && matchesVesa && matchesHdr;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMonitors = filteredMonitors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMonitors.length / itemsPerPage);

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
      screenSize: [],
      resolution: [],
      refreshRate: [],
      responseTime: { min: 0, max: 10 },
      panelType: [],
      aspectRatio: [],
      color: [],
      brightness: { min: 0, max: 1000 },
      pixelPitch: { min: 0, max: 1 },
      widescreen: null,
      curvedScreen: null,
      interface: [],
      frameSync: [],
      builtInSpeakers: null,
      vesaMounting: null,
      hdrTier: []
    });
  };

  const handleSelectMonitor = (monitor) => {
    setSelectedMonitor(monitor);
    console.log('Selected Monitor:', monitor);
  };

  const handleConfirm = () => {
    if (selectedMonitor) {
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
            <FaTv size={32} style={{ color: colors.mainYellow }} />
            <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
              Choose Monitor
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
                {['ASUS', 'LG', 'Samsung', 'Dell', 'AOC', 'BenQ', 'Acer', 'MSI', 'ViewSonic'].map(manufacturer => (
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

            {/* Screen Size Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Screen Size
              </h3>
              <div className="space-y-2">
                {['21.5"', '24"', '27"', '32"', '34"', '38"', '43"', '49"'].map(size => (
                  <label key={size} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.screenSize.includes(size)}
                      onChange={() => handleCheckboxToggle('screenSize', size)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{size}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Resolution Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Resolution
              </h3>
              <div className="space-y-2">
                {['1920x1080', '2560x1080', '2560x1440', '3440x1440', '3840x2160', '5120x1440', '7680x4320'].map(resolution => (
                  <label key={resolution} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.resolution.includes(resolution)}
                      onChange={() => handleCheckboxToggle('resolution', resolution)}
                      className="cursor-pointer"
                    />
                    <span className="text-xs" style={{ color: colors.jet }}>{resolution}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Refresh Rate Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Refresh Rate
              </h3>
              <div className="space-y-2">
                {['60Hz', '75Hz', '100Hz', '120Hz', '144Hz', '165Hz', '180Hz', '240Hz', '360Hz'].map(rate => (
                  <label key={rate} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.refreshRate.includes(rate)}
                      onChange={() => handleCheckboxToggle('refreshRate', rate)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{rate}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Response Time Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Response Time (G2G)
              </h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={filters.responseTime.max}
                  onChange={(e) => handleFilterChange('responseTime', { ...filters.responseTime, max: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm" style={{ color: colors.jet }}>
                  <span>{filters.responseTime.min} ms</span>
                  <span>{filters.responseTime.max} ms</span>
                </div>
              </div>
            </div>

            {/* Panel Type Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Panel Type
              </h3>
              <div className="space-y-2">
                {['IPS', 'VA', 'TN', 'OLED', 'Nano IPS', 'Fast IPS'].map(panel => (
                  <label key={panel} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.panelType.includes(panel)}
                      onChange={() => handleCheckboxToggle('panelType', panel)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{panel}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Aspect Ratio Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Aspect Ratio
              </h3>
              <div className="space-y-2">
                {['16:9', '16:10', '21:9', '32:9', '4:3', '5:4'].map(ratio => (
                  <label key={ratio} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.aspectRatio.includes(ratio)}
                      onChange={() => handleCheckboxToggle('aspectRatio', ratio)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{ratio}</span>
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

            {/* Brightness Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Brightness
              </h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={filters.brightness.max}
                  onChange={(e) => handleFilterChange('brightness', { ...filters.brightness, max: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm" style={{ color: colors.jet }}>
                  <span>{filters.brightness.min} cd/m²</span>
                  <span>{filters.brightness.max} cd/m²</span>
                </div>
              </div>
            </div>

            {/* Pixel Pitch Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Pixel Pitch
              </h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={filters.pixelPitch.max}
                  onChange={(e) => handleFilterChange('pixelPitch', { ...filters.pixelPitch, max: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm" style={{ color: colors.jet }}>
                  <span>{filters.pixelPitch.min} mm</span>
                  <span>{filters.pixelPitch.max} mm</span>
                </div>
              </div>
            </div>

            {/* Widescreen Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Widescreen
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="widescreen"
                    checked={filters.widescreen === true}
                    onChange={() => handleFilterChange('widescreen', true)}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="widescreen"
                    checked={filters.widescreen === false}
                    onChange={() => handleFilterChange('widescreen', false)}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>No</span>
                </label>
              </div>
            </div>

            {/* Curved Screen Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Curved Screen
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="curvedScreen"
                    checked={filters.curvedScreen === true}
                    onChange={() => handleFilterChange('curvedScreen', true)}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="curvedScreen"
                    checked={filters.curvedScreen === false}
                    onChange={() => handleFilterChange('curvedScreen', false)}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>No</span>
                </label>
              </div>
            </div>

            {/* Interface Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Interface
              </h3>
              <div className="space-y-2">
                {['HDMI 2.1', 'HDMI 2.0', 'HDMI 1.4', 'DisplayPort 1.4', 'DisplayPort 1.2', 'USB-C/Thunderbolt', 'DVI', 'VGA'].map(iface => (
                  <label key={iface} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.interface.includes(iface)}
                      onChange={() => handleCheckboxToggle('interface', iface)}
                      className="cursor-pointer"
                    />
                    <span className="text-xs" style={{ color: colors.jet }}>{iface}</span>
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
                {['G-Sync', 'G-Sync Compatible', 'FreeSync', 'FreeSync Premium', 'FreeSync Premium Pro', 'None'].map(sync => (
                  <label key={sync} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.frameSync.includes(sync)}
                      onChange={() => handleCheckboxToggle('frameSync', sync)}
                      className="cursor-pointer"
                    />
                    <span className="text-xs" style={{ color: colors.jet }}>{sync}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Built-in Speakers Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Built-in Speakers
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="builtInSpeakers"
                    checked={filters.builtInSpeakers === true}
                    onChange={() => handleFilterChange('builtInSpeakers', true)}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="builtInSpeakers"
                    checked={filters.builtInSpeakers === false}
                    onChange={() => handleFilterChange('builtInSpeakers', false)}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>No</span>
                </label>
              </div>
            </div>

            {/* VESA Mounting Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                VESA Mounting
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="vesaMounting"
                    checked={filters.vesaMounting === true}
                    onChange={() => handleFilterChange('vesaMounting', true)}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="vesaMounting"
                    checked={filters.vesaMounting === false}
                    onChange={() => handleFilterChange('vesaMounting', false)}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>No</span>
                </label>
              </div>
            </div>

            {/* HDR Tier Filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                HDR Tier
              </h3>
              <div className="space-y-2">
                {['HDR10', 'HDR400', 'HDR600', 'HDR1000', 'HDR1400', 'Dolby Vision', 'None'].map(hdr => (
                  <label key={hdr} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.hdrTier.includes(hdr)}
                      onChange={() => handleCheckboxToggle('hdrTier', hdr)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{hdr}</span>
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
                  placeholder="Search monitors..."
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
                Showing {filteredMonitors.length} of {monitorList.length} monitors
              </p>
            </div>

            {selectedMonitor && (
          <div 
            className="rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center"
            style={{ backgroundColor: colors.mainYellow }}
          >
            <div>
              <p className="text-sm font-semibold text-white">Selected:</p>
              <p className="text-lg font-bold text-white">{selectedMonitor.name}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedMonitor(null)}
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
          {currentMonitors.map((monitor, index) => (
            <BounceCard
              key={`${monitor.id}-${animationKey}`}
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
                    {monitor.brand}
                  </span>
                  {selectedMonitor?.id === monitor.id && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>

                {/* Image Section */}
                <div className="flex justify-center mb-4 h-48 items-center">
                  {getMonitorImage(monitor.brand, monitor.name) ? (
                    <img
                      src={getMonitorImage(monitor.brand, monitor.name)}
                      alt={monitor.name}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className="flex-col items-center text-center"
                    style={{
                      display: getMonitorImage(monitor.brand, monitor.name) ? 'none' : 'flex',
                      color: colors.platinum
                    }}
                  >
                    <FaTv size={64} style={{ color: colors.platinum }} />
                    <span className="mt-2 text-sm">Image not found</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                  {monitor.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Size:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{monitor.size}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Resolution:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{monitor.resolution}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Refresh Rate:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{monitor.refreshRate}</span>
                  </div>
                </div>

                <div className="pt-4 border-t mb-4" style={{ borderColor: colors.platinum }}>
                  <p className="text-2xl font-bold text-center" style={{ color: colors.mainYellow }}>
                    ${monitor.price.toFixed(2)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end">
                  {/* Only show action buttons if source exists (from builder or comparator) */}
                  {source && (
                    <>
                      {/* Select button - hide if from comparator */}
                      {source !== 'comparator' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addComponent('monitor', monitor);
                            navigate('/builder');
                          }}
                          className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer flex-1"
                          style={{
                            backgroundColor: selectedMonitor?.id === monitor.id ? colors.mainYellow : 'white',
                            color: selectedMonitor?.id === monitor.id ? 'white' : colors.mainYellow,
                            border: `2px solid ${colors.mainYellow}`
                          }}
                        >
                          {selectedMonitor?.id === monitor.id ? 'Selected' : 'Select'}
                        </button>
                      )}
                      
                      {/* Compare button - hide if from builder */}
                      {source !== 'builder' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const currentCategory = getCategory();
                            if (currentCategory && currentCategory !== 'monitor') {
                              toast.error(`You can only compare Monitors together. Clear the ${currentCategory} comparison first.`, { duration: 3000 });
                              return;
                            }
                            if (isInCompare(monitor.id)) {
                              removeFromCompare(monitor.id);
                            } else {
                              if (compareList.length >= 4) {
                                toast.error('You can compare up to 4 products at once.', { duration: 3000 });
                                return;
                              }
                              addToCompare(monitor, 'monitor');
                            }
                          }}
                          className="px-3 py-2 rounded-lg font-bold transition-all hover:opacity-90 cursor-pointer"
                          style={{
                            backgroundColor: isInCompare(monitor.id) ? colors.mainYellow : 'white',
                            color: isInCompare(monitor.id) ? 'white' : colors.mainYellow,
                            border: `2px solid ${colors.mainYellow}`
                          }}
                        >
                          {isInCompare(monitor.id) ? '✓' : '+'}
                        </button>
                      )}
                    </>
                  )}
                  
                  {/* Details button - always show */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/monitor/${monitor.id}`);
                    }}
                    className="px-6 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer"
                    style={{
                      backgroundColor: selectedMonitor?.id === monitor.id ? 'white' : colors.mainYellow,
                      color: selectedMonitor?.id === monitor.id ? colors.mainYellow : 'white',
                      border: selectedMonitor?.id === monitor.id ? `2px solid ${colors.mainYellow}` : 'none'
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
            {filteredMonitors.length === 0 && (
              <div className="text-center py-12">
                <FaTv size={64} style={{ color: colors.platinum }} className="mx-auto mb-4" />
                <p className="text-2xl font-bold mb-2" style={{ color: colors.mainBlack }}>No monitors found</p>
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

export default Monitor;
