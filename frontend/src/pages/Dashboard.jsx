// frontend/src/pages/Dashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const getUserTypeText = (type) => {
    const types = {
      'cliente': 'Cliente 🛒',
      'canastera': 'Canastera 🧺', 
      'vendedor_ambulante': 'Vendedor Ambulante 🚶',
      'admin': 'Administrador ⚙️'
    };
    return types[type] || type;
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>🧺 Panel de La Canastera</h1>
          <p>Bienvenido de vuelta, {user?.username}</p>
        </div>
        
        <div className="user-info">
          <span>Tipo: {getUserTypeText(user?.userType)}</span>
          <button onClick={logout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-card">
          <h2>¡Hola, {user?.username}! 👋</h2>
          <p>Estamos construyendo tu experiencia en La Canastera...</p>
          
          <div className="coming-soon">
            <h3>Próximamente:</h3>
            <ul>
              <li>🗺️ Mapa interactivo de vendedores</li>
              <li>📱 Gestión de productos</li>
              <li>🛒 Sistema de compras en tiempo real</li>
              <li>🌡️ Monitoreo con sensores IoT</li>
              <li>👥 Foro comunitario</li>
            </ul>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Estado</h3>
            <p className="stat-value">Activo ✅</p>
          </div>
          
          <div className="stat-card">
            <h3>Tipo de Usuario</h3>
            <p className="stat-value">{getUserTypeText(user?.userType)}</p>
          </div>
          
          <div className="stat-card">
            <h3>Próxima Función</h3>
            <p className="stat-value">Mapa Interactivo</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;