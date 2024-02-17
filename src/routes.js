import {useRoutes, Navigate, useLocation} from 'react-router-dom';
// layouts 
import DashboardLayout from './layout/dashboard'
import DataGridView from './pages/DataGridView';
import DocUpload from './pages/DocUpload';
import Home from './pages/Home';
import AiGenerator from './pages/AiGenerator';
import SignIn from './pages/SignIn';
import SignUp from "./pages/SignUp"
import ChatPdf from './pages/ChatPdf';
import { autoLogin } from './redux/loginStore/loginAction';
import { useDispatch, useSelector} from 'react-redux';
import { useEffect } from 'react';



function ProtectedRoute({ children }) {
  const { isAuth } = useSelector(state => state.login);
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default function Router() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(autoLogin())
  },[dispatch])

    const routes = useRoutes([
      // {
      //   path: '/',
      //   element:  <DashboardLayout />,
      //   children: [
      //     { element: isAuth ? <Navigate to="/home" /> : <Navigate to="/login" />, index: true },
      //     {
      //       path: 'home',
      //       element: <Home />,
      //     },

      //   ]
      // },
      {
        path: '/',
        element: <DashboardLayout />,
        children: [
          { element: <Navigate to="/home" />, index: true },
          { path: 'home', element: <ProtectedRoute><Home /></ProtectedRoute> },
          { path: 'templates', element: <ProtectedRoute><DataGridView /></ProtectedRoute> },
          { path:  'edit', element: <ProtectedRoute> <DocUpload />  </ProtectedRoute> },
          { path: 'generate', element: <ProtectedRoute>  <AiGenerator /> </ProtectedRoute> },
          { path: 'chatpdf', element: <ProtectedRoute>  <ChatPdf />  </ProtectedRoute> },
          { path: 'login', element: <SignIn />},
          { path: 'signup', element: <SignUp />},
         ],
      },
    //   {
    //     element: <SimpleLayout />,
    //     children: [
    //       { element: <Navigate to="/dashboard/app" />, index: true },
    //       { path: '404', element: <Page404 /> },
    //       { path: '*', element: <Navigate to="/404" /> },
    //     ],
    //   },
    //   {
    //     path: '*',
    //     element: <Navigate to="/404" replace />,
    //   },
    ]);
  
    return routes;
  }