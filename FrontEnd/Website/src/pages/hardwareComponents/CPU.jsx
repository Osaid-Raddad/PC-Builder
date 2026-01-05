import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/navbar/Navbar.jsx';
import Footer from '../../components/user/footer/Footer.jsx';
import colors from '../../config/colors';
import { BsCpuFill } from 'react-icons/bs';
import { FiArrowLeft } from 'react-icons/fi';
import cpusData from '../../data/components/cpus.json';


const CPU = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  
  // Transform JSON data to match component structure
  const cpuList = cpusData.cpus.map(cpu => ({
    ...cpu,
    brand: cpu.brand, // Already has brand field in JSON
    model: cpu.model,
    tdp: `${cpu.tdpWatts}W`
  }));
  
  console.log('CPU List loaded:', cpuList.length, 'items');
  
  // Filter states
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 2000 },
    manufacturers: [],
    rating: 0,
    coreCount: [],
    threadCount: [],
    performanceCoreClock: { min: 0, max: 6 },
    l2Cache: [],
    l3Cache: [],
    tdp: { min: 0, max: 300 },
    series: [],
    microarchitecture: [],
    coreFamily: [],
    socket: [],
    integratedGraphics: null,
    smt: null,
    eccSupport: null,
    includesCooler: null
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
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
      rating: 0,
      coreCount: [],
      threadCount: [],
      performanceCoreClock: { min: 0, max: 6 },
      l2Cache: [],
      l3Cache: [],
      tdp: { min: 0, max: 300 },
      series: [],
      microarchitecture: [],
      coreFamily: [],
      socket: [],
      integratedGraphics: null,
      smt: null,
      eccSupport: null,
      includesCooler: null
    });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCPUs = cpuList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(cpuList.length / itemsPerPage);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
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
            <BsCpuFill size={32} style={{ color: colors.mainYellow }} />
            <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
              Choose CPU
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
              maxHeight: 'calc(100vh - 250px)',
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
                {['Intel', 'AMD'].map(manufacturer => (
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

            {/* Core Count Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Core Count
              </h3>
              <div className="space-y-2">
                {[4, 6, 8, 10, 12, 14, 16, 24, 32].map(cores => (
                  <label key={cores} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.coreCount.includes(cores)}
                      onChange={() => handleCheckboxToggle('coreCount', cores)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{cores} Cores</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Thread Count Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Thread Count
              </h3>
              <div className="space-y-2">
                {[8, 12, 16, 20, 24, 28, 32, 48, 64].map(threads => (
                  <label key={threads} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.threadCount.includes(threads)}
                      onChange={() => handleCheckboxToggle('threadCount', threads)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{threads} Threads</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Performance Core Clock Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Performance Core Clock
              </h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="6"
                  step="0.1"
                  value={filters.performanceCoreClock.max}
                  onChange={(e) => handleFilterChange('performanceCoreClock', { ...filters.performanceCoreClock, max: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm" style={{ color: colors.jet }}>
                  <span>{filters.performanceCoreClock.min} GHz</span>
                  <span>{filters.performanceCoreClock.max} GHz</span>
                </div>
              </div>
            </div>

            {/* L2 Cache Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                L2 Cache
              </h3>
              <div className="space-y-2">
                {['2 MB', '4 MB', '8 MB', '16 MB', '32 MB'].map(cache => (
                  <label key={cache} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.l2Cache.includes(cache)}
                      onChange={() => handleCheckboxToggle('l2Cache', cache)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{cache}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* L3 Cache Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                L3 Cache
              </h3>
              <div className="space-y-2">
                {['8 MB', '16 MB', '32 MB', '64 MB', '96 MB', '128 MB'].map(cache => (
                  <label key={cache} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.l3Cache.includes(cache)}
                      onChange={() => handleCheckboxToggle('l3Cache', cache)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{cache}</span>
                  </label>
                ))}
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
                  max="300"
                  value={filters.tdp.max}
                  onChange={(e) => handleFilterChange('tdp', { ...filters.tdp, max: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm" style={{ color: colors.jet }}>
                  <span>{filters.tdp.min}W</span>
                  <span>{filters.tdp.max}W</span>
                </div>
              </div>
            </div>

            {/* Series Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Series
              </h3>
              <div className="space-y-2">
                {['Core i9', 'Core i7', 'Core i5', 'Ryzen 9', 'Ryzen 7', 'Ryzen 5'].map(series => (
                  <label key={series} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.series.includes(series)}
                      onChange={() => handleCheckboxToggle('series', series)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{series}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Microarchitecture Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Microarchitecture
              </h3>
              <div className="space-y-2">
                {['Raptor Lake', 'Alder Lake', 'Zen 4', 'Zen 3', 'Zen 2'].map(arch => (
                  <label key={arch} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.microarchitecture.includes(arch)}
                      onChange={() => handleCheckboxToggle('microarchitecture', arch)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{arch}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Core Family Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Core Family
              </h3>
              <div className="space-y-2">
                {['Intel Core 14th Gen', 'Intel Core 13th Gen', 'AMD Ryzen 7000', 'AMD Ryzen 5000'].map(family => (
                  <label key={family} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.coreFamily.includes(family)}
                      onChange={() => handleCheckboxToggle('coreFamily', family)}
                      className="cursor-pointer"
                    />
                    <span style={{ color: colors.jet }}>{family}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Socket Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Socket
              </h3>
              <div className="space-y-2">
                {['LGA1700', 'LGA1200', 'AM5', 'AM4'].map(socket => (
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

            {/* Integrated Graphics Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Integrated Graphics
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="integratedGraphics"
                    checked={filters.integratedGraphics === true}
                    onChange={() => handleFilterChange('integratedGraphics', true)}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="integratedGraphics"
                    checked={filters.integratedGraphics === false}
                    onChange={() => handleFilterChange('integratedGraphics', false)}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>No</span>
                </label>
              </div>
            </div>

            {/* SMT Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                SMT
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="smt"
                    checked={filters.smt === true}
                    onChange={() => handleFilterChange('smt', true)}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="smt"
                    checked={filters.smt === false}
                    onChange={() => handleFilterChange('smt', false)}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>No</span>
                </label>
              </div>
            </div>

            {/* ECC Support Filter */}
            <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.platinum }}>
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                ECC Support
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="eccSupport"
                    checked={filters.eccSupport === true}
                    onChange={() => handleFilterChange('eccSupport', true)}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="eccSupport"
                    checked={filters.eccSupport === false}
                    onChange={() => handleFilterChange('eccSupport', false)}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>No</span>
                </label>
              </div>
            </div>

            {/* Includes Cooler Filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3" style={{ color: colors.mainBlack }}>
                Includes Cooler
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="includesCooler"
                    checked={filters.includesCooler === true}
                    onChange={() => handleFilterChange('includesCooler', true)}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="includesCooler"
                    checked={filters.includesCooler === false}
                    onChange={() => handleFilterChange('includesCooler', false)}
                    className="cursor-pointer"
                  />
                  <span style={{ color: colors.jet }}>No</span>
                </label>
              </div>
            </div>
          </div>

          {/* Products Area */}
          <div className="flex-1">
            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentCPUs.map((cpu, index) => (
                <div
                  key={cpu.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all p-6 cursor-pointer"
                  style={{ border: `2px solid ${colors.platinum}` }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = colors.mainYellow}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = colors.platinum}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: colors.mainYellow }}
                    >
                      {cpu.brand}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                    {cpu.model}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span style={{ color: colors.jet }}>Cores:</span>
                      <span className="font-semibold" style={{ color: colors.mainBlack }}>{cpu.cores}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: colors.jet }}>Threads:</span>
                      <span className="font-semibold" style={{ color: colors.mainBlack }}>{cpu.threads}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: colors.jet }}>Base Clock:</span>
                      <span className="font-semibold" style={{ color: colors.mainBlack }}>{cpu.baseClockGHz} GHz</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: colors.jet }}>Boost Clock:</span>
                      <span className="font-semibold" style={{ color: colors.mainBlack }}>{cpu.boostClockGHz} GHz</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: colors.jet }}>TDP:</span>
                      <span className="font-semibold" style={{ color: colors.mainBlack }}>{cpu.tdp}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: colors.jet }}>Socket:</span>
                      <span className="font-semibold" style={{ color: colors.mainBlack }}>{cpu.socket}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: colors.platinum }}>
                    <span className="text-2xl font-bold" style={{ color: colors.mainYellow }}>
                      ${cpu.price}
                    </span>
                    <button
                      className="px-4 py-2 rounded-lg font-semibold hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: colors.mainYellow, color: 'white' }}
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {cpuList.length > itemsPerPage && (
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

      <Footer />
    </div>
  );
};

export default CPU;
