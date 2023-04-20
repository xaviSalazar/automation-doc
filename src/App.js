// import './App.css';
// import DataGridView from './pages/DataGridView';
// import LoadFile from './pages/LoadFile';
// import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
// router 
import Router from './routes';

function App() {
  return (
      <HelmetProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </HelmetProvider>
  )
}

export default App;
