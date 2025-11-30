import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/navbar/Navbar.jsx';
import Footer from '../../components/user/footer/Footer.jsx';
import BounceCard from '../../components/animations/BounceCard/BounceCard';
import colors from '../../config/colors';
import { BsMotherboard } from 'react-icons/bs';
import { FiArrowLeft, FiFilter, FiSearch } from 'react-icons/fi';

const Motherboard = () => {
  const navigate = useNavigate();
  const [selectedMotherboard, setSelectedMotherboard] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('All');
  const [socketFilter, setSocketFilter] = useState('All');
  const [formFactorFilter, setFormFactorFilter] = useState('All');
  const [animationKey, setAnimationKey] = useState(0);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const motherboardList = [
    { id: 1, name: 'ASUS ROG Maximus Z790 Hero', brand: 'ASUS', chipset: 'Z790', socket: 'LGA1700', price: 629.99, formFactor: 'ATX' },
    { id: 2, name: 'MSI MPG X670E Carbon WiFi', brand: 'MSI', chipset: 'X670E', socket: 'AM5', price: 449.99, formFactor: 'ATX' },
    { id: 3, name: 'Gigabyte Z790 AORUS Master', brand: 'Gigabyte', chipset: 'Z790', socket: 'LGA1700', price: 489.99, formFactor: 'ATX' },
    { id: 4, name: 'ASRock B650E Taichi', brand: 'ASRock', chipset: 'B650E', socket: 'AM5', price: 299.99, formFactor: 'ATX' },
    { id: 5, name: 'ASUS TUF Gaming B760M', brand: 'ASUS', chipset: 'B760', socket: 'LGA1700', price: 189.99, formFactor: 'Micro-ATX' },
    { id: 6, name: 'MSI MAG B650 Tomahawk WiFi', brand: 'MSI', chipset: 'B650', socket: 'AM5', price: 229.99, formFactor: 'ATX' },
  ];

  const brands = ['All', 'ASUS', 'MSI', 'Gigabyte', 'ASRock'];
  const sockets = ['All', 'LGA1700', 'AM5'];
  const formFactors = ['All', 'ATX', 'Micro-ATX', 'Mini-ITX'];

  const filteredMotherboards = motherboardList.filter(mb => {
    const matchesSearch = searchTerm === '' ||
      mb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mb.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mb.chipset.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = brandFilter === 'All' || mb.brand === brandFilter;
    const matchesSocket = socketFilter === 'All' || mb.socket === socketFilter;
    const matchesFormFactor = formFactorFilter === 'All' || mb.formFactor === formFactorFilter;
    return matchesSearch && matchesBrand && matchesSocket && matchesFormFactor;
  });

  const handleSelectMotherboard = (motherboard) => {
    setSelectedMotherboard(motherboard);
    console.log('Selected Motherboard:', motherboard);
  };

  const handleConfirm = () => {
    if (selectedMotherboard) {
      navigate('/builder');
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/motherboard/${productId}`);
  };

  const handleSocketFilter = (socket) => {
    setSocketFilter(socket);
    setAnimationKey(prev => prev + 1);
  };

  const handleFormFactorFilter = (formFactor) => {
    setFormFactorFilter(formFactor);
    setAnimationKey(prev => prev + 1);
  };

  const handleBrandFilter = (brand) => {
    setBrandFilter(brand);
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
            onClick={() => navigate('/builder')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
            style={{ backgroundColor: colors.mainYellow, color: 'white' }}
          >
            <FiArrowLeft size={20} />
            Back to Builder
          </button>
          
          <div className="flex items-center gap-3">
            <BsMotherboard size={32} style={{ color: colors.mainYellow }} />
            <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
              Choose Motherboard
            </h1>
          </div>
          
          <div style={{ width: '150px' }}></div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: colors.mainYellow }} size={20} />
            <input type="text" placeholder="Search motherboards..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-lg font-medium transition-all focus:outline-none focus:ring-2" style={{ border: `2px solid ${colors.platinum}`, backgroundColor: 'white', color: colors.jet }} />
          </div>
        </div>

        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6" style={{ border: `2px solid ${colors.platinum}` }}>
            <div className="flex items-center gap-3 mb-4">
              <FiFilter size={20} style={{ color: colors.mainYellow }} />
              <h3 className="text-xl font-bold" style={{ color: colors.mainBlack }}>Filters</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>Brand</label>
                <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2" style={{ border: `2px solid ${colors.platinum}`, backgroundColor: 'white', color: colors.jet }}>
                  {brands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>Socket</label>
                <select value={socketFilter} onChange={(e) => setSocketFilter(e.target.value)} className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2" style={{ border: `2px solid ${colors.platinum}`, backgroundColor: 'white', color: colors.jet }}>
                  {sockets.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>Form Factor</label>
                <select value={formFactorFilter} onChange={(e) => setFormFactorFilter(e.target.value)} className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2" style={{ border: `2px solid ${colors.platinum}`, backgroundColor: 'white', color: colors.jet }}>
                  {formFactors.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-4 text-sm" style={{ color: colors.jet }}>Showing {filteredMotherboards.length} of {motherboardList.length} motherboards</div>
          </div>
        </div>

        {selectedMotherboard && (
          <div 
            className="rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center"
            style={{ backgroundColor: colors.mainYellow }}
          >
            <div>
              <p className="text-sm font-semibold text-white">Selected:</p>
              <p className="text-lg font-bold text-white">{selectedMotherboard.name}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedMotherboard(null)}
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
          {filteredMotherboards.map((motherboard, index) => (
            <BounceCard
              key={motherboard.id}
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
                    {motherboard.brand}
                  </span>
                  {selectedMotherboard?.id === motherboard.id && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                  {motherboard.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Chipset:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{motherboard.chipset}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Socket:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{motherboard.socket}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Form Factor:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{motherboard.formFactor}</span>
                  </div>
                </div>

                <div className="pt-4 border-t mb-4" style={{ borderColor: colors.platinum }}>
                  <p className="text-2xl font-bold text-center" style={{ color: colors.mainYellow }}>
                    ${motherboard.price.toFixed(2)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectMotherboard(motherboard);
                    }}
                    className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer"
                    style={{
                      backgroundColor: selectedMotherboard?.id === motherboard.id ? colors.mainYellow : 'white',
                      color: selectedMotherboard?.id === motherboard.id ? 'white' : colors.mainYellow,
                      border: `2px solid ${colors.mainYellow}`
                    }}
                  >
                    {selectedMotherboard?.id === motherboard.id ? 'Selected' : 'Select'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(motherboard.id);
                    }}
                    className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer"
                    style={{
                      backgroundColor: selectedMotherboard?.id === motherboard.id ? 'white' : colors.mainYellow,
                      color: selectedMotherboard?.id === motherboard.id ? colors.mainYellow : 'white',
                      border: selectedMotherboard?.id === motherboard.id ? `2px solid ${colors.mainYellow}` : 'none'
                    }}
                  >
                    Details
                  </button>
                </div>
              </div>
            </BounceCard>
          ))}
        </div>

        {filteredMotherboards.length === 0 && (
          <div className="text-center py-12">
            <BsMotherboard size={64} style={{ color: colors.platinum }} className="mx-auto mb-4" />
            <p className="text-2xl font-bold mb-2" style={{ color: colors.mainBlack }}>No motherboards found</p>
            <p className="text-lg" style={{ color: colors.jet }}>Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Motherboard;
