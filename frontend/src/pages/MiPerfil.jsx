import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./MiPerfil.css";

const MiPerfil = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    contactInfo: {
      email: "",
      phone: ""
    },
    vendorProfile: {
      story: "",
      hometown: ""
    }
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        contactInfo: {
          email: user.contactInfo?.email || "",
          phone: user.contactInfo?.phone || ""
        },
        vendorProfile: {
          story: user.vendorProfile?.story || "",
          hometown: user.vendorProfile?.hometown || ""
        }
      });
      setPhotoPreview(user.profilePhoto || "/default-avatar.png");
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith("contactInfo.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [field]: value
        }
      }));
    } else if (name.startsWith("vendorProfile.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        vendorProfile: {
          ...prev.vendorProfile,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setMessage("Please select a valid image file");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setMessage("Image should not exceed 5MB");
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
      const dataToSend = new FormData();
      
      // Add flat fields for backend compatibility
      dataToSend.append('username', formData.username);
      dataToSend.append('contactInfo[email]', formData.contactInfo.email);
      dataToSend.append('contactInfo[phone]', formData.contactInfo.phone);
      dataToSend.append('vendorProfile[story]', formData.vendorProfile.story);
      dataToSend.append('vendorProfile[hometown]', formData.vendorProfile.hometown);
      
      if (profilePhoto) {
        dataToSend.append('profilePhoto', profilePhoto);
      }

      await updateProfile(dataToSend);
      setMessage("Profile updated successfully");
      
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Error updating profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <h1>My Profile</h1>
        <p>Update your personal information</p>
      </div>

      {message && (
        <div className={`alert ${message.includes("Error") ? "alert-error" : "alert-success"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="perfil-form">
        {/* Photo Section */}
        <div className="foto-section">
          <img 
            src={photoPreview} 
            alt="Preview" 
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
            Change Photo
          </button>
        </div>

        {/* Basic Information */}
        <div className="form-group">
          <label htmlFor="username">Username *</label>
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
          <label htmlFor="contactInfo.email">Email *</label>
          <input
            type="email"
            id="contactInfo.email"
            name="contactInfo.email"
            value={formData.contactInfo.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contactInfo.phone">Phone</label>
          <input
            type="tel"
            id="contactInfo.phone"
            name="contactInfo.phone"
            value={formData.contactInfo.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="userType">User Type</label>
          <select
            id="userType"
            name="userType"
            value={user?.userType || ""}
            onChange={handleChange}
            disabled
          >
            <option value="">Select...</option>
            <option value="canastera">Canastera</option>
            <option value="vendedor_ambulante">Street Vendor</option>
            <option value="cliente">Client</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label htmlFor="vendorProfile.hometown">Hometown</label>
          <input
            type="text"
            id="vendorProfile.hometown"
            name="vendorProfile.hometown"
            value={formData.vendorProfile.hometown}
            onChange={handleChange}
            placeholder="Your town or city of origin"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="vendorProfile.story">My Story</label>
          <textarea
            id="vendorProfile.story"
            name="vendorProfile.story"
            value={formData.vendorProfile.story}
            onChange={handleChange}
            placeholder="Tell us your story, how you started, what you're passionate about..."
            rows="4"
          />
        </div>

        <button 
          type="submit" 
          className="btn-guardar"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default MiPerfil;