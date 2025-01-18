import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Bars3Icon, 
  XMarkIcon,
  UserCircleIcon 
} from '@heroicons/react/24/outline';
import UserSidebar from './UserSidebar';

const UserLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const location = useLocation();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location, isMobile]);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/tickets') return 'Tickets';
    if (path === '/profile') return 'Profile';
    return 'Dashboard';
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full z-30 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          ${!isMobile ? 'lg:translate-x-0' : ''}`}
      >
        <UserSidebar 
          isMobile={isMobile}
          onClose={() => setSidebarOpen(false)}
        />
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 
        ${!isMobile && isSidebarOpen ? 'lg:ml-64' : ''}
        ${isMobile ? '' : 'lg:ml-64'}`}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-gray-900/50 backdrop-blur-xl border-b border-gray-800">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Toggle Sidebar"
              >
                {isSidebarOpen && isMobile ? 
                  <XMarkIcon className="w-6 h-6" /> : 
                  <Bars3Icon className="w-6 h-6" />
                }
              </button>
              <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
            </div>

            <div className="flex items-center gap-4">
              <button 
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="User Menu"
              >
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserLayout; 