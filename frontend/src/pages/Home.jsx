// frontend/src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import MapComponent from '../components/common/MapComponent';
import { userAPI } from '../services/api';
import './Home.css';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActiveUsers();
  }, []);

  const loadActiveUsers = async () => {
    try {
      const response = await userAPI.getActiveUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error cargando usuarios activos:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (user) => {
    console.log('Usuario clickeado:', user);
    // Aquí podrías mostrar un modal o panel con información del usuario
  };

  if (loading) {
    return <div className="loading">Cargando mapa...</div>;
  }

  return (
    <div className="home-public">
      <div className="home-header">
        <h1>Bienvenido a La Canastera</h1>
        <p>Explora el mercado local en tiempo real</p>
      </div>

      <div className="map-section">
        <MapComponent 
          users={users}
          onUserClick={handleUserClick}
          showFilters={true}
        />
      </div>

      <div className="public-info">
        <div className="info-card">
          <h3>🧺 Para Canasteras</h3>
          <p>Muestra tus productos y aumenta tus ventas</p>
        </div>
        <div className="info-card">
          <h3>🚶 Para Vendedores Ambulantes</h3>
          <p>Llega a más clientes en tiempo real</p>
        </div>
        <div className="info-card">
          <h3>🛒 Para Clientes</h3>
          <p>Encuentra productos frescos cerca de ti</p>
        </div>
      </div>
    </div>
  );
};

export default Home;