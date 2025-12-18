import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../../../components/user/navbar/Navbar.jsx';
import Footer from '../../../../components/user/footer/Footer.jsx';
import colors from '../../../../config/colors.js';
import { 
  FaHeart, 
  FaRegHeart, 
  FaShare, 
  FaStar, 
  FaRegStar,
  FaStarHalfAlt,
  FaUser,
  FaCheckCircle,
  FaShoppingCart
} from 'react-icons/fa';
import { BsCpuFill } from 'react-icons/bs';
import { FaMicrochip, FaMemory, FaHdd } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const BuildDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [build, setBuild] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeTab, setActiveTab] = useState('specs'); // specs, reviews, qna

  useEffect(() => {
    window.scrollTo(0, 0);
    // TODO: Fetch build details from backend using id
    fetchBuildDetails();
  }, [id]);

  const fetchBuildDetails = () => {
    // Mock data - replace with actual API call
    const mockBuilds = [
      {
        id: 1,
        name: 'Beast Gaming Rig',
        owner: 'John Doe',
        ownerAvatar: null,
        category: 'Gaming',
        price: 2499.99,
        rating: 4.8,
        reviewCount: 127,
        likes: 342,
        shares: 89,
        images: [
          'https://via.placeholder.com/800x600/242423/f3bd4a?text=Beast+Gaming+Rig',
          'https://via.placeholder.com/800x600/242423/efece1?text=Side+View',
          'https://via.placeholder.com/800x600/242423/CFDBD5?text=Interior',
          'https://via.placeholder.com/800x600/242423/333533?text=RGB+Lighting'
        ],
        description: 'This is the ultimate gaming beast! Built with top-tier components for maximum performance. Perfect for 4K gaming at ultra settings. Features custom RGB lighting and premium cable management. Overclocked CPU and GPU for extra performance. Liquid cooling keeps everything running cool and quiet.',
        specs: {
          cpu: 'Intel Core i9-13900K',
          gpu: 'NVIDIA RTX 4090 24GB',
          ram: 'Corsair Vengeance 64GB DDR5-6000',
          storage: 'Samsung 990 Pro 2TB NVMe',
          motherboard: 'ASUS ROG Maximus Z790 Hero',
          psu: 'Corsair RM1000x 1000W 80+ Gold',
          cooler: 'Corsair iCUE H150i Elite',
          case: 'Lian Li O11 Dynamic EVO'
        },
        reviews: [
          {
            id: 1,
            userName: 'Mike Johnson',
            rating: 5,
            date: '2024-10-15',
            title: 'Absolutely Amazing!',
            comment: 'Best gaming PC I\'ve ever owned. Runs everything at max settings without breaking a sweat. Cable management is pristine!',
            helpful: 45,
            verified: true
          },
          {
            id: 2,
            userName: 'Sarah Williams',
            rating: 4,
            date: '2024-10-10',
            title: 'Great Build, Minor Issues',
            comment: 'Overall fantastic build. Only complaint is the RGB could be synchronized better. Performance is top notch though!',
            helpful: 23,
            verified: true
          },
          {
            id: 3,
            userName: 'David Chen',
            rating: 5,
            date: '2024-10-05',
            title: 'Worth Every Penny',
            comment: 'The attention to detail is incredible. Perfect for streaming and gaming simultaneously. Highly recommend!',
            helpful: 67,
            verified: false
          }
        ],
        qna: [
          {
            id: 1,
            question: 'Can this handle 4K gaming at 144Hz?',
            answer: 'Absolutely! The RTX 4090 handles 4K gaming with ease. Most games will run at 100+ FPS on ultra settings.',
            askedBy: 'GamerPro',
            answeredBy: 'John Doe',
            date: '2024-10-20'
          },
          {
            id: 2,
            question: 'What are the temps under load?',
            answer: 'CPU stays around 65-70°C and GPU around 70-75°C under full load thanks to the liquid cooling.',
            askedBy: 'TechEnthusiast',
            answeredBy: 'John Doe',
            date: '2024-10-18'
          }
        ]
      }
      // Add more builds as needed
    ];

    const foundBuild = mockBuilds.find(b => b.id === parseInt(id));
    setBuild(foundBuild);
  };

  const handleLike = () => {
    setLiked(!liked);
    toast.success(liked ? 'Removed from favorites' : 'Added to favorites!');
  };

  const handleShare = () => {
    // Copy link to clipboard
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

  if (!build) {
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

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/completed-builds')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md group cursor-pointer"
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
            <span>Back to Completed Builds</span>
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
                src={build.images[selectedImage]}
                alt={build.name}
                className="w-full h-[500px] object-cover"
              />
              
              {/* Navigation Arrows */}
              {build.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(prev => prev === 0 ? build.images.length - 1 : prev - 1)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full hover:opacity-80 transition-opacity cursor-pointer"
                    style={{ backgroundColor: colors.mainYellow }}
                  >
                    <FiChevronLeft size={24} color="white" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(prev => prev === build.images.length - 1 ? 0 : prev + 1)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full hover:opacity-80 transition-opacity cursor-pointer"
                    style={{ backgroundColor: colors.mainYellow }}
                  >
                    <FiChevronRight size={24} color="white" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-2 overflow-x-auto">
              {build.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
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
            {/* Build Name & Category */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span 
                  className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: colors.mainYellow }}
                >
                  {build.category}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-2" style={{ color: colors.mainBlack }}>
                {build.name}
              </h1>
              
              {/* Owner Info */}
              <div className="flex items-center gap-2 mb-3">
                <FaUser size={16} style={{ color: colors.jet }} />
                <span style={{ color: colors.jet }}>Built by <span className="font-semibold">{build.owner}</span></span>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1">
                  {renderStars(build.rating)}
                </div>
                <span className="font-bold text-lg" style={{ color: colors.mainBlack }}>
                  {build.rating}
                </span>
                <button 
                  onClick={() => setActiveTab('reviews')}
                  className="hover:underline cursor-pointer"
                  style={{ color: colors.jet }}
                >
                  {build.reviewCount} reviews
                </button>
              </div>

              {/* Social Stats */}
              <div className="flex items-center gap-6 mb-4">
                <span style={{ color: colors.jet }}>
                  <FaHeart size={18} className="inline mr-1" style={{ color: colors.mainYellow }} />
                  {build.likes} likes
                </span>
                <span style={{ color: colors.jet }}>
                  <FaShare size={18} className="inline mr-1" style={{ color: colors.mainYellow }} />
                  {build.shares} shares
                </span>
              </div>
            </div>

            <hr style={{ borderColor: colors.platinum }} className="my-6" />

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold" style={{ color: colors.mainYellow }}>
                  ${build.price.toFixed(2)}
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
                {showFullDescription ? build.description : `${build.description.substring(0, 200)}...`}
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="ml-2 font-semibold hover:underline cursor-pointer"
                  style={{ color: colors.mainYellow }}
                >
                  {showFullDescription ? 'Show less' : 'Read more'}
                </button>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleLike}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                style={{ 
                  backgroundColor: liked ? colors.mainYellow : 'white',
                  color: liked ? 'white' : colors.mainYellow,
                  border: `2px solid ${colors.mainYellow}`
                }}
              >
                {liked ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
                {liked ? 'Liked' : 'Like'}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
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
              className={`px-6 py-3 font-semibold transition-all cursor-pointer ${
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
              className={`px-6 py-3 font-semibold transition-all cursor-pointer ${
                activeTab === 'reviews' ? 'border-b-4' : ''
              }`}
              style={{ 
                color: activeTab === 'reviews' ? colors.mainYellow : colors.jet,
                borderColor: activeTab === 'reviews' ? colors.mainYellow : 'transparent'
              }}
            >
              Reviews ({build.reviewCount})
            </button>
            <button
              onClick={() => setActiveTab('qna')}
              className={`px-6 py-3 font-semibold transition-all cursor-pointer ${
                activeTab === 'qna' ? 'border-b-4' : ''
              }`}
              style={{ 
                color: activeTab === 'qna' ? colors.mainYellow : colors.jet,
                borderColor: activeTab === 'qna' ? colors.mainYellow : 'transparent'
              }}
            >
              Q&A
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(build.specs).map(([key, value]) => (
                <div
                  key={key}
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: 'white', border: `1px solid ${colors.platinum}` }}
                >
                  <div className="flex items-center gap-3">
                    {key === 'cpu' && <BsCpuFill size={24} style={{ color: colors.mainYellow }} />}
                    {key === 'gpu' && <FaMicrochip size={24} style={{ color: colors.mainYellow }} />}
                    {key === 'ram' && <FaMemory size={24} style={{ color: colors.mainYellow }} />}
                    {key === 'storage' && <FaHdd size={24} style={{ color: colors.mainYellow }} />}
                    <div className="flex-1">
                      <p className="text-sm font-semibold uppercase" style={{ color: colors.jet }}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
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
                      {build.rating}
                    </p>
                    <div className="flex gap-1 mb-2 justify-center">
                      {renderStars(build.rating, 24)}
                    </div>
                    <p style={{ color: colors.jet }}>{build.reviewCount} total ratings</p>
                  </div>
                  
                  <div className="flex-1 w-full">
                    <h3 className="text-lg font-bold mb-3" style={{ color: colors.mainBlack }}>
                      Rate this build
                    </h3>
                    <div className="flex gap-2">
                      {renderStars(userRating || 0, 32, true)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {build.reviews.map(review => (
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
                      className="text-sm hover:underline cursor-pointer"
                      style={{ color: colors.jet }}
                    >
                      👍 Helpful ({review.helpful})
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'qna' && (
            <div className="space-y-4">
              {build.qna.map(item => (
                <div
                  key={item.id}
                  className="p-6 rounded-lg"
                  style={{ backgroundColor: 'white', border: `1px solid ${colors.platinum}` }}
                >
                  <div className="mb-4">
                    <p className="font-bold text-lg mb-2" style={{ color: colors.mainBlack }}>
                      Q: {item.question}
                    </p>
                    <p className="text-sm mb-1" style={{ color: colors.jet }}>
                      Asked by <span className="font-semibold">{item.askedBy}</span> on {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div 
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: colors.mainBeige }}
                  >
                    <p className="font-bold mb-2" style={{ color: colors.mainYellow }}>
                      A: {item.answer}
                    </p>
                    <p className="text-sm" style={{ color: colors.jet }}>
                      Answered by <span className="font-semibold">{item.answeredBy}</span>
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Ask Question Button */}
              <button
                onClick={() => toast.info('Question form coming soon!')}
                className="w-full px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                style={{ 
                  backgroundColor: 'white',
                  color: colors.mainYellow,
                  border: `2px solid ${colors.mainYellow}`
                }}
              >
                Ask a Question
              </button>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BuildDetails;
