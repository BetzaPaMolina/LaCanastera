// frontend/src/pages/MiPerfil.jsx - EN ESPAÑOL
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./MiPerfil.css";

const MiPerfil = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    story: "",
    hometown: "",
    age: "",
    birthDate: ""
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.contactInfo?.email || "",
        phone: user.contactInfo?.phone || "",
        story: user.vendorProfile?.story || "",
        hometown: user.vendorProfile?.hometown || "",
        age: user.vendorProfile?.age || "",
        birthDate: user.vendorProfile?.birthDate ? user.vendorProfile.birthDate.split('T')[0] : ""
      });
      setPhotoPreview(user.profilePhoto || "/default-avatar.png");
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setMessage("Por favor selecciona un archivo de imagen válido");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setMessage("La imagen no debe exceder 5MB");
        return;
      }

      setProfilePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem('token');
      
      // Preparar datos a enviar
      const dataToSend = {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        story: formData.story,
        hometown: formData.hometown,
        age: formData.age ? parseInt(formData.age) : undefined,
        birthDate: formData.birthDate || undefined
      };

      console.log('📤 Enviando datos:', dataToSend);

      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      const result = await response.json();
      console.log('📥 Respuesta:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Error al actualizar perfil');
      }

      if (result.success) {
        setMessage("✅ Perfil actualizado exitosamente");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error('❌ Error:', error);
      setMessage("❌ Error al actualizar perfil: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const isVendor = user?.userType === 'canastera' || user?.userType === 'vendedor_ambulante';

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <h1>Mi Perfil</h1>
        <p>Actualiza tu información personal</p>
      </div>

      {message && (
        <div className={`alert ${message.includes("Error") || message.includes("❌") ? "alert-error" : "alert-success"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="perfil-form">
        {/* Sección de foto */}
        <div className="foto-section">
          <img 
            src={photoPreview} 
            alt="Vista previa" 
            className="foto-preview"
          />
          <input
            type="file"
            id="profilePhoto"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ display: 'none' }}
          />
          <button 
            type="button" 
            className="btn-subir-foto"
            onClick={() => document.getElementById('profilePhoto').click()}
          >
            Cambiar Foto
          </button>
        </div>

        {/* Información básica */}
        <div className="form-group">
          <label htmlFor="username">Usuario *</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo Electrónico *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Teléfono</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="5512-3456"
          />
        </div>

        <div className="form-group">
          <label htmlFor="userType">Tipo de Usuario</label>
          <select
            id="userType"
            name="userType"
            value={user?.userType || ""}
            disabled
          >
            <option value="">Seleccionar...</option>
            <option value="canastera">Canastera</option>
            <option value="vendedor_ambulante">Vendedor Ambulante</option>
            <option value="cliente">Cliente</option>
          </select>
        </div>

        {/* Información de vendedor - solo si es canastera o vendedor ambulante */}
        {isVendor && (
          <>
            <div className="form-group">
              <label htmlFor="age">Edad</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="18"
                max="100"
                placeholder="Ej: 35"
              />
            </div>

            <div className="form-group">
              <label htmlFor="birthDate">Fecha de Nacimiento</label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="hometown">Lugar de Origen</label>
              <input
                type="text"
                id="hometown"
                name="hometown"
                value={formData.hometown}
                onChange={handleChange}
                placeholder="Tu pueblo o ciudad de origen"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="story">Mi Historia</label>
              <textarea
                id="story"
                name="story"
                value={formData.story}
                onChange={handleChange}
                placeholder="Cuéntanos tu historia, cómo empezaste, qué te apasiona..."
                rows="4"
              />
            </div>
          </>
        )}

        <button 
          type="submit" 
          className="btn-guardar"
          disabled={loading}
        >
          {loading ? "Guardando..." : "💾 Guardar Cambios"}
        </button>
      </form>
    </div>
  );
};

export default MiPerfil;