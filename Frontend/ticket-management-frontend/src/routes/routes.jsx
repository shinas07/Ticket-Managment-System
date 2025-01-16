import { createBrowserRouter } from 'react-router-dom';
// import MainLayout from '../components/layout/MainLayout';
// import AuthLayout from '../components/layout/AuthLayout';
import LoginPage from '../pages/auth/LoginPage';
// import DashboardPage from '../pages/dashboard/DashboardPage';
// import TicketListPage from '../pages/tickets/TicketListPage';
// import TicketDetailPage from '../pages/tickets/TicketDetailPage';
// import ErrorPage from '../pages/ErrorPage';
// import NotFoundPage from '../pages/NotFoundPage';

const ProtectedLoggedInRoute = ({ element }) => {
    const { user } = useAuth();
    
    if (user) {
      return user.user_type === 'manager' 
        ? <Navigate to="/manager/dashboard" /> 
        : <Navigate to="/employee/dashboard" />;
    }
    return element;
  };
  
  // Protected route for manager-only pages
  const ProtectedManagerRoute = ({ element }) => {
    const { user } = useAuth();
    
    if (!user) {
      return <Navigate to="/login" />;
    }
    
    if (user.user_type !== 'manager') {
      return <Navigate to="/employee/dashboard" />;
    }
    
    return element;
  };

  
  
const route = createBrowserRouter([
    {
      path: '/',
      element: <LandingPage />,
    },
    // auth routes
    {
        path: '/employee/leave-history',
        element: <ProtectedEmployeeRoute element={<LeaveHistory />} />,
      },
    // Manager routes
    {
      path: '/manager/signup',
      element: <ProtectedLoggedInRoute element={<ManagerSignUp />} />,
    },
    // Employee routes
    {
      path: '/employee/dashboard',
      element: <ProtectedEmployeeRoute element={<EmployeeDashboard />} />,
    },
    {
      path: '/employee/leave-form',
      element: <ProtectedEmployeeRoute element={<LeaveApplicationForm />} />,
    },
    {
      path: '/employee/leave-history',
      element: <ProtectedEmployeeRoute element={<LeaveHistory />} />,
    },
    // Auth routes

    {
      path: '*',
      element: <NotFoundPage />,
    },
  ]);