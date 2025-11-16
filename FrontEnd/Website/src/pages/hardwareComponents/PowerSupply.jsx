import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/navbar/Navbar.jsx';
import Footer from '../../components/user/footer/Footer.jsx';
import colors from '../../config/colors';
import { FaBolt } from 'react-icons/fa';
import { FiArrowLeft, FiSearch } from 'react-icons/fi';

const PowerSupply = () => {
  const navigate = useNavigate();
  const [selectedPSU, setSelectedPSU] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [wattageFilter, setWattageFilter] = useState('All');
  const [efficiencyFilter, setEfficiencyFilter] = useState('All');
  const [modularFilter, setModularFilter] = useState('All');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const psuList = [
    { id: 1, name: 'Corsair RM1000x', brand: 'Corsair', wattage: '1000W', efficiency: '80+ Gold', modular: 'Fully Modular', price: 189.99 },
    { id: 2, name: 'EVGA SuperNOVA 850 G6', brand: 'EVGA', wattage: '850W', efficiency: '80+ Gold', modular: 'Fully Modular', price: 149.99 },
    { id: 3, name: 'Seasonic Focus GX-850', brand: 'Seasonic', wattage: '850W', efficiency: '80+ Gold', modular: 'Fully Modular', price: 139.99 },
    { id: 4, name: 'be quiet! Straight Power 11', brand: 'be quiet!', wattage: '750W', efficiency: '80+ Platinum', modular: 'Fully Modular', price: 159.99 },
    { id: 5, name: 'Thermaltake Toughpower GF1', brand: 'Thermaltake', wattage: '750W', efficiency: '80+ Gold', modular: 'Fully Modular', price: 119.99 },
    { id: 6, name: 'Cooler Master V850 SFX', brand: 'Cooler Master', wattage: '850W', efficiency: '80+ Gold', modular: 'Fully Modular', price: 169.99 },
  ];

  const wattages = ['All', '500W', '650W', '750W', '850W', '1000W', '1200W+'];
  const efficiencies = ['All', '80+ Bronze', '80+ Gold', '80+ Platinum', '80+ Titanium'];
  const modularTypes = ['All', 'Fully Modular', 'Semi-Modular', 'Non-Modular'];

  const filteredPSUs = psuList.filter(psu => {
    const matchesSearch = searchTerm === '' || psu.name.toLowerCase().includes(searchTerm.toLowerCase()) || psu.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWattage = wattageFilter === 'All' || psu.wattage === wattageFilter;
    const matchesEfficiency = efficiencyFilter === 'All' || psu.efficiency === efficiencyFilter;
    const matchesModular = modularFilter === 'All' || psu.modular === modularFilter;
    return matchesSearch && matchesWattage && matchesEfficiency && matchesModular;
  });

  const handleSelectPSU = (psu) => {
    setSelectedPSU(psu);
    console.log('Selected PSU:', psu);
  };

  const handleConfirm = () => {
    if (selectedPSU) {
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
            <FaBolt size={32} style={{ color: colors.mainYellow }} />
            <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
              Choose Power Supply
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
              placeholder="Search power supplies..."
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
            {/* Wattage Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                Wattage
              </label>
              <select
                value={wattageFilter}
                onChange={(e) => setWattageFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:border-opacity-80"
                style={{ 
                  borderColor: colors.platinum,
                  color: colors.mainBlack,
                  backgroundColor: 'white'
                }}
              >
                {wattages.map(wattage => (
                  <option key={wattage} value={wattage}>{wattage}</option>
                ))}
              </select>
            </div>

            {/* Efficiency Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                Efficiency
              </label>
              <select
                value={efficiencyFilter}
                onChange={(e) => setEfficiencyFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:border-opacity-80"
                style={{ 
                  borderColor: colors.platinum,
                  color: colors.mainBlack,
                  backgroundColor: 'white'
                }}
              >
                {efficiencies.map(efficiency => (
                  <option key={efficiency} value={efficiency}>{efficiency}</option>
                ))}
              </select>
            </div>

            {/* Modular Type Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                Modular
              </label>
              <select
                value={modularFilter}
                onChange={(e) => setModularFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:border-opacity-80"
                style={{ 
                  borderColor: colors.platinum,
                  color: colors.mainBlack,
                  backgroundColor: 'white'
                }}
              >
                {modularTypes.map(modular => (
                  <option key={modular} value={modular}>{modular}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-4">
          <p className="text-lg font-semibold" style={{ color: colors.jet }}>
            Showing {filteredPSUs.length} of {psuList.length} power supplies
          </p>
        </div>

        {selectedPSU && (
          <div 
            className="rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center"
            style={{ backgroundColor: colors.mainYellow }}
          >
            <div>
              <p className="text-sm font-semibold text-white">Selected:</p>
              <p className="text-lg font-bold text-white">{selectedPSU.name}</p>
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
          {filteredPSUs.map((psu) => (
            <div
              key={psu.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer ${
                selectedPSU?.id === psu.id ? 'ring-4' : ''
              }`}
              style={{ 
                border: `2px solid ${selectedPSU?.id === psu.id ? colors.mainYellow : colors.platinum}`,
                ringColor: colors.mainYellow
              }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ 
                      backgroundColor: psu.efficiency.includes('Platinum') ? '#9C27B0' : '#FFC107',
                      color: psu.efficiency.includes('Platinum') ? 'white' : 'black'
                    }}
                  >
                    {psu.efficiency}
                  </span>
                  {selectedPSU?.id === psu.id && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                  {psu.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Brand:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{psu.brand}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Wattage:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{psu.wattage}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Modular:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{psu.modular}</span>
                  </div>
                </div>

                <div className="pt-4 border-t mb-4" style={{ borderColor: colors.platinum }}>
                  <p className="text-2xl font-bold text-center" style={{ color: colors.mainYellow }}>
                    ${psu.price.toFixed(2)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPSU(psu);
                    }}
                    className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer"
                    style={{
                      backgroundColor: selectedPSU?.id === psu.id ? colors.mainYellow : 'white',
                      color: selectedPSU?.id === psu.id ? 'white' : colors.mainYellow,
                      border: `2px solid ${colors.mainYellow}`
                    }}
                  >
                    {selectedPSU?.id === psu.id ? 'Selected' : 'Select'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/powersupply/${psu.id}`);
                    }}
                    className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer"
                    style={{
                      backgroundColor: selectedPSU?.id === psu.id ? 'white' : colors.mainYellow,
                      color: selectedPSU?.id === psu.id ? colors.mainYellow : 'white',
                      border: selectedPSU?.id === psu.id ? `2px solid ${colors.mainYellow}` : 'none'
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
        {filteredPSUs.length === 0 && (
          <div className="text-center py-12">
            <FaBolt size={64} style={{ color: colors.platinum }} className="mx-auto mb-4" />
            <p className="text-2xl font-bold mb-2" style={{ color: colors.mainBlack }}>No power supplies found</p>
            <p className="text-lg" style={{ color: colors.jet }}>Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PowerSupply;
