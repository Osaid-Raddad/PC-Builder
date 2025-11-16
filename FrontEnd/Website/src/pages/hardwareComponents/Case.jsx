import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/navbar/Navbar.jsx';
import Footer from '../../components/user/footer/Footer.jsx';
import colors from '../../config/colors';
import { FaDesktop } from 'react-icons/fa';
import { FiArrowLeft, FiSearch } from 'react-icons/fi';

const Case = () => {
  const navigate = useNavigate();
  const [selectedCase, setSelectedCase] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('All');
  const [formFactorFilter, setFormFactorFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const caseList = [
    { id: 1, name: 'Lian Li O11 Dynamic EVO', brand: 'Lian Li', type: 'Mid Tower', formFactor: 'ATX', price: 169.99 },
    { id: 2, name: 'NZXT H510 Elite', brand: 'NZXT', type: 'Mid Tower', formFactor: 'ATX', price: 149.99 },
    { id: 3, name: 'Corsair 4000D Airflow', brand: 'Corsair', type: 'Mid Tower', formFactor: 'ATX', price: 104.99 },
    { id: 4, name: 'Fractal Design Meshify 2', brand: 'Fractal Design', type: 'Mid Tower', formFactor: 'ATX', price: 139.99 },
    { id: 5, name: 'Phanteks Eclipse P500A', brand: 'Phanteks', type: 'Mid Tower', formFactor: 'ATX', price: 159.99 },
    { id: 6, name: 'be quiet! Pure Base 500DX', brand: 'be quiet!', type: 'Mid Tower', formFactor: 'ATX', price: 109.99 },
  ];

  const brands = ['All', 'Lian Li', 'NZXT', 'Corsair', 'Fractal Design', 'Phanteks', 'be quiet!'];
  const formFactors = ['All', 'ATX', 'Micro-ATX', 'Mini-ITX'];
  const types = ['All', 'Full Tower', 'Mid Tower', 'Compact'];

  const filteredCases = caseList.filter(caseItem => {
    const matchesSearch = searchTerm === '' || caseItem.name.toLowerCase().includes(searchTerm.toLowerCase()) || caseItem.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = brandFilter === 'All' || caseItem.brand === brandFilter;
    const matchesFormFactor = formFactorFilter === 'All' || caseItem.formFactor === formFactorFilter;
    const matchesType = typeFilter === 'All' || caseItem.type === typeFilter;
    return matchesSearch && matchesBrand && matchesFormFactor && matchesType;
  });

  const handleSelectCase = (caseItem) => {
    setSelectedCase(caseItem);
    console.log('Selected Case:', caseItem);
  };

  const handleConfirm = () => {
    if (selectedCase) {
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
            <FaDesktop size={32} style={{ color: colors.mainYellow }} />
            <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
              Choose Case
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
              placeholder="Search cases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                Brand
              </label>
              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:border-opacity-80"
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

            {/* Form Factor Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                Form Factor
              </label>
              <select
                value={formFactorFilter}
                onChange={(e) => setFormFactorFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:border-opacity-80"
                style={{ 
                  borderColor: colors.platinum,
                  color: colors.mainBlack,
                  backgroundColor: 'white'
                }}
              >
                {formFactors.map(formFactor => (
                  <option key={formFactor} value={formFactor}>{formFactor}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:border-opacity-80"
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
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-4">
          <p className="text-lg font-semibold" style={{ color: colors.jet }}>
            Showing {filteredCases.length} of {caseList.length} cases
          </p>
        </div>

        {selectedCase && (
          <div 
            className="rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center"
            style={{ backgroundColor: colors.mainYellow }}
          >
            <div>
              <p className="text-sm font-semibold text-white">Selected:</p>
              <p className="text-lg font-bold text-white">{selectedCase.name}</p>
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
          {filteredCases.map((caseItem) => (
            <div
              key={caseItem.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer ${
                selectedCase?.id === caseItem.id ? 'ring-4' : ''
              }`}
              style={{ 
                border: `2px solid ${selectedCase?.id === caseItem.id ? colors.mainYellow : colors.platinum}`,
                ringColor: colors.mainYellow
              }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: colors.mainYellow }}
                  >
                    {caseItem.brand}
                  </span>
                  {selectedCase?.id === caseItem.id && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                  {caseItem.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Type:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{caseItem.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Form Factor:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{caseItem.formFactor}</span>
                  </div>
                </div>

                <div className="pt-4 border-t mb-4" style={{ borderColor: colors.platinum }}>
                  <p className="text-2xl font-bold text-center" style={{ color: colors.mainYellow }}>
                    ${caseItem.price.toFixed(2)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCase(caseItem);
                    }}
                    className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer"
                    style={{
                      backgroundColor: selectedCase?.id === caseItem.id ? colors.mainYellow : 'white',
                      color: selectedCase?.id === caseItem.id ? 'white' : colors.mainYellow,
                      border: `2px solid ${colors.mainYellow}`
                    }}
                  >
                    {selectedCase?.id === caseItem.id ? 'Selected' : 'Select'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/case/${caseItem.id}`);
                    }}
                    className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer"
                    style={{
                      backgroundColor: selectedCase?.id === caseItem.id ? 'white' : colors.mainYellow,
                      color: selectedCase?.id === caseItem.id ? colors.mainYellow : 'white',
                      border: selectedCase?.id === caseItem.id ? `2px solid ${colors.mainYellow}` : 'none'
                    }}
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCases.length === 0 && (
          <div className="text-center py-12">
            <FaDesktop size={64} style={{ color: colors.platinum }} className="mx-auto mb-4" />
            <p className="text-2xl font-bold mb-2" style={{ color: colors.mainBlack }}>No cases found</p>
            <p className="text-lg" style={{ color: colors.jet }}>Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Case;
