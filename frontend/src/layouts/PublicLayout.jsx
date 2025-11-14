// frontend/src/layouts/PublicLayout.jsx
import React from 'react';
import PublicSidebar from '../components/layout/PublicSidebar';
import './Layout.css';

const PublicLayout = ({ children }) => {
  return (
    <div className="layout public-layout">
      <PublicSidebar />
      <main className="layout-main">
        {children}
      </main>
    </div>
  );
};

export default PublicLayout;