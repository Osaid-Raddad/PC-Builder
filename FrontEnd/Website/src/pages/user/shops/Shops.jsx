import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/user/navbar/Navbar';
import Footer from '../../../components/user/footer/Footer';
import BounceCard from '../../../components/animations/BounceCard/BounceCard';
import colors from '../../../config/colors';
import { FiExternalLink, FiMapPin, FiChevronLeft, FiChevronRight, FiFilter, FiSearch, FiPlus, FiShoppingBag, FiX, FiUpload, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import BlurText from '../../../components/animations/BlurText/BlurText';
import { useForm } from 'react-hook-form';
import apiClient from '../../../services/apiService';

const Shops = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCity, setSelectedCity] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [animationKey, setAnimationKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const shopsPerPage = 6;

  // React Hook Form
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();
  const watchLogo = watch('ShopLogo');

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  const allShops = [
    {
      id: 1,
      name: 'Watani Mall',
      description: 'Your trusted destination for computers, electronics, and tech accessories in Palestine',
      logo: '/src/assets/Images/watani.png',
      url: 'https://watanimall.com/?srsltid=AfmBOor1Zh5XPOFWmau4Ty-57WDCplKHQEoddNMlTyIfS4TpG-4F1UMH',
      location: 'Beit-Hanina, Jerusalem',
      city: 'Jerusalem',
      specialties: ['Computers', 'Gaming', 'Electronics', 'Accessories']
    },
    {
      id: 2,
      name: 'CS Net Games',
      description: 'Gaming specialists with wide selection of gaming hardware',
      logo: '/src/assets/Images/cs.svg',
      url: 'https://csnetgames.com/ar',
      location: 'Ramallah, West Bank',
      city: 'Ramallah',
      specialties: ['Gaming PCs', 'Consoles', 'Gaming Accessories']
    },
    {
      id: 3,
      name: 'Cobra Shop',
      description: 'Premium computer hardware and gaming equipment supplier',
      logo: '/src/assets/Images/cobra.webp',
      url: 'https://www.cobrashop.ps/',
      location: 'Ramallah, West Bank',
      city: 'Ramallah',
      specialties: ['PC Components', 'Gaming Gear', 'Peripherals']
    },
    {
      id: 4,
      name: 'Mega Tech',
      description: 'Complete tech solutions for all your computing needs',
      logo: '/src/assets/Images/mega.png',
      url: 'https://megatech.ps/',
      location: 'Ramallah, West Bank',
      city: 'Ramallah',
      specialties: ['PC Building', 'Repairs', 'Components', 'Gaming']
    },
    {
      id: 5,
      name: 'Quantum',
      description: 'Professional computer solutions and IT services',
      logo: '/src/assets/Images/quantum.webp',
      url: 'https://quantum.ps/',
      location: 'Ramallah, West Bank',
      city: 'Ramallah',
      specialties: ['Business Solutions', 'Hardware', 'IT Services']
    },
    {
      id: 6,
      name: 'A to Z',
      description: 'Complete technology store offering comprehensive range of computer products',
      logo: '/src/assets/Images/AZ.jpg',
      url: 'https://www.facebook.com/atoztechnologystore',
      location: 'Ramallah, West Bank',
      city: 'Ramallah',
      specialties: ['Computers', 'Technology', 'Accessories', 'Electronics']
    },
    {
      id: 7,
      name: 'ZikZak Store',
      description: 'Modern tech store offering latest computers and accessories',
      logo: '/src/assets/Images/zikzak.webp',
      url: 'https://zikzakstore.com/en/',
      location: 'Nablus, West Bank',
      city: 'Nablus',
      specialties: ['Laptops', 'Desktops', 'Accessories', 'Software']
    },
    {
      id: 8,
      name: 'Arabi',
      description: 'Reliable computer shop offering quality hardware and excellent customer service',
      logo: '/src/assets/Images/Arabi.jpg',
      url: 'https://www.facebook.com/alarabi.for.computer',
      location: 'Bethlehem, West Bank',
      city: 'Bethlehem',
      specialties: ['Computers', 'Hardware', 'Repairs', 'Accessories']
    },
    {
      id: 9,
      name: 'Alyamen',
      description: 'Trusted provider of computers and tech solutions for businesses and individuals',
      logo: '/src/assets/Images/yamen.png',
      url: 'https://www.facebook.com/Yamen4Computer/',
      location: 'Hebron, West Bank',
      city: 'Hebron',
      specialties: ['PC Building', 'Components', 'Software', 'IT Support']
    },
    {
      id: 10,
      name: 'Extreme Gaming Store',
      description: 'Ultimate destination for gaming enthusiasts with top-tier gaming hardware',
      logo: '/src/assets/Images/extreme.png',
      url: 'https://xgc.ps/',
      location: 'Ramallah, West Bank',
      city: 'Ramallah',
      specialties: ['Gaming PCs', 'High-End Components', 'Gaming Gear', 'Custom Builds']
    },
    {
      id: 11,
      name: 'Core Tech',
      description: 'Cutting-edge technology solutions and computer hardware provider',
      logo: '/src/assets/Images/coretech.jpg',
      url: 'https://www.facebook.com/share/17SqcdAwHe/?mibextid=wwXIfr',
      location: 'Hebron, West Bank',
      city: 'Hebron',
      specialties: ['PC Components', 'Hardware', 'Gaming', 'Accessories']
    },
    {
      id: 12,
      name: 'Masalmeh',
      description: 'Trusted computer store with quality products and professional service',
      logo: '/src/assets/Images/masalmeh.jpg',
      url: 'https://www.facebook.com/masalmehpc',
      location: 'Hebron, West Bank',
      city: 'Hebron',
      specialties: ['Computers', 'Components', 'Repairs', 'IT Solutions']
    },
    {
      id: 13,
      name: 'Digital Doctors',
      description: 'Expert computer repair and hardware solutions with technical expertise',
      logo: '/src/assets/Images/digital.jpg',
      url: 'https://www.facebook.com/share/1AUkjNyi6F/?mibextid=wwXIfr',
      location: 'Hebron, West Bank',
      city: 'Hebron',
      specialties: ['Repairs', 'IT Support', 'Hardware', 'Diagnostics']
    },
    {
      id: 14,
      name: 'Islam PC',
      description: 'Quality computer hardware and accessories at competitive prices',
      logo: '/src/assets/Images/islam.jpg',
      url: 'https://www.facebook.com/share/19Jy7FQ3Rt/?mibextid=wwXIfr',
      location: 'Hebron, West Bank',
      city: 'Hebron',
      specialties: ['PC Components', 'Accessories', 'Gaming', 'Peripherals']
    },
    {
      id: 15,
      name: 'Master PC',
      description: 'Professional PC building and hardware solutions for enthusiasts',
      logo: '/src/assets/Images/master.jpg',
      url: 'https://www.facebook.com/share/17Pycrjfnw/?mibextid=wwXIfr',
      location: 'Hebron, West Bank',
      city: 'Hebron',
      specialties: ['Custom Builds', 'High-End Components', 'Gaming', 'Workstations']
    },
    {
      id: 16,
      name: 'Gold PC',
      description: 'Premium computer hardware and gaming equipment with excellent service',
      logo: '/src/assets/Images/gold.jpg',
      url: 'https://www.facebook.com/share/1YuYdFSNAs/?mibextid=wwXIfr',
      location: 'Kafr Aqab, Jerusalem',
      city: 'Jerusalem',
      specialties: ['Gaming PCs', 'Components', 'Accessories', 'Upgrades']
    },
    {
      id: 17,
      name: 'Ultra PC',
      description: 'High-performance PC solutions and cutting-edge computer technology',
      logo: '/src/assets/Images/ultra.jpg',
      url: 'https://www.facebook.com/share/1BM24Wqouh/?mibextid=wwXIfr',
      location: 'Hebron, West Bank',
      city: 'Hebron',
      specialties: ['Gaming', 'High-End Hardware', 'Custom Builds', 'Overclocking']
    },
    {
      id: 18,
      name: 'Computer Strix',
      description: 'Gaming-focused computer shop with latest hardware and peripherals',
      logo: '/src/assets/Images/strix.jpg',
      url: 'https://www.facebook.com/share/16RSGSFkpM/?mibextid=wwXIfr',
      location: 'Jerusalem',
      city: 'Jerusalem',
      specialties: ['Gaming PCs', 'RGB Components', 'Peripherals', 'Custom Builds']
    },
    {
      id: 19,
      name: 'Nabtech',
      description: 'Modern technology solutions and computer hardware provider',
      logo: '/src/assets/Images/nabtech.jpg',
      url: 'https://www.facebook.com/share/16dz6BzfjS/?mibextid=wwXIfr',
      location: 'Nablus, West Bank',
      city: 'Nablus',
      specialties: ['PC Components', 'Laptops', 'Networking', 'IT Solutions']
    },
    {
      id: 20,
      name: 'Warehouse',
      description: 'Large inventory of computer parts and electronics at wholesale prices',
      logo: '/src/assets/Images/warrehouse.jpg',
      url: 'https://www.facebook.com/share/1CRDffJKm7/?mibextid=wwXIfr',
      location: 'Tulkarem, West Bank',
      city: 'Tulkarem',
      specialties: ['Wholesale', 'Components', 'Bulk Orders', 'Electronics']
    },
    {
      id: 21,
      name: 'Etihad',
      description: 'Comprehensive computer solutions and hardware supplier',
      logo: '/src/assets/Images/ithad.jpg',
      url: 'https://www.facebook.com/share/16TGdXvzH1/?mibextid=wwXIfr',
      location: 'Hebron, West Bank',
      city: 'Hebron',
      specialties: ['Computers', 'Hardware', 'Networking', 'Business Solutions']
    },
    {
      id: 22,
      name: 'Horizon',
      description: 'Innovative computer solutions and technology services',
      logo: '/src/assets/Images/horizon.jpg',
      url: 'https://www.facebook.com/profile.php?id=100083081091336',
      location: 'Kafr Aqab, Jerusalem',
      city: 'Jerusalem',
      specialties: ['PC Components', 'Gaming', 'Hardware', 'Tech Solutions']
    },
    {
      id: 23,
      name: 'Easy Life',
      description: 'Making technology accessible with quality computers and electronics',
      logo: '/src/assets/Images/Easy.png',
      url: 'https://www.facebook.com/EasyLifeSales',
      location: 'Nablus, West Bank',
      city: 'Nablus',
      specialties: ['Computers', 'Electronics', 'Home Tech', 'Accessories']
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
    setAnimationKey(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleCityFilter = (city) => {
    setSelectedCity(city);
    setCurrentPage(1);
    setAnimationKey(prev => prev + 1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    setAnimationKey(prev => prev + 1);
  };

  const handleShopClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (JPG, PNG, WEBP, or SVG)');
        e.target.value = null;
        setLogoPreview(null);
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Logo size must be less than 2MB');
        e.target.value = null;
        setLogoPreview(null);
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setLogoPreview(null);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        toast.error('You must be logged in to submit a shop');
        setIsSubmitting(false);
        return;
      }

      // Validate that logo file exists
      if (!data.ShopLogo || !data.ShopLogo[0]) {
        toast.error('Please upload a shop logo');
        setIsSubmitting(false);
        return;
      }

      // Create FormData object
      const formData = new FormData();
      formData.append('ShopName', data.ShopName);
      formData.append('OwnerName', data.OwnerName);
      formData.append('Email', data.Email);
      formData.append('Phone', data.Phone);
      formData.append('City', data.City);
      formData.append('ExactLocation', data.ExactLocation);
      formData.append('WebURL', data.WebURL);
      formData.append('Description', data.Description);
      formData.append('Specialties', data.Specialties);
      
      // Append logo file (only one file)
      const logoFile = data.ShopLogo[0];
      formData.append('ShopLogo', logoFile, logoFile.name);

      // Debug: Log FormData contents
      console.log('=== Shop Submission Data ===');
      console.log('ShopName:', data.ShopName);
      console.log('OwnerName:', data.OwnerName);
      console.log('Email:', data.Email);
      console.log('Phone:', data.Phone);
      console.log('City:', data.City);
      console.log('ExactLocation:', data.ExactLocation);
      console.log('WebURL:', data.WebURL);
      console.log('Description:', data.Description);
      console.log('Specialties:', data.Specialties);
      console.log('Logo File:', {
        name: logoFile.name,
        size: logoFile.size,
        type: logoFile.type
      });
      console.log('Token exists:', !!token);
      console.log('===========================');

      // Make API call with apiClient (token automatically added by interceptor)
      // Note: Don't set Content-Type for FormData - browser sets it automatically with boundary
      const response = await apiClient.post(
        '/Shops/Shop/Request',
        formData
      );

      console.log('Success response:', response.data);

      // Success handling
      toast.success('Your shop has been submitted for review! We will contact you soon.');
      
      // Reset form and close modal
      reset();
      setLogoPreview(null);
      setShowSubmitModal(false);
    } catch (error) {
      console.error('Error submitting shop:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response) {
        // Server responded with error
        const errorMessage = error.response.data?.message || error.response.data || 'Failed to submit shop. Please try again.';
        toast.error(typeof errorMessage === 'string' ? errorMessage : 'Failed to submit shop. Please try again.');
      } else if (error.request) {
        // Request made but no response - likely CORS issue
        toast.error('Cannot connect to server. This may be a CORS configuration issue. Please contact support.');
      } else {
        // Other errors
        toast.error('An error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.mainBeige }}>
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center">
            <BlurText 
              text="Computer Shops in West Bank"
              className="text-6xl font-bold mb-4"
              delay={80}
              animateBy="words"
              direction="top"
            />
          </div>
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
                className="px-5 py-2 rounded-full font-medium transition-all shrink-0 cursor-pointer"
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
          {currentShops.map((shop, index) => (
            <BounceCard
              key={`${shop.id}-${animationKey}`}
              delay={index * 0.1}
              animationKey={animationKey}
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
                  className="w-full py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
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
            </BounceCard>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mb-12">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer"
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
                  className="w-10 h-10 rounded-lg font-semibold transition-all duration-200 cursor-pointer"
                  style={{
                    backgroundColor: currentPage === pageNumber ? colors.mainYellow : 'white',
                    color: currentPage === pageNumber ? 'white' : colors.mainBlack,
                    border: `2px solid ${currentPage === pageNumber ? colors.mainYellow : colors.platinum}`
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== pageNumber) {
                      e.currentTarget.style.backgroundColor = colors.platinum;
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.borderColor = colors.platinum;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== pageNumber) {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.color = colors.mainBlack;
                      e.currentTarget.style.borderColor = colors.platinum;
                    }
                  }}
                >
                  {pageNumber}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer"
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

        {/* Submit Your Shop Section */}
        <div 
          className="mt-12 p-8 rounded-lg text-center"
          style={{ backgroundColor: colors.mainYellow + '15', border: `2px solid ${colors.mainYellow}` }}
        >
          <FiShoppingBag size={48} style={{ color: colors.mainYellow, margin: '0 auto 16px' }} />
          <h3 className="text-3xl font-bold mb-4" style={{ color: colors.mainBlack }}>
            Own a Computer Shop?
          </h3>
          <p className="text-lg mb-6" style={{ color: colors.jet }}>
            List your shop on our platform and reach thousands of PC builders and tech enthusiasts across Palestine!
          </p>
          {!isLoggedIn && (
            <p className="text-sm mb-4 font-semibold" style={{ color: colors.mainYellow }}>
              Please sign in to submit your shop
            </p>
          )}
          <button
            onClick={() => {
              if (isLoggedIn) {
                setShowSubmitModal(true);
              } else {
                toast.error('Please sign in to submit your shop');
              }
            }}
            disabled={!isLoggedIn}
            className="px-8 py-4 rounded-lg font-bold text-white transition-opacity text-lg flex items-center gap-2 mx-auto"
            style={{ 
              backgroundColor: isLoggedIn ? colors.mainYellow : colors.platinum,
              opacity: isLoggedIn ? 1 : 0.6,
              cursor: isLoggedIn ? 'pointer' : 'not-allowed'
            }}
            onMouseEnter={(e) => {
              if (isLoggedIn) {
                e.currentTarget.style.opacity = '0.9';
              }
            }}
            onMouseLeave={(e) => {
              if (isLoggedIn) {
                e.currentTarget.style.opacity = '1';
              }
            }}
          >
            <FiPlus size={20} />
            {isLoggedIn ? 'Submit Your Shop' : 'Sign In Required'}
          </button>
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

      {/* Submit Shop Modal */}
      {showSubmitModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setShowSubmitModal(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ border: `3px solid ${colors.mainYellow}` }}
          >
            {/* Modal Header */}
            <div 
              className="sticky top-0 bg-white p-6 border-b-2 flex items-center justify-between"
              style={{ borderColor: colors.platinum }}
            >
              <h2 className="text-2xl font-bold" style={{ color: colors.mainBlack }}>
                Submit Your Shop for Review
              </h2>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <FiX size={24} style={{ color: colors.jet }} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6" encType="multipart/form-data">
              <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: colors.mainYellow + '15' }}>
                <p className="text-sm font-semibold" style={{ color: colors.mainBlack }}>
                  📋 Your submission will be reviewed by our team before being published on the website.
                </p>
              </div>

              <div className="space-y-4">
                {/* Shop Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                    Shop Name <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    {...register('ShopName', { required: 'Shop name is required' })}
                    placeholder="e.g., Tech Paradise"
                    className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                    style={{ 
                      borderColor: errors.ShopName ? 'red' : colors.platinum,
                      color: colors.mainBlack
                    }}
                    onFocus={(e) => e.target.style.borderColor = colors.mainYellow}
                    onBlur={(e) => e.target.style.borderColor = errors.ShopName ? 'red' : colors.platinum}
                  />
                  {errors.ShopName && <p className="text-red-500 text-xs mt-1">{errors.ShopName.message}</p>}
                </div>

                {/* Owner Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                    Owner Name <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    {...register('OwnerName', { required: 'Owner name is required' })}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                    style={{ 
                      borderColor: errors.OwnerName ? 'red' : colors.platinum,
                      color: colors.mainBlack
                    }}
                    onFocus={(e) => e.target.style.borderColor = colors.mainYellow}
                    onBlur={(e) => e.target.style.borderColor = errors.OwnerName ? 'red' : colors.platinum}
                  />
                  {errors.OwnerName && <p className="text-red-500 text-xs mt-1">{errors.OwnerName.message}</p>}
                </div>

                {/* Shop Logo */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                    Shop Logo <span style={{ color: 'red' }}>*</span>
                  </label>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <label 
                        className="flex items-center justify-center w-full px-4 py-12 rounded-lg border-2 border-dashed cursor-pointer transition-all hover:border-solid"
                        style={{ 
                          borderColor: errors.ShopLogo ? 'red' : colors.platinum,
                          backgroundColor: colors.mainYellow + '08'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = colors.mainYellow}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = errors.ShopLogo ? 'red' : colors.platinum}
                      >
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
                          {...register('ShopLogo', { 
                            required: 'Shop logo is required',
                            onChange: (e) => handleLogoChange(e),
                            validate: {
                              fileType: (files) => {
                                if (!files || files.length === 0) return 'Shop logo is required';
                                const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
                                return validTypes.includes(files[0].type) || 'Please upload a valid image file (JPG, PNG, WEBP, or SVG)';
                              },
                              fileSize: (files) => {
                                if (!files || files.length === 0) return 'Shop logo is required';
                                return files[0].size <= 2 * 1024 * 1024 || 'Logo size must be less than 2MB';
                              }
                            }
                          })}
                          className="hidden"
                        />
                        <div className="text-center">
                          <FiUpload className="mx-auto mb-3" size={48} style={{ color: colors.mainYellow }} />
                          <p className="text-base font-semibold" style={{ color: colors.mainBlack }}>
                            Click to upload logo
                          </p>
                          <p className="text-sm mt-2" style={{ color: colors.jet }}>
                            JPG, PNG, WEBP, or SVG (Max 2MB)
                          </p>
                          {logoPreview && (
                            <p className="text-xs mt-2 font-semibold" style={{ color: colors.mainYellow }}>
                              ✓ Logo uploaded
                            </p>
                          )}
                        </div>
                      </label>
                    </div>
                    {logoPreview && (
                      <div className="w-40 h-40 rounded-lg border-2 overflow-hidden flex items-center justify-center bg-white"
                           style={{ borderColor: colors.mainYellow }}>
                        <img 
                          src={logoPreview} 
                          alt="Logo preview" 
                          className="max-w-full max-h-full object-contain p-2"
                        />
                      </div>
                    )}
                  </div>
                  {errors.ShopLogo && <p className="text-red-500 text-xs mt-1">{errors.ShopLogo.message}</p>}
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                      Email <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="email"
                      {...register('Email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      placeholder="shop@example.com"
                      className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                      style={{ 
                        borderColor: errors.Email ? 'red' : colors.platinum,
                        color: colors.mainBlack
                      }}
                      onFocus={(e) => e.target.style.borderColor = colors.mainYellow}
                      onBlur={(e) => e.target.style.borderColor = errors.Email ? 'red' : colors.platinum}
                    />
                    {errors.Email && <p className="text-red-500 text-xs mt-1">{errors.Email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                      Phone <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      {...register('Phone', { required: 'Phone number is required' })}
                      placeholder="+970 XX XXX XXXX"
                      className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                      style={{ 
                        borderColor: errors.Phone ? 'red' : colors.platinum,
                        color: colors.mainBlack
                      }}
                      onFocus={(e) => e.target.style.borderColor = colors.mainYellow}
                      onBlur={(e) => e.target.style.borderColor = errors.Phone ? 'red' : colors.platinum}
                    />
                    {errors.Phone && <p className="text-red-500 text-xs mt-1">{errors.Phone.message}</p>}
                  </div>
                </div>

                {/* City & Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                      City <span style={{ color: 'red' }}>*</span>
                    </label>
                    <select
                      {...register('City', { required: 'City is required' })}
                      className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors cursor-pointer"
                      style={{ 
                        borderColor: errors.City ? 'red' : colors.platinum,
                        color: colors.mainBlack
                      }}
                      onFocus={(e) => e.target.style.borderColor = colors.mainYellow}
                      onBlur={(e) => e.target.style.borderColor = errors.City ? 'red' : colors.platinum}
                    >
                      <option value="">Select a city</option>
                      <option value="Ramallah">Ramallah</option>
                      <option value="Jerusalem">Jerusalem</option>
                      <option value="Nablus">Nablus</option>
                      <option value="Hebron">Hebron</option>
                      <option value="Bethlehem">Bethlehem</option>
                      <option value="Jenin">Jenin</option>
                      <option value="Tulkarm">Tulkarm</option>
                      <option value="Qalqilya">Qalqilya</option>
                      <option value="Jericho">Jericho</option>
                    </select>
                    {errors.City && <p className="text-red-500 text-xs mt-1">{errors.City.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                      Exact Location <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="text"
                      {...register('ExactLocation', { required: 'Exact location is required' })}
                      placeholder="Street address, area"
                      className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                      style={{ 
                        borderColor: errors.ExactLocation ? 'red' : colors.platinum,
                        color: colors.mainBlack
                      }}
                      onFocus={(e) => e.target.style.borderColor = colors.mainYellow}
                      onBlur={(e) => e.target.style.borderColor = errors.ExactLocation ? 'red' : colors.platinum}
                    />
                    {errors.ExactLocation && <p className="text-red-500 text-xs mt-1">{errors.ExactLocation.message}</p>}
                  </div>
                </div>

                {/* Website/Facebook */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                    Website or Facebook Page URL <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="url"
                    {...register('WebURL', { 
                      required: 'Website URL is required',
                      pattern: {
                        value: /^https?:\/\/.+/,
                        message: 'Please enter a valid URL starting with http:// or https://'
                      }
                    })}
                    placeholder="https://..."
                    className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                    style={{ 
                      borderColor: errors.WebURL ? 'red' : colors.platinum,
                      color: colors.mainBlack
                    }}
                    onFocus={(e) => e.target.style.borderColor = colors.mainYellow}
                    onBlur={(e) => e.target.style.borderColor = errors.WebURL ? 'red' : colors.platinum}
                  />
                  {errors.WebURL && <p className="text-red-500 text-xs mt-1">{errors.WebURL.message}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                    Shop Description <span style={{ color: 'red' }}>*</span>
                  </label>
                  <textarea
                    {...register('Description', { required: 'Shop description is required' })}
                    placeholder="Brief description of your shop and services..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors resize-none"
                    style={{ 
                      borderColor: errors.Description ? 'red' : colors.platinum,
                      color: colors.mainBlack
                    }}
                    onFocus={(e) => e.target.style.borderColor = colors.mainYellow}
                    onBlur={(e) => e.target.style.borderColor = errors.Description ? 'red' : colors.platinum}
                  />
                  {errors.Description && <p className="text-red-500 text-xs mt-1">{errors.Description.message}</p>}
                </div>

                {/* Specialties */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: colors.mainBlack }}>
                    Specialties <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    {...register('Specialties', { required: 'Specialties are required' })}
                    placeholder="e.g., Gaming PCs, Components, Repairs (comma-separated)"
                    className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                    style={{ 
                      borderColor: errors.Specialties ? 'red' : colors.platinum,
                      color: colors.mainBlack
                    }}
                    onFocus={(e) => e.target.style.borderColor = colors.mainYellow}
                    onBlur={(e) => e.target.style.borderColor = errors.Specialties ? 'red' : colors.platinum}
                  />
                  {errors.Specialties && <p className="text-red-500 text-xs mt-1">{errors.Specialties.message}</p>}
                  <p className="text-xs mt-1" style={{ color: colors.jet }}>
                    Separate multiple specialties with commas
                  </p>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowSubmitModal(false);
                    reset();
                    setLogoPreview(null);
                  }}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 rounded-lg font-semibold transition-colors border-2 cursor-pointer"
                  style={{ 
                    borderColor: colors.platinum,
                    color: colors.jet,
                    backgroundColor: 'white',
                    opacity: isSubmitting ? 0.5 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ 
                    backgroundColor: colors.mainYellow,
                    opacity: isSubmitting ? 0.5 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Shops;
