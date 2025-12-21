import { MdMenu, MdNotifications, MdSearch } from 'react-icons/md';
import { useState, useEffect } from 'react';
import colors from '../../config/colors';

const Header = ({ toggleSidebar }) => {
  const [fullName, setFullName] = useState('Admin User');
  const [userRole, setUserRole] = useState('Admin');

  useEffect(() => {
    // Get user info from localStorage
    const storedFullName = localStorage.getItem('fullName');
    const storedUserRole = localStorage.getItem('userRole');
    
    if (storedFullName) setFullName(storedFullName);
    if (storedUserRole) setUserRole(storedUserRole);
  }, []);

  // Get first letter of name for avatar
  const avatarLetter = fullName.charAt(0).toUpperCase();

  return (
    <header 
      className="h-16 shadow-md flex items-center justify-between px-6"
      style={{ 
        backgroundColor: colors.mainBeige,
        borderBottom: `2px solid ${colors.mainYellow}`
      }}
    >
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg transition-all"
          style={{ 
            backgroundColor: colors.mainYellow,
            color: colors.mainBlack
          }}
        >
          <MdMenu className="text-2xl" />
        </button>

        {/* Search Bar */}
        <div className="relative hidden md:block">
          <MdSearch 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl" 
            style={{ color: colors.jet }}
          />
          <input
            type="text"
            placeholder="Search anything..."
            className="pl-10 pr-4 py-2 w-96 rounded-lg focus:outline-none focus:ring-2 transition-all"
            style={{ 
              backgroundColor: '#FFFFFF',
              border: `2px solid ${colors.platinum}`,
              color: colors.mainBlack
            }}
            onFocus={(e) => e.target.style.borderColor = colors.mainYellow}
            onBlur={(e) => e.target.style.borderColor = colors.platinum}
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button 
          className="relative p-2 rounded-lg transition-all"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <MdNotifications className="text-2xl" style={{ color: colors.mainBlack }} />
          <span 
            className="absolute top-1 right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-semibold"
            style={{ backgroundColor: colors.mainYellow, color: colors.mainBlack }}
          >
            3
          </span>
        </button>

        {/* Admin Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold" style={{ color: colors.mainBlack }}>
              {fullName}
            </p>
            <p className="text-xs" style={{ color: colors.jet }}>
              {userRole}
            </p>
          </div>
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg"
            style={{ 
              backgroundColor: colors.mainYellow,
              color: colors.mainBlack
            }}
          >
            {avatarLetter}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
