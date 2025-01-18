import { useState } from 'react';
import { 
  Bars3Icon,
  BellIcon, 
  MagnifyingGlassIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const AdminHeader = ({ onMenuClick, user }) => {
  const [notifications] = useState([
    { id: 1, text: 'New ticket assigned', time: '5m ago' },
    { id: 2, text: 'System update completed', time: '1h ago' },
  ]);

  return (
    <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg lg:hidden"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            {/* Search */}
            <div className="hidden sm:flex items-center">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg
                           text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
                <BellIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Settings */}
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
              <Cog6ToothIcon className="w-6 h-6" />
            </button>

            {/* Profile */}
            <div className="relative">
              <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800">
                <img
                  className="h-8 w-8 rounded-lg object-cover border-2 border-blue-500"
                  src={`https://ui-avatars.com/api/?name=${user?.email}&background=random`}
                  alt=""
                />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white">{user?.email}</p>
                  <p className="text-xs text-gray-400">Administrator</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader; 