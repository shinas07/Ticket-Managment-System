import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HomeIcon,
  TicketIcon,
  PlusCircleIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  ArrowLeftOnRectangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const UserSidebar = ({ isMobile, onClose }) => {
  const { logout } = useAuth();

  const navItems = [
    { 
      path: '/user/dashboard', 
      icon: HomeIcon, 
      label: 'Dashboard',
      description: 'Overview of your tickets'
    },
    { 
      path: '/user/ticket/create', 
      icon: PlusCircleIcon, 
      label: 'Create Ticket',
      description: 'Submit a new ticket'
    },
    { 
      path: '/user/ticket/manage', 
      icon: ClipboardDocumentListIcon, 
      label: 'Manage Tickets',
      description: 'View and manage your tickets'
    },
  ];

  const NavItem = ({ path, icon: Icon, label, description }) => (
    <NavLink
      to={path}
      onClick={isMobile ? onClose : undefined}
      className={({ isActive }) => `
        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
        ${isActive 
          ? 'bg-blue-500/10 text-blue-500' 
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
        }
      `}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <div className="flex-1">
        <span className="block font-medium">{label}</span>
        <span className="text-xs text-gray-500">{description}</span>
      </div>
    </NavLink>
  );

  return (
    <div className="h-full w-64 bg-gray-900 border-r border-gray-800">
      {/* Header with close button for mobile */}
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Ticket System</h1>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="px-3 space-y-1">
        {navItems.map((item) => (
          <NavItem key={item.path} {...item} />
        ))}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 
                   hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default UserSidebar; 