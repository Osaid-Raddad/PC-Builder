import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const buildsPerPage = 6;

  const builds = [
    {
      id: 1,
      name: 'The Beast Gaming Rig',
      owner: 'Ahmad Khalil',
      image: '/src/assets/Images/build1.jpg',
      category: 'Gaming',
      cpu: 'Intel Core i9-14900K',
      gpu: 'NVIDIA RTX 4090',
      ram: '64GB DDR5',
      storage: '2TB NVMe SSD',
      psu: '1000W 80+ Platinum',
      price: '$3,500',
      likes: 234,
      comments: 45,
      description: 'Ultimate gaming beast for 4K gaming at max settings'
    },
    {
      id: 2,
      name: 'Budget King',
      owner: 'Mohammed Nasser',
      image: '/src/assets/Images/build2.jpg',
      category: 'Budget',
      cpu: 'AMD Ryzen 5 7600X',
      gpu: 'AMD RX 7600',
      ram: '16GB DDR5',
      storage: '512GB NVMe SSD',
      psu: '550W 80+ Bronze',
      price: '$800',
      likes: 189,
      comments: 32,
      description: 'Best value for 1080p gaming on a tight budget'
    },
    {
      id: 3,
      name: 'Workstation Pro',
      owner: 'Sara Ahmed',
      image: '/src/assets/Images/build3.jpg',
      category: 'Workstation',
      cpu: 'AMD Ryzen 9 7950X',
      gpu: 'NVIDIA RTX 4080',
      ram: '128GB DDR5',
      storage: '4TB NVMe SSD',
      psu: '850W 80+ Gold',
      price: '$4,200',
      likes: 156,
      comments: 28,
      description: 'Professional workstation for video editing and 3D rendering'
    },
    {
      id: 4,
      name: 'RGB Paradise',
      owner: 'Omar Hassan',
      image: '/src/assets/Images/build4.jpg',
      category: 'Gaming',
      cpu: 'Intel Core i7-14700K',
      gpu: 'NVIDIA RTX 4070 Ti',
      ram: '32GB DDR5',
      storage: '1TB NVMe SSD',
      psu: '750W 80+ Gold',
      price: '$2,100',
      likes: 312,
      comments: 67,
      description: 'Full RGB setup with stunning visual effects'
    },
    {
      id: 5,
      name: 'Silent Performer',
      owner: 'Layla Mahmoud',
      image: '/src/assets/Images/build5.jpg',
      category: 'Office',
      cpu: 'Intel Core i5-14600K',
      gpu: 'Integrated Graphics',
      ram: '32GB DDR5',
      storage: '1TB NVMe SSD',
      psu: '500W 80+ Gold',
      price: '$950',
      likes: 98,
      comments: 19,
      description: 'Quiet and efficient build for office work and productivity'
    },
    {
      id: 6,
      name: 'Compact Powerhouse',
      owner: 'Yusuf Ali',
      image: '/src/assets/Images/build6.jpg',
      category: 'Mini-ITX',
      cpu: 'AMD Ryzen 7 7800X3D',
      gpu: 'NVIDIA RTX 4070',
      ram: '32GB DDR5',
      storage: '2TB NVMe SSD',
      psu: '650W 80+ Gold SFX',
      price: '$2,400',
      likes: 267,
      comments: 54,
      description: 'Small form factor without compromising performance'
    },
    {
      id: 7,
      name: 'White Snow Elegance',
      owner: 'Rana Saleh',
      image: '/src/assets/Images/build1.jpg',
      category: 'Gaming',
      cpu: 'Intel Core i5-14600K',
      gpu: 'NVIDIA RTX 4060 Ti',
      ram: '32GB DDR5',
      storage: '1TB NVMe SSD',
      psu: '700W 80+ Gold',
      price: '$1,650',
      likes: 421,
      comments: 89,
      description: 'All-white themed build with clean aesthetics and great 1440p performance'
    },
    {
      id: 8,
      name: 'Creator Studio',
      owner: 'Tariq Mansour',
      image: '/src/assets/Images/build2.jpg',
      category: 'Workstation',
      cpu: 'AMD Ryzen 9 7900X',
      gpu: 'NVIDIA RTX 4070 Ti',
      ram: '64GB DDR5',
      storage: '2TB NVMe + 4TB HDD',
      psu: '850W 80+ Platinum',
      price: '$3,100',
      likes: 187,
      comments: 42,
      description: 'Perfect for content creation, streaming, and video production'
    },
    {
      id: 9,
      name: 'First Build Ever',
      owner: 'Noor Ibrahim',
      image: '/src/assets/Images/build3.jpg',
      category: 'Budget',
      cpu: 'AMD Ryzen 5 5600',
      gpu: 'NVIDIA GTX 1660 Super',
      ram: '16GB DDR4',
      storage: '500GB NVMe SSD',
      psu: '500W 80+ Bronze',
      price: '$650',
      likes: 278,
      comments: 96,
      description: 'My first PC build! Great entry-level gaming performance on a student budget'
    },
    {
      id: 10,
      name: 'Cyberpunk Dream',
      owner: 'Khalid Zaid',
      image: '/src/assets/Images/build4.jpg',
      category: 'Gaming',
      cpu: 'Intel Core i9-14900KS',
      gpu: 'NVIDIA RTX 4090',
      ram: '64GB DDR5',
      storage: '4TB NVMe SSD',
      psu: '1200W 80+ Titanium',
      price: '$5,200',
      likes: 542,
      comments: 134,
      description: 'Custom water-cooled beast with neon RGB and futuristic theme'
    },
    {
      id: 11,
      name: 'Office Minimalist',
      owner: 'Maha Fares',
      image: '/src/assets/Images/build5.jpg',
      category: 'Office',
      cpu: 'Intel Core i3-14100',
      gpu: 'Integrated UHD Graphics',
      ram: '16GB DDR5',
      storage: '512GB NVMe SSD',
      psu: '450W 80+ Bronze',
      price: '$520',
      likes: 67,
      comments: 12,
      description: 'Simple and efficient setup for daily office tasks and web browsing'
    },
    {
      id: 12,
      name: 'AMD All The Way',
      owner: 'Basel Yousef',
      image: '/src/assets/Images/build6.jpg',
      category: 'Gaming',
      cpu: 'AMD Ryzen 7 7800X3D',
      gpu: 'AMD Radeon RX 7900 XTX',
      ram: '32GB DDR5',
      storage: '2TB NVMe SSD',
      psu: '850W 80+ Gold',
      price: '$2,800',
      likes: 334,
      comments: 71,
      description: 'Full AMD build with excellent gaming performance and SAM enabled'
    },
    {
      id: 13,
      name: 'ITX Travel Companion',
      owner: 'Dina Rashid',
      image: '/src/assets/Images/build1.jpg',
      category: 'Mini-ITX',
      cpu: 'AMD Ryzen 5 7600X',
      gpu: 'NVIDIA RTX 4060',
      ram: '32GB DDR5',
      storage: '1TB NVMe SSD',
      psu: '600W 80+ Gold SFX',
      price: '$1,450',
      likes: 203,
      comments: 38,
      description: 'Portable gaming setup that fits in a backpack for LAN parties'
    },
    {
      id: 14,
      name: 'Retro Gaming Station',
      owner: 'Fadi Haddad',
      image: '/src/assets/Images/build2.jpg',
      category: 'Budget',
      cpu: 'Intel Core i5-12400F',
      gpu: 'AMD RX 6600',
      ram: '16GB DDR4',
      storage: '1TB NVMe SSD',
      psu: '550W 80+ Bronze',
      price: '$750',
      likes: 145,
      comments: 29,
      description: 'Perfect for emulation and playing older games at high settings'
    },
    {
      id: 15,
      name: 'Dual Monitor Workstation',
      owner: 'Hiba Kamal',
      image: '/src/assets/Images/build3.jpg',
      category: 'Workstation',
      cpu: 'AMD Ryzen 7 7700X',
      gpu: 'NVIDIA RTX 4060 Ti',
      ram: '64GB DDR5',
      storage: '2TB NVMe SSD',
      psu: '750W 80+ Gold',
      price: '$2,300',
      likes: 176,
      comments: 34,
      description: 'Productivity powerhouse for multitasking with dual 4K monitors'
    },
    {
      id: 16,
      name: 'Silent Assassin',
      owner: 'Jamal Qasim',
      image: '/src/assets/Images/build4.jpg',
      category: 'Gaming',
      cpu: 'Intel Core i7-14700F',
      gpu: 'NVIDIA RTX 4070 Super',
      ram: '32GB DDR5',
      storage: '2TB NVMe SSD',
      psu: '750W 80+ Gold',
      price: '$2,200',
      likes: 298,
      comments: 56,
      description: 'Ultra-quiet build with premium Noctua cooling and sound dampening'
    },
    {
      id: 17,
      name: 'Family PC',
      owner: 'Amira Taleb',
      image: '/src/assets/Images/build5.jpg',
      category: 'Office',
      cpu: 'AMD Ryzen 5 5600G',
      gpu: 'Integrated Radeon Graphics',
      ram: '16GB DDR4',
      storage: '512GB NVMe SSD',
      psu: '450W 80+ Bronze',
      price: '$480',
      likes: 92,
      comments: 18,
      description: 'Affordable family computer for homework, browsing, and light tasks'
    },
    {
      id: 18,
      name: 'Green Machine',
      owner: 'Sami Najjar',
      image: '/src/assets/Images/build6.jpg',
      category: 'Gaming',
      cpu: 'AMD Ryzen 5 7600X',
      gpu: 'NVIDIA RTX 4070',
      ram: '32GB DDR5',
      storage: '1TB NVMe SSD',
      psu: '700W 80+ Gold',
      price: '$1,850',
      likes: 256,
      comments: 48,
      description: 'Green and black themed build with excellent 1440p gaming performance'
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
                className="px-5 py-2 rounded-full font-medium transition-all shrink-0"
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
                navigate(`/build/${build.id}`);
              }}
            >
              <div
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                {/* Build Image */}
                <div 
                  className="h-64 bg-cover bg-center relative"
                  style={{ 
                    backgroundColor: colors.platinum,
                    backgroundImage: `url(${build.image})`
                  }}
                >
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
                        className="flex items-center gap-1 hover:opacity-70 transition-opacity"
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
                      className="p-2 rounded-lg hover:opacity-70 transition-all"
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
              className="p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="px-4 py-2 rounded-lg font-semibold transition-all"
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
              className="p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="px-8 py-4 rounded-lg font-bold text-white hover:opacity-90 transition-opacity text-lg"
              style={{ backgroundColor: colors.mainYellow }}
            >
              Start Your Build
            </button>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'instant' });
                navigate('/submit-build');
              }}
              className="px-8 py-4 rounded-lg font-bold hover:opacity-90 transition-opacity text-lg"
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
