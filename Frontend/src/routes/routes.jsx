import { createBrowserRouter } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
// import Login from '../pages/auth/Login';


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
    // const { user } = useAuth();
    
    // if (!user) {
    //   return <Navigate to="/login" />;
    // }
    
    // if (user.user_type !== 'manager') {
    //   return <Navigate to="/employee/dashboard" />;
    // }
    
    return element;
  };

  

const route = createBrowserRouter([
    {
      path: '/',
      element: <LandingPage />,
    },
    // auth routes
    //  {
    //   path: '/login',
    //   element: <Login />,
    // },
    // {
    //   path: '*',
    //   element: <NotFoundPage />,
    // },
  ]);

export default route;