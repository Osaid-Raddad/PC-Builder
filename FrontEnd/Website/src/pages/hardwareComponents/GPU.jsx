import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/navbar/Navbar.jsx';
import Footer from '../../components/user/footer/Footer.jsx';
import colors from '../../config/colors';
import { FaMicrochip } from 'react-icons/fa';
import { FiArrowLeft, FiFilter, FiSearch } from 'react-icons/fi';

const GPU = () => {
  const navigate = useNavigate();
  const [selectedGPU, setSelectedGPU] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('All');
  const [memoryFilter, setMemoryFilter] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const gpuList = [
    { id: 1, name: 'NVIDIA RTX 4090', brand: 'NVIDIA', memory: '24GB GDDR6X', price: 1599.99, tdp: '450W' },
    { id: 2, name: 'AMD Radeon RX 7900 XTX', brand: 'AMD', memory: '24GB GDDR6', price: 999.99, tdp: '355W' },
    { id: 3, name: 'NVIDIA RTX 4080', brand: 'NVIDIA', memory: '16GB GDDR6X', price: 1199.99, tdp: '320W' },
    { id: 4, name: 'AMD Radeon RX 7900 XT', brand: 'AMD', memory: '20GB GDDR6', price: 849.99, tdp: '315W' },
    { id: 5, name: 'NVIDIA RTX 4070 Ti', brand: 'NVIDIA', memory: '12GB GDDR6X', price: 799.99, tdp: '285W' },
    { id: 6, name: 'AMD Radeon RX 7800 XT', brand: 'AMD', memory: '16GB GDDR6', price: 499.99, tdp: '263W' },
  ];

  // Filter options
  const brands = ['All', 'NVIDIA', 'AMD'];
  const memoryOptions = ['All', '12GB', '16GB', '20GB', '24GB'];
  const priceRanges = ['All', 'Under $700', '$700-$1000', 'Over $1000'];

  // Filter and search logic
  const filteredGPUs = gpuList.filter(gpu => {
    const matchesSearch = searchTerm === '' ||
      gpu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gpu.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBrand = brandFilter === 'All' || gpu.brand === brandFilter;
    
    const matchesMemory = memoryFilter === 'All' || gpu.memory.startsWith(memoryFilter);
    
    let matchesPrice = true;
    if (priceFilter === 'Under $700') {
      matchesPrice = gpu.price < 700;
    } else if (priceFilter === '$700-$1000') {
      matchesPrice = gpu.price >= 700 && gpu.price <= 1000;
    } else if (priceFilter === 'Over $1000') {
      matchesPrice = gpu.price > 1000;
    }

    return matchesSearch && matchesBrand && matchesMemory && matchesPrice;
  });

  const handleSelectGPU = (gpu) => {
    setSelectedGPU(gpu);
    console.log('Selected GPU:', gpu);
  };

  const handleConfirm = () => {
    if (selectedGPU) {
      navigate('/builder');
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
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
            <FaMicrochip size={32} style={{ color: colors.mainYellow }} />
            <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
              Choose GPU
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
              placeholder="Search GPUs by name or brand..."
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

              {/* Memory Filter */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                  VRAM
                </label>
                <select
                  value={memoryFilter}
                  onChange={(e) => setMemoryFilter(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    border: `2px solid ${colors.platinum}`,
                    backgroundColor: 'white',
                    color: colors.jet
                  }}
                >
                  {memoryOptions.map(memory => (
                    <option key={memory} value={memory}>{memory}</option>
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
              Showing {filteredGPUs.length} of {gpuList.length} GPUs
            </div>
          </div>
        </div>

        {selectedGPU && (
          <div 
            className="rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center"
            style={{ backgroundColor: colors.mainYellow }}
          >
            <div>
              <p className="text-sm font-semibold text-white">Selected:</p>
              <p className="text-lg font-bold text-white">{selectedGPU.name}</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGPUs.map((gpu) => (
            <div
              key={gpu.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer ${
                selectedGPU?.id === gpu.id ? 'ring-4' : ''
              }`}
              style={{ 
                border: `2px solid ${selectedGPU?.id === gpu.id ? colors.mainYellow : colors.platinum}`,
                ringColor: colors.mainYellow
              }}
              onClick={() => handleSelectGPU(gpu)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ 
                      backgroundColor: gpu.brand === 'NVIDIA' ? '#76B900' : '#ED1C24',
                      color: 'white'
                    }}
                  >
                    {gpu.brand}
                  </span>
                  {selectedGPU?.id === gpu.id && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                  {gpu.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Memory:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{gpu.memory}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>TDP:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{gpu.tdp}</span>
                  </div>
                </div>

                <div className="pt-4 border-t" style={{ borderColor: colors.platinum }}>
                  <p className="text-2xl font-bold text-center" style={{ color: colors.mainYellow }}>
                    ${gpu.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredGPUs.length === 0 && (
          <div className="text-center py-12">
            <FaMicrochip size={64} style={{ color: colors.platinum }} className="mx-auto mb-4" />
            <p className="text-2xl font-bold mb-2" style={{ color: colors.mainBlack }}>
              No GPUs found
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

export default GPU;
