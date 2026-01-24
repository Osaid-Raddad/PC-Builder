import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaShoppingCart, 
  FaHeart, 
  FaRegHeart, 
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaShare,
  FaUser,
  FaCheckCircle
} from 'react-icons/fa';
import { MdCompare } from 'react-icons/md';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaPlus } from 'react-icons/fa';
import { BsCpuFill } from 'react-icons/bs';
import { FaMicrochip, FaMemory, FaHdd } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Navbar from '../../../components/user/navbar/Navbar.jsx';
import Footer from '../../../components/user/footer/Footer.jsx';
import colors from '../../../config/colors.js';
import { useBuild } from '../../../context/BuildContext';
import {
  getCPUImage,
  getGPUImage,
  getMotherboardImage,
  getMemoryImage,
  getStorageImage,
  getCaseImage,
  getPSUImage,
  getMonitorImage,
  getCPUCoolerImage
} from '../../../utils/imageMapper';

// Import all product data
import cpusData from '../../../data/components/cpus.json';
import gpusData from '../../../data/components/gpus.json';
import motherboardsData from '../../../data/components/motherboards.json';
import memoryData from '../../../data/components/memory.json';
import storageData from '../../../data/components/storage.json';
import casesData from '../../../data/components/cases.json';
import powerSuppliesData from '../../../data/components/powerSupplies.json';
import monitorsData from '../../../data/components/monitors.json';
import cpuCoolersData from '../../../data/components/cpuCoolers.json';
import accessoriesData from '../../../data/components/accessories.json';
import expansionData from '../../../data/components/expansion.json';
import peripheralsData from '../../../data/components/peripherals.json';

