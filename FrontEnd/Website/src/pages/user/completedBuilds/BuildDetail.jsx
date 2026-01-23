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
      name: 'RTX 5090 Ultimate Beast',
      owner: 'Ahmad Khalil',
      image: '/src/assets/Images/PCBuilds/1.jpg',
      images: [
        '/src/assets/Images/PCBuilds/1.jpg',
        '/src/assets/Images/PCBuilds/2.jpg',
        '/src/assets/Images/PCBuilds/3.jpg',
        '/src/assets/Images/PCBuilds/4.jpg'
      ],
      category: 'Gaming',
      cpu: 'Intel Core i7-13700K',
      gpu: 'ASUS GeForce RTX 5090',
      ram: '64GB DDR5',
      storage: '2TB NVMe SSD + 4TB HDD',
      psu: '1000W 80+ Platinum',
      motherboard: 'ASUS ROG STRIX Z790-E GAMING WIFI',
      cpuCooler: 'NZXT Kraken Z73',
      case: 'Lian Li O11 Dynamic EVO',
      price: '$5,299',
      likes: 892,
      comments: 156,
      description: 'The ultimate gaming powerhouse with the latest RTX 5090. Dominates 8K gaming and handles any workload thrown at it. RGB everywhere! This beast was built to push the absolute limits of gaming performance.',
      buildDate: 'January 2026',
      purpose: '8K gaming and extreme content creation'
    },
    {
      id: 2,
      name: 'Budget Champion 2026',
      owner: 'Mohammed Nasser',
      image: '/src/assets/Images/PCBuilds/2.jpg',
      images: [
        '/src/assets/Images/PCBuilds/2.jpg',
        '/src/assets/Images/PCBuilds/5.jpg',
        '/src/assets/Images/PCBuilds/6.jpg',
        '/src/assets/Images/PCBuilds/7.jpg'
      ],
      category: 'Budget',
      cpu: 'AMD Ryzen 5 7600X',
      gpu: 'Gigabyte GeForce RTX 4060',
      ram: '16GB DDR5',
      storage: '512GB NVMe SSD',
      psu: '550W 80+ Bronze',
      motherboard: 'MSI PRO B650-P WIFI',
      cpuCooler: 'Stock AMD Cooler',
      case: 'NZXT H510',
      price: '$879',
      likes: 445,
      comments: 87,
      description: 'Incredible value build that crushes 1080p gaming. Perfect for students and first-time builders! Every component was carefully chosen for maximum performance per dollar.',
      buildDate: 'December 2025',
      purpose: '1080p gaming on a budget'
    },
    {
      id: 3,
      name: 'Red Team Powerhouse',
      owner: 'Sara Ahmed',
      image: '/src/assets/Images/PCBuilds/3.jpg',
      images: [
        '/src/assets/Images/PCBuilds/3.jpg',
        '/src/assets/Images/PCBuilds/8.jpg',
        '/src/assets/Images/PCBuilds/9.jpg',
        '/src/assets/Images/PCBuilds/1.jpg'
      ],
      category: 'Gaming',
      cpu: 'AMD Ryzen 7 7700X',
      gpu: 'Sapphire Radeon RX 9070 XT',
      ram: '32GB DDR5',
      storage: '2TB NVMe SSD',
      psu: '750W 80+ Gold',
      motherboard: 'GIGABYTE X670 AORUS ELITE AX',
      cpuCooler: 'Arctic Liquid Freezer II 360',
      case: 'Fractal Design Meshify 2',
      price: '$2,149',
      likes: 623,
      comments: 94,
      description: 'All-AMD build with the new RX 9070 XT. Excellent for 1440p high refresh rate gaming. Team Red pride! This build showcases AMD\'s latest architecture with outstanding price-to-performance.',
      buildDate: 'January 2026',
      purpose: '1440p high refresh gaming'
    },
    {
      id: 4,
      name: 'RGB Wonderland',
      owner: 'Omar Hassan',
      image: '/src/assets/Images/PCBuilds/4.jpg',
      images: [
        '/src/assets/Images/PCBuilds/4.jpg',
        '/src/assets/Images/PCBuilds/5.jpg',
        '/src/assets/Images/PCBuilds/6.jpg',
        '/src/assets/Images/PCBuilds/7.jpg'
      ],
      category: 'Gaming',
      cpu: 'Intel Core i5-13600K',
      gpu: 'MSI GeForce RTX 4080 SUPER',
      ram: '32GB DDR5 RGB',
      storage: '1TB NVMe SSD',
      psu: '850W 80+ Gold',
      motherboard: 'MSI MPG Z790 CARBON WIFI',
      cpuCooler: 'Corsair iCUE H150i ELITE CAPELLIX',
      case: 'Corsair 5000X RGB',
      price: '$2,698',
      likes: 1024,
      comments: 203,
      description: 'A symphony of lights! Every component features RGB. Performance meets aesthetics in perfect harmony. Synchronized lighting effects create an immersive gaming environment.',
      buildDate: 'November 2025',
      purpose: 'Gaming with maximum RGB aesthetics'
    },
    {
      id: 5,
      name: 'Silent Productivity Beast',
      owner: 'Layla Mahmoud',
      image: '/src/assets/Images/PCBuilds/5.jpg',
      images: [
        '/src/assets/Images/PCBuilds/5.jpg',
        '/src/assets/Images/PCBuilds/8.jpg',
        '/src/assets/Images/PCBuilds/9.jpg',
        '/src/assets/Images/PCBuilds/2.jpg'
      ],
      category: 'Workstation',
      cpu: 'Intel Core i7-13700K',
      gpu: 'ASUS GeForce RTX 4070',
      ram: '64GB DDR5',
      storage: '2TB NVMe SSD',
      psu: '650W 80+ Gold',
      motherboard: 'ASUS PRIME Z790-P WIFI D4',
      cpuCooler: 'be quiet! Dark Rock Pro 4',
      case: 'be quiet! Silent Base 802',
      price: '$2,347',
      likes: 312,
      comments: 48,
      description: 'Whisper-quiet workstation for programming and content creation. You can barely hear it running! Premium silent components ensure distraction-free productivity.',
      buildDate: 'October 2025',
      purpose: 'Silent productivity and development'
    },
    {
      id: 6,
      name: 'Mini-ITX Gaming Marvel',
      owner: 'Yusuf Ali',
      image: '/src/assets/Images/PCBuilds/6.jpg',
      images: [
        '/src/assets/Images/PCBuilds/6.jpg',
        '/src/assets/Images/PCBuilds/3.jpg',
        '/src/assets/Images/PCBuilds/4.jpg',
        '/src/assets/Images/PCBuilds/1.jpg'
      ],
      category: 'Mini-ITX',
      cpu: 'AMD Ryzen 5 7600X',
      gpu: 'MSI GeForce RTX 5060 Ti',
      ram: '32GB DDR5',
      storage: '1TB NVMe SSD',
      psu: '650W 80+ Gold SFX',
      motherboard: 'GIGABYTE B650I AORUS ULTRA',
      cpuCooler: 'Noctua NH-L12S',
      case: 'Cooler Master NR200P',
      price: '$1,847',
      likes: 556,
      comments: 112,
      description: 'Tiny case, huge performance! Perfect for LAN parties and desk space optimization. Proved that small form factor doesn\'t mean compromised performance.',
      buildDate: 'September 2025',
      purpose: 'Compact 1440p gaming'
    },
    {
      id: 7,
      name: 'Pure White Elegance',
      owner: 'Rana Saleh',
      image: '/src/assets/Images/PCBuilds/7.jpg',
      images: [
        '/src/assets/Images/PCBuilds/7.jpg',
        '/src/assets/Images/PCBuilds/8.jpg',
        '/src/assets/Images/PCBuilds/9.jpg',
        '/src/assets/Images/PCBuilds/1.jpg'
      ],
      category: 'Gaming',
      cpu: 'Intel Core i5-13600K',
      gpu: 'Gigabyte GeForce RTX 5070',
      ram: '32GB DDR5',
      storage: '1TB NVMe SSD',
      psu: '750W 80+ Gold',
      motherboard: 'ASUS TUF GAMING Z790-PLUS WIFI',
      cpuCooler: 'Corsair iCUE H100i ELITE CAPELLIX White',
      case: 'Lian Li O11 Dynamic Mini (White)',
      price: '$2,098',
      likes: 778,
      comments: 145,
      description: 'Clean white build with the new RTX 5070. Aesthetics that match performance perfectly! Every component was selected in white or silver to maintain the pristine aesthetic.',
      buildDate: 'December 2025',
      purpose: '1440p gaming with clean aesthetics'
    },
    {
      id: 8,
      name: 'Content Creator Pro Max',
      owner: 'Tariq Mansour',
      image: '/src/assets/Images/PCBuilds/8.jpg',
      images: [
        '/src/assets/Images/PCBuilds/8.jpg',
        '/src/assets/Images/PCBuilds/2.jpg',
        '/src/assets/Images/PCBuilds/3.jpg',
        '/src/assets/Images/PCBuilds/4.jpg'
      ],
      category: 'Workstation',
      cpu: 'AMD Ryzen 7 7700X',
      gpu: 'PowerColor Radeon RX 9070',
      ram: '128GB DDR5',
      storage: '4TB NVMe SSD + 8TB HDD',
      psu: '1000W 80+ Platinum',
      motherboard: 'ASUS ProArt X670E-CREATOR WIFI',
      cpuCooler: 'Arctic Liquid Freezer II 420',
      case: 'Fractal Design Define 7',
      price: '$3,899',
      likes: 421,
      comments: 76,
      description: 'Professional workstation for 4K video editing, 3D rendering, and multi-track audio production. Fast storage for massive project files. Built for professional workflows with reliability in mind.',
      buildDate: 'November 2025',
      purpose: 'Professional content creation'
    },
    {
      id: 9,
      name: 'My First Gaming PC!',
      owner: 'Noor Ibrahim',
      image: '/src/assets/Images/PCBuilds/9.jpg',
      images: [
        '/src/assets/Images/PCBuilds/9.jpg',
        '/src/assets/Images/PCBuilds/5.jpg',
        '/src/assets/Images/PCBuilds/6.jpg',
        '/src/assets/Images/PCBuilds/7.jpg'
      ],
      category: 'Budget',
      cpu: 'AMD Ryzen 5 7600X',
      gpu: 'Zotac GeForce RTX 3050',
      ram: '16GB DDR5',
      storage: '500GB NVMe SSD',
      psu: '500W 80+ Bronze',
      motherboard: 'MSI PRO B650-P WIFI',
      cpuCooler: 'Cooler Master Hyper 212',
      case: 'Cooler Master MasterBox Q300L',
      price: '$748',
      likes: 892,
      comments: 234,
      description: 'Built this with help from YouTube tutorials! Runs all my favorite games at 1080p. So proud of this accomplishment! This was an amazing learning journey from parts to POST.',
      buildDate: 'January 2026',
      purpose: 'Entry-level gaming for students'
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
