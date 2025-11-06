import React from 'react';
import Navbar from '../../../components/user/navbar/Navbar';
import Footer from '../../../components/user/footer/Footer';
import colors from '../../../config/colors';
import { FiExternalLink, FiMapPin } from 'react-icons/fi';

const Shops = () => {
  const shops = [
    {
      id: 1,
      name: 'Watani Mall',
      description: 'Your trusted destination for computers, electronics, and tech accessories in Palestine',
      logo: '/src/assets/Images/watani.png',
      url: 'https://watanimall.com/?srsltid=AfmBOor1Zh5XPOFWmau4Ty-57WDCplKHQEoddNMlTyIfS4TpG-4F1UMH',
      location: 'Ramallah, West Bank',
      specialties: ['Computers', 'Gaming', 'Electronics', 'Accessories']
    },
    {
      id: 2,
      name: 'Cobra Shop',
      description: 'Premium computer hardware and gaming equipment supplier',
      logo: '/src/assets/Images/cobra.webp',
      url: 'https://www.cobrashop.ps/',
      location: 'West Bank',
      specialties: ['PC Components', 'Gaming Gear', 'Peripherals']
    },
    {
      id: 3,
      name: 'ZikZak Store',
      description: 'Modern tech store offering latest computers and accessories',
      logo: '/src/assets/Images/zikzak.webp',
      url: 'https://zikzakstore.com/en/',
      location: 'West Bank',
      specialties: ['Laptops', 'Desktops', 'Accessories', 'Software']
    },
    {
      id: 4,
      name: 'Quantum',
      description: 'Professional computer solutions and IT services',
      logo: '/src/assets/Images/quantum.webp',
      url: 'https://quantum.ps/',
      location: 'West Bank',
      specialties: ['Business Solutions', 'Hardware', 'IT Services']
    },
    {
      id: 5,
      name: 'Mega Tech',
      description: 'Complete tech solutions for all your computing needs',
      logo: '/src/assets/Images/mega.png',
      url: 'https://megatech.ps/',
      location: 'West Bank',
      specialties: ['PC Building', 'Repairs', 'Components', 'Gaming']
    },
    {
      id: 6,
      name: 'CS Net Games',
      description: 'Gaming specialists with wide selection of gaming hardware',
      logo: '/src/assets/Images/cs.svg',
      url: 'https://csnetgames.com/ar',
      location: 'West Bank',
      specialties: ['Gaming PCs', 'Consoles', 'Gaming Accessories']
    }
  ];

  const handleShopClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4" style={{ color: colors.mainBlack }}>
            Computer Shops in West Bank
          </h1>
          <p className="text-xl" style={{ color: colors.jet }}>
            Find the best computer shops near you for all your PC building needs
          </p>
        </div>

        {/* Shop Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <div
              key={shop.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
              style={{ border: `2px solid ${colors.platinum}` }}
              onClick={() => handleShopClick(shop.url)}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = colors.mainYellow}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = colors.platinum}
            >
              {/* Shop Logo */}
              <div 
                className="h-48 flex items-center justify-center p-6"
                style={{ backgroundColor: colors.alabaster }}
              >
                {shop.logo ? (
                  <img 
                    src={shop.logo} 
                    alt={`${shop.name} logo`}
                    className="max-h-full max-w-full object-contain"
                    style={shop.name === 'Watani Mall' ? { maxHeight: '250px', maxWidth: '100%' } : {}}
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center rounded-lg"
                    style={{ backgroundColor: colors.mainBeige }}
                  >
                    <span 
                      className="text-4xl font-bold"
                      style={{ color: colors.mainYellow }}
                    >
                      {shop.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Shop Info */}
              <div className="p-6">
                {/* Shop Name */}
                <h2 className="text-2xl font-bold mb-2" style={{ color: colors.mainBlack }}>
                  {shop.name}
                </h2>

                {/* Location */}
                <div className="flex items-center mb-3">
                  <FiMapPin size={16} style={{ color: colors.mainYellow }} />
                  <span className="ml-2 text-sm" style={{ color: colors.jet }}>
                    {shop.location}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm mb-4" style={{ color: colors.jet }}>
                  {shop.description}
                </p>

                {/* Specialties */}
                <div className="mb-4">
                  <p className="text-xs font-semibold mb-2" style={{ color: colors.mainBlack }}>
                    Specialties:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {shop.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: colors.mainYellow + '20',
                          color: colors.mainBlack
                        }}
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Visit Button */}
                <button
                  className="w-full py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  style={{ backgroundColor: colors.mainYellow }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShopClick(shop.url);
                  }}
                >
                  <span>Visit Website</span>
                  <FiExternalLink size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div 
          className="mt-12 p-8 rounded-lg text-center"
          style={{ backgroundColor: 'white', border: `2px solid ${colors.mainYellow}` }}
        >
          <h3 className="text-2xl font-bold mb-4" style={{ color: colors.mainBlack }}>
            Why Shop Local?
          </h3>
          <p className="text-lg" style={{ color: colors.jet }}>
            Support local Palestinian businesses and get expert advice, warranty support, 
            and fast delivery for your PC building needs. All shops listed above offer 
            quality products and reliable customer service.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shops;
