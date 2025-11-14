// frontend/src/App.jsx
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
  switch (user.userType) {
    case 'canastera':
    case 'vendedor_ambulante':
      LayoutComponent = VendorLayout;
      break;
    case 'admin':
      LayoutComponent = AdminLayout;
      break;
    case 'cliente':
    default:
      LayoutComponent = ClientLayout;
      break;
  }

  return (
    <LayoutComponent>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/perfil" element={<MiPerfil />} />
        <Route path="/comunidad" element={<NuestraComunidad />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
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