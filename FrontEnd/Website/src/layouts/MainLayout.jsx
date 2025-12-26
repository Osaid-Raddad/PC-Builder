import { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiCpu, FiMonitor, FiHardDrive, FiLogOut } from 'react-icons/fi';
import { AiOutlineAppstore } from 'react-icons/ai';
import { MdMemory } from 'react-icons/md';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  // Listen for custom event to open sidebar
  useEffect(() => {
    const handleOpenSidebar = () => {
      setIsSidebarOpen(true);
    };

    window.addEventListener('openSidebar', handleOpenSidebar);
    return () => {
      window.removeEventListener('openSidebar', handleOpenSidebar);
    };
  }, []);

  const menuItems = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/builder', icon: AiOutlineAppstore, label: 'PC Builder' },
    { path: '/builder/cpu', icon: FiCpu, label: 'Processors' },
    { path: '/builder/gpu', icon: FiMonitor, label: 'Graphics Cards' },
    { path: '/builder/motherboard', icon: MdMemory, label: 'Motherboards' },
    { path: '/builder/storage', icon: FiHardDrive, label: 'Storage' },
  ];

  const handleLogout = () => {
    // Clear all localStorage data to prevent conflicts between user sessions
    localStorage.clear();
    navigate('/signin');
  };

  const handleMenuItemClick = (e) => {
    e.stopPropagation(); // Prevent sidebar from opening
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#333533]">
      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Sidebar - Fixed on right, below navbar */}
      <aside
        ref={sidebarRef}
        onClick={() => !isSidebarOpen && setIsSidebarOpen(true)}
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-[#242423] transition-all duration-300 flex flex-col border-l border-[#F5CB5C]/20 ${
          !isSidebarOpen ? 'cursor-pointer' : ''
        } fixed top-[64px] right-0 bottom-0 z-40 shadow-lg`}
      >
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/builder' || item.path === '/'}
              onClick={handleMenuItemClick}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#F5CB5C] text-[#242423]'
                    : 'text-[#CFDBD5] hover:bg-[#333533] hover:text-[#F5CB5C]'
                }`
              }
              title={!isSidebarOpen ? item.label : ''}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[#F5CB5C]/20">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 w-full text-[#CFDBD5] hover:bg-[#333533] hover:text-[#F5CB5C] rounded-lg transition-all"
            title={!isSidebarOpen ? 'Logout' : ''}
          >
            <FiLogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    </div>
  );
};

export default MainLayout;
