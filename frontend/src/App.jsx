// frontend/src/App.jsx - VERSIÓN ACTUALIZADA
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import VendorLayout from './layouts/VendorLayout';
import ClientLayout from './layouts/ClientLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import MiPerfil from './pages/MiPerfil';
import NuestraComunidad from './pages/NuestraComunidad';

// ✅ IMPORTAR NUEVAS PÁGINAS
import MisProductos from './pages/MisProductos';
import InformeVentas from './pages/InformeVentas';
import AVender from './pages/AVender';
import AComprar from './pages/AComprar';

import './App.css';

// Componente para determinar el layout
const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Cargando La Canastera... 🧺</div>;
  }

  // SI NO hay usuario → LAYOUT PÚBLICO
  if (!user) {
    return (
      <PublicLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/comunidad" element={<NuestraComunidad />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </PublicLayout>
    );
  }

  // SI HAY usuario → Layout según tipo
  let LayoutComponent;
  let userRoutes;

  switch (user.userType) {
    case 'canastera':
    case 'vendedor_ambulante':
      LayoutComponent = VendorLayout;
      userRoutes = (
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/perfil" element={<MiPerfil />} />
          <Route path="/comunidad" element={<NuestraComunidad />} />
          {/* ✅ RUTAS ESPECÍFICAS PARA VENDEDORES */}
          <Route path="/productos" element={<MisProductos />} />
          <Route path="/ventas" element={<InformeVentas />} />
          <Route path="/vender" element={<AVender />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      );
      break;
    
    case 'admin':
      LayoutComponent = AdminLayout;
      userRoutes = (
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/perfil" element={<MiPerfil />} />
          <Route path="/comunidad" element={<NuestraComunidad />} />
          {/* ✅ RUTAS PARA ADMIN (podemos agregar después) */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      );
      break;
    
    case 'cliente':
    default:
      LayoutComponent = ClientLayout;
      userRoutes = (
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/perfil" element={<MiPerfil />} />
          <Route path="/comunidad" element={<NuestraComunidad />} />
          {/* ✅ RUTA ESPECÍFICA PARA CLIENTES */}
          <Route path="/comprar" element={<AComprar />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      );
      break;
  }

  return (
    <LayoutComponent>
      {userRoutes}
    </LayoutComponent>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;