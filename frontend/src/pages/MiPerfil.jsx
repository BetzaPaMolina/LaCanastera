// frontend/src/pages/MiPerfil.jsx - ESQUELETO INICIAL
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './MiPerfil.css';

const MiPerfil = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    // Campos comunes
    profilePhoto: '',
    // Campos específicos por tipo de usuario
    ...(user.userType === 'cliente' && {
      email: '',
      phone: ''
    }),
    ...((user.userType === 'canastera' || user.userType === 'vendedor_ambulante') && {
      age: '',
      birthDate: '',
      story: '',
      hometown: ''
    })
  });

  return (
    <div className="mi-perfil">
      <h1>👤 Mi Perfil</h1>
      
      {/* Formulario dinámico según tipo de usuario */}
      {user.userType === 'cliente' && (
        <div className="perfil-cliente">
          <h2>Información de Contacto (Opcional)</h2>
          {/* Campos para email y teléfono */}
        </div>
      )}
      
      {(user.userType === 'canastera' || user.userType === 'vendedor_ambulante') && (
        <div className="perfil-vendedor">
          <h2>Información del Vendedor (Obligatoria)</h2>
          {/* Campos para edad, historia, procedencia */}
        </div>
      )}
    </div>
  );
};

export default MiPerfil;