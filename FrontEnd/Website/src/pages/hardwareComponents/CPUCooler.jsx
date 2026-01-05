import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/navbar/Navbar.jsx';
import Footer from '../../components/user/footer/Footer.jsx';
import BounceCard from '../../components/animations/BounceCard/BounceCard';
import colors from '../../config/colors';
import { FaFan } from 'react-icons/fa';
import { FiArrowLeft, FiSearch } from 'react-icons/fi';
import cpuCoolersData from '../../data/components/cpuCoolers.json';

const CPUCooler = () => {
  const navigate = useNavigate();
  const [selectedCooler, setSelectedCooler] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [animationKey, setAnimationKey] = useState(0);

  // Filter states
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 500 },
    manufacturers: [],
    rating: 0,
    color: [],
    height: { min: 0, max: 200 },
    bearing: [],
    cpuSocket: [],
    waterCooled: null,
    fanless: null
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const coolerList = cpuCoolersData.cpuCoolers.map(cooler => ({
    ...cooler,
    name: `${cooler.brand} ${cooler.model}`, // Combine brand and model for display
    compatibility: cooler.socketCompatibility
  }));
  
  console.log('CPU Cooler List loaded:', coolerList.length, 'items');

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(1);
    setAnimationKey(prev => prev + 1);
  };

  const handleCheckboxToggle = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: prev[filterName].includes(value)
        ? prev[filterName].filter(item => item !== value)
        : [...prev[filterName], value]
    }));
    setCurrentPage(1);
    setAnimationKey(prev => prev + 1);
  };

  const resetFilters = () => {
    setFilters({
      priceRange: { min: 0, max: 500 },
      manufacturers: [],
      rating: 0,
      color: [],
      height: { min: 0, max: 200 },
      bearing: [],
      cpuSocket: [],
      waterCooled: null,
      fanless: null
    });
    setCurrentPage(1);
    setAnimationKey(prev => prev + 1);
  };

  const filteredCoolers = coolerList.filter(cooler => {
    // Search term
    const matchesSearch = searchTerm === '' || 
      cooler.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      cooler.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Price range
    const matchesPrice = cooler.price >= filters.priceRange.min && cooler.price <= filters.priceRange.max;
    
    // Manufacturers
    const matchesManufacturer = filters.manufacturers.length === 0 || 
      filters.manufacturers.includes(cooler.brand);
    
    // Rating (optional)
    const matchesRating = filters.rating === null ||
      !filters.rating ||
      (cooler.rating && cooler.rating >= filters.rating);
    
    return matchesSearch && matchesPrice && matchesManufacturer && matchesRating;
  });

  const handleSelectCooler = (cooler) => {
    setSelectedCooler(cooler);
    console.log('Selected Cooler:', cooler);
  };

  const handleConfirm = () => {
    if (selectedCooler) {
      navigate('/builder');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    setAnimationKey(prev => prev + 1);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredCoolers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCoolers.length / itemsPerPage);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
            style={{ backgroundColor: colors.mainYellow, color: 'white' }}
          >
            <FiArrowLeft size={20} />
            Back
          </button>
          
          <div className="flex items-center gap-3">
            <FaFan size={32} style={{ color: colors.mainYellow }} />
            <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
              Choose CPU Cooler
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
                {['Noctua', 'Corsair', 'be quiet!', 'NZXT', 'Cooler Master', 'Arctic', 'Deepcool', 'Thermaltake'].map(manufacturer => (
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

            {/* Color Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Color
              </h3>
              <div className="space-y-2">
                {['Black', 'White', 'Silver', 'RGB', 'Blue', 'Red'].map(color => (
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

            {/* Height Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Height
              </h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={filters.height.max}
                  onChange={(e) => handleFilterChange('height', { ...filters.height, max: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm" style={{ color: colors.jet }}>
                  <span>{filters.height.min} mm</span>
                  <span>{filters.height.max} mm</span>
                </div>
              </div>
            </div>

            {/* Bearing Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Bearing
              </h3>
              <div className="space-y-2">
                {['Rifle Bearing', 'Sleeve Bearing', 'Fluid Dynamic Bearing', 'Magnetic Bearing', 'Ball Bearing', 'SSO2 Bearing'].map(bearing => (
                  <label key={bearing} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.bearing.includes(bearing)}
                      onChange={() => handleCheckboxToggle('bearing', bearing)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{bearing}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* CPU Socket Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                CPU Socket
              </h3>
              <div className="space-y-2">
                {['LGA1700', 'LGA1200', 'AM5', 'AM4', 'LGA1151', 'TR4'].map(socket => (
                  <label key={socket} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.cpuSocket.includes(socket)}
                      onChange={() => handleCheckboxToggle('cpuSocket', socket)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{socket}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Water Cooled Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Water Cooled
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="waterCooled"
                    checked={filters.waterCooled === true}
                    onChange={() => handleFilterChange('waterCooled', true)}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="waterCooled"
                    checked={filters.waterCooled === false}
                    onChange={() => handleFilterChange('waterCooled', false)}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>No</span>
                </label>
              </div>
            </div>

            {/* Fanless Filter */}
            <div className="mb-6">
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
                  placeholder="Search CPU coolers..."
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
                Showing {currentProducts.length} of {filteredCoolers.length} CPU coolers
              </p>
            </div>

            {selectedCooler && (
              <div 
                className="rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center"
                style={{ backgroundColor: colors.mainYellow }}
              >
                <div>
                  <p className="text-sm font-semibold text-white">Selected:</p>
                  <p className="text-lg font-bold text-white">{selectedCooler.name}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedCooler(null)}
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
              {currentProducts.map((product, index) => (
                <BounceCard
                  key={product.id}
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
                        style={{ backgroundColor: product.type === 'Air' ? '#4CAF50' : '#2196F3' }}
                      >
                        {product.type} Cooling
                      </span>
                      {selectedCooler?.id === product.id && (
                        <span className="text-2xl">✓</span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                      {product.name}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span style={{ color: colors.jet }}>Brand:</span>
                        <span className="font-semibold" style={{ color: colors.mainBlack }}>{product.brand}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: colors.jet }}>Type:</span>
                        <span className="font-semibold" style={{ color: colors.mainBlack }}>{product.type}</span>
                      </div>
                      <div className="text-sm">
                        <span style={{ color: colors.jet }}>Compatible:</span>
                        <div className="flex gap-2 mt-1">
                          {product.compatibility.map((comp) => (
                            <span 
                              key={comp}
                              className="px-2 py-1 rounded text-xs"
                              style={{ backgroundColor: colors.mainBeige, color: colors.mainBlack }}
                            >
                              {comp}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t mb-4" style={{ borderColor: colors.platinum }}>
                      <p className="text-2xl font-bold text-center" style={{ color: colors.mainYellow }}>
                        ${product.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectCooler(product);
                        }}
                        className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer"
                        style={{
                          backgroundColor: selectedCooler?.id === product.id ? colors.mainYellow : 'white',
                          color: selectedCooler?.id === product.id ? 'white' : colors.mainYellow,
                          border: `2px solid ${colors.mainYellow}`
                        }}
                      >
                        {selectedCooler?.id === product.id ? 'Selected' : 'Select'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/cpucooler/${product.id}`);
                        }}
                        className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer"
                        style={{
                          backgroundColor: selectedCooler?.id === product.id ? 'white' : colors.mainYellow,
                          color: selectedCooler?.id === product.id ? colors.mainYellow : 'white',
                          border: selectedCooler?.id === product.id ? `2px solid ${colors.mainYellow}` : 'none'
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
            {filteredCoolers.length > itemsPerPage && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer"
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
                  className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer"
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

            {/* Empty State */}
            {filteredCoolers.length === 0 && (
              <div className="text-center py-12">
                <FaFan size={64} style={{ color: colors.platinum }} className="mx-auto mb-4" />
                <p className="text-2xl font-bold mb-2" style={{ color: colors.mainBlack }}>No CPU coolers found</p>
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

export default CPUCooler;
