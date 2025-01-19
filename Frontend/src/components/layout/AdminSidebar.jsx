import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  TicketIcon,
  UsersIcon,
  ChartBarIcon,
  CogIcon,
  ClipboardDocumentListIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate()

  const handlelogout = () => {
    logout(navigate)
  }


  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/admin/dashboard', 
      icon: HomeIcon 
    },
    { 
      name: 'Tickets', 
      href: '/admin/tickets/management', 
      icon: TicketIcon,
    },
    { 
      name: 'Users', 
      href: '/admin/user/manage', 
      icon: UsersIcon 
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div 
      className={`${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 border-r border-gray-700 
      transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 bg-gray-800">
          <span className="text-blue-500 text-2xl font-bold">
            TMS Admin
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`${
                isActive(item.href)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              } flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150`}
            >
              <div className="flex items-center">
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </div>
              {item.badge && (
                <span className="bg-blue-500 text-white px-2.5 py-0.5 rounded-full text-xs">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-sm font-medium text-white">
                Admin User
              </p>
              <p className="text-xs text-gray-400">
                System Administrator
              </p>
            </div>
          </div>
          <button
            onClick={handlelogout}
            className="mt-4 flex items-center w-full px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-150"
          >
            <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar; 