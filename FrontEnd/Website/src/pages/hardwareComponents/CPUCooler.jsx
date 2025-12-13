import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/navbar/Navbar.jsx';
import Footer from '../../components/user/footer/Footer.jsx';
import BounceCard from '../../components/animations/BounceCard/BounceCard';
import colors from '../../config/colors';
import { FaFan } from 'react-icons/fa';
import { FiArrowLeft, FiFilter, FiSearch } from 'react-icons/fi';

const CPUCooler = () => {
  const navigate = useNavigate();
  const [selectedCooler, setSelectedCooler] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [brandFilter, setBrandFilter] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [animationKey, setAnimationKey] = useState(0);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const coolerList = [
    { id: 1, name: 'Noctua NH-D15', brand: 'Noctua', type: 'Air', price: 109.99, compatibility: ['Intel', 'AMD'] },
    { id: 2, name: 'Corsair iCUE H150i Elite', brand: 'Corsair', type: 'Liquid', price: 189.99, compatibility: ['Intel', 'AMD'] },
    { id: 3, name: 'be quiet! Dark Rock Pro 4', brand: 'be quiet!', type: 'Air', price: 89.99, compatibility: ['Intel', 'AMD'] },
    { id: 4, name: 'NZXT Kraken X63', brand: 'NZXT', type: 'Liquid', price: 149.99, compatibility: ['Intel', 'AMD'] },
    { id: 5, name: 'Cooler Master Hyper 212', brand: 'Cooler Master', type: 'Air', price: 44.99, compatibility: ['Intel', 'AMD'] },
    { id: 6, name: 'Arctic Liquid Freezer II 280', brand: 'Arctic', type: 'Liquid', price: 119.99, compatibility: ['Intel', 'AMD'] },
  ];

  const types = ['All', 'Air', 'Liquid'];
  const brands = ['All', 'Noctua', 'Corsair', 'be quiet!', 'NZXT', 'Cooler Master', 'Arctic'];
  const priceRanges = ['All', 'Under $75', '$75-$125', 'Over $125'];

  const filteredCoolers = coolerList.filter(cooler => {
    const matchesSearch = searchTerm === '' || cooler.name.toLowerCase().includes(searchTerm.toLowerCase()) || cooler.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || cooler.type === typeFilter;
    const matchesBrand = brandFilter === 'All' || cooler.brand === brandFilter;
    let matchesPrice = true;
    if (priceFilter === 'Under $75') matchesPrice = cooler.price < 75;
    else if (priceFilter === '$75-$125') matchesPrice = cooler.price >= 75 && cooler.price <= 125;
    else if (priceFilter === 'Over $125') matchesPrice = cooler.price > 125;
    return matchesSearch && matchesType && matchesBrand && matchesPrice;
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

  // Update filter handlers
  const handleTypeFilter = (type) => {
    setTypeFilter(type);
    setCurrentPage(1);
    setAnimationKey(prev => prev + 1);
  };

  const handleBrandFilter = (brand) => {
    setBrandFilter(brand);
    setCurrentPage(1);
    setAnimationKey(prev => prev + 1);
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
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity  cursor-pointer"
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

        {/* Filters Section */}
        <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'white' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => handleTypeFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:border-opacity-80 cursor-pointer"
                style={{ 
                  borderColor: colors.platinum,
                  color: colors.mainBlack,
                  backgroundColor: 'white'
                }}
              >
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                Brand
              </label>
              <select
                value={brandFilter}
                onChange={(e) => handleBrandFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:border-opacity-80 cursor-pointer"
                style={{ 
                  borderColor: colors.platinum,
                  color: colors.mainBlack,
                  backgroundColor: 'white'
                }}
              >
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                Price Range
              </label>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:border-opacity-80 cursor-pointer"
                style={{ 
                  borderColor: colors.platinum,
                  color: colors.mainBlack,
                  backgroundColor: 'white'
                }}
              >
                {priceRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      <Footer />
    </div>
  );
};

export default CPUCooler;
