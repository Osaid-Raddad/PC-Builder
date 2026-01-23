import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../../components/user/navbar/Navbar';
import Footer from '../../../components/user/footer/Footer';
import ElectricCard from '../../../components/user/electric-card/ElectricCard';
import colors from '../../../config/colors';
import { FiUser, FiCpu, FiMonitor, FiHardDrive, FiZap, FiThumbsUp, FiMessageSquare, FiShare2, FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { BsCpuFill } from 'react-icons/bs';
import { FaMicrochip, FaMemory } from 'react-icons/fa';
import BlurText from '../../../components/animations/BlurText/BlurText';

const CompletedBuilds = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const buildsPerPage = 6;

  // Restore page number when returning from build detail
  useEffect(() => {
    if (location.state?.initialPage) {
      setCurrentPage(location.state.initialPage);
      // Clear the state to avoid restoring again on subsequent renders
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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
      description: 'The ultimate gaming powerhouse with the latest RTX 5090. Dominates 8K gaming and handles any workload thrown at it. RGB everywhere!',
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
      description: 'Incredible value build that crushes 1080p gaming. Perfect for students and first-time builders!',
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
      description: 'All-AMD build with the new RX 9070 XT. Excellent for 1440p high refresh rate gaming. Team Red pride!',
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
      description: 'A symphony of lights! Every component features RGB. Performance meets aesthetics in perfect harmony.',
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
      description: 'Whisper-quiet workstation for programming and content creation. You can barely hear it running!',
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
      description: 'Tiny case, huge performance! Perfect for LAN parties and desk space optimization.',
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
      description: 'Clean white build with the new RTX 5070. Aesthetics that match performance perfectly!',
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
      description: 'Professional workstation for 4K video editing, 3D rendering, and multi-track audio production. Fast storage for massive project files.',
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
      description: 'Built this with help from YouTube tutorials! Runs all my favorite games at 1080p. So proud of this accomplishment!',
      buildDate: 'January 2026',
      purpose: 'Entry-level gaming for students'
    }
  ];

  const categories = ['All', 'Gaming', 'Workstation', 'Budget', 'Office', 'Mini-ITX'];

  // Filter and search logic
  const filteredBuilds = builds.filter(build => {
    const matchesCategory = selectedCategory === 'All' || build.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      build.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      build.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      build.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      build.cpu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      build.gpu.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBuilds.length / buildsPerPage);
  const indexOfLastBuild = currentPage * buildsPerPage;
  const indexOfFirstBuild = indexOfLastBuild - buildsPerPage;
  const currentBuilds = filteredBuilds.slice(indexOfFirstBuild, indexOfLastBuild);

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleLike = (buildId) => {
    console.log('Liked build:', buildId);
    // TODO: Implement like functionality
  };

  const handleShare = (buildId) => {
    console.log('Share build:', buildId);
    // TODO: Implement share functionality
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center">
            <BlurText 
              text="Completed Builds"
              className="text-6xl font-bold mb-4"
              delay={100}
              animateBy="words"
              direction="top"
            />
          </div>
          <p className="text-xl" style={{ color: colors.jet }}>
            Explore amazing PC builds from our community
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <FiSearch 
              className="absolute left-4 top-1/2 -translate-y-1/2" 
              style={{ color: colors.mainYellow }} 
              size={20} 
            />
            <input
              type="text"
              placeholder="Search builds by name, owner, specs, or description..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-4 rounded-lg font-medium transition-all focus:outline-none focus:ring-2"
              style={{
                border: `2px solid ${colors.platinum}`,
                backgroundColor: 'white',
                color: colors.jet,
                focusRingColor: colors.mainYellow
              }}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <FiFilter size={20} style={{ color: colors.mainYellow }} className="shrink-0" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryFilter(category)}
                className="px-5 py-2 rounded-full font-medium transition-all shrink-0 cursor-pointer"
                style={{
                  backgroundColor: selectedCategory === category ? colors.mainYellow : 'white',
                  color: selectedCategory === category ? 'white' : colors.jet,
                  border: `2px solid ${selectedCategory === category ? colors.mainYellow : colors.platinum}`
                }}
              >
                {category}
                {category !== 'All' && (
                  <span 
                    className="ml-2 px-2 py-1 rounded-full text-xs"
                    style={{
                      backgroundColor: selectedCategory === category ? 'rgba(255,255,255,0.3)' : colors.mainYellow + '20'
                    }}
                  >
                    {builds.filter(build => build.category === category).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Builds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentBuilds.map((build) => (
            <ElectricCard
              key={build.id}
              className="hover:shadow-2xl transition-all duration-300 cursor-pointer"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'instant' });
                navigate(`/completed-builds/${build.id}`, { state: { fromPage: currentPage } });
              }}
            >
              <div
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                {/* Build Image */}
                <div 
                  className="h-64 relative overflow-hidden"
                  style={{ 
                    backgroundColor: colors.platinum
                  }}
                >
                  <img 
                    src={build.image} 
                    alt={build.name}
                    className="w-full h-full object-cover"
                    style={{ objectFit: 'cover' }}
                  />
                
                  {/* Category Badge */}
                  <div 
                    className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold"
                    style={{ backgroundColor: colors.mainYellow, color: 'white' }}
                  >
                    {build.category}
                  </div>
                  
                  {/* Price Badge */}
                  <div 
                    className="absolute bottom-4 left-4 px-4 py-2 rounded-lg font-bold backdrop-blur-md"
                    style={{ backgroundColor: 'rgba(36, 36, 35, 0.8)', color: colors.mainYellow }}
                  >
                    {build.price}
                  </div>
                </div>

                {/* Build Info */}
                <div className="p-6">
                  {/* Build Name & Owner */}
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold mb-2" style={{ color: colors.mainBlack }}>
                      {build.name}
                    </h2>
                    <div className="flex items-center gap-2">
                      <FiUser size={16} style={{ color: colors.mainYellow }} />
                      <span className="text-sm" style={{ color: colors.jet }}>
                        Built by {build.owner}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm mb-4" style={{ color: colors.jet }}>
                    {build.description}
                  </p>

                  {/* Specs */}
                  <div className="space-y-2 mb-4">
                    {/* CPU */}
                    <div className="flex items-center gap-2">
                      <BsCpuFill size={16} style={{ color: colors.mainYellow }} />
                      <span className="text-xs font-semibold" style={{ color: colors.mainBlack }}>
                        CPU:
                      </span>
                      <span className="text-xs" style={{ color: colors.jet }}>
                        {build.cpu}
                      </span>
                    </div>

                    {/* GPU */}
                    <div className="flex items-center gap-2">
                      <FaMicrochip size={16} style={{ color: colors.mainYellow }} />
                      <span className="text-xs font-semibold" style={{ color: colors.mainBlack }}>
                        GPU:
                      </span>
                      <span className="text-xs" style={{ color: colors.jet }}>
                        {build.gpu}
                      </span>
                    </div>

                    {/* RAM */}
                    <div className="flex items-center gap-2">
                      <FaMemory size={16} style={{ color: colors.mainYellow }} />
                      <span className="text-xs font-semibold" style={{ color: colors.mainBlack }}>
                        RAM:
                      </span>
                      <span className="text-xs" style={{ color: colors.jet }}>
                        {build.ram}
                      </span>
                    </div>

                    {/* Storage */}
                    <div className="flex items-center gap-2">
                      <FiHardDrive size={16} style={{ color: colors.mainYellow }} />
                      <span className="text-xs font-semibold" style={{ color: colors.mainBlack }}>
                        Storage:
                      </span>
                      <span className="text-xs" style={{ color: colors.jet }}>
                        {build.storage}
                      </span>
                    </div>

                    {/* PSU */}
                    <div className="flex items-center gap-2">
                      <FiZap size={16} style={{ color: colors.mainYellow }} />
                      <span className="text-xs font-semibold" style={{ color: colors.mainBlack }}>
                        PSU:
                      </span>
                      <span className="text-xs" style={{ color: colors.jet }}>
                        {build.psu}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div 
                    className="flex items-center justify-between pt-4"
                    style={{ borderTop: `1px solid ${colors.platinum}` }}
                  >
                    {/* Likes & Comments */}
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleLike(build.id)}
                        className="flex items-center gap-1 hover:opacity-70 transition-opacity cursor-pointer"
                      >
                        <FiThumbsUp size={18} style={{ color: colors.mainYellow }} />
                        <span className="text-sm font-semibold" style={{ color: colors.mainBlack }}>
                          {build.likes}
                        </span>
                      </button>

                      <div className="flex items-center gap-1">
                        <FiMessageSquare size={18} style={{ color: colors.jet }} />
                        <span className="text-sm" style={{ color: colors.jet }}>
                          {build.comments}
                        </span>
                      </div>
                    </div>

                    {/* Share Button */}
                    <button
                      onClick={() => handleShare(build.id)}
                      className="p-2 rounded-lg hover:opacity-70 transition-all cursor-pointer"
                      style={{ border: `2px solid ${colors.platinum}` }}
                    >
                      <FiShare2 size={18} style={{ color: colors.mainYellow }} />
                    </button>
                  </div>
                </div>
              </div>
            </ElectricCard>
          ))}
        </div>

        {/* Pagination */}
        {filteredBuilds.length > buildsPerPage && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{
                backgroundColor: 'white',
                border: `2px solid ${colors.platinum}`,
                color: colors.mainYellow
              }}
            >
              <FiChevronLeft size={20} />
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className="px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer"
                style={{
                  backgroundColor: currentPage === index + 1 ? colors.mainYellow : 'white',
                  color: currentPage === index + 1 ? 'white' : colors.jet,
                  border: `2px solid ${currentPage === index + 1 ? colors.mainYellow : colors.platinum}`
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== index + 1) {
                    e.currentTarget.style.backgroundColor = colors.mainYellow;
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.borderColor = colors.mainYellow;
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== index + 1) {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = colors.jet;
                    e.currentTarget.style.borderColor = colors.platinum;
                  }
                }}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{
                backgroundColor: 'white',
                border: `2px solid ${colors.platinum}`,
                color: colors.mainYellow
              }}
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredBuilds.length === 0 && (
          <div className="text-center py-12">
            <p className="text-2xl font-bold mb-2" style={{ color: colors.mainBlack }}>
              No builds found
            </p>
            <p className="text-lg" style={{ color: colors.jet }}>
              Try selecting a different category or searching for something else
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div 
          className="mt-12 p-8 rounded-lg text-center"
          style={{ backgroundColor: 'white', border: `2px solid ${colors.mainYellow}` }}
        >
          <h3 className="text-3xl font-bold mb-4" style={{ color: colors.mainBlack }}>
            Ready to Build Your Dream PC?
          </h3>
          <p className="text-lg mb-6" style={{ color: colors.jet }}>
            Start building your custom PC with our interactive builder or share your completed build with the community!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'instant' });
                navigate('/builder');
              }}
              className="px-8 py-4 rounded-lg font-bold text-white hover:opacity-90 transition-opacity text-lg cursor-pointer"
              style={{ backgroundColor: colors.mainYellow }}
            >
              Start Your Build
            </button>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'instant' });
                navigate('/completed-builds/submit-build');
              }}
              className="px-8 py-4 rounded-lg font-bold hover:opacity-90 transition-opacity text-lg cursor-pointer"
              style={{ 
                backgroundColor: 'white',
                color: colors.mainYellow,
                border: `2px solid ${colors.mainYellow}`
              }}
            >
              Submit Your Build
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CompletedBuilds;
