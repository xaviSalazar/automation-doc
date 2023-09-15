import {useRoutes, Navigate} from 'react-router-dom';
// layouts 
import DashboardLayout from './layout/dashboard'
import DataGridView from './pages/DataGridView';
import DocUpload from './pages/DocUpload';
import Home from './pages/Home';
import AiGenerator from './pages/AiGenerator';
import SignIn from './pages/SignIn';
import SignUp from "./pages/SignUp"
import { autoLogin } from './redux/loginStore/loginAction';
import { useDispatch, useSelector} from 'react-redux';
import { useEffect } from 'react';


// Create a function to check if the user is authenticated
// const isAuthenticated = () => {
//   const token = localStorage.getItem('customerToken'); // Get the JWT from storage
//   if(token)
//     return true; // Return true if a token is present, false otherwise
// };

export default function Router() {

  const { isAuth } = useSelector(state => state.login)

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
          {
            path: 'home',
            element: <Home />,
          },
          { 
            path: 'templates', 
            element: isAuth ? <DataGridView />  : <Navigate to="/login" /> ,
          },
          { 
            path: 'templates/:name', 
            element: isAuth ? <DataGridView /> : <Navigate to="/login" />,
          },
          { 
            path:  'edit', 
            element: isAuth ? <DocUpload />  : <Navigate to="/login" />,
          },
          {
            path: 'generate',
            element: isAuth ? <AiGenerator />  : <Navigate to="/login" />,

          },
          {
            path: 'login',
            element: <SignIn />,
          },
          {
            path: 'signup',
            element: <SignUp />,
          },
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