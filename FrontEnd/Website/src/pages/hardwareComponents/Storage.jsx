import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/navbar/Navbar.jsx';
import Footer from '../../components/user/footer/Footer.jsx';
import BounceCard from '../../components/animations/BounceCard/BounceCard';
import colors from '../../config/colors';
import { FaHdd } from 'react-icons/fa';
import { FiArrowLeft, FiSearch } from 'react-icons/fi';
import storageData from '../../data/components/storage.json';

const Storage = () => {
  const navigate = useNavigate();
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [animationKey, setAnimationKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 500 },
    manufacturers: [],
    rating: null,
    capacity: [],
    type: [],
    interface: [],
    cache: [],
    formFactor: [],
    nvme: null
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const storageList = storageData.storage.map(storage => ({
    ...storage,
    name: `${storage.brand} ${storage.model}`, // Combine brand and model for display
    capacity: `${storage.capacityGB}GB`,
    speed: storage.type === 'NVMe SSD' || storage.type === 'SATA SSD' ? 
      `${storage.readSpeedMBps} MB/s` : 
      storage.type === 'HDD' ? `${storage.rpmSpeed || 7200} RPM` : '',
    nvme: storage.interface?.includes('M.2') ? 'Yes' : 'No'
  }));
  
  console.log('Storage List loaded:', storageList.length, 'items');

  const filteredStorage = storageList.filter(storage => {
    // Search term
    const matchesSearch = searchTerm === '' || 
      storage.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      storage.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Price range
    const matchesPrice = storage.price >= filters.priceRange.min && storage.price <= filters.priceRange.max;
    
    // Manufacturers
    const matchesManufacturer = filters.manufacturers.length === 0 || 
      filters.manufacturers.includes(storage.brand);
    
    // Rating
    const matchesRating = filters.rating === null || 
      (storage.rating && storage.rating >= filters.rating);
    
    // Capacity
    const matchesCapacity = filters.capacity.length === 0 || 
      !storage.capacity ||
      filters.capacity.includes(storage.capacity);
    
    // Type
    const matchesType = filters.type.length === 0 || 
      !storage.type ||
      filters.type.includes(storage.type);
    
    // Interface
    const matchesInterface = filters.interface.length === 0 || 
      !storage.interface ||
      filters.interface.includes(storage.interface);
    
    // Cache
    const matchesCache = filters.cache.length === 0 || 
      !storage.cache ||
      filters.cache.includes(storage.cache);
    
    // Form Factor
    const matchesFormFactor = filters.formFactor.length === 0 || 
      !storage.formFactor ||
      filters.formFactor.includes(storage.formFactor);
    
    // NVMe
    const matchesNvme = filters.nvme === null || 
      !storage.hasOwnProperty('nvme') ||
      storage.nvme === filters.nvme;
    
    return matchesSearch && matchesPrice && matchesManufacturer && matchesRating &&
           matchesCapacity && matchesType && matchesInterface && matchesCache &&
           matchesFormFactor && matchesNvme;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStorage = filteredStorage.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStorage.length / itemsPerPage);

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
      capacity: [],
      type: [],
      interface: [],
      cache: [],
      formFactor: [],
      nvme: null
    });
  };

  const handleSelectStorage = (storage) => {
    setSelectedStorage(storage);
    console.log('Selected Storage:', storage);
  };

  const handleConfirm = () => {
    if (selectedStorage) {
      navigate('/builder');
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/storage/${productId}`);
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
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
            style={{ backgroundColor: colors.mainYellow, color: 'white' }}
          >
            <FiArrowLeft size={20} />
            Back
          </button>
          
          <div className="flex items-center gap-3">
            <FaHdd size={32} style={{ color: colors.mainYellow }} />
            <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
              Choose Storage
            </h1>
          </div>
          
          <div style={{ width: '150px' }}></div>
        </div>
       

        {/* Main Content with Sidebar Filters */}
        <div className="flex gap-6">
          {/* Sidebar Filters */}
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
                {['Samsung', 'Western Digital', 'Crucial', 'Seagate', 'Kingston', 'Corsair'].map(manufacturer => (
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

            {/* Capacity Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Capacity
              </h3>
              <div className="space-y-2">
                {['500GB', '1TB', '2TB', '4TB', '8TB'].map(capacity => (
                  <label key={capacity} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.capacity.includes(capacity)}
                      onChange={() => handleCheckboxToggle('capacity', capacity)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{capacity}</span>
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
                {['NVMe SSD', 'SATA SSD', 'HDD', 'M.2 SSD'].map(type => (
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

            {/* Interface Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Interface
              </h3>
              <div className="space-y-2">
                {['PCIe 4.0 x4', 'PCIe 3.0 x4', 'SATA III', 'SATA II'].map(interfaceType => (
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

            {/* Cache Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Cache
              </h3>
              <div className="space-y-2">
                {['64MB', '128MB', '256MB', '512MB', '1GB', '2GB'].map(cache => (
                  <label key={cache} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.cache.includes(cache)}
                      onChange={() => handleCheckboxToggle('cache', cache)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{cache}</span>
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
                {['M.2 2280', 'M.2 2260', '2.5"', '3.5"'].map(formFactor => (
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

            {/* NVMe Filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                NVMe
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="nvme"
                    checked={filters.nvme === 'Yes'}
                    onChange={() => handleFilterChange('nvme', 'Yes')}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="nvme"
                    checked={filters.nvme === 'No'}
                    onChange={() => handleFilterChange('nvme', 'No')}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>No</span>
                </label>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {selectedStorage && (
              <div 
                className="rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center"
                style={{ backgroundColor: colors.mainYellow }}
              >
                <div>
                  <p className="text-sm font-semibold text-white">Selected:</p>
                  <p className="text-lg font-bold text-white">{selectedStorage.name}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedStorage(null)}
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

            <div className="mb-6">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: colors.mainYellow }} size={20} />
                <input type="text" placeholder="Search storage..." value={searchTerm} onChange={handleSearch} className="w-full pl-12 pr-4 py-4 rounded-lg font-medium transition-all focus:outline-none focus:ring-2" style={{ border: `2px solid ${colors.platinum}`, backgroundColor: 'white', color: colors.jet }} />
              </div>
            </div>


            <div className="mb-4">
              <p className="text-lg font-semibold" style={{ color: colors.jet }}>
                Showing {filteredStorage.length} of {storageList.length} storage devices
              </p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentStorage.map((storage, index) => (
                <BounceCard
                  key={storage.id}
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
                        className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ 
                          backgroundColor: storage.type.includes('NVMe') ? '#4CAF50' : 
                                          storage.type.includes('SATA') ? '#2196F3' : '#FF9800'
                        }}
                      >
                        {storage.type}
                      </span>
                      {selectedStorage?.id === storage.id && (
                        <span className="text-2xl">✓</span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                      {storage.name}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span style={{ color: colors.jet }}>Brand:</span>
                        <span className="font-semibold" style={{ color: colors.mainBlack }}>{storage.brand}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: colors.jet }}>Capacity:</span>
                        <span className="font-semibold" style={{ color: colors.mainBlack }}>{storage.capacity}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: colors.jet }}>Speed:</span>
                        <span className="font-semibold" style={{ color: colors.mainBlack }}>{storage.speed}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t mb-4" style={{ borderColor: colors.platinum }}>
                      <p className="text-2xl font-bold text-center" style={{ color: colors.mainYellow }}>
                        ${storage.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectStorage(storage);
                        }}
                        className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer"
                        style={{
                          backgroundColor: selectedStorage?.id === storage.id ? colors.mainYellow : 'white',
                          color: selectedStorage?.id === storage.id ? 'white' : colors.mainYellow,
                          border: `2px solid ${colors.mainYellow}`
                        }}
                      >
                        {selectedStorage?.id === storage.id ? 'Selected' : 'Select'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/storage/${storage.id}`);
                        }}
                        className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer"
                        style={{
                          backgroundColor: selectedStorage?.id === storage.id ? 'white' : colors.mainYellow,
                          color: selectedStorage?.id === storage.id ? colors.mainYellow : 'white',
                          border: selectedStorage?.id === storage.id ? `2px solid ${colors.mainYellow}` : 'none'
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

            {filteredStorage.length === 0 && (
              <div className="text-center py-12">
                <FaHdd size={64} style={{ color: colors.platinum }} className="mx-auto mb-4" />
                <p className="text-2xl font-bold mb-2" style={{ color: colors.mainBlack }}>No storage found</p>
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

export default Storage;
