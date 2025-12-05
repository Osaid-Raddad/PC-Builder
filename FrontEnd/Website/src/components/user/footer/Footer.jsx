import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import colors from '../../../config/colors';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: colors.mainBlack }} className="text-white mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* About Section */}
          <div>
            <img 
              src="/src/assets/Images/LogoIcon.png" 
              alt="PC Builder Logo" 
              style={{ height: '100px', width: 'auto', objectFit: 'contain' }}
              className="mb-4"
            />
            <p className="text-sm" style={{ color: colors.alabaster }}>
              Build your dream PC with our comprehensive tools and expert guidance. 
              Join thousands of builders worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.mainYellow }}>
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/builder" className="text-sm hover:underline transition-colors" style={{ color: colors.alabaster }}>
                  PC Builder
                </a>
              </li>
              <li>
                <a href="/comparator" className="text-sm hover:underline transition-colors" style={{ color: colors.alabaster }}>
                  Comparator
                </a>
              </li>
              <li>
                <a href="/completed-builds" className="text-sm hover:underline transition-colors" style={{ color: colors.alabaster }}>
                  Completed Builds
                </a>
              </li>
              <li>
                <a href="/posts" className="text-sm hover:underline transition-colors" style={{ color: colors.alabaster }}>
                  Community Posts
                </a>
              </li>
              <li>
                <a href="/news" className="text-sm hover:underline transition-colors" style={{ color: colors.alabaster }}>
                  Latest News
                </a>
              </li>
              <li>
                <a href="/shops" className="text-sm hover:underline transition-colors" style={{ color: colors.alabaster }}>
                  Shops
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.mainYellow }}>
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/tech-support" className="text-sm hover:underline transition-colors cursor-pointer" style={{ color: colors.alabaster }}>
                  Tech Support
                </a>
              </li>
              <li>
                <a href="/faq" className="text-sm hover:underline transition-colors cursor-pointer" style={{ color: colors.alabaster }}>
                  FAQ
                </a>
              </li>
              <li>
                <a href="/guides" className="text-sm hover:underline transition-colors cursor-pointer" style={{ color: colors.alabaster }}>
                  Building Guides
                </a>
              </li>
              <li>
                <a href="/contact" className="text-sm hover:underline transition-colors cursor-pointer" style={{ color: colors.alabaster }}>
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/terms" className="text-sm hover:underline transition-colors cursor-pointer" style={{ color: colors.alabaster }}>
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.mainYellow }}>
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <FiMail style={{ color: colors.mainYellow }} size={18} />
                <span className="text-sm" style={{ color: colors.alabaster }}>
                  support@pcbuilder.com
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <FiPhone style={{ color: colors.mainYellow }} size={18} />
                <span className="text-sm" style={{ color: colors.alabaster }}>
                  +972 52 275 8700
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <FiMapPin style={{ color: colors.mainYellow }} size={18} className="mt-1" />
                <span className="text-sm" style={{ color: colors.alabaster }}>
                  Rafidia St<br />
                  Almajeen, Nablus
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-8 pt-8 border-t" style={{ borderColor: colors.jet }}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
                style={{ color: colors.mainYellow }}
              >
                <FaFacebook size={24} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
                style={{ color: colors.mainYellow }}
              >
                <FaTwitter size={24} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
                style={{ color: colors.mainYellow }}
              >
                <FaInstagram size={24} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
                style={{ color: colors.mainYellow }}
              >
                <FaLinkedin size={24} />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
                style={{ color: colors.mainYellow }}
              >
                <FaGithub size={24} />
              </a>
            </div>
            <p className="text-sm" style={{ color: colors.platinum }}>
              © {currentYear} PC Builder. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
