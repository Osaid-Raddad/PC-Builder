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
import { BsCpuFill } from 'react-icons/bs';
import { FaMicrochip, FaMemory, FaHdd } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Navbar from '../../../components/user/navbar/Navbar.jsx';
import Footer from '../../../components/user/footer/Footer.jsx';
import colors from '../../../config/colors.js';

const ProductDetails = () => {
  const { category, id } = useParams();
  const navigate = useNavigate();
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

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      // const response = await axios.get(`/api/products/${category}/${id}`);
      
      // Mock data for demonstration
      const mockProduct = {
        id: id,
        name: 'Intel Core i9-14900K',
        category: category,
        brand: 'Intel',
        price: 589.99,
        originalPrice: 649.99,
        rating: 4.8,
        reviewCount: 342,
        likes: 256,
        shares: 48,
        inStock: true,
        images: [
          'https://via.placeholder.com/800x600/242423/f3bd4a?text=Product+Image+1',
          'https://via.placeholder.com/800x600/242423/efece1?text=Product+Image+2',
          'https://via.placeholder.com/800x600/242423/CFDBD5?text=Product+Image+3',
          'https://via.placeholder.com/800x600/242423/333533?text=Product+Image+4'
        ],
        description: 'High-performance processor designed for gaming and content creation with exceptional multi-threaded performance. Perfect for 4K gaming at ultra settings. Features advanced architecture and premium performance capabilities. Overclocked for extra performance. Advanced thermal management keeps everything running cool and quiet.',
        specifications: {
          'Cores': '24 (8P + 16E)',
          'Threads': '32',
          'Base Clock': '3.2 GHz',
          'Boost Clock': '6.0 GHz',
          'TDP': '125W',
          'Socket': 'LGA 1700',
          'Cache': '36 MB',
          'Integrated Graphics': 'Intel UHD Graphics 770',
        },
        features: [
          'Unlocked for overclocking',
          'Support for DDR5 memory',
          'PCIe 5.0 support',
          'Intel Thread Director',
          'Intel Thermal Velocity Boost',
        ],
        compatibility: [
          'Compatible with LGA 1700 motherboards',
          'Requires BIOS update for some boards',
          'DDR5 memory recommended',
        ],
        reviews: [
          {
            id: 1,
            userName: 'TechGuru',
            rating: 5,
            date: '2024-10-15',
            title: 'Outstanding Performance!',
            comment: 'Best CPU I\'ve ever used. Handles everything I throw at it with ease. Gaming performance is phenomenal!',
            helpful: 89,
            verified: true
          },
          {
            id: 2,
            userName: 'BuilderPro',
            rating: 4,
            date: '2024-10-10',
            title: 'Great but runs hot',
            comment: 'Performance is excellent but requires a good cooler. Make sure you have proper cooling solution.',
            helpful: 45,
            verified: true
          },
          {
            id: 3,
            userName: 'GamerX',
            rating: 5,
            date: '2024-10-05',
            title: 'Perfect for gaming',
            comment: 'Zero bottleneck with my RTX 4090. Highly recommended for high-end builds!',
            helpful: 123,
            verified: false
          }
        ],
      };
      
      setProduct(mockProduct);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product details');
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    toast.success('Added to cart!');
    // Add your cart logic here
  };

  const handleAddToBuild = () => {
    toast.success('Added to PC build!');
    navigate('/builder');
    // Add your build logic here
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
              border: `1px solid ${colors.mainYellow}`
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
            <div className="flex gap-3 mb-6">
              <button
                onClick={toggleFavorite}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                style={{ 
                  backgroundColor: isFavorite ? colors.mainYellow : 'white',
                  color: isFavorite ? 'white' : colors.mainYellow,
                  border: `2px solid ${colors.mainYellow}`
                }}
              >
                {isFavorite ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
                {isFavorite ? 'Liked' : 'Like'}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                style={{ 
                  backgroundColor: 'white',
                  color: colors.mainYellow,
                  border: `2px solid ${colors.mainYellow}`
                }}
              >
                <FaShare size={20} />
                Share
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
