import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/navbar/Navbar.jsx';
import Footer from '../../components/user/footer/Footer.jsx';
import BounceCard from '../../components/animations/BounceCard/BounceCard';
import colors from '../../config/colors';
import { BsCpuFill } from 'react-icons/bs';
import { FiArrowLeft, FiFilter, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { loadAllCPUs, getUniqueBrands, getUniqueSockets, filterCPUs } from '../../services/cpuService.js';

const CPU = () => {
  const navigate = useNavigate();
  const [selectedCPU, setSelectedCPU] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('All');
  const [socketFilter, setSocketFilter] = useState('All');
  const [allCPUs, setAllCPUs] = useState([]);
  const [brands, setBrands] = useState(['All']);
  const [sockets, setSockets] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const cpusPerPage = 9;

  // Load CPU data on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const loadCPUData = async () => {
      setLoading(true);
      try {
        const cpus = await loadAllCPUs();
        setAllCPUs(cpus);
        setBrands(getUniqueBrands(cpus));
        setSockets(getUniqueSockets(cpus));
      } catch (error) {
        console.error('Error loading CPU data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCPUData();
  }, []);

  // Filter and search logic
  const filteredCPUs = filterCPUs(allCPUs, {
    searchTerm,
    brand: brandFilter,
    socket: socketFilter
  });

  // Pagination
  const totalPages = Math.ceil(filteredCPUs.length / cpusPerPage);
  const indexOfLastCPU = currentPage * cpusPerPage;
  const indexOfFirstCPU = indexOfLastCPU - cpusPerPage;
  const currentCPUs = filteredCPUs.slice(indexOfFirstCPU, indexOfLastCPU);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, brandFilter, socketFilter]);

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

  const handleProductClick = (productId) => {
    navigate(`/product/cpu/${productId}`);
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
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm" style={{ color: colors.jet }}>
              {!loading && (
                <>
                  Showing {indexOfFirstCPU + 1}-{Math.min(indexOfLastCPU, filteredCPUs.length)} of {filteredCPUs.length} CPUs
                  {filteredCPUs.length !== allCPUs.length && ` (filtered from ${allCPUs.length} total)`}
                </>
              )}
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
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedCPU(null)}
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

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 mb-4" 
                 style={{ borderColor: colors.mainYellow }}></div>
            <p className="text-xl font-semibold" style={{ color: colors.mainBlack }}>
              Loading CPUs from BuildCores...
            </p>
          </div>
        )}

        {/* CPU List */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCPUs.map((cpu, index) => (
            <BounceCard
              key={cpu.id}
              delay={index * 0.1}
              className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all ${
                selectedCPU?.id === cpu.id ? 'ring-4' : ''
              }`}
              style={{ 
                border: `2px solid ${selectedCPU?.id === cpu.id ? colors.mainYellow : colors.platinum}`,
                ringColor: colors.mainYellow
              }}
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
                <div className="pt-4 border-t mb-4" style={{ borderColor: colors.platinum }}>
                  <p className="text-sm font-semibold text-center" style={{ color: colors.jet }}>
                    Price Not Available
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCPU(cpu);
                    }}
                    className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer"
                    style={{
                      backgroundColor: selectedCPU?.id === cpu.id ? colors.mainYellow : 'white',
                      color: selectedCPU?.id === cpu.id ? 'white' : colors.mainYellow,
                      border: `2px solid ${colors.mainYellow}`
                    }}
                  >
                    {selectedCPU?.id === cpu.id ? 'Selected' : 'Select'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(cpu.id);
                    }}
                    className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer"
                    style={{
                      backgroundColor: selectedCPU?.id === cpu.id ? 'white' : colors.mainYellow,
                      color: selectedCPU?.id === cpu.id ? colors.mainYellow : 'white',
                      border: selectedCPU?.id === cpu.id ? `2px solid ${colors.mainYellow}` : 'none'
                    }}
                  >
                    Details
                  </button>
                </div>
              </div>
            </BounceCard>
          ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-opacity disabled:opacity-30"
              style={{ backgroundColor: colors.mainYellow, color: 'white' }}
            >
              <FiChevronLeft size={20} />
              Previous
            </button>

            <div className="flex items-center gap-2">
              {/* First Page */}
              {currentPage > 3 && totalPages > 5 && (
                <>
                  <button
                    onClick={() => setCurrentPage(1)}
                    className="w-10 h-10 rounded-lg font-semibold transition-all"
                    style={{
                      backgroundColor: 'white',
                      color: colors.mainBlack,
                      border: `2px solid ${colors.mainYellow}`
                    }}
                  >
                    1
                  </button>
                  <span className="text-xl font-bold" style={{ color: colors.mainBlack }}>...</span>
                </>
              )}

              {/* Page Numbers */}
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-10 h-10 rounded-lg font-semibold transition-all"
                    style={{
                      backgroundColor: currentPage === pageNum ? colors.mainYellow : 'white',
                      color: currentPage === pageNum ? 'white' : colors.mainBlack,
                      border: `2px solid ${colors.mainYellow}`
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Last Page */}
              {currentPage < totalPages - 2 && totalPages > 5 && (
                <>
                  <span className="text-xl font-bold" style={{ color: colors.mainBlack }}>...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="w-10 h-10 rounded-lg font-semibold transition-all"
                    style={{
                      backgroundColor: 'white',
                      color: colors.mainBlack,
                      border: `2px solid ${colors.mainYellow}`
                    }}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-opacity disabled:opacity-30"
              style={{ backgroundColor: colors.mainYellow, color: 'white' }}
            >
              Next
              <FiChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCPUs.length === 0 && (
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
