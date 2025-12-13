import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/navbar/Navbar.jsx';
import Footer from '../../components/user/footer/Footer.jsx';
import BounceCard from '../../components/animations/BounceCard/BounceCard';
import colors from '../../config/colors';
import { FaTv } from 'react-icons/fa';
import { FiArrowLeft, FiSearch } from 'react-icons/fi';

const Monitor = () => {
  const navigate = useNavigate();
  const [selectedMonitor, setSelectedMonitor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sizeFilter, setSizeFilter] = useState('All');
  const [resolutionFilter, setResolutionFilter] = useState('All');
  const [refreshRateFilter, setRefreshRateFilter] = useState('All');
  const [animationKey, setAnimationKey] = useState(0);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const monitorList = [
    { id: 1, name: 'ASUS ROG Swift PG279QM', brand: 'ASUS', size: '27"', resolution: '2560x1440', refreshRate: '240Hz', price: 699.99 },
    { id: 2, name: 'LG 27GN950-B', brand: 'LG', size: '27"', resolution: '3840x2160', refreshRate: '144Hz', price: 799.99 },
    { id: 3, name: 'Samsung Odyssey G7', brand: 'Samsung', size: '32"', resolution: '2560x1440', refreshRate: '240Hz', price: 649.99 },
    { id: 4, name: 'Dell S2721DGF', brand: 'Dell', size: '27"', resolution: '2560x1440', refreshRate: '165Hz', price: 429.99 },
    { id: 5, name: 'AOC CU34G2X', brand: 'AOC', size: '34"', resolution: '3440x1440', refreshRate: '144Hz', price: 449.99 },
    { id: 6, name: 'BenQ EX2780Q', brand: 'BenQ', size: '27"', resolution: '2560x1440', refreshRate: '144Hz', price: 499.99 },
  ];

  const sizes = ['All', '24"', '27"', '32"', '34"', '49"'];
  const resolutions = ['All', '1920x1080', '2560x1440', '3840x2160', '3440x1440'];
  const refreshRates = ['All', '60Hz', '75Hz', '144Hz', '165Hz', '240Hz', '360Hz'];

  const filteredMonitors = monitorList.filter(monitor => {
    const matchesSearch = searchTerm === '' || monitor.name.toLowerCase().includes(searchTerm.toLowerCase()) || monitor.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSize = sizeFilter === 'All' || monitor.size === sizeFilter;
    const matchesResolution = resolutionFilter === 'All' || monitor.resolution === resolutionFilter;
    const matchesRefreshRate = refreshRateFilter === 'All' || monitor.refreshRate === refreshRateFilter;
    return matchesSearch && matchesSize && matchesResolution && matchesRefreshRate;
  });

  const handleSelectMonitor = (monitor) => {
    setSelectedMonitor(monitor);
    console.log('Selected Monitor:', monitor);
  };

  const handleConfirm = () => {
    if (selectedMonitor) {
      navigate('/builder');
    }
  };

  const handleSizeFilter = (size) => {
    setSizeFilter(size);
    setAnimationKey(prev => prev + 1);
  };

  const handleResolutionFilter = (resolution) => {
    setResolutionFilter(resolution);
    setAnimationKey(prev => prev + 1);
  };

  const handleRefreshRateFilter = (rate) => {
    setRefreshRateFilter(rate);
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
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
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

        {/* Filters Section */}
        <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'white' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Size Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                Size
              </label>
              <select
                value={sizeFilter}
                onChange={(e) => handleSizeFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:border-opacity-80 cursor-pointer"
                style={{ 
                  borderColor: colors.platinum,
                  color: colors.mainBlack,
                  backgroundColor: 'white'
                }}
              >
                {sizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            {/* Resolution Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                Resolution
              </label>
              <select
                value={resolutionFilter}
                onChange={(e) => handleResolutionFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:border-opacity-80 cursor-pointer"
                style={{ 
                  borderColor: colors.platinum,
                  color: colors.mainBlack,
                  backgroundColor: 'white'
                }}
              >
                {resolutions.map(resolution => (
                  <option key={resolution} value={resolution}>{resolution}</option>
                ))}
              </select>
            </div>

            {/* Refresh Rate Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                Refresh Rate
              </label>
              <select
                value={refreshRateFilter}
                onChange={(e) => handleRefreshRateFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:border-opacity-80 cursor-pointer"
                style={{ 
                  borderColor: colors.platinum,
                  color: colors.mainBlack,
                  backgroundColor: 'white'
                }}
              >
                {refreshRates.map(refreshRate => (
                  <option key={refreshRate} value={refreshRate}>{refreshRate}</option>
                ))}
              </select>
            </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMonitors.map((monitor, index) => (
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
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectMonitor(monitor);
                    }}
                    className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer"
                    style={{
                      backgroundColor: selectedMonitor?.id === monitor.id ? colors.mainYellow : 'white',
                      color: selectedMonitor?.id === monitor.id ? 'white' : colors.mainYellow,
                      border: `2px solid ${colors.mainYellow}`
                    }}
                  >
                    {selectedMonitor?.id === monitor.id ? 'Selected' : 'Select'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/monitor/${monitor.id}`);
                    }}
                    className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer"
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
      </div>

      {/* Empty State */}
      {filteredMonitors.length === 0 && (
        <div className="text-center py-12">
          <FaTv size={64} style={{ color: colors.platinum }} className="mx-auto mb-4" />
          <p className="text-2xl font-bold mb-2" style={{ color: colors.mainBlack }}>No monitors found</p>
          <p className="text-lg" style={{ color: colors.jet }}>Try adjusting your filters or search terms</p>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Monitor;
