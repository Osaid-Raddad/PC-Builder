import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiMenu, FiX, FiUser, FiChevronDown, FiShoppingBag, FiLogOut, FiHeart } from 'react-icons/fi';
import { FaTools, FaBoxOpen, FaNewspaper, FaEdit, FaUserCircle, FaMicrochip, FaMemory, FaHdd, FaDesktop } from 'react-icons/fa';
import { PiDesktopTowerFill } from 'react-icons/pi';
import { HiCog } from 'react-icons/hi';
import { BsFillMotherboardFill, BsGpuCard } from 'react-icons/bs';
import { GiComputerFan } from 'react-icons/gi';
import { MdPowerSettingsNew, MdCable } from 'react-icons/md';
import { Tooltip } from 'react-tooltip';
import colors from '../../../config/colors';
import { openSidebar } from '../../../utils/sidebarHelper';
export default function Navbar() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  
  // TODO: Replace with actual authentication state from your auth context/redux
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Change this based on actual auth state
  const [userName, setUserName] = useState('John Doe'); // Get from auth context

  // Product categories with icons
  const productCategories = [
    { label: 'CPU', path: '/products/cpu', icon: <FaMicrochip size={18} /> },
    { label: 'GPU', path: '/products/gpu', icon: <BsGpuCard size={18} /> },
    { label: 'Motherboard', path: '/products/motherboard', icon: <BsFillMotherboardFill size={18} /> },
    { label: 'RAM', path: '/products/ram', icon: <FaMemory size={18} /> },
    { label: 'Storage', path: '/products/storage', icon: <FaHdd size={18} /> },
    { label: 'Power Supply', path: '/products/power-supply', icon: <MdPowerSettingsNew size={18} /> },
    { label: 'Case', path: '/products/case', icon: <PiDesktopTowerFill size={18} /> },
    { label: 'Cooling', path: '/products/cooling', icon: <GiComputerFan size={18} /> },
    { label: 'Monitor', path: '/products/monitor', icon: <FaDesktop size={18} /> },
    { label: 'Accessories', path: '/products/accessories', icon: <MdCable size={18} /> },
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
      hasDropdown: true
    },
    { 
      label: 'Completed Builds', 
      path: '/completed-builds', 
      icon: <PiDesktopTowerFill size={20} />,
      tooltip: 'Explore community PC builds for inspiration'
    },
    { 
      label: 'Posts', 
      path: '/posts', 
      icon: <FaEdit size={18} />,
      tooltip: 'Read community posts and discussions'
    },
    { 
      label: 'News', 
      path: '/news', 
      icon: <FaNewspaper size={18} />,
      tooltip: 'Latest tech news and hardware releases'
    },
    { 
      label: 'Shops', 
      path: '/shops', 
      icon: <FiShoppingBag size={18} />,
      tooltip: 'Find local computer shops in Palestine'
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setIsUserMenuOpen(false);
    setIsProductsDropdownOpen(false);
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductsClick = () => {
    setIsProductsDropdownOpen(!isProductsDropdownOpen);
  };

  const handleLogout = () => {
    // TODO: Implement actual logout logic
    setIsLoggedIn(false);
    setIsUserMenuOpen(false);
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
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen, isProductsDropdownOpen]);

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
          <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            {menuItems.map((item, index) => (
              <div key={index} className="relative group products-menu-container">
                <button
                  onClick={() => item.hasDropdown ? handleProductsClick() : handleNavigation(item.path)}
                  className="flex items-center space-x-2 px-2 py-2 rounded-md text-sm font-medium transition-all duration-200"
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
                        transform: isProductsDropdownOpen && item.label === 'Products' ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s'
                      }} 
                      size={16} 
                    />
                  )}
                </button>

                {/* Products Dropdown */}
                {item.hasDropdown && isProductsDropdownOpen && (
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
                          className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-200"
                          style={{ color: 'white' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = colors.mainYellow;
                            e.currentTarget.style.color = colors.mainBlack;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'white';
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
              </div>
            ))}
          </div>

          {/* Right Side - Search & User - Max Right */}
          <div className="hidden md:flex items-center space-x-4 shrink-0 z-10">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 transition-all duration-200"
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
                className="flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-200"
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
                        className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-200 hover:bg-opacity-80"
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
                        className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-200 hover:bg-opacity-80"
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
                        className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-200 hover:bg-opacity-80"
                        style={{ color: 'white' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.mainYellow}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <FaUserCircle size={18} style={{ color: colors.mainYellow }} />
                        <span className="font-medium">Profile</span>
                      </button>
                      <div style={{ height: '1px', backgroundColor: colors.platinum, opacity: 0.3 }} />
                      <button
                        onClick={() => handleNavigation('/my-builds')}
                        className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-200 hover:bg-opacity-80"
                        style={{ color: 'white' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.mainYellow}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <PiDesktopTowerFill size={18} style={{ color: colors.mainYellow }} />
                        <span className="font-medium">My Builds</span>
                      </button>
                      <div style={{ height: '1px', backgroundColor: colors.platinum, opacity: 0.3 }} />
                      <button
                        onClick={() => handleNavigation('/favorites')}
                        className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-200 hover:bg-opacity-80"
                        style={{ color: 'white' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.mainYellow}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <FiHeart size={18} style={{ color: colors.mainYellow }} />
                        <span className="font-medium">Favorites</span>
                      </button>
                      <div style={{ height: '1px', backgroundColor: colors.platinum, opacity: 0.3 }} />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-200 hover:bg-opacity-80"
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
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md"
              style={{ color: colors.mainYellow }}
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden" style={{ backgroundColor: colors.jet }}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item, index) => (
              <div key={index} className={item.hasDropdown ? 'mobile-products-container' : ''}>
                <button
                  onClick={() => item.hasDropdown ? setIsProductsDropdownOpen(!isProductsDropdownOpen) : handleNavigation(item.path)}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center justify-between"
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
                        transform: isProductsDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s'
                      }} 
                      size={16} 
                    />
                  )}
                </button>
                
                {/* Mobile Products Dropdown */}
                {item.hasDropdown && isProductsDropdownOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    {productCategories.map((product, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleNavigation(product.path)}
                        className="w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
                        style={{ color: '#FFFFFF' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.mainYellow}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <span style={{ color: colors.mainYellow }}>{product.icon}</span>
                        <span>{product.label}</span>
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
                className="w-full px-4 py-2 rounded-md text-sm"
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
