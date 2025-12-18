import { NavLink } from 'react-router-dom';
import { 
  MdDashboard, 
  MdStore, 
  MdSupport, 
  MdArticle, 
  MdPeople, 
  MdInventory, 
  MdSettings,
  MdLogout
} from 'react-icons/md';
import colors from '../../config/colors';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { name: 'Overview', path: '/admin', icon: MdDashboard, end: true },
    { name: 'Shop Requests', path: '/admin/shop-requests', icon: MdStore },
    { name: 'Tech Support', path: '/admin/tech-support', icon: MdSupport },
    { name: 'Posts', path: '/admin/posts', icon: MdArticle },
    { name: 'Users', path: '/admin/users', icon: MdPeople },
    { name: 'Products', path: '/admin/products', icon: MdInventory },
    { name: 'Settings', path: '/admin/settings', icon: MdSettings },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 h-full shadow-2xl transition-all duration-300 z-50 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
      style={{ 
        backgroundColor: colors.mainBlack,
        borderRight: `2px solid ${colors.mainYellow}`
      }}
    >
      {/* Logo */}
      <div 
        className="h-16 flex items-center justify-center border-b"
        style={{ borderColor: colors.mainYellow }}
      >
        {isOpen ? (
          <h1 className="text-2xl font-bold" style={{ color: colors.mainYellow }}>
            PC Builder
          </h1>
        ) : (
          <span className="text-2xl font-bold" style={{ color: colors.mainYellow }}>
            PB
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 mb-2 rounded-lg transition-all duration-200 group ${
                isActive ? 'shadow-lg' : ''
              }`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? colors.mainYellow : 'transparent',
              color: isActive ? colors.mainBlack : colors.mainBeige,
            })}
          >
            {({ isActive }) => (
              <>
                <item.icon className="text-2xl" />
                {isOpen && (
                  <span className="ml-3 font-medium">{item.name}</span>
                )}
                {!isOpen && (
                  <div 
                    className="absolute left-20 px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50"
                    style={{ 
                      backgroundColor: colors.mainBlack, 
                      color: colors.mainYellow,
                      border: `1px solid ${colors.mainYellow}`
                    }}
                  >
                    {item.name}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-6 w-full px-3">
        <button
          className="flex items-center px-4 py-3 w-full rounded-lg transition-all duration-200"
          style={{ 
            color: colors.error,
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${colors.error}20`}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          onClick={() => {
            console.log('Logout clicked');
          }}
        >
          <MdLogout className="text-2xl" />
          {isOpen && <span className="ml-3 font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
