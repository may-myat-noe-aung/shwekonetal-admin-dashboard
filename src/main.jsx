import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom';
import router from './router.jsx';
import { AlertProvider } from './AlertProvider.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AlertProvider>
    <RouterProvider router={router} />
  </AlertProvider>
)
