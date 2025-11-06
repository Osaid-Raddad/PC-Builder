import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/navbar/Navbar.jsx';
import Footer from '../../components/user/footer/Footer.jsx';
import colors from '../../config/colors';
import { BsCpuFill } from 'react-icons/bs';
import { FiArrowLeft, FiFilter, FiSearch } from 'react-icons/fi';

const CPU = () => {
  const navigate = useNavigate();
  const [selectedCPU, setSelectedCPU] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('All');
  const [socketFilter, setSocketFilter] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // TODO: Replace with actual data from backend
  const cpuList = [
    { id: 1, name: 'Intel Core i9-14900K', brand: 'Intel', cores: 24, threads: 32, price: 589.99, socket: 'LGA1700' },
    { id: 2, name: 'AMD Ryzen 9 7950X', brand: 'AMD', cores: 16, threads: 32, price: 549.99, socket: 'AM5' },
    { id: 3, name: 'Intel Core i7-14700K', brand: 'Intel', cores: 20, threads: 28, price: 409.99, socket: 'LGA1700' },
    { id: 4, name: 'AMD Ryzen 7 7800X3D', brand: 'AMD', cores: 8, threads: 16, price: 449.99, socket: 'AM5' },
    { id: 5, name: 'Intel Core i5-14600K', brand: 'Intel', cores: 14, threads: 20, price: 319.99, socket: 'LGA1700' },
    { id: 6, name: 'AMD Ryzen 5 7600X', brand: 'AMD', cores: 6, threads: 12, price: 249.99, socket: 'AM5' },
  ];

  // Filter options
  const brands = ['All', 'Intel', 'AMD'];
  const sockets = ['All', 'LGA1700', 'AM5'];
  const priceRanges = ['All', 'Under $300', '$300-$450', 'Over $450'];

  // Filter and search logic
  const filteredCPUs = cpuList.filter(cpu => {
    const matchesSearch = searchTerm === '' ||
      cpu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cpu.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBrand = brandFilter === 'All' || cpu.brand === brandFilter;
    const matchesSocket = socketFilter === 'All' || cpu.socket === socketFilter;
    
    let matchesPrice = true;
    if (priceFilter === 'Under $300') {
      matchesPrice = cpu.price < 300;
    } else if (priceFilter === '$300-$450') {
      matchesPrice = cpu.price >= 300 && cpu.price <= 450;
    } else if (priceFilter === 'Over $450') {
      matchesPrice = cpu.price > 450;
    }

    return matchesSearch && matchesBrand && matchesSocket && matchesPrice;
  });

  const handleSelectCPU = (cpu) => {
    setSelectedCPU(cpu);
    // TODO: Save selection to context/state management
    console.log('Selected CPU:', cpu);
  };

  const handleConfirm = () => {
    if (selectedCPU) {
      // TODO: Save to build state
      navigate('/builder');
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/builder')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
            style={{ backgroundColor: colors.mainYellow, color: 'white' }}
          >
            <FiArrowLeft size={20} />
            Back to Builder
          </button>
          
          <div className="flex items-center gap-3">
            <BsCpuFill size={32} style={{ color: colors.mainYellow }} />
            <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
              Choose CPU
            </h1>
          </div>
          
          <div style={{ width: '150px' }}></div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <FiSearch 
              className="absolute left-4 top-1/2 -translate-y-1/2" 
              style={{ color: colors.mainYellow }} 
              size={20} 
            />
            <input
              type="text"
              placeholder="Search CPUs by name or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-lg font-medium transition-all focus:outline-none focus:ring-2"
              style={{
                border: `2px solid ${colors.platinum}`,
                backgroundColor: 'white',
                color: colors.jet
              }}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div 
            className="bg-white rounded-lg shadow-lg p-6"
            style={{ border: `2px solid ${colors.platinum}` }}
          >
            <div className="flex items-center gap-3 mb-4">
              <FiFilter size={20} style={{ color: colors.mainYellow }} />
              <h3 className="text-xl font-bold" style={{ color: colors.mainBlack }}>
                Filters
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                  Brand
                </label>
                <select
                  value={brandFilter}
                  onChange={(e) => setBrandFilter(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    border: `2px solid ${colors.platinum}`,
                    backgroundColor: 'white',
                    color: colors.jet
                  }}
                >
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Socket Filter */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                  Socket Type
                </label>
                <select
                  value={socketFilter}
                  onChange={(e) => setSocketFilter(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    border: `2px solid ${colors.platinum}`,
                    backgroundColor: 'white',
                    color: colors.jet
                  }}
                >
                  {sockets.map(socket => (
                    <option key={socket} value={socket}>{socket}</option>
                  ))}
                </select>
              </div>

              {/* Price Filter */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                  Price Range
                </label>
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    border: `2px solid ${colors.platinum}`,
                    backgroundColor: 'white',
                    color: colors.jet
                  }}
                >
                  {priceRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm" style={{ color: colors.jet }}>
              Showing {filteredCPUs.length} of {cpuList.length} CPUs
            </div>
          </div>
        </div>

        {/* Selected Component Bar */}
        {selectedCPU && (
          <div 
            className="rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center"
            style={{ backgroundColor: colors.mainYellow }}
          >
            <div>
              <p className="text-sm font-semibold text-white">Selected:</p>
              <p className="text-lg font-bold text-white">{selectedCPU.name}</p>
            </div>
            <button
              onClick={handleConfirm}
              className="px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: 'white', color: colors.mainYellow }}
            >
              Confirm Selection
            </button>
          </div>
        )}

        {/* CPU List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCPUs.map((cpu) => (
            <div
              key={cpu.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer ${
                selectedCPU?.id === cpu.id ? 'ring-4' : ''
              }`}
              style={{ 
                border: `2px solid ${selectedCPU?.id === cpu.id ? colors.mainYellow : colors.platinum}`,
                ringColor: colors.mainYellow
              }}
              onClick={() => handleSelectCPU(cpu)}
            >
              <div className="p-6">
                {/* Brand Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ 
                      backgroundColor: cpu.brand === 'Intel' ? '#0071C5' : '#ED1C24',
                      color: 'white'
                    }}
                  >
                    {cpu.brand}
                  </span>
                  {selectedCPU?.id === cpu.id && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>

                {/* CPU Name */}
                <h3 className="text-xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                  {cpu.name}
                </h3>

                {/* Specifications */}
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
                    <span style={{ color: colors.jet }}>Socket:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{cpu.socket}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="pt-4 border-t" style={{ borderColor: colors.platinum }}>
                  <p className="text-2xl font-bold text-center" style={{ color: colors.mainYellow }}>
                    ${cpu.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCPUs.length === 0 && (
          <div className="text-center py-12">
            <BsCpuFill size={64} style={{ color: colors.platinum }} className="mx-auto mb-4" />
            <p className="text-2xl font-bold mb-2" style={{ color: colors.mainBlack }}>
              No CPUs found
            </p>
            <p className="text-lg" style={{ color: colors.jet }}>
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CPU;
