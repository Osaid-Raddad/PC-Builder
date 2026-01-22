import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/navbar/Navbar.jsx';
import Footer from '../../components/user/footer/Footer.jsx';
import GlassIcons from '../../components/ui/GlassIcons/GlassIcons.jsx';
import BlurText from '../../components/animations/BlurText/BlurText.jsx';
import ModelViewer from '../../components/user/3D/ModelViewer.jsx';
import ElectricBorder from '../../components/animations/ElectricBorder/ElectricBorder.jsx';
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
import {BsMotherboard, BsGpuCard} from 'react-icons/bs';
import {FaMemory , FaBolt} from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();

  const featureItems = [
    { icon: <FiCpu />, color: colors.mainYellow, label: 'CPU', link: '/products/cpu' },
    { icon: <FiWind />, color: colors.mainYellow, label: 'CPU Cooler', link: '/products/cooler' },
    { icon: <BsMotherboard />, color: colors.mainYellow, label: 'Motherboard', link: '/products/motherboard' },
    { icon: <FaMemory />, color: colors.mainYellow, label: 'Memory', link: '/products/memory' },
    { icon: <FiHardDrive />, color: colors.mainYellow, label: 'Storage', link: '/products/storage' },
    { icon: <BsGpuCard />, color: colors.mainYellow, label: 'GPU', link: '/products/gpu' },
    { icon: <FiBox />, color: colors.mainYellow, label: 'Case', link: '/products/case' },
    { icon: <FaBolt />, color: colors.mainYellow, label: 'Power Supply', link: '/products/power-supply' },
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
          <div className="flex gap-6 flex-wrap justify-center">
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
            <button
              onClick={() => navigate('/ai-calculator')}
              className="ai-calculator-button px-10 py-5 text-xl font-bold rounded-xl cursor-pointer flex items-center gap-3 relative overflow-hidden"
              style={{ 
                background: `linear-gradient(135deg, ${colors.mainBlack} 0%, #1a1a1a 50%, ${colors.mainBlack} 100%)`,
                color: colors.mainYellow,
                border: `3px solid ${colors.mainYellow}`,
                boxShadow: `0 0 30px rgba(243, 189, 74, 0.5), 0 0 60px rgba(243, 189, 74, 0.3), inset 0 0 20px rgba(243, 189, 74, 0.1)`,
                animation: 'pulse-glow 2s ease-in-out infinite, shimmer 3s linear infinite',
                position: 'relative'
              }}
            >
              <span style={{ 
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(243, 189, 74, 0.4), transparent)',
                animation: 'shine 3s infinite'
              }}></span>
              <span className="relative z-10 flex items-center gap-3">
                <span className="text-2xl" style={{ animation: 'brain-pulse 1.5s ease-in-out infinite' }}>🧠</span>
                <span>AI Hardware Calculator</span>
                <span className="text-sm px-2 py-1 rounded-full" style={{
                  backgroundColor: colors.mainYellow,
                  color: colors.mainBlack,
                  animation: 'badge-bounce 2s ease-in-out infinite'
                }}>NEW</span>
              </span>
            </button>
          </div>
          <style>{`
            @keyframes pulse-glow {
              0%, 100% {
                box-shadow: 0 0 30px rgba(243, 189, 74, 0.5), 0 0 60px rgba(243, 189, 74, 0.3), inset 0 0 20px rgba(243, 189, 74, 0.1);
              }
              50% {
                box-shadow: 0 0 40px rgba(243, 189, 74, 0.8), 0 0 80px rgba(243, 189, 74, 0.5), inset 0 0 30px rgba(243, 189, 74, 0.2);
              }
            }
            @keyframes shine {
              0% { left: -100%; }
              100% { left: 200%; }
            }
            @keyframes brain-pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.2); }
            }
            @keyframes badge-bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-3px); }
            }
            .ai-calculator-button:hover {
              transform: translateY(-5px) scale(1.05);
              box-shadow: 0 0 50px rgba(243, 189, 74, 0.8), 0 0 100px rgba(243, 189, 74, 0.5), inset 0 0 30px rgba(243, 189, 74, 0.2) !important;
              transition: all 0.3s ease;
            }
            .ai-calculator-button::before {
              content: '';
              position: absolute;
              top: -2px;
              left: -2px;
              right: -2px;
              bottom: -2px;
              background: linear-gradient(45deg, ${colors.mainYellow}, #ffd700, ${colors.mainYellow}, #ffd700);
              border-radius: 0.75rem;
              z-index: -1;
              opacity: 0;
              transition: opacity 0.3s;
              animation: rotate-border 4s linear infinite;
              background-size: 400% 400%;
            }
            .ai-calculator-button:hover::before {
              opacity: 1;
            }
            @keyframes rotate-border {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}</style>
        </div>
      </section>

      <div className="flex-1 py-8" style={{color: colors.mainBlack}}>
        
        {/* Section 1: 3D Component Showcase */}
        <section className="container mx-auto mb-20 px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.mainYellow }}>
                Featured Components in 3D
              </h2>
              <p className="text-lg md:text-xl opacity-90" style={{ color: colors.mainBlack }}>
                Explore our components with interactive 3D models
              </p>
            </div>

            {/* Section 5: 3D Models Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* GPU Model */}
              <ElectricBorder color={colors.mainYellow} speed={0.3} chaos={0.3} thickness={2}>
                <ModelViewer
                  modelPath="/models/gpu.glb"
                  title="ROG ASTRAL RTX 5090 Golden Edition"
                  description="Linmited Edition with 24GB GDDR7X"
                  componentName="Graphics Card"
                  cameraPosition={[5, -5, 5]}
                  modelPosition={[0, 0, 0]}
                  modelRotation={[0, 0, 0]}
                  modelScale={2}
                />
              </ElectricBorder>

              {/* GPU Model 2 */}
              <ElectricBorder color={colors.mainYellow} speed={0.3} chaos={0.3} thickness={2}>
                <ModelViewer
                  modelPath="/models/gpu2.glb"
                  title="Asus ROG Geforce RTX 4090 v2.0"
                  description="Limited Edition with enhanced cooling"
                  componentName="Graphics Card"
                  cameraPosition={[-5, -5, 5]}
                  modelPosition={[0, 0, 0]}
                  modelRotation={[0, 0, 0]}
                  modelScale={2}
                />
              </ElectricBorder>

              {/* RAM Model */}
              <ElectricBorder color={colors.mainYellow} speed={0.3} chaos={0.3} thickness={2}>
                <ModelViewer
                  modelPath="/models/ram.glb"
                  title="Corsair DOMINATOR RGB RAM"
                  description="32GB (2x16GB) DDR5 6000MHz"
                  componentName="Memory"
                  cameraPosition={[5, 0, 5]}
                  modelPosition={[0, 0, 0]}
                  modelRotation={[0, 0, 0]}
                  modelScale={0.9}
                />
              </ElectricBorder>
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
