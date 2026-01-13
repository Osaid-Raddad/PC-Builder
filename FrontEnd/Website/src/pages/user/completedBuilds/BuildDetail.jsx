import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../../components/user/navbar/Navbar';
import Footer from '../../../components/user/footer/Footer';
import colors from '../../../config/colors';
import { FiUser, FiCpu, FiMonitor, FiHardDrive, FiZap, FiThumbsUp, FiMessageSquare, FiShare2, FiArrowLeft, FiCalendar, FiDollarSign, FiBox } from 'react-icons/fi';
import { BsCpuFill } from 'react-icons/bs';
import { FaMicrochip, FaMemory } from 'react-icons/fa';

const BuildDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fromPage = location.state?.fromPage || 1;
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  // Same build data from CompletedBuilds - in production, this would come from an API
  const builds = [
    {
      id: 1,
      name: 'The Beast Gaming Rig',
      owner: 'Ahmad Khalil',
      image: '/src/assets/Images/build1.jpg',
      images: [
        '/src/assets/Images/build1.jpg',
        '/src/assets/Images/build2.jpg',
        '/src/assets/Images/build3.jpg',
        '/src/assets/Images/build4.jpg'
      ],
      category: 'Gaming',
      cpu: 'Intel Core i9-14900K',
      gpu: 'NVIDIA RTX 4090',
      ram: '64GB DDR5',
      storage: '2TB NVMe SSD',
      psu: '1000W 80+ Platinum',
      motherboard: 'ASUS ROG MAXIMUS Z790 HERO',
      cpuCooler: 'NZXT Kraken Z73 RGB',
      case: 'Lian Li O11 Dynamic EVO',
      price: '$3,500',
      likes: 234,
      comments: 45,
      description: 'Ultimate gaming beast for 4K gaming at max settings. This build was designed to handle any game at maximum settings with ray tracing enabled. Perfect for content creation and streaming as well.',
      buildDate: 'December 2025',
      purpose: 'High-end gaming and content creation'
    },
    {
      id: 2,
      name: 'Budget King',
      owner: 'Mohammed Nasser',
      image: '/src/assets/Images/build2.jpg',
      images: [
        '/src/assets/Images/build2.jpg',
        '/src/assets/Images/build3.jpg',
        '/src/assets/Images/build4.jpg',
        '/src/assets/Images/build1.jpg'
      ],
      category: 'Budget',
      cpu: 'AMD Ryzen 5 7600X',
      gpu: 'AMD RX 7600',
      ram: '16GB DDR5',
      storage: '512GB NVMe SSD',
      psu: '550W 80+ Bronze',
      motherboard: 'MSI B650 GAMING PLUS WIFI',
      cpuCooler: 'Stock AMD Cooler',
      case: 'NZXT H510',
      price: '$800',
      likes: 189,
      comments: 32,
      description: 'Best value for 1080p gaming on a tight budget. Carefully selected components to provide the best bang for buck without compromising on quality or future upgrade paths.',
      buildDate: 'November 2025',
      purpose: '1080p gaming on a budget'
    },
    {
      id: 3,
      name: 'Workstation Pro',
      owner: 'Sara Ahmed',
      image: '/src/assets/Images/build3.jpg',
      images: [
        '/src/assets/Images/build3.jpg',
        '/src/assets/Images/build4.jpg',
        '/src/assets/Images/build1.jpg',
        '/src/assets/Images/build2.jpg'
      ],
      category: 'Workstation',
      cpu: 'AMD Ryzen 9 7950X',
      gpu: 'NVIDIA RTX 4080',
      ram: '128GB DDR5',
      storage: '4TB NVMe SSD',
      psu: '850W 80+ Gold',
      motherboard: 'ASUS ProArt X670E-CREATOR WIFI',
      cpuCooler: 'Noctua NH-D15',
      case: 'Fractal Design Define 7',
      price: '$4,200',
      likes: 156,
      comments: 28,
      description: 'Professional workstation for video editing and 3D rendering. Built specifically for Adobe Creative Suite and Blender with exceptional multi-threaded performance.',
      buildDate: 'October 2025',
      purpose: 'Professional content creation'
    },
    {
      id: 4,
      name: 'RGB Paradise',
      owner: 'Omar Hassan',
      image: '/src/assets/Images/build4.jpg',
      images: [
        '/src/assets/Images/build4.jpg',
        '/src/assets/Images/build1.jpg',
        '/src/assets/Images/build2.jpg',
        '/src/assets/Images/build3.jpg'
      ],
      category: 'Gaming',
      cpu: 'Intel Core i7-14700K',
      gpu: 'NVIDIA RTX 4070 Ti',
      ram: '32GB DDR5',
      storage: '1TB NVMe SSD',
      psu: '750W 80+ Gold',
      motherboard: 'MSI MPG Z790 CARBON WIFI',
      cpuCooler: 'Corsair iCUE H150i RGB',
      case: 'Corsair 5000X RGB',
      price: '$2,100',
      likes: 312,
      comments: 67,
      description: 'Full RGB setup with stunning visual effects. Every component was chosen for its RGB capabilities and synchronized lighting effects. Perfect showcase build!',
      buildDate: 'January 2026',
      purpose: 'Gaming with maximum RGB'
    },
    {
      id: 5,
      name: 'Silent Performer',
      owner: 'Layla Mahmoud',
      image: '/src/assets/Images/build5.jpg',
      images: [
        '/src/assets/Images/build5.jpg',
        '/src/assets/Images/build1.jpg',
        '/src/assets/Images/build3.jpg'
      ],
      category: 'Office',
      cpu: 'Intel Core i5-14600K',
      gpu: 'Integrated Graphics',
      ram: '32GB DDR5',
      storage: '1TB NVMe SSD',
      psu: '500W 80+ Gold',
      motherboard: 'ASUS PRIME Z790-P WIFI',
      cpuCooler: 'be quiet! Dark Rock 4',
      case: 'be quiet! Pure Base 500DX',
      price: '$950',
      likes: 98,
      comments: 19,
      description: 'Quiet and efficient build for office work and productivity. Focus on silent operation with premium quality components for professional workload.',
      buildDate: 'September 2025',
      purpose: 'Office productivity and programming'
    },
    {
      id: 6,
      name: 'Mini Powerhouse',
      owner: 'Youssef Ali',
      image: '/src/assets/Images/build1.jpg',
      images: [
        '/src/assets/Images/build1.jpg',
        '/src/assets/Images/build4.jpg',
        '/src/assets/Images/build2.jpg',
        '/src/assets/Images/build5.jpg'
      ],
      category: 'Mini-ITX',
      cpu: 'AMD Ryzen 7 7800X3D',
      gpu: 'NVIDIA RTX 4070',
      ram: '32GB DDR5',
      storage: '2TB NVMe SSD',
      psu: '650W SFX 80+ Gold',
      motherboard: 'ASUS ROG STRIX B650E-I GAMING WIFI',
      cpuCooler: 'Noctua NH-L12S',
      case: 'NZXT H1',
      price: '$1,800',
      likes: 267,
      comments: 54,
      description: 'Compact powerhouse in a Mini-ITX form factor. Perfect for small spaces without sacrificing performance. Gaming ready in a tiny package!',
      buildDate: 'December 2025',
      purpose: 'Compact high-performance gaming'
    },
    {
      id: 7,
      name: 'Creator Station',
      owner: 'Fatima Yousef',
      image: '/src/assets/Images/build2.jpg',
      images: [
        '/src/assets/Images/build2.jpg',
        '/src/assets/Images/build3.jpg',
        '/src/assets/Images/build5.jpg',
        '/src/assets/Images/build4.jpg'
      ],
      category: 'Workstation',
      cpu: 'Intel Core i9-14900K',
      gpu: 'NVIDIA RTX 4090',
      ram: '96GB DDR5',
      storage: '8TB NVMe SSD',
      psu: '1200W 80+ Platinum',
      motherboard: 'ASUS ProArt Z790-CREATOR WIFI',
      cpuCooler: 'Arctic Liquid Freezer II 360',
      case: 'Phanteks Enthoo Pro 2',
      price: '$5,500',
      likes: 178,
      comments: 41,
      description: 'Top-tier creator workstation for professional video production. Handles 8K video editing with ease and renders faster than ever.',
      buildDate: 'November 2025',
      purpose: '8K video editing and VFX'
    },
    {
      id: 8,
      name: 'First Build Ever',
      owner: 'Noor Ibrahim',
      image: '/src/assets/Images/build3.jpg',
      images: [
        '/src/assets/Images/build3.jpg',
        '/src/assets/Images/build1.jpg',
        '/src/assets/Images/build2.jpg'
      ],
      category: 'Budget',
      cpu: 'AMD Ryzen 5 5600',
      gpu: 'NVIDIA GTX 1660 Super',
      ram: '16GB DDR4',
      storage: '500GB NVMe SSD',
      psu: '500W 80+ Bronze',
      motherboard: 'MSI B550-A PRO',
      cpuCooler: 'Stock AMD Cooler',
      case: 'Cooler Master MasterBox Q300L',
      price: '$650',
      likes: 278,
      comments: 96,
      description: 'My first PC build! Great entry-level gaming performance on a student budget. This was an amazing learning experience and the build runs all my favorite games smoothly.',
      buildDate: 'August 2025',
      purpose: 'First gaming PC on student budget'
    }
  ];

  const build = builds.find(b => b.id === parseInt(id));

  if (!build) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4" style={{ color: colors.mainBlack }}>
              Build Not Found
            </h1>
            <button
              onClick={() => navigate('/completed-builds', { state: { initialPage: fromPage } })}
              className="px-6 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity cursor-pointer"
              style={{ backgroundColor: colors.mainYellow }}
            >
              Back to Builds
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleShare = () => {
    // In production, implement actual share functionality
    alert('Share functionality coming soon!');
  };

  const comments = [
    {
      id: 1,
      user: 'Ali Mansour',
      avatar: 'https://ui-avatars.com/api/?name=Ali+Mansour&background=F9B233&color=fff',
      comment: 'Amazing build! How are the temps under load?',
      date: '2 days ago',
      likes: 12
    },
    {
      id: 2,
      user: 'Huda Salem',
      avatar: 'https://ui-avatars.com/api/?name=Huda+Salem&background=242423&color=fff',
      comment: 'Love the component choices. Very well balanced!',
      date: '3 days ago',
      likes: 8
    },
    {
      id: 3,
      user: 'Karim Zaki',
      avatar: 'https://ui-avatars.com/api/?name=Karim+Zaki&background=F9B233&color=fff',
      comment: 'This is exactly what I was looking for. Thanks for sharing!',
      date: '1 week ago',
      likes: 15
    }
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/completed-builds', { state: { initialPage: fromPage } })}
          className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
          style={{ backgroundColor: 'white', color: colors.mainYellow, border: `2px solid ${colors.platinum}` }}
        >
          <FiArrowLeft size={20} />
          <span className="font-semibold">Back to Builds</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Build Header */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-bold" style={{ color: colors.mainBlack }}>
                      {build.name}
                    </h1>
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{ backgroundColor: colors.mainYellow, color: 'white' }}
                    >
                      {build.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm" style={{ color: colors.jet }}>
                    <div className="flex items-center gap-2">
                      <FiUser size={16} style={{ color: colors.mainYellow }} />
                      <span>Built by <span className="font-semibold">{build.owner}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCalendar size={16} style={{ color: colors.mainYellow }} />
                      <span>{build.buildDate}</span>
                    </div>
                  </div>
                </div>
                <div 
                  className="px-6 py-3 rounded-lg font-bold text-2xl"
                  style={{ backgroundColor: colors.mainYellow, color: 'white' }}
                >
                  {build.price}
                </div>
              </div>

              {/* Build Image Gallery */}
              <div className="mb-6">
                {/* Main Image */}
                <div 
                  className="h-96 bg-cover bg-center rounded-lg mb-3 transition-all duration-300"
                  style={{ 
                    backgroundColor: colors.platinum,
                    backgroundImage: `url(${build.images ? build.images[selectedImage] : build.image})`
                  }}
                />
                
                {/* Thumbnail Gallery */}
                {build.images && build.images.length > 1 && (
                  <div className="flex gap-3">
                    {build.images.map((img, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className="h-20 w-20 bg-cover bg-center rounded-lg cursor-pointer transition-all duration-300"
                        style={{
                          backgroundColor: colors.platinum,
                          backgroundImage: `url(${img})`,
                          border: selectedImage === index ? `3px solid ${colors.mainYellow}` : `3px solid ${colors.platinum}`,
                          opacity: selectedImage === index ? 1 : 0.6,
                          transform: selectedImage === index ? 'scale(1.05)' : 'scale(1)'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3" style={{ color: colors.mainBlack }}>
                  About This Build
                </h2>
                <p className="text-base leading-relaxed" style={{ color: colors.jet }}>
                  {build.description}
                </p>
              </div>

              {/* Purpose */}
              <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: colors.mainBeige }}>
                <div className="flex items-center gap-2 mb-2">
                  <FiBox size={18} style={{ color: colors.mainYellow }} />
                  <h3 className="font-bold" style={{ color: colors.mainBlack }}>Build Purpose</h3>
                </div>
                <p style={{ color: colors.jet }}>{build.purpose}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4" style={{ borderTop: `2px solid ${colors.platinum}` }}>
                <button
                  onClick={handleLike}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all cursor-pointer"
                  style={{
                    backgroundColor: liked ? colors.mainYellow : 'white',
                    color: liked ? 'white' : colors.mainYellow,
                    border: `2px solid ${colors.mainYellow}`
                  }}
                >
                  <FiThumbsUp size={20} />
                  <span>{liked ? build.likes + 1 : build.likes} Likes</span>
                </button>

                <button
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all cursor-pointer"
                  style={{
                    backgroundColor: 'white',
                    color: colors.jet,
                    border: `2px solid ${colors.platinum}`
                  }}
                >
                  <FiMessageSquare size={20} />
                  <span>{build.comments} Comments</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all cursor-pointer"
                  style={{
                    backgroundColor: 'white',
                    color: colors.jet,
                    border: `2px solid ${colors.platinum}`
                  }}
                >
                  <FiShare2 size={20} />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Comments Section */}
            {showComments && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6" style={{ color: colors.mainBlack }}>
                  Comments ({build.comments})
                </h2>
                
                {/* Add Comment */}
                <div className="mb-6">
                  <textarea
                    placeholder="Add a comment..."
                    className="w-full p-4 rounded-lg resize-none focus:outline-none focus:ring-2"
                    rows="3"
                    style={{
                      border: `2px solid ${colors.platinum}`,
                      focusRing: colors.mainYellow
                    }}
                  />
                  <button
                    className="mt-2 px-6 py-2 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity cursor-pointer"
                    style={{ backgroundColor: colors.mainYellow }}
                  >
                    Post Comment
                  </button>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map(comment => (
                    <div 
                      key={comment.id}
                      className="p-4 rounded-lg"
                      style={{ border: `1px solid ${colors.platinum}` }}
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={comment.avatar}
                          alt={comment.user}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold" style={{ color: colors.mainBlack }}>
                              {comment.user}
                            </span>
                            <span className="text-sm" style={{ color: colors.jet }}>
                              {comment.date}
                            </span>
                          </div>
                          <p className="mb-2" style={{ color: colors.jet }}>
                            {comment.comment}
                          </p>
                          <button className="flex items-center gap-1 text-sm hover:opacity-70 transition-opacity">
                            <FiThumbsUp size={14} style={{ color: colors.mainYellow }} />
                            <span style={{ color: colors.jet }}>{comment.likes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Build Specifications */}
          <div className="space-y-6">
            {/* Full Specs Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              <h2 className="text-2xl font-bold mb-6" style={{ color: colors.mainBlack }}>
                Full Specifications
              </h2>
              
              <div className="space-y-4">
                {/* CPU */}
                <div className="p-4 rounded-lg" style={{ backgroundColor: colors.mainBeige }}>
                  <div className="flex items-center gap-2 mb-2">
                    <BsCpuFill size={20} style={{ color: colors.mainYellow }} />
                    <span className="font-bold text-sm" style={{ color: colors.mainBlack }}>
                      Processor
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: colors.jet }}>
                    {build.cpu}
                  </p>
                </div>

                {/* GPU */}
                <div className="p-4 rounded-lg" style={{ backgroundColor: colors.mainBeige }}>
                  <div className="flex items-center gap-2 mb-2">
                    <FaMicrochip size={20} style={{ color: colors.mainYellow }} />
                    <span className="font-bold text-sm" style={{ color: colors.mainBlack }}>
                      Graphics Card
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: colors.jet }}>
                    {build.gpu}
                  </p>
                </div>

                {/* Motherboard */}
                <div className="p-4 rounded-lg" style={{ backgroundColor: colors.mainBeige }}>
                  <div className="flex items-center gap-2 mb-2">
                    <FiCpu size={20} style={{ color: colors.mainYellow }} />
                    <span className="font-bold text-sm" style={{ color: colors.mainBlack }}>
                      Motherboard
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: colors.jet }}>
                    {build.motherboard}
                  </p>
                </div>

                {/* RAM */}
                <div className="p-4 rounded-lg" style={{ backgroundColor: colors.mainBeige }}>
                  <div className="flex items-center gap-2 mb-2">
                    <FaMemory size={20} style={{ color: colors.mainYellow }} />
                    <span className="font-bold text-sm" style={{ color: colors.mainBlack }}>
                      Memory
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: colors.jet }}>
                    {build.ram}
                  </p>
                </div>

                {/* Storage */}
                <div className="p-4 rounded-lg" style={{ backgroundColor: colors.mainBeige }}>
                  <div className="flex items-center gap-2 mb-2">
                    <FiHardDrive size={20} style={{ color: colors.mainYellow }} />
                    <span className="font-bold text-sm" style={{ color: colors.mainBlack }}>
                      Storage
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: colors.jet }}>
                    {build.storage}
                  </p>
                </div>

                {/* CPU Cooler */}
                <div className="p-4 rounded-lg" style={{ backgroundColor: colors.mainBeige }}>
                  <div className="flex items-center gap-2 mb-2">
                    <FiMonitor size={20} style={{ color: colors.mainYellow }} />
                    <span className="font-bold text-sm" style={{ color: colors.mainBlack }}>
                      CPU Cooler
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: colors.jet }}>
                    {build.cpuCooler}
                  </p>
                </div>

                {/* PSU */}
                <div className="p-4 rounded-lg" style={{ backgroundColor: colors.mainBeige }}>
                  <div className="flex items-center gap-2 mb-2">
                    <FiZap size={20} style={{ color: colors.mainYellow }} />
                    <span className="font-bold text-sm" style={{ color: colors.mainBlack }}>
                      Power Supply
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: colors.jet }}>
                    {build.psu}
                  </p>
                </div>

                {/* Case */}
                <div className="p-4 rounded-lg" style={{ backgroundColor: colors.mainBeige }}>
                  <div className="flex items-center gap-2 mb-2">
                    <FiBox size={20} style={{ color: colors.mainYellow }} />
                    <span className="font-bold text-sm" style={{ color: colors.mainBlack }}>
                      Case
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: colors.jet }}>
                    {build.case}
                  </p>
                </div>
              </div>

              {/* Total Price */}
              <div 
                className="mt-6 p-4 rounded-lg"
                style={{ backgroundColor: colors.mainYellow }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiDollarSign size={24} color="white" />
                    <span className="font-bold text-white text-lg">Total Price</span>
                  </div>
                  <span className="font-bold text-white text-2xl">{build.price}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BuildDetail;
