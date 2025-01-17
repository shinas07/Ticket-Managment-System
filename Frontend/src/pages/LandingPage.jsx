import { useNavigate } from 'react-router-dom';
import { 
  FaTicketAlt, 
  FaClipboardList, 
  FaUserShield, 
  FaTasks,
  FaArrowRight 
} from 'react-icons/fa';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FaClipboardList className="w-6 h-6" />,
      title: 'Ticket Management',
      description: 'Create, track, and manage support tickets with ease. Set priorities and monitor status updates.'
    },
    {
      icon: <FaUserShield className="w-6 h-6" />,
      title: 'Admin Controls',
      description: 'Comprehensive admin panel for ticket assignment, status updates, and user management.'
    },
    {
      icon: <FaTasks className="w-6 h-6" />,
      title: 'Status Tracking',
      description: 'Real-time status updates from open to resolved. Filter tickets by priority and status.'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-black/50 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <FaTicketAlt className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold">TicketFlow</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/login')}
                className="px-4 py-2 rounded-lg text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-black" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center space-y-8">
      
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Simple Ticket
              <span className="block text-blue-500">Management System</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-400">
              A streamlined platform for managing support tickets. Create, track, and resolve
              tickets efficiently with our user-friendly interface.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 
                         hover:from-blue-600 hover:to-blue-700 transition-all duration-300
                         transform hover:scale-105 shadow-lg shadow-blue-500/25
                         text-lg font-semibold flex items-center justify-center gap-2"
              >
                Get Started <FaArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-24 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Core Features</h2>
            <p className="text-gray-400 text-lg">Everything you need for efficient ticket management</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-xl
                         hover:border-blue-500/50 transition-all duration-300
                         group hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center
                              text-blue-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="relative py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">Simple steps to manage your support tickets</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create Ticket',
                description: 'Submit your support request with relevant details',
                icon: '📝'
              },
              {
                step: '02',
                title: 'Track Progress',
                description: 'Monitor the status of your ticket in real-time',
                icon: '📊'
              },
              {
                step: '03',
                title: 'Get Resolution',
                description: 'Receive updates and resolution for your ticket',
                icon: '✅'
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="relative group"
              >
                {/* Connecting Line */}
                {index !== 2 && (
                  <div className="hidden md:block absolute top-1/2 left-2/3 w-full h-[2px] 
                                bg-gradient-to-r from-blue-500/50 to-transparent -z-10" />
                )}
                
                {/* Card */}
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8
                              group-hover:border-blue-500/50 transition-all duration-300
                              group-hover:shadow-lg group-hover:shadow-blue-500/10">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-5xl">{item.icon}</span>
                    <span className="text-4xl font-bold text-blue-500/20">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaTicketAlt className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold">Support Ticket System</span>
            </div>
            <div className="text-gray-400">
              © 2024 All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;