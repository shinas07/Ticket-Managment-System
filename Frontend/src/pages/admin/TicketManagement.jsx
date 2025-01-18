import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/layout/AdminLayout';
import api from '../../service/api';
import { toast } from 'sonner';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  FunnelIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const AdminTicketManagement = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assignedTo: ''
  });

  // Fetch tickets and agents
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/tickets', {
        params: {
          ...filters,
          ordering: '-created_at'
        }
      });
      setTickets(response.data);
    } catch (error) {
      toast.error('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTicket = async (ticketId, updates) => {
    try {
      await api.patch(`/api/tickets/${ticketId}/`, updates);
      fetchTickets(); // Refresh tickets
      toast.success('Ticket updated successfully');
      setShowEditModal(false);
    } catch (error) {
      toast.error('Failed to update ticket');
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    try {
      await api.delete(`/api/tickets/${ticketId}/`);
      setTickets(tickets.filter(ticket => ticket.id !== ticketId));
      toast.success('Ticket deleted successfully');
      setShowConfirmModal(false);
    } catch (error) {
      toast.error('Failed to delete ticket');
    }
  };

  // Confirm Modal Component
  const ConfirmModal = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Confirm Deletion</h2>
        <p className="text-gray-400 mb-6">Are you sure you want to delete this ticket?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="bg-gray-600 text-white rounded-lg px-4 py-2 hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  // Edit Modal Component
  const EditModal = () => {
    const [formData, setFormData] = useState({
      status: selectedTicket?.status || '',
      priority: selectedTicket?.priority || '',
      assigned_to: selectedTicket?.assigned_to || '',
      admin_notes: selectedTicket?.admin_notes || ''
    });

    return (
      <div className="fixed inset-0 mt-6 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Edit Ticket</h2>
            <button
              onClick={() => setShowEditModal(false)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            handleUpdateTicket(selectedTicket.id, formData);
          }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Assign To
                </label>
                <select
                  value={formData.assigned_to || ""}
                  onChange={(e) => setFormData({...formData, assigned_to: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="">Unassigned</option>
                  <option value="1">John Doe - Support Agent</option>
                  <option value="2">Jane Smith - Sales Agent</option>
                  <option value="3">Michael Brown - Tech Support</option>
                  <option value="4">Emily Davis - Customer Service</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors"
              >
                Update Ticket
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Details Modal Component
  const TicketDetailsModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Ticket Details</h2>
          <button
            onClick={() => setShowDetailsModal(false)}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>

        {selectedTicket && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-white">{selectedTicket.title}</h3>
              <div className="flex gap-2 mt-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                  ${selectedTicket.priority === 'high' 
                    ? 'bg-red-500/10 text-red-500' 
                    : selectedTicket.priority === 'medium' 
                    ? 'bg-yellow-500/10 text-yellow-500' 
                    : 'bg-blue-500/10 text-blue-500'
                  }`}
                >
                  {selectedTicket.priority}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                  ${selectedTicket.status === 'resolved'
                    ? 'bg-green-500/10 text-green-500'
                    : selectedTicket.status === 'in_progress'
                    ? 'bg-yellow-500/10 text-yellow-500'
                    : 'bg-purple-500/10 text-purple-500'
                  }`}
                >
                  {selectedTicket.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-gray-300">{selectedTicket.description}</p>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                <div>
                  <p>Created by: {selectedTicket.user}</p>
                  <p>Created on: {new Date(selectedTicket.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p>Assigned to: {selectedTicket.assigned_to || 'Unassigned'}</p>
                  <p>Last updated: {new Date(selectedTicket.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Ticket Management</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchTickets}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
              title="Refresh"
            >
              <ArrowPathIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => {/* Add filter modal logic */}}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
              title="Filter"
            >
              <FunnelIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 overflow-hidden">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No tickets found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Assigned To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Created</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{ticket.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {ticket.created_by_email.replace("@gmail.com",'')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${ticket.priority === 'high' 
                            ? 'bg-red-500/10 text-red-500' 
                            : ticket.priority === 'medium'
                            ? 'bg-yellow-500/10 text-yellow-500'
                            : 'bg-blue-500/10 text-blue-500'
                          }`}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${ticket.status === 'resolved'
                            ? 'bg-green-500/10 text-green-500'
                            : ticket.status === 'in_progress'
                            ? 'bg-yellow-500/10 text-yellow-500'
                            : 'bg-purple-500/10 text-purple-500'
                          }`}
                        >
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {ticket.assigned_to || 'Unassigned'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setShowDetailsModal(true);
                            }}
                            className="text-gray-400 hover:text-blue-500 transition-colors"
                            title="View Details"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setShowEditModal(true);
                            }}
                            className="text-gray-400 hover:text-yellow-500 transition-colors"
                            title="Edit Ticket"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setShowConfirmModal(true);
                            }}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete Ticket"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showDetailsModal && <TicketDetailsModal />}
      {showEditModal && <EditModal />}
      {showConfirmModal && (
        <ConfirmModal
          onConfirm={() => handleDeleteTicket(selectedTicket.id)}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </AdminLayout>
  );
};

export default AdminTicketManagement;