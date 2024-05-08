import { useRoutes, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// layouts
import DashboardLayout from './layout/dashboard';
// pages
import DataGridView from './pages/DataGridView';
import DocUpload from './pages/DocUpload';
import Home from './pages/Home';
import AiGenerator from './pages/AiGenerator';
import ImgGenerator from './pages/ImgGenerator';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ChatPdf from './pages/ChatPdf';
// Redux action
import { autoLogin } from './redux/loginStore/loginAction';

function ProtectedRoute({ children }) {
  
  const { isAuth } = useSelector((state) => state.login);
  const location = useLocation();

  if (!isAuth) {
    // Redirect to login but remember the location we're trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, show the intended route's component
  return children;
}

export default function Router() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Attempt to auto-login the user
    dispatch(autoLogin());
  }, [dispatch]);

  // Define routes using useRoutes() hook for dynamic route config
  const routes = useRoutes([
    {
      path: '/',
      element: <DashboardLayout />, // Your layout that wraps around everything
      children: [
        // Redirects immediately to /home
        { element: <Navigate to="/home" />, index: true },
        // Your routes wrapped in ProtectedRoute component
        { path: 'home', element: <ProtectedRoute><Home /></ProtectedRoute> },
        { path: 'templates', element: <ProtectedRoute><DataGridView /></ProtectedRoute> },
        { path: 'edit', element: <ProtectedRoute><DocUpload /></ProtectedRoute> },
        { path: 'generate', element: <ProtectedRoute><AiGenerator /></ProtectedRoute> },
        { path: 'chatpdf', element: <ProtectedRoute><ChatPdf /></ProtectedRoute> },
        // { path: 'image-gen', element: <ProtectedRoute><ImgGenerator /></ProtectedRoute> },
        // Public routes below
        { path: 'login', element: <SignIn />},
        { path: 'signup', element: <SignUp />},
      ],
    },
    // Add more routes as needed
    // Example: Error handling, external layouts, etc.
    // {
    //   path: '*',
    //   element: <Navigate to="/404" replace />,
    // },
  ]);

  return routes;
}