const ProductDetails = () => {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const { addComponent } = useBuild();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeTab, setActiveTab] = useState('specs'); // specs, reviews, compatibility

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProductDetails();
  }, [id, category]);

  const getProductData = () => {
    try {
      // Map category to the appropriate data source
      let productList;
      let componentKey; // for BuildContext
      
      console.log('Category received:', category);
      
      switch(category) {
        case 'cpu':
          productList = cpusData?.cpus;
          componentKey = 'cpu';
          break;
        case 'gpu':
          productList = gpusData?.gpus;
          componentKey = 'gpu';
          break;
        case 'motherboard':
          productList = motherboardsData?.motherboards;
          componentKey = 'motherboard';
          break;
        case 'memory':
          productList = memoryData?.memory;
          componentKey = 'memory';
          break;
        case 'storage':
          productList = storageData?.storage;
          componentKey = 'storage';
          break;
        case 'case':
          productList = casesData?.cases;
          componentKey = 'case';
          break;
        case 'power-supply':
        case 'powersupply': // Handle both variations
          productList = powerSuppliesData?.powerSupplies;
          componentKey = 'psu';
          break;
        case 'monitor':
          console.log('Monitor data:', monitorsData);
          productList = Array.isArray(monitorsData) ? monitorsData : monitorsData?.monitors;
          componentKey = 'monitor';
          break;
        case 'cooler':
        case 'cpucooler': // Handle both variations
          productList = cpuCoolersData?.cpuCoolers;
          componentKey = 'cooler';
          break;
        case 'accessories':
          console.log('Accessories data:', accessoriesData);
          productList = Array.isArray(accessoriesData) ? accessoriesData : accessoriesData?.accessories;
          componentKey = 'accessories';
          break;
        case 'expansion':
          console.log('Expansion data:', expansionData);
          productList = Array.isArray(expansionData) ? expansionData : expansionData?.expansion;
          componentKey = 'expansion';
          break;
        case 'peripherals':
          console.log('Peripherals data:', peripheralsData);
          productList = Array.isArray(peripheralsData) ? peripheralsData : peripheralsData?.peripherals;
          componentKey = 'peripherals';
          break;
        default:
          console.error('Unknown category:', category);
          return null;
      }
      
      console.log('Product list loaded:', productList ? `${productList.length} items` : 'undefined');
      
      if (!productList || !Array.isArray(productList)) {
        console.error('Product list is not an array or is undefined for category:', category);
        return null;
      }
      
      // Handle both string and numeric IDs
      const rawProduct = productList.find(p => p.id === id || p.id === parseInt(id) || p.id.toString() === id.toString());
      if (!rawProduct) {
        console.error('Product not found in list. ID:', id, 'Available IDs:', productList.map(p => p.id).slice(0, 10));
        return null;
      }

      console.log('Found product:', rawProduct);

      // Get proper image source using imageMapper functions
      let mainImageSource = null;
      const brand = rawProduct.brand || rawProduct.manufacturer;
      const model = rawProduct.model;
      
      switch(category) {
        case 'cpu':
          mainImageSource = getCPUImage(model);
          break;
        case 'gpu':
          mainImageSource = getGPUImage(brand, model);
          break;
        case 'motherboard':
          mainImageSource = getMotherboardImage(brand, model);
          break;
        case 'memory':
          mainImageSource = getMemoryImage(brand, model);
          break;
        case 'storage':
          mainImageSource = getStorageImage(brand, model);
          break;
        case 'case':
          mainImageSource = getCaseImage(brand, model);
          break;
        case 'power-supply':
        case 'powersupply':
          mainImageSource = getPSUImage(brand, model);
          break;
        case 'monitor':
          mainImageSource = getMonitorImage(brand, model);
          break;
        case 'cooler':
        case 'cpucooler':
          mainImageSource = getCPUCoolerImage(brand, model);
          break;
        default:
          mainImageSource = null;
      }
      
      // Fallback to placeholder if no image found
      const mainImage = mainImageSource || 'https://via.placeholder.com/800x600/242423/f3bd4a?text=Product+Image';
      
      return {
        ...rawProduct,
        componentKey, // Store for AddToBuild functionality
        name: rawProduct.name || `${rawProduct.brand || rawProduct.manufacturer} ${rawProduct.model}`,
        brand: rawProduct.brand || rawProduct.manufacturer,
        category: category,
        originalPrice: rawProduct.price * 1.2, // 20% markup for display
        rating: rawProduct.rating || 4.5,
        reviewCount: Math.floor(Math.random() * 500) + 50,
        likes: Math.floor(Math.random() * 300) + 20,
        shares: Math.floor(Math.random() * 100) + 5,
        inStock: true,
        images: [
          mainImage,
          mainImage,
          mainImage,
          mainImage
        ],
        description: generateDescription(rawProduct, category),
        specifications: generateSpecifications(rawProduct, category),
        features: generateFeatures(rawProduct, category),
        compatibility: generateCompatibility(rawProduct, category),
        reviews: generateMockReviews()
      };
    } catch (error) {
      console.error('Error in getProductData:', error);
      return null;
    }
  };

  const generateDescription = (product, category) => {
    const brand = product.brand || product.manufacturer;
    
    switch(category) {
      case 'cpu':
        return `High-performance ${product.cores}-core processor from ${brand}. Perfect for gaming and demanding applications with ${product.baseClockGHz}GHz base clock and ${product.boostClockGHz}GHz boost. ${product.tdpWatts}W TDP ensures efficient power consumption.`;
      case 'gpu':
        return `Powerful graphics card featuring ${product.memoryGB}GB ${product.memoryType} memory. Core clock of ${product.coreClockMHz}MHz and boost clock of ${product.boostClockMHz}MHz. Performance score: ${product.performanceScore}.`;
      case 'motherboard':
        return `Feature-rich motherboard with ${product.socket} socket and ${product.formFactor} form factor. Supports ${product.memoryType} memory with ${product.memorySlots} slots and ${product.maxMemoryGB}GB maximum capacity.`;
      case 'memory':
        return `High-speed ${product.modules} memory kit with ${product.totalCapacityGB}GB total capacity. ${product.speedMHz}MHz speed with CL${product.casLatency} timing. ${product.color} heatspreader design.`;
      case 'storage':
        return `${product.capacityGB}GB ${product.type} storage with ${product.formFactor} form factor. ${product.interface} interface ensures fast data transfer speeds. Cache: ${product.cacheMB}MB.`;
      case 'case':
        return `Stylish ${product.type} case with ${product.color} finish. Supports motherboards up to ${product.motherboardFormFactor}. Includes ${product.includedFans} fans and has ${product.maxFans} fan mounting points.`;
      case 'power-supply':
      case 'powersupply':
        return `Reliable ${product.wattage}W power supply with ${product.efficiencyRating} efficiency certification. ${product.modular} cable management and ${product.fanSize}mm fan for quiet operation.`;
      case 'monitor':
        return `${product.screenSize}" monitor with ${product.resolution} resolution. ${product.refreshRate}Hz refresh rate and ${product.responseTime}ms response time. ${product.panelType} panel technology for excellent color accuracy and viewing angles.`;
      case 'cooler':
      case 'cpucooler':
        return `${product.type} CPU cooler with ${product.fanSize}mm fan. Compatible with ${product.socket} and ${product.tdpWatts}W TDP. Noise level: ${product.noiseLevel}dB.`;
      case 'accessories':
        return `Quality ${product.category || 'accessory'} from ${brand}. ${product.name} offers great value and performance for your build.`;
      case 'expansion':
        return `${product.type} expansion card from ${brand}. ${product.name} provides enhanced functionality for your system.`;
      case 'peripherals':
        return `Premium ${product.type} from ${brand}. ${product.name} delivers excellent performance and reliability.`;
      default:
        return `Quality ${category} component from ${brand}. Professional-grade performance and reliability.`;
    }
  };

  const generateSpecifications = (product, category) => {
    const brand = product.brand || product.manufacturer;
    const model = product.model || '';
    
    switch(category) {
      case 'cpu':
        return {
          'Brand': product.brand,
          'Model': product.model,
          'Cores': product.cores,
          'Threads': product.threads,
          'Base Clock': `${product.baseClockGHz} GHz`,
          'Boost Clock': `${product.boostClockGHz} GHz`,
          'TDP': `${product.tdpWatts}W`,
          'Socket': product.socket,
          'Integrated Graphics': product.integratedGraphics || 'No',
          'Performance Score': product.performanceScore
        };
      case 'gpu':
        return {
          'Brand': product.brand,
          'Model': product.model,
          'Memory': `${product.memoryGB}GB ${product.memoryType}`,
          'Core Clock': `${product.coreClockMHz} MHz`,
          'Boost Clock': `${product.boostClockMHz} MHz`,
          'TDP': `${product.tdpWatts}W`,
          'Length': `${product.length}mm`,
          'PCI Slots': product.pciSlots,
          'Performance Score': product.performanceScore
        };
      case 'motherboard':
        return {
          'Brand': product.brand,
          'Model': product.model,
          'Socket': product.socket,
          'Form Factor': product.formFactor,
          'Chipset': product.chipset,
          'Memory Type': product.memoryType,
          'Memory Slots': product.memorySlots,
          'Max Memory': `${product.maxMemoryGB}GB`,
          'PCIe x16 Slots': product.pcie16Slots,
          'M.2 Slots': product.m2Slots
        };
      case 'memory':
        return {
          'Brand': product.brand,
          'Model': product.model,
          'Type': product.type,
          'Speed': `${product.speedMHz} MHz`,
          'Modules': product.modules,
          'Capacity per Module': `${product.capacityPerModuleGB}GB`,
          'Total Capacity': `${product.totalCapacityGB}GB`,
          'CAS Latency': `CL${product.casLatency}`,
          'Color': product.color
        };
      case 'storage':
        return {
          'Brand': product.brand,
          'Model': product.model,
          'Type': product.type,
          'Capacity': `${product.capacityGB}GB`,
          'Form Factor': product.formFactor,
          'Interface': product.interface,
          'Cache': `${product.cacheMB}MB`,
          'Read Speed': product.readSpeed || 'N/A',
          'Write Speed': product.writeSpeed || 'N/A'
        };
      case 'case':
        return {
          'Brand': product.brand,
          'Model': product.model,
          'Type': product.type,
          'Color': product.color,
          'Form Factor': product.motherboardFormFactor,
          'Included Fans': product.includedFans,
          'Max Fans': product.maxFans,
          'Side Panel': product.sidePanel
        };
      case 'power-supply':
      case 'powersupply':
        return {
          'Brand': product.brand,
          'Model': product.model,
          'Wattage': `${product.wattage}W`,
          'Efficiency': product.efficiencyRating,
          'Modular': product.modular,
          'Fan Size': `${product.fanSize}mm`,
          'Length': `${product.length}mm`
        };
      case 'monitor':
        return {
          'Brand': brand,
          'Model': model || product.name,
          'Screen Size': `${product.screenSize}"`,
          'Resolution': product.resolution,
          'Refresh Rate': `${product.refreshRate}Hz`,
          'Response Time': `${product.responseTime}ms`,
          'Panel Type': product.panelType,
          'Adaptive Sync': product.adaptiveSync || 'No'
        };
      case 'cooler':
      case 'cpucooler':
        return {
          'Brand': brand,
          'Model': model,
          'Type': product.type,
          'Fan Size': `${product.fanSize}mm`,
          'Socket': product.socket,
          'TDP': `${product.tdpWatts}W`,
          'Noise Level': `${product.noiseLevel}dB`,
          'Height': `${product.height}mm`
        };
      case 'accessories':
        return {
          'Brand': brand,
          'Name': product.name,
          'Category': product.category,
          'Type': product.type,
          'Price': `$${product.price}`
        };
      case 'expansion':
        return {
          'Brand': brand,
          'Name': product.name,
          'Type': product.type,
          'Interface': product.interface,
          'Price': `$${product.price}`
        };
      case 'peripherals':
        return {
          'Brand': brand,
          'Name': product.name,
          'Type': product.type,
          'Price': `$${product.price}`
        };
      default:
        return {
          'Brand': brand,
          'Name': product.name || `${brand} ${model}`,
          'Price': `$${product.price}`
        };
    }
  };

  const generateFeatures = (product, category) => {
    const features = [];
    
    switch(category) {
      case 'cpu':
        features.push(`${product.cores} cores / ${product.threads} threads for multitasking`);
        features.push(`Up to ${product.boostClockGHz}GHz boost frequency`);
        if (product.integratedGraphics) features.push(`Integrated ${product.integratedGraphics} graphics`);
        features.push(`Compatible with ${product.socket} motherboards`);
        break;
      case 'gpu':
        features.push(`${product.memoryGB}GB ${product.memoryType} high-speed memory`);
        features.push(`Performance score: ${product.performanceScore}`);
        features.push(`Boost clock up to ${product.boostClockMHz}MHz`);
        features.push(`${product.pciSlots}-slot design`);
        break;
      case 'motherboard':
        features.push(`Supports ${product.memoryType} memory up to ${product.maxMemoryGB}GB`);
        features.push(`${product.pcie16Slots} PCIe x16 slots for expansion`);
        features.push(`${product.m2Slots} M.2 slots for fast storage`);
        features.push(`${product.formFactor} form factor`);
        break;
      case 'memory':
        features.push(`${product.totalCapacityGB}GB total capacity (${product.modules})`);
        features.push(`${product.speedMHz}MHz for fast performance`);
        features.push(`Low latency CL${product.casLatency} timing`);
        features.push(`${product.color} design`);
        break;
      default:
        features.push('High-quality construction');
        features.push('Reliable performance');
        features.push('Great value for money');
    }
    
    return features;
  };

  const generateCompatibility = (product, category) => {
    const compat = [];
    
    switch(category) {
      case 'cpu':
        compat.push(`Compatible with ${product.socket} motherboards`);
        compat.push(`Requires appropriate cooling solution`);
        compat.push(`Check motherboard compatibility for full feature support`);
        break;
      case 'gpu':
        compat.push(`Requires ${product.pciSlots} PCIe slots`);
        compat.push(`Minimum ${product.tdpWatts}W power supply recommended`);
        compat.push(`Check case clearance (${product.length}mm length)`);
        break;
      case 'motherboard':
        compat.push(`Supports ${product.socket} processors`);
        compat.push(`${product.memorySlots} slots for ${product.memoryType} memory`);
        compat.push(`Compatible with ${product.formFactor} cases`);
        break;
      case 'memory':
        compat.push(`Compatible with ${product.type} memory slots`);
        compat.push(`Check motherboard support for ${product.speedMHz}MHz speed`);
        compat.push(`XMP/DOCP profile support may be required`);
        break;
      default:
        compat.push('Check product specifications for compatibility');
        compat.push('Consult manufacturer documentation');
    }
    
    return compat;
  };

  const generateMockReviews = () => {
    const reviewTemplates = [
      {
        userName: 'TechEnthusiast',
        rating: 5,
        title: 'Excellent Product!',
        comment: 'This product exceeded my expectations. Great performance and quality.',
        helpful: Math.floor(Math.random() * 100) + 20,
        verified: true
      },
      {
        userName: 'PCBuilder2024',
        rating: 4,
        title: 'Good value',
        comment: 'Solid product for the price. Works as expected.',
        helpful: Math.floor(Math.random() * 80) + 10,
        verified: true
      },
      {
        userName: 'GamerPro',
        rating: 5,
        title: 'Perfect for my build',
        comment: 'Exactly what I needed. Highly recommended!',
        helpful: Math.floor(Math.random() * 120) + 30,
        verified: false
      }
    ];
    
    return reviewTemplates.map((review, index) => ({
      ...review,
      id: index + 1,
      date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));
  };

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      console.log('Fetching product details for category:', category, 'id:', id);
      const productData = getProductData();
      
      if (!productData) {
        console.log('Product not found for category:', category, 'id:', id);
        setProduct(null);
      } else {
        console.log('Product data loaded:', productData);
        setProduct(productData);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      console.error('Category:', category, 'ID:', id);
      toast.error('Failed to load product details');
      setProduct(null);
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    toast.success('Added to cart!');
    // Add your cart logic here
  };

  const handleAddToBuild = () => {
    if (product) {
      try {
        // Use the componentKey we stored when transforming the product
        addComponent(product.componentKey, product);
        toast.success(`${product.name} added to your build!`);
        navigate('/builder');
      } catch (error) {
        toast.error('Failed to add to build');
        console.error('Error adding to build:', error);
      }
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleRating = (rating) => {
    setUserRating(rating);
    toast.success(`Rated ${rating} stars!`);
  };

  const renderStars = (rating, size = 20, interactive = false) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <FaStar 
            key={i} 
            size={size} 
            style={{ color: colors.mainYellow, cursor: interactive ? 'pointer' : 'default' }}
            onClick={() => interactive && handleRating(i)}
          />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <FaStarHalfAlt 
            key={i} 
            size={size} 
            style={{ color: colors.mainYellow, cursor: interactive ? 'pointer' : 'default' }}
            onClick={() => interactive && handleRating(i)}
          />
        );
      } else {
        stars.push(
          <FaRegStar 
            key={i} 
            size={size} 
            style={{ color: colors.platinum, cursor: interactive ? 'pointer' : 'default' }}
            onClick={() => interactive && handleRating(i)}
          />
        );
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-2xl font-bold" style={{ color: colors.mainBlack }}>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: colors.mainBlack }}>Product not found</h2>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            style={{ 
              backgroundColor: colors.mainYellow,
              color: 'white'
            }}
          >
            Go Back
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb / Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md group"
            style={{ 
              backgroundColor: colors.mainYellow,
              color: 'white',
              border: `1px solid ${colors.mainYellow}`,
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = colors.mainYellow;
              e.currentTarget.style.borderColor = colors.mainYellow;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.mainYellow;
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.borderColor = colors.mainYellow;
            }}
          >
            <FiChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to Products</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Side - Images */}
          <div>
            {/* Main Image */}
            <div 
              className="rounded-lg overflow-hidden mb-4 relative"
              style={{ backgroundColor: 'white', border: `2px solid ${colors.platinum}` }}
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-[500px] object-cover"
              />
              
              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(prev => prev === 0 ? product.images.length - 1 : prev - 1)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: colors.mainYellow }}
                  >
                    <FiChevronLeft size={24} color="white" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(prev => prev === product.images.length - 1 ? 0 : prev + 1)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: colors.mainYellow }}
                  >
                    <FiChevronRight size={24} color="white" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'ring-2' : ''
                  }`}
                  style={{ 
                    borderColor: selectedImage === index ? colors.mainYellow : colors.platinum,
                    ringColor: colors.mainYellow
                  }}
                >
                  <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Details */}
          <div>
            {/* Category Badge */}
            <div className="mb-2">
              <span 
                className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: colors.mainYellow }}
              >
                {product.category}
              </span>
            </div>

            {/* Product Name */}
            <h1 className="text-4xl font-bold mb-2" style={{ color: colors.mainBlack }}>
              {product.name}
            </h1>
            
            {/* Brand Info */}
            <div className="flex items-center gap-2 mb-3">
              <span style={{ color: colors.jet }}>Brand: <span className="font-semibold">{product.brand}</span></span>
            </div>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1">
                {renderStars(product.rating)}
              </div>
              <span className="font-bold text-lg" style={{ color: colors.mainBlack }}>
                {product.rating}
              </span>
              <button 
                onClick={() => setActiveTab('reviews')}
                className="hover:underline"
                style={{ color: colors.jet }}
              >
                {product.reviewCount} reviews
              </button>
            </div>

            {/* Social Stats */}
            <div className="flex items-center gap-6 mb-4">
              <span style={{ color: colors.jet }}>
                <FaHeart size={18} className="inline mr-1" style={{ color: colors.mainYellow }} />
                {product.likes} likes
              </span>
              <span style={{ color: colors.jet }}>
                <FaShare size={18} className="inline mr-1" style={{ color: colors.mainYellow }} />
                {product.shares} shares
              </span>
            </div>

            <hr style={{ borderColor: colors.platinum }} className="my-6" />

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold" style={{ color: colors.mainYellow }}>
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-sm" style={{ color: colors.jet }}>USD</span>
              </div>
              <p className="text-sm mt-1" style={{ color: colors.jet }}>
                Free shipping available
              </p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2" style={{ color: colors.mainBlack }}>
                Description
              </h3>
              <p 
                className="leading-relaxed"
                style={{ color: colors.jet }}
              >
                {showFullDescription ? product.description : `${product.description.substring(0, 200)}...`}
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="ml-2 font-semibold hover:underline"
                  style={{ color: colors.mainYellow }}
                >
                  {showFullDescription ? 'Show less' : 'Read more'}
                </button>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mb-6">
              {/* Add to Build - Primary Action */}
              <button
                onClick={handleAddToBuild}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-bold hover:opacity-90 transition-opacity text-lg"
                style={{ 
                  backgroundColor: colors.mainYellow,
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                <FaPlus size={20} />
                Add to Build
              </button>  
            </div>
          </div>
        </div>

        <hr style={{ borderColor: colors.platinum }} className="my-8" />

        {/* Tabs Section */}
        <div className="mb-8">
          {/* Tab Headers */}
          <div className="flex gap-4 border-b-2 mb-6" style={{ borderColor: colors.platinum }}>
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'specs' ? 'border-b-4' : ''
              }`}
              style={{ 
                color: activeTab === 'specs' ? colors.mainYellow : colors.jet,
                borderColor: activeTab === 'specs' ? colors.mainYellow : 'transparent'
              }}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'reviews' ? 'border-b-4' : ''
              }`}
              style={{ 
                color: activeTab === 'reviews' ? colors.mainYellow : colors.jet,
                borderColor: activeTab === 'reviews' ? colors.mainYellow : 'transparent'
              }}
            >
              Reviews ({product.reviewCount})
            </button>
            <button
              onClick={() => setActiveTab('compatibility')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'compatibility' ? 'border-b-4' : ''
              }`}
              style={{ 
                color: activeTab === 'compatibility' ? colors.mainYellow : colors.jet,
                borderColor: activeTab === 'compatibility' ? colors.mainYellow : 'transparent'
              }}
            >
              Compatibility & Features
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div
                  key={key}
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: 'white', border: `1px solid ${colors.platinum}` }}
                >
                  <div className="flex items-center gap-3">
                    {(key.toLowerCase().includes('core') || key.toLowerCase().includes('thread')) && 
                      <BsCpuFill size={24} style={{ color: colors.mainYellow }} />}
                    {key.toLowerCase().includes('clock') && 
                      <FaMicrochip size={24} style={{ color: colors.mainYellow }} />}
                    {key.toLowerCase().includes('cache') && 
                      <FaMemory size={24} style={{ color: colors.mainYellow }} />}
                    <div className="flex-1">
                      <p className="text-sm font-semibold uppercase" style={{ color: colors.jet }}>
                        {key}
                      </p>
                      <p className="text-lg font-bold" style={{ color: colors.mainBlack }}>
                        {value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              {/* Rating Summary */}
              <div className="p-6 rounded-lg mb-6" style={{ backgroundColor: 'white' }}>
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="text-center">
                    <p className="text-6xl font-bold mb-2" style={{ color: colors.mainYellow }}>
                      {product.rating}
                    </p>
                    <div className="flex gap-1 mb-2 justify-center">
                      {renderStars(product.rating, 24)}
                    </div>
                    <p style={{ color: colors.jet }}>{product.reviewCount} total ratings</p>
                  </div>
                  
                  <div className="flex-1 w-full">
                    <h3 className="text-lg font-bold mb-3" style={{ color: colors.mainBlack }}>
                      Rate this product
                    </h3>
                    <div className="flex gap-2">
                      {renderStars(userRating || 0, 32, true)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {product.reviews.map(review => (
                  <div
                    key={review.id}
                    className="p-6 rounded-lg"
                    style={{ backgroundColor: 'white', border: `1px solid ${colors.platinum}` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: colors.platinum }}
                        >
                          <FaUser size={20} style={{ color: colors.mainBlack }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold" style={{ color: colors.mainBlack }}>
                              {review.userName}
                            </p>
                            {review.verified && (
                              <FaCheckCircle size={16} style={{ color: colors.mainYellow }} title="Verified Purchase" />
                            )}
                          </div>
                          <p className="text-sm" style={{ color: colors.jet }}>
                            {new Date(review.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {renderStars(review.rating, 18)}
                      </div>
                    </div>
                    
                    <h4 className="font-bold text-lg mb-2" style={{ color: colors.mainBlack }}>
                      {review.title}
                    </h4>
                    <p className="mb-3 leading-relaxed" style={{ color: colors.jet }}>
                      {review.comment}
                    </p>
                    
                    <button
                      className="text-sm hover:underline"
                      style={{ color: colors.jet }}
                    >
                      👍 Helpful ({review.helpful})
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'compatibility' && (
            <div className="space-y-6">
              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div
                  className="p-6 rounded-lg"
                  style={{ backgroundColor: 'white', border: `1px solid ${colors.platinum}` }}
                >
                  <h3 className="text-2xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                    Key Features
                  </h3>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span style={{ color: colors.mainYellow }}>✓</span>
                        <span style={{ color: colors.jet }}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Compatibility */}
              {product.compatibility && product.compatibility.length > 0 && (
                <div
                  className="p-6 rounded-lg"
                  style={{ backgroundColor: 'white', border: `1px solid ${colors.platinum}` }}
                >
                  <h3 className="text-2xl font-bold mb-4" style={{ color: colors.mainBlack }}>
                    Compatibility Information
                  </h3>
                  <ul className="space-y-3">
                    {product.compatibility.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span style={{ color: colors.mainYellow }}>ℹ</span>
                        <span style={{ color: colors.jet }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductDetails;
