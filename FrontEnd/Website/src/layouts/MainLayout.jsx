import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiCpu, FiMonitor, FiHardDrive, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { AiOutlineAppstore } from 'react-icons/ai';
import { MdMemory } from 'react-icons/md';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const menuItems = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/builder', icon: AiOutlineAppstore, label: 'PC Builder' },
    { path: '/builder/cpu', icon: FiCpu, label: 'Processors' },
    { path: '/builder/gpu', icon: FiMonitor, label: 'Graphics Cards' },
    { path: '/builder/motherboard', icon: MdMemory, label: 'Motherboards' },
    { path: '/builder/storage', icon: FiHardDrive, label: 'Storage' },
  ];

  const handleLogout = () => {
    // Add your logout logic here
    navigate('/signin');
  };

  return (
    <div className="flex h-screen bg-[#333533]">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-[#242423] transition-all duration-300 flex flex-col border-r border-[#F5CB5C]/20`}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#F5CB5C]/20 flex items-center justify-between">
          {isSidebarOpen && (
            <h1 className="text-[#F5CB5C] text-xl font-bold">PC Builder</h1>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-[#CFDBD5] hover:text-[#F5CB5C] transition-colors"
          >
            {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#F5CB5C] text-[#242423]'
                    : 'text-[#CFDBD5] hover:bg-[#333533] hover:text-[#F5CB5C]'
                }`
              }
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
          >
            <FiLogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
