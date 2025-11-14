// frontend/src/components/auth/Register.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import './Auth.css'; // AÑADIR ESTA LÍNEA

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    userType: 'cliente',
    email: '',
    phone: ''
  });
  
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      // Redirigir según el tipo de usuario
    } catch (error) {
      alert('Error en el registro: ' + error.response?.data?.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="register-container">
      <h2>Registrarse en La Canastera 🧺</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuario único:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            minLength="3"
          />
        </div>

        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
          />
        </div>

        <div>
          <label>Tipo de usuario:</label>
          <select name="userType" value={formData.userType} onChange={handleChange}>
            <option value="cliente">Cliente</option>
            <option value="canastera">Canastera</option>
            <option value="vendedor_ambulante">Vendedor Ambulante</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div>
          <label>Email (opcional):</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Teléfono (opcional):</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Crear Cuenta</button>
      </form>
    </div>
  );
};

export default Register;