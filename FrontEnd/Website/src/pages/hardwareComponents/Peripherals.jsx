import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/navbar/Navbar.jsx';
import Footer from '../../components/user/footer/Footer.jsx';
import BounceCard from '../../components/animations/BounceCard/BounceCard';
import colors from '../../config/colors';
import { FaKeyboard } from 'react-icons/fa';
import { FiArrowLeft, FiSearch } from 'react-icons/fi';

const Peripherals = () => {
  const navigate = useNavigate();
  const [selectedPeripheral, setSelectedPeripheral] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [brandFilter, setBrandFilter] = useState('All');
  const [connectivityFilter, setConnectivityFilter] = useState('All');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const peripheralList = [
    { id: 1, name: 'Logitech G Pro X Superlight', brand: 'Logitech', type: 'Mouse', connectivity: 'Wireless', price: 159.99 },
    { id: 2, name: 'Corsair K70 RGB TKL', brand: 'Corsair', type: 'Keyboard', connectivity: 'Wired', price: 139.99 },
    { id: 3, name: 'Razer DeathAdder V3 Pro', brand: 'Razer', type: 'Mouse', connectivity: 'Wireless', price: 149.99 },
    { id: 4, name: 'SteelSeries Apex Pro', brand: 'SteelSeries', type: 'Keyboard', connectivity: 'Wired', price: 199.99 },
    { id: 5, name: 'HyperX Cloud Alpha', brand: 'HyperX', type: 'Headset', connectivity: 'Wired', price: 99.99 },
    { id: 6, name: 'Blue Yeti X', brand: 'Blue', type: 'Microphone', connectivity: 'USB', price: 169.99 },
  ];

  const types = ['All', 'Mouse', 'Keyboard', 'Headset', 'Microphone'];
  const brands = ['All', 'Logitech', 'Corsair', 'Razer', 'SteelSeries', 'HyperX', 'Blue'];
  const connectivityOptions = ['All', 'Wired', 'Wireless', 'USB', 'Bluetooth'];

  const filteredPeripherals = peripheralList.filter(peripheral => {
    const matchesSearch = searchTerm === '' || peripheral.name.toLowerCase().includes(searchTerm.toLowerCase()) || peripheral.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || peripheral.type === typeFilter;
    const matchesBrand = brandFilter === 'All' || peripheral.brand === brandFilter;
    const matchesConnectivity = connectivityFilter === 'All' || peripheral.connectivity === connectivityFilter;
    return matchesSearch && matchesType && matchesBrand && matchesConnectivity;
  });

  const handleSelectPeripheral = (peripheral) => {
    setSelectedPeripheral(peripheral);
    console.log('Selected Peripheral:', peripheral);
  };

  const handleConfirm = () => {
    if (selectedPeripheral) {
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
            <FaKeyboard size={32} style={{ color: colors.mainYellow }} />
            <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
              Choose Peripherals
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
              placeholder="Search peripherals..."
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

            {/* Connectivity Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                Connectivity
              </label>
              <select
                value={connectivityFilter}
                onChange={(e) => setConnectivityFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:border-opacity-80"
                style={{ 
                  borderColor: colors.platinum,
                  color: colors.mainBlack,
                  backgroundColor: 'white'
                }}
              >
                {connectivityOptions.map(connectivity => (
                  <option key={connectivity} value={connectivity}>{connectivity}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-4">
          <p className="text-lg font-semibold" style={{ color: colors.jet }}>
            Showing {filteredPeripherals.length} of {peripheralList.length} peripherals
          </p>
        </div>

        {selectedPeripheral && (
          <div 
            className="rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center"
            style={{ backgroundColor: colors.mainYellow }}
          >
            <div>
              <p className="text-sm font-semibold text-white">Selected:</p>
              <p className="text-lg font-bold text-white">{selectedPeripheral.name}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedPeripheral(null)}
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
          {filteredPeripherals.map((peripheral, index) => (
            <BounceCard
              key={peripheral.id}
              delay={index * 0.1}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all"
              style={{ border: `2px solid ${colors.platinum}` }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = colors.mainYellow}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = colors.platinum}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ 
                      backgroundColor: peripheral.type === 'Mouse' ? '#F44336' :
                                      peripheral.type === 'Keyboard' ? '#2196F3' :
                                      peripheral.type === 'Headset' ? '#4CAF50' : '#FF9800'
                    }}
                  >
                    {peripheral.type}
                  </span>
                  {selectedPeripheral?.id === peripheral.id && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                  {peripheral.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Brand:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{peripheral.brand}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Connectivity:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{peripheral.connectivity}</span>
                  </div>
                </div>

                <div className="pt-4 border-t mb-4" style={{ borderColor: colors.platinum }}>
                  <p className="text-2xl font-bold text-center" style={{ color: colors.mainYellow }}>
                    ${peripheral.price.toFixed(2)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPeripheral(peripheral);
                    }}
                    className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer"
                    style={{
                      backgroundColor: selectedPeripheral?.id === peripheral.id ? colors.mainYellow : 'white',
                      color: selectedPeripheral?.id === peripheral.id ? 'white' : colors.mainYellow,
                      border: `2px solid ${colors.mainYellow}`
                    }}
                  >
                    {selectedPeripheral?.id === peripheral.id ? 'Selected' : 'Select'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/peripherals/${peripheral.id}`);
                    }}
                    className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer"
                    style={{
                      backgroundColor: selectedPeripheral?.id === peripheral.id ? 'white' : colors.mainYellow,
                      color: selectedPeripheral?.id === peripheral.id ? colors.mainYellow : 'white',
                      border: selectedPeripheral?.id === peripheral.id ? `2px solid ${colors.mainYellow}` : 'none'
                    }}
                  >
                    Details
                  </button>
                </div>
              </div>
            </BounceCard>
          ))}
        </div>

        {/* Empty State */}
        {filteredPeripherals.length === 0 && (
          <div className="text-center py-12">
            <FaKeyboard size={64} style={{ color: colors.platinum }} className="mx-auto mb-4" />
            <p className="text-2xl font-bold mb-2" style={{ color: colors.mainBlack }}>No peripherals found</p>
            <p className="text-lg" style={{ color: colors.jet }}>Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Peripherals;
