import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../../../components/user/navbar/Navbar.jsx';
import Footer from '../../../components/user/footer/Footer.jsx';
import colors from '../../../config/colors';
import { 
  BsCpuFill, 
  BsGpuCard, 
  BsMemory,
  BsMotherboard
} from 'react-icons/bs';
import { 
  FiArrowLeft, 
  FiX, 
  FiPlus, 
  FiSearch,
  FiHardDrive,
  FiMonitor,
  FiBox
} from 'react-icons/fi';
import { MdPowerSettingsNew, MdCompareArrows} from 'react-icons/md';

const CATEGORIES = [
  { id: 'cpu', name: 'CPU', icon: BsCpuFill },
  { id: 'gpu', name: 'GPU', icon: BsGpuCard },
  { id: 'motherboard', name: 'Motherboard', icon: BsMotherboard },
  { id: 'memory', name: 'Memory', icon: BsMemory },
  { id: 'storage', name: 'Storage', icon: FiHardDrive },
  { id: 'power-supply', name: 'Power Supply', icon: MdPowerSettingsNew },
  { id: 'case', name: 'Case', icon: FiBox },
  { id: 'monitor', name: 'Monitor', icon: FiMonitor },
];

// Mock data - replace with actual API calls
const MOCK_PRODUCTS = {
  cpu: [
    {
      id: 'cpu1',
      name: 'Intel Core i9-13900K',
      brand: 'Intel',
      specs: {
        cores: '24',
        threads: '32',
        baseClock: '3.0 GHz',
        boostClock: '5.8 GHz',
        socket: 'LGA1700',
        tdp: '125W',
        cache: '36MB',
        integratedGraphics: 'Intel UHD Graphics 770',
      },
      price: '$589',
      image: '/cpu-placeholder.jpg'
    },
    {
      id: 'cpu2',
      name: 'AMD Ryzen 9 7950X',
      brand: 'AMD',
      specs: {
        cores: '16',
        threads: '32',
        baseClock: '4.5 GHz',
        boostClock: '5.7 GHz',
        socket: 'AM5',
        tdp: '170W',
        cache: '64MB',
        integratedGraphics: 'AMD Radeon Graphics',
      },
      price: '$574',
      image: '/cpu-placeholder.jpg'
    },
    {
      id: 'cpu3',
      name: 'Intel Core i7-13700K',
      brand: 'Intel',
      specs: {
        cores: '16',
        threads: '24',
        baseClock: '3.4 GHz',
        boostClock: '5.4 GHz',
        socket: 'LGA1700',
        tdp: '125W',
        cache: '30MB',
        integratedGraphics: 'Intel UHD Graphics 770',
      },
      price: '$384',
      image: '/cpu-placeholder.jpg'
    },
  ],
  gpu: [
    {
      id: 'gpu1',
      name: 'NVIDIA RTX 4090',
      brand: 'NVIDIA',
      specs: {
        memory: '24GB GDDR6X',
        coreClock: '2.23 GHz',
        boostClock: '2.52 GHz',
        memoryBus: '384-bit',
        tdp: '450W',
        ports: 'HDMI 2.1, 3x DisplayPort 1.4a',
        length: '304mm',
      },
      price: '$1,599',
      image: '/gpu-placeholder.jpg'
    },
    {
      id: 'gpu2',
      name: 'AMD Radeon RX 7900 XTX',
      brand: 'AMD',
      specs: {
        memory: '24GB GDDR6',
        coreClock: '2.3 GHz',
        boostClock: '2.5 GHz',
        memoryBus: '384-bit',
        tdp: '355W',
        ports: 'HDMI 2.1, 2x DisplayPort 2.1',
        length: '287mm',
      },
      price: '$999',
      image: '/gpu-placeholder.jpg'
    },
  ],
  motherboard: [
    {
      id: 'mb1',
      name: 'ASUS ROG MAXIMUS Z790 HERO',
      brand: 'ASUS',
      specs: {
        socket: 'LGA1700',
        chipset: 'Intel Z790',
        formFactor: 'ATX',
        memorySlots: '4x DDR5',
        maxMemory: '128GB',
        m2Slots: '5',
        pciSlots: '3x PCIe 5.0 x16',
        networking: 'WiFi 6E, 2.5G LAN',
      },
      price: '$629',
      image: '/mb-placeholder.jpg'
    },
  ],
  memory: [],
  storage: [],
  'power-supply': [],
  case: [],
  monitor: [],
};

