// frontend/src/components/auth/Register.jsx - VERSIÓN MODERNA
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    userType: 'cliente'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(formData);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Error al registrar usuario';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Unirse a La Canastera</h2>
        <p>Crea tu cuenta y comienza a vender o comprar</p>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="username">Usuario único:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            minLength="3"
            disabled={loading}
            placeholder="Elige tu nombre de usuario"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            disabled={loading}
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <div className="form-group">
          <label htmlFor="userType">Quiero ser:</label>
          <select 
            id="userType"
            name="userType" 
            value={formData.userType} 
            onChange={handleChange}
            disabled={loading}
          >
            <option value="cliente">🛒 Cliente - Comprar productos</option>
            <option value="canastera">🧺 Canastera - Vender mis productos</option>
            <option value="vendedor_ambulante">🚶 Vendedor Ambulante</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Creando cuenta...
            </>
          ) : (
            '🚀 Unirse a La Canastera'
          )}
        </button>
        
        <div className="auth-link">
          <p>
            ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;