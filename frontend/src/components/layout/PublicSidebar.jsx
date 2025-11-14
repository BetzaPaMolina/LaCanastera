// frontend/src/components/layout/PublicSidebar.jsx - VERSIÓN MEJORADA
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const PublicSidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* ✅ Botón toggle para móvil */}
      <button 
        className="sidebar-toggle"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      {/* ✅ Overlay para móvil */}
      {isMobile && (
        <div 
          className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
          onClick={closeSidebar}
        />
      )}

      <aside className={`sidebar public-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1>🧺 La Canastera</h1>
          <p>Mercados locales, tecnología global</p>
        </div>

        <nav className="sidebar-nav">
          <Link 
            to="/" 
            className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            🗺️ Inicio
          </Link>
          
          <Link 
            to="/register" 
            className={`nav-item ${location.pathname === '/register' ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            📝 Registrarse
          </Link>
          
          <Link 
            to="/login" 
            className={`nav-item ${location.pathname === '/login' ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            🔐 Iniciar Sesión
          </Link>
          
          <Link 
            to="/comunidad" 
            className={`nav-item ${location.pathname === '/comunidad' ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            👥 Nuestra Comunidad
          </Link>
        </nav>

        <div className="sidebar-footer">
          <p>Conectando vendedores y clientes</p>
        </div>
      </aside>
    </>
  );
};

export default PublicSidebar;