// frontend/src/components/layout/VendorSidebar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const VendorSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getUserTypeText = () => {
    return user.userType === 'canastera' ? '🧺 Canastera' : '🚶 Vendedor Ambulante';
  };

  return (
    <aside className="sidebar vendor-sidebar">
      <div className="sidebar-header">
        <h1>🧺 La Canastera</h1>
        <p>{getUserTypeText()}</p>
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
        
        <Link to="/productos" className={`nav-item ${location.pathname === '/productos' ? 'active' : ''}`}>
          📦 Mis Productos
        </Link>
        
        <Link to="/ventas" className={`nav-item ${location.pathname === '/ventas' ? 'active' : ''}`}>
          💰 Informe de Ventas
        </Link>
        
        <Link to="/vender" className={`nav-item ${location.pathname === '/vender' ? 'active' : ''}`}>
          🛒 ¡A Vender!
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

export default VendorSidebar;