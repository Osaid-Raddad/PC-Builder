import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiMenu, FiX, FiUser, FiChevronDown, FiShoppingBag, FiLogOut, FiHeart, FiMessageCircle } from 'react-icons/fi';
import { FaTools, FaBoxOpen, FaNewspaper, FaEdit, FaUserCircle, FaMemory, FaHdd, FaDesktop } from 'react-icons/fa';
import { PiDesktopTowerFill } from 'react-icons/pi';
import { BsFillMotherboardFill, BsGpuCard } from 'react-icons/bs';
import { GiComputerFan } from 'react-icons/gi';
import { MdPowerSettingsNew, MdCable, MdCompareArrows } from 'react-icons/md';
import { Tooltip } from 'react-tooltip';
import toast from 'react-hot-toast';
import colors from '../../../config/colors';
import { BsCpuFill} from 'react-icons/bs';
export default function Navbar() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isCommunityDropdownOpen, setIsCommunityDropdownOpen] = useState(false);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token) {
      setIsLoggedIn(true);
      
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setUserName(user.name || user.username || user.email || 'User');
        } catch (error) {
          console.error('Error parsing user data:', error);
          setUserName('User');
        }
      }
    }
  }, []);

  // Product categories with icons
  const productCategories = [
    { label: 'CPU', path: '/products/cpu', icon: <BsCpuFill size={18} /> },
    { label: 'GPU', path: '/products/gpu', icon: <BsGpuCard size={18} /> },
    { label: 'Motherboard', path: '/products/motherboard', icon: <BsFillMotherboardFill size={18} /> },
    { label: 'RAM', path: '/products/memory', icon: <FaMemory size={18} /> },
    { label: 'Storage', path: '/products/storage', icon: <FaHdd size={18} /> },
    { label: 'Power Supply', path: '/products/power-supply', icon: <MdPowerSettingsNew size={18} /> },
    { label: 'Case', path: '/products/case', icon: <PiDesktopTowerFill size={18} /> },
    { label: 'Cooling', path: '/products/cooler', icon: <GiComputerFan size={18} /> },
    { label: 'Monitor', path: '/products/monitor', icon: <FaDesktop size={18} /> },
    { label: 'Accessories', path: '/products/accessories', icon: <MdCable size={18} /> },
  ];

  // Community items for dropdown
  const communityItems = [
    { label: 'Posts', path: '/posts', icon: <FaEdit size={18} /> },
    { label: 'News', path: '/news', icon: <FaNewspaper size={18} /> },
    { label: 'Shops', path: '/shops', icon: <FiShoppingBag size={18} /> },
  ];

  const menuItems = [
    { 
      label: 'Builder', 
      path: '/builder', 
      icon: <FaTools size={18} />,
      tooltip: 'Build your custom PC step by step'
    },
    { 
      label: 'Products', 
      path: '/products', 
      icon: <FaBoxOpen size={18} />,
      tooltip: 'Browse all PC components and hardware',
      hasDropdown: true,
      dropdownType: 'products'
    },
    { 
      label: 'Compare', 
      path: '/comparator', 
      icon: <MdCompareArrows size={20} />,
      tooltip: 'Compare components side by side'
    },
    { 
      label: 'Completed Builds', 
      path: '/completed-builds', 
      icon: <PiDesktopTowerFill size={20} />,
      tooltip: 'Explore community PC builds for inspiration'
    },
    { 
      label: 'Community', 
      path: '/community', 
      icon: <FaEdit size={18} />,
      tooltip: 'Community posts, news, and local shops',
      hasDropdown: true,
      dropdownType: 'community'
    },
    { 
      label: 'Chat', 
      path: '/chat', 
      icon: <FiMessageCircle size={18} />,
      tooltip: 'Message other users and shop owners'
    }
  ];

  const handleNavigation = (path) => {
    // Protected routes that require authentication
    const protectedRoutes = ['/chat', '/posts', '/shops'];
    
    // Check if the route is protected and user is not logged in
    if (protectedRoutes.includes(path) && !isLoggedIn) {
      toast.error('You must login first to access this feature');
      return;
    }
    
    navigate(path);
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsProductsDropdownOpen(false);
    setIsCommunityDropdownOpen(false);
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductsClick = () => {
    setIsProductsDropdownOpen(!isProductsDropdownOpen);
    setIsCommunityDropdownOpen(false);
  };

  const handleCommunityClick = () => {
    setIsCommunityDropdownOpen(!isCommunityDropdownOpen);
    setIsProductsDropdownOpen(false);
  };

  const handleLogout = () => {
    // Clear authentication tokens and user data from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    // Update local state
    setIsLoggedIn(false);
    setUserName('');
    setIsUserMenuOpen(false);
    
    // Navigate to home page
    navigate('/');
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
      if (isProductsDropdownOpen && !event.target.closest('.products-menu-container') && !event.target.closest('.mobile-products-container')) {
        setIsProductsDropdownOpen(false);
      }
      if (isCommunityDropdownOpen && !event.target.closest('.community-menu-container') && !event.target.closest('.mobile-community-container')) {
        setIsCommunityDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen, isProductsDropdownOpen, isCommunityDropdownOpen]);

  return (
    <nav style={{ backgroundColor: colors.mainBlack }} className="sticky top-0 z-50 shadow-lg">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          
          {/* Logo - Max Left */}
          <div 
            className="shrink-0 cursor-pointer z-10" 
            onClick={() => handleNavigation('/')}
            data-tooltip-id="logo-tooltip"
            data-tooltip-content="Go to Home"
          >
            <img 
              src="/src/assets/Images/LogoIcon.png" 
              alt="PC Builder Logo" 
              style={{ height: '50px', width: 'auto', objectFit: 'contain' }}
            />
          </div>

          {/* Desktop Menu - Absolute Center */}
          <div className="hidden 2xl:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
            {menuItems.map((item, index) => (
              <div key={index} className={`relative group ${item.dropdownType === 'products' ? 'products-menu-container' : item.dropdownType === 'community' ? 'community-menu-container' : ''}`}>
                <button
                  onClick={() => {
                    if (item.dropdownType === 'products') {
                      handleProductsClick();
                    } else if (item.dropdownType === 'community') {
                      handleCommunityClick();
                    } else {
                      handleNavigation(item.path);
                    }
                  }}
                  className="flex items-center space-x-1.5 px-2 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer"
                  style={{ 
                    color: '#FFFFFF',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = colors.mainYellow}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#FFFFFF'}
                  data-tooltip-id="nav-tooltip"
                  data-tooltip-content={item.tooltip}
                >
                  <span style={{ color: colors.mainYellow }}>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.hasDropdown && (
                    <FiChevronDown 
                      style={{ 
                        color: colors.mainYellow,
                        transform: ((item.dropdownType === 'products' && isProductsDropdownOpen) || (item.dropdownType === 'community' && isCommunityDropdownOpen)) ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s'
                      }} 
                      size={16} 
                    />
                  )}
                </button>

                {/* Products Dropdown */}
                {item.dropdownType === 'products' && isProductsDropdownOpen && (
                  <div 
                    className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-56 rounded-lg shadow-xl overflow-hidden z-50"
                    style={{ 
                      backgroundColor: colors.jet,
                      border: `2px solid ${colors.mainYellow}`
                    }}
                  >
                    {productCategories.map((product, idx) => (
                      <React.Fragment key={idx}>
                        <button
                          onClick={() => handleNavigation(product.path)}
                          className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-200 cursor-pointer"
                          style={{ color: 'white' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = colors.mainYellow;
                            e.currentTarget.style.color = colors.mainBlack;
                            const icon = e.currentTarget.querySelector('span:first-child');
                            if (icon) icon.style.color = colors.mainBlack;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'white';
                            const icon = e.currentTarget.querySelector('span:first-child');
                            if (icon) icon.style.color = colors.mainYellow;
                          }}
                        >
                          <span style={{ color: colors.mainYellow }}>{product.icon}</span>
                          <span className="font-medium">{product.label}</span>
                        </button>
                        {idx < productCategories.length - 1 && (
                          <div style={{ height: '1px', backgroundColor: colors.platinum, opacity: 0.3 }} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}

                {/* Community Dropdown */}
                {item.dropdownType === 'community' && isCommunityDropdownOpen && (
                  <div 
                    className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-56 rounded-lg shadow-xl overflow-hidden z-50"
                    style={{ 
                      backgroundColor: colors.jet,
                      border: `2px solid ${colors.mainYellow}`
                    }}
                  >
                    {communityItems.map((community, idx) => (
                      <React.Fragment key={idx}>
                        <button
                          onClick={() => handleNavigation(community.path)}
                          className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-200 cursor-pointer"
                          style={{ color: 'white' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = colors.mainYellow;
                            e.currentTarget.style.color = colors.mainBlack;
                            const icon = e.currentTarget.querySelector('span:first-child');
                            if (icon) icon.style.color = colors.mainBlack;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'white';
                            const icon = e.currentTarget.querySelector('span:first-child');
                            if (icon) icon.style.color = colors.mainYellow;
                          }}
                        >
                          <span style={{ color: colors.mainYellow }}>{community.icon}</span>
                          <span className="font-medium">{community.label}</span>
                        </button>
                        {idx < communityItems.length - 1 && (
                          <div style={{ height: '1px', backgroundColor: colors.platinum, opacity: 0.3 }} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Side - Search & User - Max Right */}
          <div className="hidden 2xl:flex items-center space-x-3 shrink-0 z-10">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 transition-all duration-200 w-44 cursor-text"
                style={{ 
                  backgroundColor: colors.jet,
                  border: `1px solid ${colors.platinum}`,
                  color: colors.alabaster,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.mainYellow;
                  e.target.style.boxShadow = `0 0 0 3px rgba(243, 189, 74, 0.1)`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.platinum;
                  e.target.style.boxShadow = 'none';
                }}
                data-tooltip-id="search-tooltip"
                data-tooltip-content="Search for products, builds, or posts"
              />
              <FiSearch 
                className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                style={{ color: colors.mainYellow }}
                size={18}
              />
            </div>

            {/* User Avatar with Dropdown */}
            <div className="relative user-menu-container">
              <button 
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-200 cursor-pointer"
                style={{ border: `2px solid ${colors.mainYellow}` }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.jet}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                data-tooltip-id="user-tooltip"
                data-tooltip-content={isLoggedIn ? `Logged in as ${userName}` : "Sign in to your account"}
              >
                <FiUser style={{ color: colors.mainYellow }} size={20} />
                <FiChevronDown 
                  style={{ 
                    color: colors.mainYellow,
                    transform: isUserMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }} 
                  size={16} 
                />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl overflow-hidden z-50"
                  style={{ 
                    backgroundColor: colors.jet,
                    border: `2px solid ${colors.mainYellow}`
                  }}
                >
                  {!isLoggedIn ? (
                    // Not logged in - Show Login/Signup
                    <>
                      <button
                        onClick={() => handleNavigation('/signin')}
                        className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-200 hover:bg-opacity-80 cursor-pointer"
                        style={{ color: 'white' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.mainYellow}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <FiUser size={18} style={{ color: colors.mainYellow }} />
                        <span className="font-medium">Login</span>
                      </button>
                      <div style={{ height: '1px', backgroundColor: colors.platinum, opacity: 0.3 }} />
                      <button
                        onClick={() => handleNavigation('/signup')}
                        className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-200 hover:bg-opacity-80 cursor-pointer"
                        style={{ color: 'white' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.mainYellow}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <FaUserCircle size={18} style={{ color: colors.mainYellow }} />
                        <span className="font-medium">Sign Up</span>
                      </button>
                    </>
                  ) : (
                    // Logged in - Show Profile/My Builds/Favorites/Logout
                    <>
                      <button
                        onClick={() => handleNavigation('/profile')}
                        className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-200 hover:bg-opacity-80 cursor-pointer"
                        style={{ color: 'white' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.mainYellow;
                          e.currentTarget.style.color = colors.mainBlack;
                          e.currentTarget.querySelector('svg').style.color = colors.mainBlack;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.querySelector('svg').style.color = colors.mainYellow;
                        }}
                      >
                        <FaUserCircle size={18} style={{ color: colors.mainYellow }} />
                        <span className="font-medium">Profile</span>
                      </button>
                      <div style={{ height: '1px', backgroundColor: colors.platinum, opacity: 0.3 }} />
                      <button
                        onClick={() => handleNavigation('/my-builds')}
                        className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-200 hover:bg-opacity-80 cursor-pointer"
                        style={{ color: 'white' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.mainYellow;
                          e.currentTarget.style.color = colors.mainBlack;
                          e.currentTarget.querySelector('svg').style.color = colors.mainBlack;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.querySelector('svg').style.color = colors.mainYellow;
                        }}
                      >
                        <PiDesktopTowerFill size={18} style={{ color: colors.mainYellow }} />
                        <span className="font-medium">My Builds</span>
                      </button>
                      <div style={{ height: '1px', backgroundColor: colors.platinum, opacity: 0.3 }} />
                      <button
                        onClick={() => handleNavigation('/favorites')}
                        className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-200 hover:bg-opacity-80 cursor-pointer"
                        style={{ color: 'white' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.mainYellow;
                          e.currentTarget.style.color = colors.mainBlack;
                          e.currentTarget.querySelector('svg').style.color = colors.mainBlack;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.querySelector('svg').style.color = colors.mainYellow;
                        }}
                      >
                        <FiHeart size={18} style={{ color: colors.mainYellow }} />
                        <span className="font-medium">Favorites</span>
                      </button>
                      <div style={{ height: '1px', backgroundColor: colors.platinum, opacity: 0.3 }} />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-200 hover:bg-opacity-80 cursor-pointer"
                        style={{ color: 'white' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#dc2626';
                          e.currentTarget.querySelector('svg').style.color = 'white';
                          e.currentTarget.querySelector('span').style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.querySelector('svg').style.color = colors.mainYellow;
                          e.currentTarget.querySelector('span').style.color = 'white';
                        }}
                      >
                        <FiLogOut size={18} style={{ color: colors.mainYellow }} />
                        <span className="font-medium">Logout</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="2xl:hidden flex items-center space-x-3">
            {/* Mobile User Icon */}
            <div className="relative user-menu-container">
              <button 
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 px-2 py-2 rounded-full transition-all duration-200 cursor-pointer"
                style={{ border: `2px solid ${colors.mainYellow}` }}
              >
                <FiUser style={{ color: colors.mainYellow }} size={20} />
              </button>

              {/* User Dropdown for mobile/tablet */}
              {isUserMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl overflow-hidden z-50"
                  style={{ 
                    backgroundColor: colors.jet,
                    border: `2px solid ${colors.mainYellow}`
                  }}
                >
                  {!isLoggedIn ? (
                    <>
                      <button
                        onClick={() => handleNavigation('/signin')}
                        className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-200 hover:bg-opacity-80 cursor-pointer"
                        style={{ color: 'white' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.mainYellow}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <FiUser size={18} style={{ color: colors.mainYellow }} />
                        <span className="font-medium">Login</span>
                      </button>
                      <div style={{ height: '1px', backgroundColor: colors.platinum, opacity: 0.3 }} />
                      <button
                        onClick={() => handleNavigation('/signup')}
                        className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-200 hover:bg-opacity-80 cursor-pointer"
                        style={{ color: 'white' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.mainYellow}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <FaUserCircle size={18} style={{ color: colors.mainYellow }} />
                        <span className="font-medium">Sign Up</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleNavigation('/profile')}
                        className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-200 hover:bg-opacity-80 cursor-pointer"
                        style={{ color: 'white' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.mainYellow;
                          e.currentTarget.style.color = colors.mainBlack;
                          e.currentTarget.querySelector('svg').style.color = colors.mainBlack;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.querySelector('svg').style.color = colors.mainYellow;
                        }}
                      >
                        <FaUserCircle size={18} style={{ color: colors.mainYellow }} />
                        <span className="font-medium">Profile</span>
                      </button>
                      <div style={{ height: '1px', backgroundColor: colors.platinum, opacity: 0.3 }} />
                      <button
                        onClick={() => handleNavigation('/my-builds')}
                        className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-200 hover:bg-opacity-80 cursor-pointer"
                        style={{ color: 'white' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.mainYellow;
                          e.currentTarget.style.color = colors.mainBlack;
                          e.currentTarget.querySelector('svg').style.color = colors.mainBlack;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.querySelector('svg').style.color = colors.mainYellow;
                        }}
                      >
                        <PiDesktopTowerFill size={18} style={{ color: colors.mainYellow }} />
                        <span className="font-medium">My Builds</span>
                      </button>
                      <div style={{ height: '1px', backgroundColor: colors.platinum, opacity: 0.3 }} />
                      <button
                        onClick={() => handleNavigation('/favorites')}
                        className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-200 hover:bg-opacity-80 cursor-pointer"
                        style={{ color: 'white' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.mainYellow;
                          e.currentTarget.style.color = colors.mainBlack;
                          e.currentTarget.querySelector('svg').style.color = colors.mainBlack;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.querySelector('svg').style.color = colors.mainYellow;
                        }}
                      >
                        <FiHeart size={18} style={{ color: colors.mainYellow }} />
                        <span className="font-medium">Favorites</span>
                      </button>
                      <div style={{ height: '1px', backgroundColor: colors.platinum, opacity: 0.3 }} />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-200 hover:bg-opacity-80 cursor-pointer"
                        style={{ color: 'white' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#dc2626';
                          e.currentTarget.querySelector('svg').style.color = 'white';
                          e.currentTarget.querySelector('span').style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.querySelector('svg').style.color = colors.mainYellow;
                          e.currentTarget.querySelector('span').style.color = 'white';
                        }}
                      >
                        <FiLogOut size={18} style={{ color: colors.mainYellow }} />
                        <span className="font-medium">Logout</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md cursor-pointer"
              style={{ color: colors.mainYellow }}
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="2xl:hidden" style={{ backgroundColor: colors.jet }}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item, index) => (
              <div key={index} className={item.dropdownType === 'products' ? 'mobile-products-container' : item.dropdownType === 'community' ? 'mobile-community-container' : ''}>
                <button
                  onClick={() => {
                    if (item.dropdownType === 'products') {
                      setIsProductsDropdownOpen(!isProductsDropdownOpen);
                      setIsCommunityDropdownOpen(false);
                    } else if (item.dropdownType === 'community') {
                      setIsCommunityDropdownOpen(!isCommunityDropdownOpen);
                      setIsProductsDropdownOpen(false);
                    } else {
                      handleNavigation(item.path);
                    }
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center justify-between cursor-pointer"
                  style={{ color: '#FFFFFF' }}
                >
                  <div className="flex items-center space-x-2">
                    <span style={{ color: colors.mainYellow }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.hasDropdown && (
                    <FiChevronDown 
                      style={{ 
                        color: colors.mainYellow,
                        transform: ((item.dropdownType === 'products' && isProductsDropdownOpen) || (item.dropdownType === 'community' && isCommunityDropdownOpen)) ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s'
                      }} 
                      size={16} 
                    />
                  )}
                </button>
                
                {/* Mobile Products Dropdown */}
                {item.dropdownType === 'products' && isProductsDropdownOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    {productCategories.map((product, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleNavigation(product.path)}
                        className="w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 cursor-pointer"
                        style={{ color: '#FFFFFF' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.mainYellow;
                          e.currentTarget.style.color = colors.mainBlack;
                          const icon = e.currentTarget.querySelector('span:first-child');
                          if (icon) icon.style.color = colors.mainBlack;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#FFFFFF';
                          const icon = e.currentTarget.querySelector('span:first-child');
                          if (icon) icon.style.color = colors.mainYellow;
                        }}
                      >
                        <span style={{ color: colors.mainYellow }}>{product.icon}</span>
                        <span>{product.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Mobile Community Dropdown */}
                {item.dropdownType === 'community' && isCommunityDropdownOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    {communityItems.map((community, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleNavigation(community.path)}
                        className="w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 cursor-pointer"
                        style={{ color: '#FFFFFF' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.mainYellow;
                          e.currentTarget.style.color = colors.mainBlack;
                          const icon = e.currentTarget.querySelector('span:first-child');
                          if (icon) icon.style.color = colors.mainBlack;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#FFFFFF';
                          const icon = e.currentTarget.querySelector('span:first-child');
                          if (icon) icon.style.color = colors.mainYellow;
                        }}
                      >
                        <span style={{ color: colors.mainYellow }}>{community.icon}</span>
                        <span>{community.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Mobile Search */}
            <div className="px-3 py-2">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 rounded-md text-sm cursor-text"
                style={{ 
                  backgroundColor: colors.mainBlack,
                  border: `1px solid ${colors.platinum}`,
                  color: colors.alabaster,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tooltips */}
      <Tooltip 
        id="logo-tooltip" 
        place="bottom"
        style={{ 
          backgroundColor: colors.mainYellow, 
          color: colors.mainBlack,
          fontWeight: 'bold',
          fontSize: '14px',
          borderRadius: '8px',
          padding: '8px 12px'
        }}
      />
      <Tooltip 
        id="nav-tooltip" 
        place="bottom"
        style={{ 
          backgroundColor: colors.mainYellow, 
          color: colors.mainBlack,
          fontWeight: '600',
          fontSize: '13px',
          borderRadius: '8px',
          padding: '6px 12px',
          maxWidth: '250px'
        }}
      />
      <Tooltip 
        id="search-tooltip" 
        place="bottom"
        style={{ 
          backgroundColor: colors.mainYellow, 
          color: colors.mainBlack,
          fontWeight: '600',
          fontSize: '13px',
          borderRadius: '8px',
          padding: '6px 12px'
        }}
      />
      <Tooltip 
        id="user-tooltip" 
        place="bottom-end"
        style={{ 
          backgroundColor: colors.mainYellow, 
          color: colors.mainBlack,
          fontWeight: '600',
          fontSize: '13px',
          borderRadius: '8px',
          padding: '6px 12px'
        }}
      />
    </nav>
  );
}
