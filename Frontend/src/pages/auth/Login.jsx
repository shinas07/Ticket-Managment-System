import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserShield, FaUser, FaEnvelope, FaLock, FaTicketAlt, FaArrowRight } from 'react-icons/fa';
// import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
const { loading, login} = useAuth()
  const navigate = useNavigate();
//   const { user, login } = useAuth();
const user = useState('sinas')
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('user');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

//   useEffect(() => {
//     if (user) {
//       navigate(user.is_admin ? '/admin/dashboard' : '/dashboard');
//     }
//   }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await login(formData.email, formData.password, selectedRole);
      if (response.success) {
        toast.success('login successful');
        navigate(selectedRole === 'admin' ? '/admin/dashboard' : '/user/dashboard');
      } else {
        toast.error(response.error || 'Login failed. Please try again.');
      }
    } catch (error) {
        console.log(error)
      toast.error('An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex">
      {/* Left Panel - Enhanced gradients and shadows */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden
                    bg-gradient-to-br from-gray-900 via-blue-900/20 to-black">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:3rem_3rem]" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent" />
        
        <div className="relative z-10 p-12 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <FaTicketAlt className="text-4xl text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
              <h1 className="text-3xl font-bold text-white text-shadow-lg">TicketFlow</h1>
            </div>
            <h2 className="text-5xl font-bold text-white mb-6 text-shadow-lg">
              Ticket Management <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                Made Simple
              </span>
            </h2>
            <p className="text-xl text-gray-300 text-shadow">
              Streamline your support operations with our comprehensive ticket management system
            </p>
          </div>
          </div>
      </div>

      {/* Right Panel - Enhanced shadows and effects */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-transparent" />
        
        <div className="max-w-md w-full space-y-8 relative z-10">
          {/* Role Selector - Enhanced */}
          <div className="bg-gray-900/50 p-1 rounded-xl backdrop-blur-xl border border-gray-800
                         shadow-[0_0_25px_-5px_rgba(59,130,246,0.1)]">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedRole('user')}
                className={`flex items-center justify-center px-6 py-3 rounded-lg transition-all duration-300
                           ${selectedRole === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <FaUser className="mr-2" />
                User
              </button>
              <button
                onClick={() => setSelectedRole('admin')}
                className={`flex items-center justify-center px-6 py-3 rounded-lg transition-all
                           ${selectedRole === 'admin'
                    ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/30'
                    : 'text-gray-400 hover:text-white'
                  }`}
              >
                <FaUserShield className="mr-2" />
                Admin
              </button>
            </div>
          </div>

          {/* Login Form - Enhanced */}
          <div className="bg-gray-900/50 p-8 rounded-2xl backdrop-blur-xl border border-gray-800
                         shadow-[0_0_25px_-5px_rgba(59,130,246,0.1)]">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2 text-shadow">Welcome Back</h2>
              <p className="text-gray-400">
                Sign in as {selectedRole === 'admin' ? 'an administrator' : 'a user'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-800 rounded-lg
                             bg-gray-900/50 text-white placeholder-gray-500
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                             transition-all duration-300 hover:border-blue-500/50"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg
                             bg-gray-700/50 text-white placeholder-gray-400
                             focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                             transition-all duration-300"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-lg text-white text-lg font-semibold
                         bg-gradient-to-r from-blue-500 to-blue-600
                         hover:from-blue-600 hover:to-blue-700
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                         focus:ring-offset-gray-900
                         transform hover:scale-[1.02] transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed
                         shadow-[0_0_25px_-5px_rgba(59,130,246,0.3)]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>
          </div>

          {/* Back Link - Enhanced */}
          <div className="text-center">
            <Link 
              to="/" 
              className="text-gray-400 hover:text-white text-sm inline-flex items-center gap-2
                         hover:gap-3 transition-all duration-300 group"
            >
              <FaArrowRight className="w-4 h-4 rotate-180 group-hover:text-blue-400" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;