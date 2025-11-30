import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/navbar/Navbar.jsx';
import Footer from '../../components/user/footer/Footer.jsx';
import BounceCard from '../../components/animations/BounceCard/BounceCard';
import colors from '../../config/colors';
import { FaMemory } from 'react-icons/fa';
import { FiArrowLeft, FiFilter, FiSearch } from 'react-icons/fi';

const Memory = () => {
  const navigate = useNavigate();
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('All');
  const [capacityFilter, setCapacityFilter] = useState('All');
  const [speedFilter, setSpeedFilter] = useState('All');
  const [animationKey, setAnimationKey] = useState(0);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const memoryList = [
    { id: 1, name: 'Corsair Vengeance RGB DDR5', brand: 'Corsair', capacity: '32GB (2x16GB)', speed: 'DDR5-6000', price: 149.99 },
    { id: 2, name: 'G.Skill Trident Z5 RGB', brand: 'G.Skill', capacity: '32GB (2x16GB)', speed: 'DDR5-6400', price: 169.99 },
    { id: 3, name: 'Kingston Fury Beast DDR5', brand: 'Kingston', capacity: '32GB (2x16GB)', speed: 'DDR5-5600', price: 129.99 },
    { id: 4, name: 'Corsair Dominator Platinum RGB', brand: 'Corsair', capacity: '64GB (2x32GB)', speed: 'DDR5-6000', price: 289.99 },
    { id: 5, name: 'Crucial DDR5', brand: 'Crucial', capacity: '32GB (2x16GB)', speed: 'DDR5-5200', price: 109.99 },
    { id: 6, name: 'G.Skill Ripjaws S5', brand: 'G.Skill', capacity: '32GB (2x16GB)', speed: 'DDR5-6000', price: 139.99 },
  ];

  const brands = ['All', 'Corsair', 'G.Skill', 'Kingston', 'Crucial'];
  const capacities = ['All', '32GB (2x16GB)', '64GB (2x32GB)'];
  const speeds = ['All', 'DDR5-5200', 'DDR5-5600', 'DDR5-6000', 'DDR5-6400'];

  const filteredMemory = memoryList.filter(mem => {
    const matchesSearch = searchTerm === '' || mem.name.toLowerCase().includes(searchTerm.toLowerCase()) || mem.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = brandFilter === 'All' || mem.brand === brandFilter;
    const matchesCapacity = capacityFilter === 'All' || mem.capacity === capacityFilter;
    const matchesSpeed = speedFilter === 'All' || mem.speed === speedFilter;
    return matchesSearch && matchesBrand && matchesCapacity && matchesSpeed;
  });

  const handleSelectMemory = (memory) => {
    setSelectedMemory(memory);
    console.log('Selected Memory:', memory);
  };

  const handleConfirm = () => {
    if (selectedMemory) {
      navigate('/builder');
    }
  };

  const handleTypeFilter = (type) => {
    setSelectedType(type);
    setCurrentPage(1);
    setAnimationKey(prev => prev + 1);
  };

  const handleCapacityFilter = (capacity) => {
    setSelectedCapacity(capacity);
    setCurrentPage(1);
    setAnimationKey(prev => prev + 1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    setAnimationKey(prev => prev + 1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setAnimationKey(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <FaMemory size={32} style={{ color: colors.mainYellow }} />
            <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
              Choose Memory (RAM)
            </h1>
          </div>
          
          <div style={{ width: '150px' }}></div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: colors.mainYellow }} size={20} />
            <input type="text" placeholder="Search memory..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-lg font-medium transition-all focus:outline-none focus:ring-2" style={{ border: `2px solid ${colors.platinum}`, backgroundColor: 'white', color: colors.jet }} />
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
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>Capacity</label>
                <select value={capacityFilter} onChange={(e) => setCapacityFilter(e.target.value)} className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2" style={{ border: `2px solid ${colors.platinum}`, backgroundColor: 'white', color: colors.jet }}>
                  {capacities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>Speed</label>
                <select value={speedFilter} onChange={(e) => setSpeedFilter(e.target.value)} className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2" style={{ border: `2px solid ${colors.platinum}`, backgroundColor: 'white', color: colors.jet }}>
                  {speeds.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-4 text-sm" style={{ color: colors.jet }}>Showing {filteredMemory.length} of {memoryList.length} memory kits</div>
          </div>
        </div>

        {selectedMemory && (
          <div 
            className="rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center"
            style={{ backgroundColor: colors.mainYellow }}
          >
            <div>
              <p className="text-sm font-semibold text-white">Selected:</p>
              <p className="text-lg font-bold text-white">{selectedMemory.name}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedMemory(null)}
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
          {filteredMemory.map((memory, index) => (
            <BounceCard
              key={memory.id}
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
                    style={{ backgroundColor: colors.mainYellow }}
                  >
                    {memory.brand}
                  </span>
                  {selectedMemory?.id === memory.id && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                  {memory.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Capacity:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{memory.capacity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Speed:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{memory.speed}</span>
                  </div>
                </div>

                <div className="pt-4 border-t mb-4" style={{ borderColor: colors.platinum }}>
                  <p className="text-2xl font-bold text-center" style={{ color: colors.mainYellow }}>
                    ${memory.price.toFixed(2)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectMemory(memory);
                    }}
                    className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer"
                    style={{
                      backgroundColor: selectedMemory?.id === memory.id ? colors.mainYellow : 'white',
                      color: selectedMemory?.id === memory.id ? 'white' : colors.mainYellow,
                      border: `2px solid ${colors.mainYellow}`
                    }}
                  >
                    {selectedMemory?.id === memory.id ? 'Selected' : 'Select'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/memory/${memory.id}`);
                    }}
                    className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer"
                    style={{
                      backgroundColor: selectedMemory?.id === memory.id ? 'white' : colors.mainYellow,
                      color: selectedMemory?.id === memory.id ? colors.mainYellow : 'white',
                      border: selectedMemory?.id === memory.id ? `2px solid ${colors.mainYellow}` : 'none'
                    }}
                  >
                    Details
                  </button>
                </div>
              </div>
            </BounceCard>
          ))}
        </div>

        {filteredMemory.length === 0 && (
          <div className="text-center py-12">
            <FaMemory size={64} style={{ color: colors.platinum }} className="mx-auto mb-4" />
            <p className="text-2xl font-bold mb-2" style={{ color: colors.mainBlack }}>No memory kits found</p>
            <p className="text-lg" style={{ color: colors.jet }}>Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Memory;
