import {useRoutes} from 'react-router-dom';
// layouts 
import DashboardLayout from './layout/DashboardLayout';

export default function Router() {
    const routes = useRoutes([
      {
        path: 'automation-doc',
        element: <DashboardLayout />,
        // children: [
        //   { element: <Navigate to="/dashboard/app" />, index: true },
        //   { path: 'app', element: <DashboardAppPage /> },
        //   { path: 'user', element: <UserPage /> },
        //   { path: 'products', element: <ProductsPage /> },
        //   { path: 'blog', element: <BlogPage /> },
        // ],
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