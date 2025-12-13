import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/navbar/Navbar.jsx';
import Footer from '../../components/user/footer/Footer.jsx';
import GlassIcons from '../../components/ui/GlassIcons/GlassIcons.jsx';
import BlurText from '../../components/animations/BlurText/BlurText.jsx';
import colors from '../../config/colors';
import Setup1 from '../../assets/Images/Setup1.jpg';
import Setup2 from '../../assets/Images/Setup2.jpg';
import { 
  FiCpu, 
  FiMonitor, 
  FiHardDrive, 
  FiZap, 
  FiTool, 
  FiBox,
  FiGrid,
  FiCommand,
  FiPackage,
  FiWind,
  FiDisc,
  FiAperture
} from 'react-icons/fi';

const Home = () => {
  const navigate = useNavigate();

  const featureItems = [
    { icon: <FiCpu />, color: colors.mainYellow, label: 'CPU', link: '/products/cpu' },
    { icon: <FiZap />, color: colors.mainYellow, label: 'GPU', link: '/products/gpu' },
    { icon: <FiGrid />, color: colors.mainYellow, label: 'Motherboard', link: '/products/motherboard' },
    { icon: <FiHardDrive />, color: colors.mainYellow, label: 'Storage', link: '/products/storage' },
    { icon: <FiCommand />, color: colors.mainYellow, label: 'Memory', link: '/products/memory' },
    { icon: <FiPackage />, color: colors.mainYellow, label: 'Power Supply', link: '/products/power-supply' },
    { icon: <FiBox />, color: colors.mainYellow, label: 'Case', link: '/products/case' },
    { icon: <FiWind />, color: colors.mainYellow, label: 'CPU Cooler', link: '/products/cooler' },
    { icon: <FiMonitor />, color: colors.mainYellow, label: 'Monitor', link: '/products/monitor' },
    { icon: <FiDisc />, color: colors.mainYellow, label: 'Peripherals', link: '/products/peripherals' },
    { icon: <FiAperture />, color: colors.mainYellow, label: 'Accessories', link: '/products/accessories' },
    { icon: <FiTool />, color: colors.mainYellow, label: 'Expansion', link: '/products/expansion' },
  ];

  const performanceData = [
    { title: 'Gaming Beast', fps: '240+ FPS', games: '4K Ultra Settings', price: '$2,499' },
    { title: 'Content Creator', render: '8K Video Editing', cores: '32 Cores', price: '$3,299' },
    { title: 'Budget Champion', fps: '144 FPS', games: '1080p High', price: '$899' },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
      <Navbar />
      
      {/* Hero Section - Setup Image */}
      <section className="relative w-full" style={{ height: '600px' }}>
        <img 
          src={Setup1} 
          alt="PC Setup" 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            filter: 'blur(4px)'
          }}
        />
        {/* Overlay with Button */}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        >
          <div className="mb-8 px-4">
            <BlurText
              text="Start Building Your Dream"
              className="text-5xl md:text-7xl font-bold text-center"
              style={{ 
                color: colors.mainYellow,
                textShadow: '0 4px 20px rgba(0,0,0,0.8)'
              }}
            />
          </div>
          <button
            onClick={() => navigate('/builder')}
            className="px-10 py-5 text-xl font-semibold rounded-xl transition-all hover:opacity-90 hover:scale-105 shadow-2xl cursor-pointer"
            style={{ 
              backgroundColor: colors.mainYellow, 
              color: colors.mainBlack 
            }}
          >
            Launch Builder →
          </button>
        </div>
      </section>

      <div className="flex-1 py-8" style={{color: colors.mainBlack}}>
        {/* Section 1: Performance Showcase */}
        <section className="container mx-auto mb-20 px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.mainYellow }}>
              Performance Tiers
            </h2>
            <p className="text-lg md:text-xl opacity-90" style={{ color: colors.mainBlack }}>
              Choose your perfect performance level
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {performanceData.map((build, index) => (
              <div 
                key={index}
                className="relative overflow-hidden rounded-2xl p-8 transition-all hover:scale-105 cursor-pointer group"
                style={{ backgroundColor: colors.mainBlack }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-6" style={{ color: colors.mainYellow }}>
                    {build.title}
                  </h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">⚡</span>
                      <div>
                        <p className="text-sm text-gray-400">Performance</p>
                        <p className="text-xl font-semibold text-white">{build.fps || build.render}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">🎮</span>
                      <div>
                        <p className="text-sm text-gray-400">Capability</p>
                        <p className="text-xl font-semibold text-white">{build.games || build.cores}</p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-gray-700">
                    <p className="text-sm text-gray-400 mb-2">Starting at</p>
                    <p className="text-4xl font-bold" style={{ color: colors.mainYellow }}>
                      {build.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: All Products with Glass Icons */}
        <section 
          className="relative w-full mb-20 py-16" 
          style={{ paddingLeft: '1rem', paddingRight: '1rem', overflow: 'hidden' }}
        >
          {/* Background Image with Blur */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${Setup2})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(4px)',
              zIndex: 0
            }}
          ></div>
          {/* Dark Overlay */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              zIndex: 1
            }}
          ></div>
          {/* Content */}
          <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.mainYellow }}>
              Explore All Components
            </h2>
            <p className="text-lg md:text-xl opacity-90" style={{ color: 'white' }}>
              Browse our complete collection of PC components
            </p>
          </div>

          <div className="flex justify-center items-center" style={{ minHeight: '300px', position: 'relative' }}>
            <GlassIcons 
              items={featureItems.map(item => ({
                ...item,
                onClick: () => navigate(item.link)
              }))} 
              className="custom-features" 
            />
          </div>
          </div>
        </section>

        {/* Section 3: Why Choose Us */}
        <section className="container mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.mainYellow }}>
              Why Choose Our Platform?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            <div className="text-center p-8 rounded-2xl transition-transform hover:scale-105 cursor-pointer" style={{ backgroundColor: colors.mainBlack }}>
              <div className="text-6xl mb-6">👁️</div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: colors.mainYellow }}>
                Real-Time Preview
              </h3>
              <p className="text-lg" style={{ color: 'white' }}>
                Watch your PC build take shape instantly as you add components. Every change is reflected in real-time for immediate feedback.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl transition-transform hover:scale-105 cursor-pointer" style={{ backgroundColor: colors.mainBlack  }}>
              <div className="text-6xl mb-6">✅</div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: colors.mainYellow }}>
                Smart Compatibility
              </h3>
              <p className="text-lg" style={{ color: 'white'}}>
                Our intelligent system ensures all components work perfectly together. No more compatibility headaches.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl transition-transform hover:scale-105 cursor-pointer" style={{ backgroundColor: colors.mainBlack  }}>
              <div className="text-6xl mb-6">💰</div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: colors.mainYellow }}>
                Best Prices
              </h3>
              <p className="text-lg" style={{ color: 'white'}}>
                Compare prices from multiple retailers and get the best deals on every component for your dream build.
              </p>
            </div>
          </div>
        </section>

      </div>

      <Footer />
    </div>
  );
};

export default Home;
