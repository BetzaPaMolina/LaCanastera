import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./MisProductos.css";

const MisProductos = () => {
  const { user } = useAuth();
  const [view, setView] = useState("list");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Product Management</h1>
        <p>Manage your inventory easily</p>
        
        <div className="view-controls">
          <button 
            className={`btn-view ${view === "list" ? "active" : ""}`}
            onClick={() => setView("list")}
          >
            View List
          </button>
          <button 
            className={`btn-view ${view === "add" ? "active" : ""}`}
            onClick={() => setView("add")}
          >
            Add Product
          </button>
        </div>
      </div>

      {view === "list" ? (
        <ProductList 
          products={products} 
          loading={loading}
        />
      ) : (
        <ProductForm />
      )}
    </div>
  );
};

const ProductList = ({ products, loading }) => {
  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="product-list">
      {products.length === 0 ? (
        <div className="no-products">
          <h3>You don't have any products registered</h3>
          <p>Start by adding your first product to sell</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <div className="product-info">
        <h4>{product.name}</h4>
        <p className="price">Q{product.price}</p>
        <p className="quantity">{product.stock} available</p>
        <p className="category">{product.category}</p>
      </div>
      <div className="product-actions">
        <button className="btn-edit">Edit</button>
        <button className="btn-delete">Delete</button>
        <button className={`btn-status ${product.isActive ? "active" : "inactive"}`}>
          {product.isActive ? "Deactivate" : "Activate"}
        </button>
      </div>
    </div>
  );
};

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    type: "unit", // "unit" or "weight"
    price: "",
    stock: "",
    category: "",
    description: ""
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Logic to save product
    console.log("Saving product:", formData);
  };

  return (
    <div className="product-form">
      <h2>Add New Product</h2>
      <p>Complete the product information</p>
      
      <form onSubmit={handleSubmit}>
        {/* Product Image */}
        <div className="form-section">
          <label>Product Image</label>
          <div className="image-upload">
            <img 
              src={imagePreview || "/default-product.png"} 
              alt="Preview" 
              className="image-preview"
            />
            <input
              type="file"
              id="productImage"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            <button 
              type="button"
              onClick={() => document.getElementById('productImage').click()}
            >
              Choose Image
            </button>
          </div>
        </div>

        {/* Product Name */}
        <div className="form-group">
          <label htmlFor="name">Product Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Product Type */}
        <div className="form-group">
          <label htmlFor="type">Product Type *</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="unit">By Unit</option>
            <option value="weight">By Weight</option>
          </select>
        </div>

        {/* Category */}
        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="vegetables">Vegetables</option>
            <option value="fruits">Fruits</option>
            <option value="grains">Grains</option>
            <option value="dairy">Dairy</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Price */}
        <div className="form-group">
          <label htmlFor="price">Price (Q) *</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </div>

        {/* Stock/Quantity */}
        <div className="form-group">
          <label htmlFor="stock">
            {formData.type === "weight" ? "Weight (kg)" : "Quantity"} *
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            step={formData.type === "weight" ? "0.1" : "1"}
            min="0"
            required
          />
        </div>

        {/* Description */}
        <div className="form-group full-width">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Product description, quality, origin..."
            rows="3"
          />
        </div>

        <button type="submit" className="btn-save">
          Save Product
        </button>
      </form>
    </div>
  );
};

export default MisProductos;