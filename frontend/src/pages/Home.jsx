// frontend/src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <div className="logo">
          <h1>🧺 La Canastera</h1>
          <p>Conectando vendedores locales con su comunidad</p>
        </div>
        
        <nav className="home-nav">
          <Link to="/login" className="nav-link">Iniciar Sesión</Link>
          <Link to="/register" className="nav-link primary">Registrarse</Link>
        </nav>
      </header>

      <main className="home-main">
        <section className="hero">
          <h2>Mercados locales, tecnología global</h2>
          <p>
            Una plataforma que une a canasteras, vendedores ambulantes y clientes 
            en tiempo real. Apoya el comercio local y descubre productos frescos cerca de ti.
          </p>
          
          <div className="cta-buttons">
            <Link to="/register" className="cta-button primary">
              Comenzar Ahora
            </Link>
            <Link to="/login" className="cta-button secondary">
              Ya tengo cuenta
            </Link>
          </div>
        </section>

        <section className="features">
          <div className="feature-card">
            <div className="feature-icon">📍</div>
            <h3>Mapa en Tiempo Real</h3>
            <p>Encuentra vendedores cerca de tu ubicación actual</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🌡️</div>
            <h3>Calidad Garantizada</h3>
            <p>Sensores IoT monitorean temperatura y humedad de productos</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Comunidad Activa</h3>
            <p>Conoce las historias detrás de cada vendedor</p>
          </div>
        </section>

        <section className="user-types">
          <h2>Para todos los actores del mercado</h2>
          <div className="types-grid">
            <div className="type-card">
              <h4>🧺 Canasteras</h4>
              <p>Muestra tus productos, gestiona inventario y aumenta tus ventas</p>
            </div>
            
            <div className="type-card">
              <h4>🚶 Vendedores Ambulantes</h4>
              <p>Llega a más clientes y organiza tus ventas eficientemente</p>
            </div>
            
            <div className="type-card">
              <h4>🛒 Clientes</h4>
              <p>Encuentra productos frescos y apoya el comercio local</p>
            </div>
            
            <div className="type-card">
              <h4>⚙️ Administradores</h4>
              <p>Gestiona la comunidad y analiza el impacto local</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <p>&copy; 2024 La Canastera - Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default Home;