// frontend/src/layouts/AdminLayout.jsx
import React from 'react';
import AdminSidebar from '../components/layout/AdminSidebar';
import './Layout.css';

const AdminLayout = ({ children }) => {
  return (
    <div className="layout admin-layout">
      <AdminSidebar />
      <main className="layout-main">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;