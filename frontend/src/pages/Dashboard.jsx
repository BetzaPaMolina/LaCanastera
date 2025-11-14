// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import MapComponent from '../components/common/MapComponent';
import { userAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVendedores();
  }, []);

  const loadVendedores = async () => {
    try {
      const response = await userAPI.getVendedores();
      setUsers(response.data);
    } catch (error) {
      console.error('Error cargando vendedores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const getUserTypeText = (type) => {
    const types = {
      'cliente': 'Cliente 🛒',
      'canastera': 'Canastera 🧺', 
      'vendedor_ambulante': 'Vendedor Ambulante 🚶',
      'admin': 'Administrador ⚙️'
    };
    return types[type] || type;
  };

  if (loading) {
    return <div className="loading">Cargando mapa...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>🧺 La Canastera - Mapa Interactivo</h1>
          <p>Encuentra vendedores cerca de ti en tiempo real</p>
        </div>
        
        <div className="user-info">
          <span className="user-badge">{getUserTypeText(user?.userType)}</span>
          <span className="username">@{user?.username}</span>
          <button onClick={logout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {/* Panel del mapa */}
        <section className="map-section">
          <MapComponent 
            users={users}
            onUserClick={handleUserClick}
            currentUser={user}
          />
        </section>

        {/* Panel de información del usuario seleccionado */}
        {selectedUser && (
          <section className="user-detail-panel">
            <div className="panel-header">
              <h3>Información del Vendedor</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedUser(null)}
              >
                ×
              </button>
            </div>
            
            <div className="user-detail-content">
              <div className="user-avatar">
                {selectedUser.profilePhoto ? (
                  <img src={selectedUser.profilePhoto} alt={selectedUser.username} />
                ) : (
                  <div className="avatar-placeholder">
                    {selectedUser.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              <h4>{selectedUser.username}</h4>
              <p className="user-type">{getUserTypeText(selectedUser.userType)}</p>
              
              {selectedUser.vendorInfo && (
                <div className="vendor-details">
                  {selectedUser.vendorInfo.age && (
                    <p><strong>Edad:</strong> {selectedUser.vendorInfo.age} años</p>
                  )}
                  {selectedUser.vendorInfo.hometown && (
                    <p><strong>Procedencia:</strong> {selectedUser.vendorInfo.hometown}</p>
                  )}
                  {selectedUser.vendorInfo.story && (
                    <div className="story-section">
                      <strong>Su historia:</strong>
                      <p className="story-text">"{selectedUser.vendorInfo.story}"</p>
                    </div>
                  )}
                  {selectedUser.vendorInfo.rating > 0 && (
                    <p><strong>Calificación:</strong> ⭐ {selectedUser.vendorInfo.rating}/5</p>
                  )}
                </div>
              )}
              
              <div className="action-buttons">
                <button className="btn primary">Ver Productos</button>
                <button className="btn secondary">Enviar Mensaje</button>
              </div>
            </div>
          </section>
        )}

        {/* Estadísticas rápidas */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Vendedores Activos</h3>
              <p className="stat-value">
                {users.filter(u => u.userType !== 'cliente').length}
              </p>
            </div>
            
            <div className="stat-card">
              <h3>En tu Área</h3>
              <p className="stat-value">
                {users.filter(u => u.userType !== 'cliente').length}
              </p>
            </div>
            
            <div className="stat-card">
              <h3>Canasteras</h3>
              <p className="stat-value">
                {users.filter(u => u.userType === 'canastera').length}
              </p>
            </div>
            
            <div className="stat-card">
              <h3>Ambulantes</h3>
              <p className="stat-value">
                {users.filter(u => u.userType === 'vendedor_ambulante').length}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;