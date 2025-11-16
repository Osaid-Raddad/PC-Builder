import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/navbar/Navbar.jsx';
import Footer from '../../components/user/footer/Footer.jsx';
import colors from '../../config/colors';
import { FaHdd } from 'react-icons/fa';
import { FiArrowLeft, FiFilter, FiSearch } from 'react-icons/fi';

const Storage = () => {
  const navigate = useNavigate();
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [capacityFilter, setCapacityFilter] = useState('All');
  const [brandFilter, setBrandFilter] = useState('All');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const storageList = [
    { id: 1, name: 'Samsung 990 PRO', brand: 'Samsung', capacity: '2TB', type: 'NVMe SSD', speed: '7,450 MB/s', price: 189.99 },
    { id: 2, name: 'WD Black SN850X', brand: 'Western Digital', capacity: '2TB', type: 'NVMe SSD', speed: '7,300 MB/s', price: 179.99 },
    { id: 3, name: 'Crucial P5 Plus', brand: 'Crucial', capacity: '1TB', type: 'NVMe SSD', speed: '6,600 MB/s', price: 99.99 },
    { id: 4, name: 'Samsung 870 EVO', brand: 'Samsung', capacity: '2TB', type: 'SATA SSD', speed: '560 MB/s', price: 149.99 },
    { id: 5, name: 'Seagate BarraCuda', brand: 'Seagate', capacity: '4TB', type: 'HDD', speed: '5,400 RPM', price: 89.99 },
    { id: 6, name: 'WD Blue', brand: 'Western Digital', capacity: '2TB', type: 'HDD', speed: '7,200 RPM', price: 54.99 },
  ];

  const types = ['All', 'NVMe SSD', 'SATA SSD', 'HDD'];
  const capacities = ['All', '1TB', '2TB', '4TB'];
  const brands = ['All', 'Samsung', 'Western Digital', 'Crucial', 'Seagate'];

  const filteredStorage = storageList.filter(storage => {
    const matchesSearch = searchTerm === '' || storage.name.toLowerCase().includes(searchTerm.toLowerCase()) || storage.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || storage.type === typeFilter;
    const matchesCapacity = capacityFilter === 'All' || storage.capacity === capacityFilter;
    const matchesBrand = brandFilter === 'All' || storage.brand === brandFilter;
    return matchesSearch && matchesType && matchesCapacity && matchesBrand;
  });

  const handleSelectStorage = (storage) => {
    setSelectedStorage(storage);
    console.log('Selected Storage:', storage);
  };

  const handleConfirm = () => {
    if (selectedStorage) {
      navigate('/builder');
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/storage/${productId}`);
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
            <FaHdd size={32} style={{ color: colors.mainYellow }} />
            <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
              Choose Storage
            </h1>
          </div>
          
          <div style={{ width: '150px' }}></div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: colors.mainYellow }} size={20} />
            <input type="text" placeholder="Search storage..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-lg font-medium transition-all focus:outline-none focus:ring-2" style={{ border: `2px solid ${colors.platinum}`, backgroundColor: 'white', color: colors.jet }} />
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
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>Type</label>
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2" style={{ border: `2px solid ${colors.platinum}`, backgroundColor: 'white', color: colors.jet }}>
                  {types.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>Capacity</label>
                <select value={capacityFilter} onChange={(e) => setCapacityFilter(e.target.value)} className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2" style={{ border: `2px solid ${colors.platinum}`, backgroundColor: 'white', color: colors.jet }}>
                  {capacities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>Brand</label>
                <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2" style={{ border: `2px solid ${colors.platinum}`, backgroundColor: 'white', color: colors.jet }}>
                  {brands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-4 text-sm" style={{ color: colors.jet }}>Showing {filteredStorage.length} of {storageList.length} storage devices</div>
          </div>
        </div>

        {selectedStorage && (
          <div 
            className="rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center"
            style={{ backgroundColor: colors.mainYellow }}
          >
            <div>
              <p className="text-sm font-semibold text-white">Selected:</p>
              <p className="text-lg font-bold text-white">{selectedStorage.name}</p>
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
          {filteredStorage.map((storage) => (
            <div
              key={storage.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer ${
                selectedStorage?.id === storage.id ? 'ring-4' : ''
              }`}
              style={{ 
                border: `2px solid ${selectedStorage?.id === storage.id ? colors.mainYellow : colors.platinum}`,
                ringColor: colors.mainYellow
              }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ 
                      backgroundColor: storage.type.includes('NVMe') ? '#4CAF50' : 
                                      storage.type.includes('SATA') ? '#2196F3' : '#FF9800'
                    }}
                  >
                    {storage.type}
                  </span>
                  {selectedStorage?.id === storage.id && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                  {storage.name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Brand:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{storage.brand}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Capacity:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{storage.capacity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.jet }}>Speed:</span>
                    <span className="font-semibold" style={{ color: colors.mainBlack }}>{storage.speed}</span>
                  </div>
                </div>

                <div className="pt-4 border-t mb-4" style={{ borderColor: colors.platinum }}>
                  <p className="text-2xl font-bold text-center" style={{ color: colors.mainYellow }}>
                    ${storage.price.toFixed(2)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectStorage(storage);
                    }}
                    className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer"
                    style={{
                      backgroundColor: selectedStorage?.id === storage.id ? colors.mainYellow : 'white',
                      color: selectedStorage?.id === storage.id ? 'white' : colors.mainYellow,
                      border: `2px solid ${colors.mainYellow}`
                    }}
                  >
                    {selectedStorage?.id === storage.id ? 'Selected' : 'Select'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/storage/${storage.id}`);
                    }}
                    className="px-4 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90 cursor-pointer"
                    style={{
                      backgroundColor: selectedStorage?.id === storage.id ? 'white' : colors.mainYellow,
                      color: selectedStorage?.id === storage.id ? colors.mainYellow : 'white',
                      border: selectedStorage?.id === storage.id ? `2px solid ${colors.mainYellow}` : 'none'
                    }}
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredStorage.length === 0 && (
          <div className="text-center py-12">
            <FaHdd size={64} style={{ color: colors.platinum }} className="mx-auto mb-4" />
            <p className="text-2xl font-bold mb-2" style={{ color: colors.mainBlack }}>No storage found</p>
            <p className="text-lg" style={{ color: colors.jet }}>Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Storage;
