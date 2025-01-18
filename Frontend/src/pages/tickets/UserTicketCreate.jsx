import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import UserLayout from '../../components/layout/UserLayout';
import { toast } from 'sonner';
import api from '../../service/api';

const UserTicketCreate = () => {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [tickets, setTickets] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'low',
    status: 'open',
  });

  const [errors, setErrors] = useState({
    title: '',
    description: '',
  });

  const priorityColors = {
    low: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    high: 'bg-red-500/10 text-red-500 border-red-500/20'
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required.';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required.';
    }
    return newErrors;
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    // If validation fails, set errors and don't submit the form
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const response = await api.post('/api/tickets/', {
        ...formData,
        user_id: user.id
      });
      
      toast.success('Ticket created successfully!');
      setShowCreateModal(false);
      setFormData({
        title: '',
        description: '',
        priority: 'low',
        status: 'open'
      });
      
      // Optionally refresh tickets list
      setTickets(prevTickets => [response.data, ...prevTickets]);
    } catch (error) {
      toast.error('Failed to create ticket');
    }
  };

  return (
    <UserLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Create New Ticket</h1>
            <p className="text-gray-400">Submit a new support request</p>
          </div>
        </div>

        {/* Ticket Creation Form */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
          <form onSubmit={handleCreateTicket} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter ticket title"
                required
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Describe your issue in detail..."
                required
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
              )}
            </div>

            {/* Priority Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserTicketCreate;
