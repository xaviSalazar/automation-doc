import {useRoutes, Navigate} from 'react-router-dom';
// layouts 
import DashboardLayout from './layout/dashboard'
import DataGridView from './pages/DataGridView';
import DocUpload from './pages/DocUpload';

export default function Router() {
    const routes = useRoutes([
      {
        path: '/automation-doc',
        element: <DashboardLayout />,
        children: [
          { element: <Navigate to="/automation-doc/edit" />, index: true },
          { path: 'edit', element: <DataGridView /> },
          { path: 'templates', element: <DocUpload /> },
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