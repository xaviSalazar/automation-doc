import {useRoutes, Navigate} from 'react-router-dom';
// layouts 
import DashboardLayout from './layout/dashboard'
import DataGridView from './pages/DataGridView';
import DocUpload from './pages/DocUpload';
import Home from './pages/Home';

export default function Router() {
    const routes = useRoutes([
      {
        path: '/',
        element: <DashboardLayout />,
        children: [
          { element: <Navigate to="/home" />, index: true },
          {
            path: 'home',
            element: <Home />,
          },

        ]
      },
      {
        path: '/automation-doc',
        element: <DashboardLayout />,
        children: [
          { element: <Navigate to="/automation-doc/home" />, index: true },
          {
            path: 'home',
            element: <Home />,
          },
          { 
            path: 'templates', 
            element: <DataGridView /> ,
          },
          { 
            path: 'templates/:name', 
            element: <DataGridView />,
          },
          { path:  'edit', 
            element: <DocUpload /> 
          },
        //   { path: 'products', element: <ProductsPage /> },
        //   { path: 'blog', element: <BlogPage /> },
         ],
      },
    //   {
    //     path: 'login',
    //     element: <LoginPage />,
    //   },
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