import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../service/api';
import {
  ChartBarIcon,
  TicketIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  ArrowPathIcon 
} from '@heroicons/react/24/outline';
import AdminLayout from '../../components/layout/AdminLayout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatsCard = ({ title, value, icon: Icon, trend, color, trendValue }) => (
  <div className="relative overflow-hidden bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6 hover:border-gray-600/50 transition-all duration-300 group">
    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-xl group-hover:blur-2xl transition-all duration-300" />
    
    <div className="relative">
      <div className="flex items-center">
        <div className={`rounded-xl p-3 ${color} bg-opacity-10 backdrop-blur-xl`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="mt-1 text-3xl font-bold text-white">{value}</p>
        </div>
      </div>
      
      {trend && trendValue && (
        <div className="mt-4 flex items-center">
          {trend === 'up' ? (
            <ArrowTrendingUpIcon className="h-4 w-4 text-green-400" />
          ) : (
            <ArrowTrendingDownIcon className="h-4 w-4 text-red-400" />
          )}
          <span className={`ml-2 text-sm ${
            trend === 'up' ? 'text-green-400' : 'text-red-400'
          }`}>
            {trendValue}
          </span>
          <span className="ml-2 text-sm text-gray-500">vs last month</span>
        </div>
      )}
    </div>
  </div>
);

const TicketList = ({ tickets }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-700">
      <thead>
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Priority</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created By</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created At</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-700">
        {tickets.map((ticket) => (
          <tr key={ticket.id} className="hover:bg-gray-700/50">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">#{ticket.id}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{ticket.title}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
               {ticket.status === 'in_progress' ? 'on progress' : ticket.status}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {ticket.priority}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{ticket.created_by}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
              {new Date(ticket.created_at).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch stats
        const statsResponse = await api.get('/api/tickets/admin_stats/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Fetch recent tickets
        const ticketsResponse = await api.get('/api/tickets/', {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            ordering: '-created_at',
            limit: 10
          }
        });
        
        setStats(statsResponse.data);
        setTickets(ticketsResponse.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (loading) {
    return (
      <AdminLayout>
      <div className="flex justify-center mt-32 items-center h-full">
        <ArrowPathIcon className="w-16 h-16 text-black animate-spin" />
      </div>
      </AdminLayout>
    );
  }
  
  if (error) {
    return (
      <AdminLayout>
      <div className="flex justify-center items-center h-full">
        <ArrowPathIcon className="w-16 h-16 text-black animate-spin" />
      </div>
      </AdminLayout>
    );
  }
  if (!stats) return null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
            <p className="text-gray-400">Welcome back, Admin</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Tickets"
            value={stats.total_tickets}
            icon={TicketIcon}
            color="bg-blue-500"
          />
          <StatsCard
            title="Open Tickets"
            value={stats.open_tickets}
            icon={ChartBarIcon}
            color="bg-yellow-500"
          />
          <StatsCard
            title="In Progress"
            value={stats.in_progress_tickets}
            icon={ClockIcon}
            color="bg-purple-500"
          />
          <StatsCard
            title="Resolved"
            value={stats.resolved_tickets}
            icon={CheckCircleIcon}
            color="bg-green-500"
          />
        </div>

   

       

        <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Tickets</h2>
          <TicketList tickets={tickets} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;