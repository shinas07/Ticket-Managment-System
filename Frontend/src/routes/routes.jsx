import { createBrowserRouter } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import Login from '../pages/auth/Login';
import UserDashboard from '../pages/dashboard/UserDashboard';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import TicketManagement from '../pages/tickets/UserTicketCreate';
import UserTicketManagement from '../pages/tickets/UserTickets';
import AdminUserManagement from '../pages/admin/UserManagement';
import AdminTicketManagement from '../pages/admin/TicketManagement';
import Unauthorized from '../pages/Unauthorized';
import NotFound from '../pages/NotFound';
import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';

const route = createBrowserRouter([
  {
    path: '/',
    element: (
      <PublicRoute>
      <LandingPage />
      </PublicRoute>
    ),
  },
  // auth routes
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: '/user/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['user']}>
        <UserDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/user/ticket/create',
    element: (
      <ProtectedRoute allowedRoles={['user']}>
        <TicketManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: '/user/ticket/manage',
    element: (
      <ProtectedRoute allowedRoles={['user']}>
        <UserTicketManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/user/manage',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminUserManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/tickets/management',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminTicketManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default route;