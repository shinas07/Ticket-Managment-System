import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import UserLayout from '../../components/layout/UserLayout';
import {
  FunnelIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import api from '../../service/api';
import { toast } from 'sonner';

const UserTicketManagement = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: ''
  });

  const priorityColors = {
    low: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    high: 'bg-red-500/10 text-red-500 border-red-500/20'
  };

  const statusColors = {
    open: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    'in-progress': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    resolved: 'bg-green-500/10 text-green-500 border-green-500/20'
  };

  // Fetch tickets
  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...filters,
        user_id: user.id
      });
      const response = await api.get(`/api/tickets?${params}`);
      setTickets(response.data);
    } catch (error) {
      toast.error('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  // Delete ticket
  const handleDeleteTicket = async (ticketId) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await api.delete(`/api/tickets/${ticketId}`);
        setTickets(tickets.filter(ticket => ticket.id !== ticketId));
        toast.success('Ticket deleted successfully');
      } catch (error) {
        toast.error('Failed to delete ticket');
      }
    }
  };

  // Update ticket
  const handleUpdateTicket = async (ticketId, updatedData) => {
    try {
      const response = await api.put(`/api/tickets/${ticketId}`, updatedData);
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId ? response.data : ticket
      ));
      setShowEditModal(false);
      toast.success('Ticket updated successfully');
    } catch (error) {
      toast.error('Failed to update ticket');
    }
  };

  // Ticket Details Modal
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
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[selectedTicket.priority]}`}>
                  {selectedTicket.priority}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[selectedTicket.status]}`}>
                  {selectedTicket.status}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-gray-300">{selectedTicket.description}</p>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Created: {new Date(selectedTicket.created_at).toLocaleDateString()}</span>
                {selectedTicket.updated_at && (
                  <span>Last Updated: {new Date(selectedTicket.updated_at).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <UserLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">My Tickets</h1>
            <p className="text-gray-400">View and manage your support tickets</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search tickets..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({...filters, priority: e.target.value})}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Tickets List */}
        <div className="grid gap-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No tickets found
            </div>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6 hover:border-gray-600/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">
                        {ticket.title}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[ticket.priority]}`}>
                        {ticket.priority}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[ticket.status]}`}>
                        {ticket.status}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-400 line-clamp-2">
                      {ticket.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setShowDetailsModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setShowEditModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition-colors"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTicket(ticket.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      {showDetailsModal && <TicketDetailsModal />}
      {showEditModal && (
        // Add your EditTicketModal component here
        null
      )}
    </UserLayout>
  );
};

export default UserTicketManagement; 