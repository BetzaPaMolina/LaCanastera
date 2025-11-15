// MapComponent.jsx - VERSIÓN COMPLETA CON TODAS LAS MEJORAS
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';

// Fix para iconos
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Iconos personalizados
const createCustomIcon = (userType) => {
  const styles = {
    canastera: { emoji: '🧺', color: '#2ecc71' },
    vendedor_ambulante: { emoji: '🚶', color: '#3498db' },
    cliente: { emoji: '🛒', color: '#f39c12' },
    admin: { emoji: '⚙️', color: '#9b59b6' },
    default: { emoji: '📍', color: '#e74c3c' }
  };
  const style = styles[userType] || styles.default;
  
  return L.divIcon({
    html: `<div style="background:${style.color};width:35px;height:35px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;border:3px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.3);color:white;">${style.emoji}</div>`,
    iconSize: [35, 35],
  });
};

// Componente de ubicación inicial MEJORADO
function LocationHandler({ onLocationFound, onLocationError }) {
  const map = useMapEvents({
    locationfound: (e) => {
      console.log('📍 Ubicación encontrada:', e.latlng, 'Precisión:', e.accuracy);
      onLocationFound(e.latlng, e.accuracy);
      map.flyTo(e.latlng, 16);
    },
    locationerror: (e) => {
      console.error('❌ Error de geolocalización:', e.message);
      onLocationError && onLocationError(e.message);
    },
  });

  useEffect(() => {
    map.locate({ 
      setView: true, 
      maxZoom: 16,
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 30000
    });
  }, [map]);

  return null;
}

// Componente de seguimiento en tiempo real NUEVO
function RealTimeLocation({ onLocationUpdate, updateInterval = 10000 }) {
  const map = useMapEvents({});
  const [watchId, setWatchId] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error('Geolocalización no soportada');
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const newLocation = { lat: latitude, lng: longitude, accuracy };
        console.log('🔄 Actualización de ubicación:', newLocation);
        onLocationUpdate(newLocation);
        map.flyTo([latitude, longitude], map.getZoom(), { duration: 1 });
      },
      (error) => {
        console.error('❌ Error en geolocalización en tiempo real:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
      }
    );

    setWatchId(id);

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [map, onLocationUpdate, updateInterval]);

  return null;
}

// Componente principal ACTUALIZADO
const MapComponent = ({ users = [], onUserClick, currentUser }) => {
  const [currentLocation, setCurrentLocation] = useState([15.428215, -90.329235]);
  const [locationAccuracy, setLocationAccuracy] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [filters, setFilters] = useState({
    canastera: true,
    vendedor_ambulante: true,
    cliente: false,
    admin: false
  });

  const handleLocationFound = (location, accuracy) => {
    setCurrentLocation([location.lat, location.lng]);
    setLocationAccuracy(accuracy);
  };

  const handleLocationUpdate = (newLocation) => {
    setCurrentLocation([newLocation.lat, newLocation.lng]);
    setLocationAccuracy(newLocation.accuracy);
  };

  const handleLocationError = (error) => {
    console.error('Error de geolocalización:', error);
    alert('No se pudo obtener la ubicación. Permite los permisos de ubicación.');
  };

  const toggleTracking = () => {
    setIsTracking(!isTracking);
  };

  const filteredUsers = users.filter(user => filters[user.userType]);

  const tileProviders = [
    {
      name: 'OpenStreetMap',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors'
    },
    {
      name: 'CartoDB',
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; OpenStreetMap, CARTO'
    }
  ];

  const [currentTileProvider, setCurrentTileProvider] = useState(1);

  return (
    <div className="map-component">
      <div className="map-controls">
        <h3>🧭 Mapa de La Canastera</h3>
        
        <div className="location-info">
          <div className="coordinates">
            <strong>Tu ubicación:</strong>
            <span>Lat: {currentLocation[0].toFixed(6)}</span>
            <span>Lng: {currentLocation[1].toFixed(6)}</span>
            {locationAccuracy && (
              <span className="accuracy">Precisión: ~{Math.round(locationAccuracy)}m</span>
            )}
          </div>
          
          <button className={`tracking-btn ${isTracking ? 'active' : ''}`} onClick={toggleTracking}>
            {isTracking ? '🟢 Siguiendo ubicación' : '⚪ Iniciar seguimiento'}
          </button>
        </div>

        <div className="controls-row">
          <div className="filter-section">
            <strong>Filtrar vendedores:</strong>
            <div className="filter-options">
              {Object.keys(filters).map(type => (
                <label key={type} className="filter-option">
                  <input type="checkbox" checked={filters[type]} onChange={(e) => setFilters(prev => ({...prev, [type]: e.target.checked}))} />
                  <span className={`filter-label ${type}`}>
                    {type === 'canastera' && '🧺 Canasteras'}
                    {type === 'vendedor_ambulante' && '🚶 Ambulantes'}
                    {type === 'cliente' && '🛒 Clientes'}
                    {type === 'admin' && '⚙️ Admins'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="map-style-section">
            <strong>Estilo de mapa:</strong>
            <select value={currentTileProvider} onChange={(e) => setCurrentTileProvider(Number(e.target.value))} className="style-selector">
              <option value={0}>🗺️ OpenStreetMap</option>
              <option value={1}>🏙️ CartoDB</option>
            </select>
          </div>
        </div>
      </div>

      <div className="map-container">
        <MapContainer center={currentLocation} zoom={16} style={{ height: '100%', width: '100%' }} key={currentTileProvider}>
          <TileLayer url={tileProviders[currentTileProvider].url} attribution={tileProviders[currentTileProvider].attribution} />
          
          <LocationHandler onLocationFound={handleLocationFound} onLocationError={handleLocationError} />
          
          {isTracking && <RealTimeLocation onLocationUpdate={handleLocationUpdate} updateInterval={5000} />}

          <Marker position={currentLocation} icon={createCustomIcon('default')}>
            <Popup>
              <div className="popup-content">
                <strong>📍 Tu ubicación actual</strong><br />
                <em>Lat: {currentLocation[0].toFixed(6)}</em><br />
                <em>Lng: {currentLocation[1].toFixed(6)}</em><br />
                {locationAccuracy && <em>Precisión: ~{Math.round(locationAccuracy)} metros</em>}
              </div>
            </Popup>
          </Marker>

          {filteredUsers.map((user, index) => {
            const userLat = user.location?.lat || currentLocation[0] + (Math.random() - 0.5) * 0.01;
            const userLng = user.location?.lng || currentLocation[1] + (Math.random() - 0.5) * 0.01;
            
            return (
              <Marker key={user._id || user.id || index} position={[userLat, userLng]} icon={createCustomIcon(user.userType)} eventHandlers={{ click: () => onUserClick && onUserClick(user) }}>
                <Popup>
                  <div className="user-popup">
                    <h4>{user.username}</h4>
                    <p><strong>Tipo:</strong> {user.userType === 'canastera' ? '🧺 Canastera' : '🚶 Vendedor Ambulante'}</p>
                    {user.vendorInfo?.story ? <p><strong>Historia:</strong> {user.vendorInfo.story.substring(0, 80)}...</p> : <p><em>Sin descripción</em></p>}
                    <button className="view-profile-btn" onClick={() => onUserClick && onUserClick(user)}>Ver Perfil</button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      
    </div>
  );
};

export default MapComponent;