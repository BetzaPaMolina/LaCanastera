// frontend/src/components/layout/AdminSidebar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="sidebar admin-sidebar">
      <div className="sidebar-header">
        <h1>🧺 La Canastera</h1>
        <p>⚙️ Administrador</p>
        <div className="user-info">
          <strong>@{user.username}</strong>
        </div>
      </div>

      <nav className="sidebar-nav">
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          🗺️ Mapa
        </Link>
        
        <Link to="/comerciantes" className={`nav-item ${location.pathname === '/comerciantes' ? 'active' : ''}`}>
          👥 Comerciantes
        </Link>
        
        <Link to="/clientes" className={`nav-item ${location.pathname === '/clientes' ? 'active' : ''}`}>
          🛒 Clientes
        </Link>
        
        <Link to="/reportes" className={`nav-item ${location.pathname === '/reportes' ? 'active' : ''}`}>
          📊 Reportes
        </Link>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          🚪 Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;