import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/layout/AdminLayout';
import api from '../../service/api';
import { toast } from 'sonner';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import ConfirmationModal from './ConfirmationModal';

const AdminUserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm_password: '',
    role: 'user'
  });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [userIdToBlock, setUserIdToBlock] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const validateForm = (data) => {
    const newErrors = {};
    if (!data.email) newErrors.email = 'Email is required';
    if (!data.password) newErrors.password = 'Password is required';
    if (!data.confirm_password) newErrors.confirm_password = 'Confirm password is required';
    if (data.password !== data.confirm_password) newErrors.confirm_password = 'Passwords do not match';
    if (data.password.length < 8) newErrors.password = 'Password must be at least 8 characters long';
    if (!/[A-Z]/.test(data.password)) newErrors.password = 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(data.password)) newErrors.password = 'Password must contain at least one lowercase letter';
    if (!/\d/.test(data.password)) newErrors.password = 'Password must contain at least one number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/users/list/');
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

    const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!validateForm(formData)) return;
  
    setLoading(true);
    try {
      await api.post('/auth/users/create/', formData);
      toast.success('User created successfully');
      setFormData({
        email: '',
        password: '',
        confirm_password: '',
        role: 'user'
      });
      fetchUsers(); // Refresh user list
      setShowCreateModal(false);
    } catch (error) {
      const errorMessage = error.response?.data?.errors || error.response?.data?.error || 'Failed to create user';
      // Ensure errorMessage is a string
      const formattedErrorMessage = typeof errorMessage === 'string' 
        ? errorMessage 
        : Object.values(errorMessage).flat().join(', ');
      toast.error(formattedErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirm_password: '',
      role: 'user',
    });
    setErrors({});
  };

  const handleBlockUser = async (userId) => {
    setUserIdToBlock(userId);
    setShowModal(true);
  };

  const confirmBlockUser = async () => {
    try {
      await api.post(`/auth/users/${userIdToBlock}/block/`);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userIdToBlock));
      toast.success('User blocked successfully');
    } catch (error) {
      toast.error('Failed to block user');
    } finally {
      setShowModal(false);
      setUserIdToBlock(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const filteredUsers = users.filter(user => user.email.toLowerCase().includes(searchQuery.toLowerCase()));
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create User
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No users found</div>
          ) : (
            <>
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {currentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 text-white">{user.email}</td>
                      <td className="px-6 py-4 text-white">{user.role}</td>
                      <td className="px-6 py-4 text-white">{user.is_active ? 'Active' : 'Inactive'}</td>
                      <td className="px-6 py-4 flex space-x-2">
                        <button
                          onClick={() => handleBlockUser(user.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Block User
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-center mt-4">
                <nav>
                  <ul className="flex space-x-2">
                    {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, index) => (
                      <li key={index} className="cursor-pointer">
                        <button
                          onClick={() => paginate(index + 1)}
                          className={`px-4 py-2 rounded-lg ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => {
              resetForm();
              setShowCreateModal(false);
            }} />
            
            <div className="relative bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Create New User</h2>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowCreateModal(false);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-700 border rounded-lg px-4 py-2.5 text-white focus:outline-none ${
                      errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
                    }`}
                    placeholder="Enter user email"
                    autoComplete="off"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-700 border rounded-lg px-4 py-2.5 text-white focus:outline-none ${
                      errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
                    }`}
                    placeholder="Enter password"
                    autoComplete="new-password"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <input
                    id="confirm_password"
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-700 border rounded-lg px-4 py-2.5 text-white focus:outline-none ${
                      errors.confirm_password ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
                    }`}
                    placeholder="Confirm password"
                    autoComplete="new-password"
                  />
                  {errors.confirm_password && (
                    <p className="mt-1 text-sm text-red-500">{errors.confirm_password}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="user">User</option>
                    {/* <option value="admin">Admin</option> */}
                  </select>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setShowCreateModal(false);
                    }}
                    className="px-4 py-2 text-gray-300 hover:text-white mr-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
                  >
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmBlockUser}
        message="Are you sure you want to block this user?"
      />
    </AdminLayout>
  );
};

export default AdminUserManagement;