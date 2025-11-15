// frontend/src/pages/NuestraComunidad.jsx - COMPLETO
import React, { useState, useEffect } from 'react';
import './NuestraComunidad.css';

const NuestraComunidad = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'canastera', 'vendedor_ambulante'

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/vendedores');
      const data = await response.json();
      setVendors(data);
    } catch (error) {
      console.error('Error cargando vendedores:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    if (filter === 'all') return true;
    return vendor.userType === filter;
  });

  if (loading) {
    return <div className="loading">Cargando comunidad...</div>;
  }

  return (
    <div className="comunidad-container">
      <div className="comunidad-header">
        <h1>👥 Nuestra Comunidad</h1>
        <p>Conoce a los vendedores de La Canastera</p>
      </div>

      {/* Filtros */}
      <div className="filter-section">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todos ({vendors.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'canastera' ? 'active' : ''}`}
          onClick={() => setFilter('canastera')}
        >
          🧺 Canasteras ({vendors.filter(v => v.userType === 'canastera').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'vendedor_ambulante' ? 'active' : ''}`}
          onClick={() => setFilter('vendedor_ambulante')}
        >
          🚶 Vendedores Ambulantes ({vendors.filter(v => v.userType === 'vendedor_ambulante').length})
        </button>
      </div>

      {/* Grid de vendedores */}
      <div className="vendors-grid">
        {filteredVendors.length === 0 ? (
          <div className="no-vendors">
            <h3>No hay vendedores de este tipo aún</h3>
            <p>Sé el primero en unirte a nuestra comunidad</p>
          </div>
        ) : (
          filteredVendors.map(vendor => (
            <VendorCard key={vendor._id} vendor={vendor} />
          ))
        )}
      </div>
    </div>
  );
};

const VendorCard = ({ vendor }) => {
  const [showFullStory, setShowFullStory] = useState(false);
  
  const getUserTypeText = (type) => {
    return type === 'canastera' ? '🧺 Canastera' : '🚶 Vendedor Ambulante';
  };

  const hasStory = vendor.vendorProfile?.story && vendor.vendorProfile.story.length > 0;
  const story = vendor.vendorProfile?.story || '';
  const shortStory = story.length > 150 ? story.substring(0, 150) + '...' : story;

  return (
    <div className="vendor-card">
      {/* Avatar */}
      <div className="vendor-avatar">
        {vendor.profilePhoto ? (
          <img src={vendor.profilePhoto} alt={vendor.username} />
        ) : (
          <div className="avatar-placeholder">
            {vendor.username.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Información */}
      <div className="vendor-info">
        <h3>{vendor.username}</h3>
        <span className="vendor-type">{getUserTypeText(vendor.userType)}</span>

        {vendor.vendorProfile?.hometown && (
          <p className="vendor-location">
            📍 {vendor.vendorProfile.hometown}
          </p>
        )}

        {vendor.vendorProfile?.age && (
          <p className="vendor-age">
            🎂 {vendor.vendorProfile.age} años
          </p>
        )}

        {/* Historia */}
        {hasStory && (
          <div className="vendor-story">
            <strong>Su historia:</strong>
            <p className="story-text">
              {showFullStory ? story : shortStory}
            </p>
            {story.length > 150 && (
              <button 
                className="btn-read-more"
                onClick={() => setShowFullStory(!showFullStory)}
              >
                {showFullStory ? 'Ver menos' : 'Leer más'}
              </button>
            )}
          </div>
        )}

        {/* Rating si existe */}
        {vendor.vendorProfile?.rating > 0 && (
          <div className="vendor-rating">
            ⭐ {vendor.vendorProfile.rating}/5
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="vendor-actions">
        <button className="btn-contact">💬 Contactar</button>
        <button className="btn-view-products">🛒 Ver Productos</button>
      </div>
    </div>
  );
};

export default NuestraComunidad;