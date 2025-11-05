import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiMenu, FiX, FiUser, FiChevronDown } from 'react-icons/fi';
import { FaTools, FaBoxOpen, FaDesktop, FaNewspaper, FaEdit } from 'react-icons/fa';
import { HiCog } from 'react-icons/hi';
import colors from '../config/colors';

export default function Navbar() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const menuItems = [
    { label: 'Builder', path: '/builder', icon: <FaTools size={18} /> },
    { label: 'Products', path: '/products', icon: <FaBoxOpen size={18} /> },
    { label: 'Completed Builds', path: '/completed-builds', icon: <FaDesktop size={18} /> },
    { label: 'Posts', path: '/posts', icon: <FaEdit size={18} /> },
    { label: 'News', path: '/news', icon: <FaNewspaper size={18} /> },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <nav style={{ backgroundColor: colors.mainBlack }} className="sticky top-0 z-50 shadow-lg">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          
          {/* Logo - Max Left */}
          <div className="shrink-0 cursor-pointer z-10" onClick={() => handleNavigation('/')}>
            <img 
              src="/src/assets/Images/LogoIcon.png" 
              alt="PC Builder Logo" 
              style={{ height: '50px', width: 'auto', objectFit: 'contain' }}
            />
          </div>

          {/* Desktop Menu - Absolute Center */}
          <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            {menuItems.map((item, index) => (
              <div key={index} className="relative group">
                <button
                  onClick={() => handleNavigation(item.path)}
                  className="flex items-center space-x-2 px-2 py-2 rounded-md text-sm font-medium transition-all duration-200"
                  style={{ 
                    color: '#FFFFFF',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = colors.mainYellow}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#FFFFFF'}
                >
                  <span style={{ color: colors.mainYellow }}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
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
              />
              <FiSearch 
                className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                style={{ color: colors.mainYellow }}
                size={18}
              />
            </div>

            {/* User Avatar */}
            <button 
              className="flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-200"
              style={{ border: `2px solid ${colors.mainYellow}` }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.jet}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <FiUser style={{ color: colors.mainYellow }} size={20} />
            </button>
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
              <div key={index}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
                  style={{ color: '#FFFFFF' }}
                >
                  <span style={{ color: colors.mainYellow }}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
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
    </nav>
  );
}
