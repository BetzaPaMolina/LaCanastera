// frontend/src/components/layout/ClientSidebar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const ClientSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="sidebar client-sidebar">
      <div className="sidebar-header">
        <h1>🧺 La Canastera</h1>
        <p>🛒 Cliente</p>
        <div className="user-info">
          <strong>@{user.username}</strong>
        </div>
      </div>

      <nav className="sidebar-nav">
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          🗺️ Inicio
        </Link>
        
        <Link to="/perfil" className={`nav-item ${location.pathname === '/perfil' ? 'active' : ''}`}>
          👤 Mi Perfil
        </Link>
        
        <Link to="/comprar" className={`nav-item ${location.pathname === '/comprar' ? 'active' : ''}`}>
          🛍️ ¡A Comprar!
        </Link>
        
        <Link to="/comunidad" className={`nav-item ${location.pathname === '/comunidad' ? 'active' : ''}`}>
          👥 Nuestra Comunidad
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

export default ClientSidebar;