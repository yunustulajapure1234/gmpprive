import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import AdminProvider from "./context/AdminContext";
import InventoryProvider from "./context/InventoryContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AdminProvider>
      <InventoryProvider>
    <App />
    </InventoryProvider>
    </AdminProvider>
  </React.StrictMode>
);
