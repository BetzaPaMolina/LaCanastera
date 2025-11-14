// frontend/src/layouts/ClientLayout.jsx
import React from 'react';
import ClientSidebar from '../components/layout/ClientSidebar';
import './Layout.css';

const ClientLayout = ({ children }) => {
  return (
    <div className="layout client-layout">
      <ClientSidebar />
      <main className="layout-main">
        {children}
      </main>
    </div>
  );
};

export default ClientLayout;