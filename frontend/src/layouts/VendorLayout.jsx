// frontend/src/layouts/VendorLayout.jsx
import React from 'react';
import VendorSidebar from '../components/layout/VendorSidebar';
import './Layout.css';

const VendorLayout = ({ children }) => {
  return (
    <div className="layout vendor-layout">
      <VendorSidebar />
      <main className="layout-main">
        {children}
      </main>
    </div>
  );
};

export default VendorLayout;