const Comparator = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'cpu');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [availableProducts, setAvailableProducts] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Load products for the selected category
    loadProducts(selectedCategory);
  }, [selectedCategory]);

  const loadProducts = (category) => {
    // Replace with actual API call
    setAvailableProducts(MOCK_PRODUCTS[category] || []);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedProducts([]);
    setSearchTerm('');
  };

  const handleAddProduct = (product) => {
    if (selectedProducts.length >= 4) {
      alert('Maximum 4 products can be compared at once');
      return;
    }
    if (!selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
    setShowProductSelector(false);
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const filteredProducts = availableProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const CategoryIcon = CATEGORIES.find(c => c.id === selectedCategory)?.icon || BsCpuFill;

  // Get all spec keys from selected products
  const getAllSpecKeys = () => {
    const keys = new Set();
    selectedProducts.forEach(product => {
      Object.keys(product.specs || {}).forEach(key => keys.add(key));
    });
    return Array.from(keys);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
            style={{ backgroundColor: colors.mainYellow, color: 'white' }}
          >
            <FiArrowLeft size={20} />
            Back
          </button>
          
          <div className="flex items-center gap-3">
            <MdCompareArrows size={40} style={{ color: colors.mainYellow }} />
            <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
              Compare Components
            </h1>
          </div>
          
          <div style={{ width: '100px' }}></div>
        </div>

        {/* Category Selection */}
        <div className="mb-6">
          <div 
            className="bg-white rounded-lg shadow-lg p-6"
            style={{ border: `2px solid ${colors.platinum}` }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: colors.mainBlack }}>
              Select Category
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {CATEGORIES.map(category => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg transition-all hover:shadow-md cursor-pointer"
                    style={{
                      backgroundColor: isSelected ? colors.mainYellow : 'white',
                      color: isSelected ? 'white' : colors.mainBlack,
                      border: `2px solid ${isSelected ? colors.mainYellow : colors.platinum}`,
                    }}
                  >
                    <Icon size={24} />
                    <span className="text-xs font-semibold text-center">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Products Count */}
        <div className="mb-4 flex items-center justify-between">
          <p style={{ color: colors.jet }}>
            <span className="font-semibold">{selectedProducts.length}</span> of 4 products selected
          </p>
          {selectedProducts.length < 4 && (
            <button
              onClick={() => setShowProductSelector(!showProductSelector)}
              className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
              style={{ backgroundColor: colors.mainYellow, color: 'white' }}
            >
              <FiPlus size={18} />
              Add Product
            </button>
          )}
        </div>

        {/* Product Selector Modal */}
        {showProductSelector && (
          <div 
            className="mb-6 bg-white rounded-lg shadow-lg p-6"
            style={{ border: `2px solid ${colors.platinum}` }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold" style={{ color: colors.mainBlack }}>
                Select a Product to Compare
              </h3>
              <button
                onClick={() => setShowProductSelector(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <FiX size={20} style={{ color: colors.mainBlack }} />
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <FiSearch 
                className="absolute left-4 top-1/2 -translate-y-1/2" 
                style={{ color: colors.mainYellow }} 
                size={20} 
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg font-medium transition-all focus:outline-none focus:ring-2"
                style={{
                  border: `2px solid ${colors.platinum}`,
                  backgroundColor: 'white',
                  color: colors.jet
                }}
              />
            </div>

            {/* Product List */}
            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredProducts.map(product => {
                const isAlreadySelected = selectedProducts.find(p => p.id === product.id);
                return (
                  <button
                    key={product.id}
                    onClick={() => !isAlreadySelected && handleAddProduct(product)}
                    disabled={isAlreadySelected}
                    className="w-full p-4 rounded-lg transition-all hover:shadow-md text-left disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    style={{
                      border: `2px solid ${colors.platinum}`,
                      backgroundColor: isAlreadySelected ? colors.platinum : 'white',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold" style={{ color: colors.mainBlack }}>
                          {product.name}
                        </h4>
                        <p className="text-sm" style={{ color: colors.jet }}>
                          {product.brand}
                        </p>
                      </div>
                      <p className="font-bold text-lg" style={{ color: colors.mainYellow }}>
                        {product.price}
                      </p>
                    </div>
                  </button>
                );
              })}
              {filteredProducts.length === 0 && (
                <p className="text-center py-8" style={{ color: colors.jet }}>
                  No products found
                </p>
              )}
            </div>
          </div>
        )}

        {/* Comparison Table */}
        {selectedProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-lg" style={{ border: `2px solid ${colors.platinum}` }}>
            <CategoryIcon size={64} style={{ color: colors.platinum }} className="mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2" style={{ color: colors.mainBlack }}>
              No Products Selected
            </h2>
            <p style={{ color: colors.jet }}>
              Add products to start comparing
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ border: `2px solid ${colors.platinum}` }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: colors.mainBeige }}>
                    <th 
                      className="p-4 text-left font-bold sticky left-0 z-10"
                      style={{ 
                        backgroundColor: colors.mainBeige,
                        color: colors.mainBlack,
                        minWidth: '200px'
                      }}
                    >
                      Specification
                    </th>
                    {selectedProducts.map(product => (
                      <th 
                        key={product.id}
                        className="p-4 text-center relative"
                        style={{ 
                          color: colors.mainBlack,
                          minWidth: '250px'
                        }}
                      >
                        <button
                          onClick={() => handleRemoveProduct(product.id)}
                          className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-100 transition-colors cursor-pointer"
                          style={{ color: colors.error }}
                        >
                          <FiX size={18} />
                        </button>
                        <div className="pt-6">
                          <h3 className="font-bold text-sm mb-1">{product.name}</h3>
                          <p className="text-xs" style={{ color: colors.jet }}>{product.brand}</p>
                          <p className="text-lg font-bold mt-2" style={{ color: colors.mainYellow }}>
                            {product.price}
                          </p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {getAllSpecKeys().map((specKey, index) => (
                    <tr 
                      key={specKey}
                      style={{ 
                        backgroundColor: index % 2 === 0 ? 'white' : colors.mainBeige,
                        borderTop: `1px solid ${colors.platinum}`
                      }}
                    >
                      <td 
                        className="p-4 font-semibold sticky left-0 z-10"
                        style={{ 
                          backgroundColor: index % 2 === 0 ? 'white' : colors.mainBeige,
                          color: colors.mainBlack
                        }}
                      >
                        {specKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </td>
                      {selectedProducts.map(product => (
                        <td 
                          key={product.id}
                          className="p-4 text-center"
                          style={{ color: colors.jet }}
                        >
                          {product.specs[specKey] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {selectedProducts.length > 0 && (
          <div className="mt-6 flex gap-4 justify-center">
            <button
              onClick={() => setSelectedProducts([])}
              className="px-6 py-3 rounded-lg font-semibold hover:opacity-80 transition-opacity cursor-pointer"
              style={{ 
                backgroundColor: 'white',
                color: colors.mainYellow,
                border: `2px solid ${colors.mainYellow}`
              }}
            >
              Clear All
            </button>
            <button
              onClick={() => window.print()}
              className="px-6 py-3 rounded-lg font-semibold hover:opacity-80 transition-opacity cursor-pointer"
              style={{ backgroundColor: colors.mainYellow, color: 'white' }}
            >
              Print Comparison
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Comparator;
