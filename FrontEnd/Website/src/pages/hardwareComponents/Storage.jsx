import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/navbar/Navbar.jsx';
import Footer from '../../components/user/footer/Footer.jsx';
import BounceCard from '../../components/animations/BounceCard/BounceCard';
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
  const [priceFilter, setPriceFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [interfaceFilter, setInterfaceFilter] = useState('All');
  const [cacheFilter, setCacheFilter] = useState('All');
  const [formFactorFilter, setFormFactorFilter] = useState('All');
  const [nvmeFilter, setNvmeFilter] = useState('All');
  const [animationKey, setAnimationKey] = useState(0);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const storageList = [
    { id: 1, name: 'Samsung 990 PRO', brand: 'Samsung', capacity: '2TB', type: 'NVMe SSD', speed: '7,450 MB/s', price: 189.99, rating: 5, interface: 'PCIe 4.0 x4', cache: '2GB', formFactor: 'M.2 2280', nvme: 'Yes' },
    { id: 2, name: 'WD Black SN850X', brand: 'Western Digital', capacity: '2TB', type: 'NVMe SSD', speed: '7,300 MB/s', price: 179.99, rating: 5, interface: 'PCIe 4.0 x4', cache: '2GB', formFactor: 'M.2 2280', nvme: 'Yes' },
    { id: 3, name: 'Crucial P5 Plus', brand: 'Crucial', capacity: '1TB', type: 'NVMe SSD', speed: '6,600 MB/s', price: 99.99, rating: 4, interface: 'PCIe 4.0 x4', cache: '1GB', formFactor: 'M.2 2280', nvme: 'Yes' },
    { id: 4, name: 'Samsung 870 EVO', brand: 'Samsung', capacity: '2TB', type: 'SATA SSD', speed: '560 MB/s', price: 149.99, rating: 5, interface: 'SATA III', cache: '1GB', formFactor: '2.5"', nvme: 'No' },
    { id: 5, name: 'Seagate BarraCuda', brand: 'Seagate', capacity: '4TB', type: 'HDD', speed: '5,400 RPM', price: 89.99, rating: 4, interface: 'SATA III', cache: '256MB', formFactor: '3.5"', nvme: 'No' },
    { id: 6, name: 'WD Blue', brand: 'Western Digital', capacity: '2TB', type: 'HDD', speed: '7,200 RPM', price: 54.99, rating: 4, interface: 'SATA III', cache: '256MB', formFactor: '3.5"', nvme: 'No' },
  ];

  const types = ['All', 'NVMe SSD', 'SATA SSD', 'HDD'];
  const capacities = ['All', '1TB', '2TB', '4TB'];
  const brands = ['All', 'Samsung', 'Western Digital', 'Crucial', 'Seagate'];
  const priceRanges = ['All', 'Under $100', '$100 - $150', '$150 - $200', 'Over $200'];
  const ratings = ['All', '5 Stars', '4 Stars', '3 Stars'];
  const interfaces = ['All', 'PCIe 4.0 x4', 'SATA III'];
  const caches = ['All', '256MB', '1GB', '2GB'];
  const formFactors = ['All', 'M.2 2280', '2.5"', '3.5"'];
  const nvmeOptions = ['All', 'Yes', 'No'];

  const filteredStorage = storageList.filter(storage => {
    const matchesSearch = searchTerm === '' || storage.name.toLowerCase().includes(searchTerm.toLowerCase()) || storage.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || storage.type === typeFilter;
    const matchesCapacity = capacityFilter === 'All' || storage.capacity === capacityFilter;
    const matchesBrand = brandFilter === 'All' || storage.brand === brandFilter;
    
    const matchesPrice = priceFilter === 'All' || 
      (priceFilter === 'Under $100' && storage.price < 100) ||
      (priceFilter === '$100 - $150' && storage.price >= 100 && storage.price < 150) ||
      (priceFilter === '$150 - $200' && storage.price >= 150 && storage.price < 200) ||
      (priceFilter === 'Over $200' && storage.price >= 200);
    
    const matchesRating = ratingFilter === 'All' || storage.rating === parseInt(ratingFilter);
    const matchesInterface = interfaceFilter === 'All' || storage.interface === interfaceFilter;
    const matchesCache = cacheFilter === 'All' || storage.cache === cacheFilter;
    const matchesFormFactor = formFactorFilter === 'All' || storage.formFactor === formFactorFilter;
    const matchesNvme = nvmeFilter === 'All' || storage.nvme === nvmeFilter;
    
    return matchesSearch && matchesType && matchesCapacity && matchesBrand && matchesPrice && matchesRating && matchesInterface && matchesCache && matchesFormFactor && matchesNvme;
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

  const handleTypeFilter = (type) => {
    setTypeFilter(type);
    setAnimationKey(prev => prev + 1);
  };

  const handleCapacityFilter = (capacity) => {
    setCapacityFilter(capacity);
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
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
            style={{ backgroundColor: colors.mainYellow, color: 'white' }}
          >
            <FiArrowLeft size={20} />
            Back
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
            <input type="text" placeholder="Search storage..." value={searchTerm} onChange={handleSearch} className="w-full pl-12 pr-4 py-4 rounded-lg font-medium transition-all focus:outline-none focus:ring-2" style={{ border: `2px solid ${colors.platinum}`, backgroundColor: 'white', color: colors.jet }} />
          </div>
        </div>

        {/* Main Content with Sidebar Filters */}
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <div className="w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4" style={{ border: `2px solid ${colors.platinum}` }}>
              <div className="flex items-center gap-3 mb-6">
                <FiFilter size={20} style={{ color: colors.mainYellow }} />
                <h3 className="text-xl font-bold" style={{ color: colors.mainBlack }}>Filters</h3>
              </div>
              
              <div className="space-y-6">
                {/* Price Filter */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>Price</label>
                  <select 
                    value={priceFilter} 
                    onChange={(e) => {
                      setPriceFilter(e.target.value);
                      setAnimationKey(prev => prev + 1);
                    }} 
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 cursor-pointer text-sm" 
                    style={{ border: `2px solid ${colors.platinum}`, backgroundColor: 'white', color: colors.jet }}
                  >
                    {priceRanges.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                {/* Manufacturer Filter */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>Manufacturer</label>
                  <select 
                    value={brandFilter} 
                    onChange={(e) => {
                      setBrandFilter(e.target.value);
                      setAnimationKey(prev => prev + 1);
                    }} 
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 cursor-pointer text-sm" 
                    style={{ border: `2px solid ${colors.platinum}`, backgroundColor: 'white', color: colors.jet }}
                  >
                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>Rating</label>
                  <select 
                    value={ratingFilter} 
                    onChange={(e) => {
                      setRatingFilter(e.target.value);
                      setAnimationKey(prev => prev + 1);
                    }} 
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 cursor-pointer text-sm" 
                    style={{ border: `2px solid ${colors.platinum}`, backgroundColor: 'white', color: colors.jet }}
                  >
                    {ratings.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                {/* Capacity Filter */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>Capacity</label>
                  <select 
                    value={capacityFilter} 
                    onChange={(e) => handleCapacityFilter(e.target.value)} 
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 cursor-pointer text-sm" 
                    style={{ border: `2px solid ${colors.platinum}`, backgroundColor: 'white', color: colors.jet }}
                  >
                    {capacities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Interface Filter */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>Interface</label>
                  <select 
                    value={interfaceFilter} 
                    onChange={(e) => {
                      setInterfaceFilter(e.target.value);
                      setAnimationKey(prev => prev + 1);
                    }} 
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 cursor-pointer text-sm" 
                    style={{ border: `2px solid ${colors.platinum}`, backgroundColor: 'white', color: colors.jet }}
                  >
                    {interfaces.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>Type</label>
                  <select 
                    value={typeFilter} 
                    onChange={(e) => handleTypeFilter(e.target.value)} 
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 cursor-pointer text-sm" 
                    style={{ border: `2px solid ${colors.platinum}`, backgroundColor: 'white', color: colors.jet }}
                  >
                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* Cache Filter */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>Cache</label>
                  <select 
                    value={cacheFilter} 
                    onChange={(e) => {
                      setCacheFilter(e.target.value);
                      setAnimationKey(prev => prev + 1);
                    }} 
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 cursor-pointer text-sm" 
                    style={{ border: `2px solid ${colors.platinum}`, backgroundColor: 'white', color: colors.jet }}
                  >
                    {caches.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Form Factor Filter */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>Form Factor</label>
                  <select 
                    value={formFactorFilter} 
                    onChange={(e) => {
                      setFormFactorFilter(e.target.value);
                      setAnimationKey(prev => prev + 1);
                    }} 
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 cursor-pointer text-sm" 
                    style={{ border: `2px solid ${colors.platinum}`, backgroundColor: 'white', color: colors.jet }}
                  >
                    {formFactors.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                {/* NVMe Filter */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>NVMe</label>
                  <select 
                    value={nvmeFilter} 
                    onChange={(e) => {
                      setNvmeFilter(e.target.value);
                      setAnimationKey(prev => prev + 1);
                    }} 
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 cursor-pointer text-sm" 
                    style={{ border: `2px solid ${colors.platinum}`, backgroundColor: 'white', color: colors.jet }}
                  >
                    {nvmeOptions.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t text-sm" style={{ borderColor: colors.platinum, color: colors.jet }}>
                Showing {filteredStorage.length} of {storageList.length} storage devices
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {selectedStorage && (
              <div 
                className="rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center"
                style={{ backgroundColor: colors.mainYellow }}
              >
                <div>
                  <p className="text-sm font-semibold text-white">Selected:</p>
                  <p className="text-lg font-bold text-white">{selectedStorage.name}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedStorage(null)}
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
              {filteredStorage.map((storage, index) => (
                <BounceCard
                  key={storage.id}
                  delay={index * 0.1}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all"
                  style={{ border: `2px solid ${colors.platinum}` }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = colors.mainYellow}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = colors.platinum}
                  animationKey={animationKey}
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
                </BounceCard>
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
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Storage;
