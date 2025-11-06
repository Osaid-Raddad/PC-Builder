import React, { useState } from 'react';
import Navbar from '../../../components/user/navbar/Navbar';
import Footer from '../../../components/user/footer/Footer';
import colors from '../../../config/colors';
import { FiExternalLink, FiMapPin, FiChevronLeft, FiChevronRight, FiFilter, FiSearch } from 'react-icons/fi';

const Shops = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCity, setSelectedCity] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const shopsPerPage = 6;

  const allShops = [
    {
      id: 1,
      name: 'Watani Mall',
      description: 'Your trusted destination for computers, electronics, and tech accessories in Palestine',
      logo: '/src/assets/Images/watani.png',
      url: 'https://watanimall.com/?srsltid=AfmBOor1Zh5XPOFWmau4Ty-57WDCplKHQEoddNMlTyIfS4TpG-4F1UMH',
      location: 'Beit-Hanina, Jerualem',
      city: 'Jerusalem',
      specialties: ['Computers', 'Gaming', 'Electronics', 'Accessories']
    },
    {
      id: 2,
      name: 'Cobra Shop',
      description: 'Premium computer hardware and gaming equipment supplier',
      logo: '/src/assets/Images/cobra.webp',
      url: 'https://www.cobrashop.ps/',
      location: 'Ramallah, West Bank',
      city: 'Ramallah',
      specialties: ['PC Components', 'Gaming Gear', 'Peripherals']
    },
    {
      id: 3,
      name: 'ZikZak Store',
      description: 'Modern tech store offering latest computers and accessories',
      logo: '/src/assets/Images/zikzak.webp',
      url: 'https://zikzakstore.com/en/',
      location: 'Nablus, West Bank',
      city: 'Nablus',
      specialties: ['Laptops', 'Desktops', 'Accessories', 'Software']
    },
    {
      id: 4,
      name: 'Quantum',
      description: 'Professional computer solutions and IT services',
      logo: '/src/assets/Images/quantum.webp',
      url: 'https://quantum.ps/',
      location: 'Ramallah, West Bank',
      city: 'Ramallah',
      specialties: ['Business Solutions', 'Hardware', 'IT Services']
    },
    {
      id: 5,
      name: 'Mega Tech',
      description: 'Complete tech solutions for all your computing needs',
      logo: '/src/assets/Images/mega.png',
      url: 'https://megatech.ps/',
      location: 'Ramallah, West Bank',
      city: 'Ramallah',
      specialties: ['PC Building', 'Repairs', 'Components', 'Gaming']
    },
    {
      id: 6,
      name: 'CS Net Games',
      description: 'Gaming specialists with wide selection of gaming hardware',
      logo: '/src/assets/Images/cs.svg',
      url: 'https://csnetgames.com/ar',
      location: 'Ramallah, West Bank',
      city: 'Ramallah',
      specialties: ['Gaming PCs', 'Consoles', 'Gaming Accessories']
    },
    {
      id: 7,
      name: 'Arabi',
      description: 'Reliable computer shop offering quality hardware and excellent customer service',
      logo: '/src/assets/Images/Arabi.jpg',
      url: 'https://www.facebook.com/alarabi.for.computer',
      location: 'Bethlehem, West Bank',
      city: 'Bethlehem',
      specialties: ['Computers', 'Hardware', 'Repairs', 'Accessories']
    },
    {
      id: 8,
      name: 'Alyamen',
      description: 'Trusted provider of computers and tech solutions for businesses and individuals',
      logo: '/src/assets/Images/yamen.png',
      url: 'https://www.facebook.com/Yamen4Computer/',
      location: 'Hebron, West Bank',
      city: 'Hebron',
      specialties: ['PC Building', 'Components', 'Software', 'IT Support']
    },
    {
      id: 9,
      name: 'Extreme Gaming Store',
      description: 'Ultimate destination for gaming enthusiasts with top-tier gaming hardware',
      logo: '/src/assets/Images/extreme.png',
      url: 'https://xgc.ps/',
      location: 'Ramallah, West Bank',
      city: 'Ramallah',
      specialties: ['Gaming PCs', 'High-End Components', 'Gaming Gear', 'Custom Builds']
    }
  ];

  // Get unique cities for filter
  const cities = ['All', ...new Set(allShops.map(shop => shop.city))];

  // Filter shops by selected city and search term
  const filteredShops = allShops.filter(shop => {
    const matchesCity = selectedCity === 'All' || shop.city === selectedCity;
    const matchesSearch = searchTerm === '' || 
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCity && matchesSearch;
  });

  const totalPages = Math.ceil(filteredShops.length / shopsPerPage);
  const indexOfLastShop = currentPage * shopsPerPage;
  const indexOfFirstShop = indexOfLastShop - shopsPerPage;
  const currentShops = filteredShops.slice(indexOfFirstShop, indexOfLastShop);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleCityFilter = (city) => {
    setSelectedCity(city);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleShopClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4" style={{ color: colors.mainBlack }}>
            Computer Shops in West Bank
          </h1>
          <p className="text-xl" style={{ color: colors.jet }}>
            Find the best computer shops near you for all your PC building needs
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
              placeholder="Search shops by name, location, or specialty..."
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

        {/* City Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <FiFilter size={20} style={{ color: colors.mainYellow }} className="shrink-0" />
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => handleCityFilter(city)}
                className="px-5 py-2 rounded-full font-medium transition-all shrink-0"
                style={{
                  backgroundColor: selectedCity === city ? colors.mainYellow : 'white',
                  color: selectedCity === city ? 'white' : colors.jet,
                  border: `2px solid ${selectedCity === city ? colors.mainYellow : colors.platinum}`
                }}
              >
                {city}
                {city !== 'All' && (
                  <span 
                    className="ml-2 px-2 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: selectedCity === city ? 'rgba(255,255,255,0.3)' : colors.mainYellow + '20',
                      color: selectedCity === city ? 'white' : colors.mainBlack
                    }}
                  >
                    {allShops.filter(shop => shop.city === city).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {selectedCity !== 'All' && (
            <div className="mt-4 text-sm" style={{ color: colors.jet }}>
              Showing {filteredShops.length} shop{filteredShops.length !== 1 ? 's' : ''} in {selectedCity}
            </div>
          )}
        </div>

        {/* Shop Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentShops.map((shop) => (
            <div
              key={shop.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 flex flex-col"
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
              <div className="p-6 flex flex-col flex-1">
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
                <p className="text-sm mb-4 flex-1" style={{ color: colors.jet }}>
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mb-12">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
              style={{
                backgroundColor: currentPage === 1 ? colors.platinum : colors.mainYellow,
                color: currentPage === 1 ? colors.jet : 'white',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.5 : 1
              }}
            >
              <FiChevronLeft size={20} />
              Previous
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className="w-10 h-10 rounded-lg font-semibold transition-all duration-200"
                  style={{
                    backgroundColor: currentPage === pageNumber ? colors.mainYellow : 'white',
                    color: currentPage === pageNumber ? 'white' : colors.mainBlack,
                    border: `2px solid ${currentPage === pageNumber ? colors.mainYellow : colors.platinum}`
                  }}
                >
                  {pageNumber}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
              style={{
                backgroundColor: currentPage === totalPages ? colors.platinum : colors.mainYellow,
                color: currentPage === totalPages ? colors.jet : 'white',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.5 : 1
              }}
            >
              Next
              <FiChevronRight size={20} />
            </button>
          </div>
        )}

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
