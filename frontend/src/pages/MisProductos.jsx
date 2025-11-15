// frontend/src/pages/MisProductos.jsx - VERSIÓN COMPLETA
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./MisProductos.css";

const MisProductos = () => {
  const { user } = useAuth();
  const [view, setView] = useState("list");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Cargar productos del localStorage
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const saved = localStorage.getItem(`products_${user.id}`);
    if (saved) {
      setProducts(JSON.parse(saved));
    }
  };

  const saveProducts = (updatedProducts) => {
    localStorage.setItem(`products_${user.id}`, JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
  };

  const handleAddProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      isActive: true
    };
    saveProducts([...products, newProduct]);
    setView("list");
  };

  const handleUpdateProduct = (updatedProduct) => {
    const updated = products.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    );
    saveProducts(updated);
    setEditingProduct(null);
    setView("list");
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("¿Eliminar este producto?")) {
      saveProducts(products.filter(p => p.id !== id));
    }
  };

  const handleToggleActive = (id) => {
    const updated = products.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    );
    saveProducts(updated);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setView("edit");
  };

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>📦 Mis Productos</h1>
        <p>Gestiona tu inventario fácilmente</p>
        
        <div className="view-controls">
          <button 
            className={`btn-view ${view === "list" ? "active" : ""}`}
            onClick={() => {
              setView("list");
              setEditingProduct(null);
            }}
          >
            📋 Ver Lista
          </button>
          <button 
            className={`btn-view ${view === "add" ? "active" : ""}`}
            onClick={() => {
              setView("add");
              setEditingProduct(null);
            }}
          >
            ➕ Agregar Producto
          </button>
        </div>
      </div>

      {view === "list" ? (
        <ProductList 
          products={products}
          onEdit={handleEdit}
          onDelete={handleDeleteProduct}
          onToggleActive={handleToggleActive}
        />
      ) : view === "add" ? (
        <ProductForm 
          onSave={handleAddProduct}
          onCancel={() => setView("list")}
        />
      ) : (
        <ProductForm 
          product={editingProduct}
          onSave={handleUpdateProduct}
          onCancel={() => {
            setView("list");
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

// ===== LISTA DE PRODUCTOS =====
const ProductList = ({ products, onEdit, onDelete, onToggleActive }) => {
  if (products.length === 0) {
    return (
      <div className="no-products">
        <h3>📦 No tienes productos registrados</h3>
        <p>Comienza agregando tu primer producto para vender</p>
      </div>
    );
  }

  return (
    <div className="products-grid">
      {products.map(product => (
        <div key={product.id} className={`product-card ${!product.isActive ? 'inactive' : ''}`}>
          <div className="product-image">
            {product.imagePreview ? (
              <img src={product.imagePreview} alt={product.name} />
            ) : (
              <div className="no-image">📦</div>
            )}
            <div className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
              {product.isActive ? '✅ Activo' : '⏸️ Inactivo'}
            </div>
          </div>
          
          <div className="product-info">
            <h4>{product.name}</h4>
            <p className="price">Q {parseFloat(product.price).toFixed(2)}</p>
            <div className="product-details">
              <span className="stock">
                📦 Stock: {product.stock} {product.type === 'weight' ? 'kg' : 'unid.'}
              </span>
              <span className="category">🏷️ {getCategoryName(product.category)}</span>
            </div>
            {product.description && (
              <p className="description">{product.description}</p>
            )}
          </div>
          
          <div className="product-actions">
            <button 
              className="btn-edit"
              onClick={() => onEdit(product)}
            >
              ✏️ Editar
            </button>
            <button 
              className="btn-delete"
              onClick={() => onDelete(product.id)}
            >
              🗑️ Eliminar
            </button>
            <button 
              className={`btn-status ${product.isActive ? 'active' : 'inactive'}`}
              onClick={() => onToggleActive(product.id)}
            >
              {product.isActive ? '⏸️ Desactivar' : '▶️ Activar'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// ===== FORMULARIO DE PRODUCTO =====
const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    type: product?.type || "unit",
    price: product?.price || "",
    stock: product?.stock || "",
    category: product?.category || "",
    description: product?.description || ""
  });
  const [imagePreview, setImagePreview] = useState(product?.imagePreview || "");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...product,
      ...formData,
      imagePreview
    });
  };

  return (
    <div className="product-form">
      <h2>{product ? "✏️ Editar Producto" : "➕ Nuevo Producto"}</h2>
      <p>Completa la información del producto</p>
      
      <form onSubmit={handleSubmit}>
        {/* Imagen */}
        <div className="form-section">
          <label>Imagen del Producto</label>
          <div className="image-upload">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="image-preview" />
            ) : (
              <div className="image-placeholder">📦 Sin imagen</div>
            )}
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
              📸 Elegir Imagen
            </button>
          </div>
        </div>

        {/* Nombre */}
        <div className="form-group">
          <label htmlFor="name">Nombre del Producto *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ej: Tomate fresco"
            required
          />
        </div>

        {/* Tipo */}
        <div className="form-group">
          <label htmlFor="type">Tipo de Venta *</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="unit">🔢 Por Unidad</option>
            <option value="weight">⚖️ Por Peso (kg)</option>
          </select>
        </div>

        {/* Categoría */}
        <div className="form-group">
          <label htmlFor="category">Categoría *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar...</option>
            <option value="vegetables">🥬 Verduras</option>
            <option value="fruits">🍎 Frutas</option>
            <option value="grains">🌾 Granos</option>
            <option value="dairy">🥛 Lácteos</option>
            <option value="other">📦 Otros</option>
          </select>
        </div>

        {/* Precio */}
        <div className="form-group">
          <label htmlFor="price">Precio (Q) *</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            placeholder="0.00"
            required
          />
        </div>

        {/* Stock */}
        <div className="form-group">
          <label htmlFor="stock">
            {formData.type === "weight" ? "Peso Disponible (kg)" : "Cantidad Disponible"} *
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            step={formData.type === "weight" ? "0.1" : "1"}
            min="0"
            placeholder={formData.type === "weight" ? "0.0" : "0"}
            required
          />
        </div>

        {/* Descripción */}
        <div className="form-group full-width">
          <label htmlFor="description">Descripción (opcional)</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descripción del producto, calidad, origen..."
            rows="3"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onCancel}>
            ❌ Cancelar
          </button>
          <button type="submit" className="btn-save">
            💾 {product ? "Guardar Cambios" : "Agregar Producto"}
          </button>
        </div>
      </form>
    </div>
  );
};

// Helper
const getCategoryName = (category) => {
  const categories = {
    vegetables: "Verduras",
    fruits: "Frutas",
    grains: "Granos",
    dairy: "Lácteos",
    other: "Otros"
  };
  return categories[category] || category;
};

export default MisProductos;