import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import UserLayout from '../../components/layout/UserLayout';
import {
  FaFilter,
  FaEllipsisH
} from 'react-icons/fa';
import api from '../../service/api';
import { toast } from 'sonner';

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    in_progress: 0,
    resolved: 0,
  });
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/tickets/', {
        params: {
          ordering: '-created_at',
          page_size: 5
        }
      });

      const tickets = response.data;
      const statsData = {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open').length,
        in_progress: tickets.filter(t => t.status === 'in_progress').length,
        resolved: tickets.filter(t => t.status === 'resolved').length,
      };

      setStats(statsData);
      setRecentTickets(tickets);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="flex-1 mt-4">
        <main className="p-6 mt-4">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Total Tickets', value: stats.total, change: 'All tickets', color: 'blue' },
              { label: 'Open Tickets', value: stats.open, change: 'Needs attention', color: 'yellow' },
              { label: 'Resolved Tickets', value: stats.resolved, change: 'Completed tickets', color: 'green' },
            ].map((stat, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-gray-900/50 border border-gray-800
                         hover:border-blue-500/50 transition-all duration-300"
              >
                <h3 className="text-gray-400 mb-2">{stat.label}</h3>
                <p className="text-3xl font-bold mb-2">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.change}</p>
              </div>
            ))}
          </div>

          {/* Recent Tickets */}
          <div className="rounded-xl bg-gray-900/50 border border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Tickets</h2>
              <div className="flex items-center gap-4">
                <button className="p-2 text-gray-400 hover:text-white
                                hover:bg-gray-800 rounded-lg transition-colors">
                  <FaFilter />
                </button>
                <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2
                                text-sm text-gray-400 focus:outline-none focus:border-blue-500">
                  <option>All Tickets</option>
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
              </div>
            </div>

            {/* Tickets Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Ticket Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {recentTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium">{ticket.title}</div>
                          <div className="text-sm text-gray-400">{ticket.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs
                          ${ticket.priority === 'high' 
                            ? 'bg-red-500/20 text-red-400' 
                            : ticket.priority === 'medium'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-green-500/20 text-green-400'}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs
                          ${ticket.status === 'open'
                            ? 'bg-blue-500/20 text-blue-400'
                            : ticket.status === 'in_progress'
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-green-500/20 text-green-400'}`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-gray-400 hover:text-white
                                       hover:bg-gray-800 p-2 rounded-lg transition-colors">
                          <FaEllipsisH />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </UserLayout>
  );
};

export default UserDashboard;