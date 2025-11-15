// frontend/src/pages/AComprar.jsx - COMPLETO
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import './AComprar.css';

const AComprar = () => {
  const { user } = useAuth();
  const [vendors, setVendors] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVendorsAndProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, allProducts]);

  const loadVendorsAndProducts = async () => {
    try {
      // Cargar todos los vendedores
      const response = await userAPI.getVendedores();
      const vendorsList = response.data || [];
      setVendors(vendorsList);

      // Cargar productos de todos los vendedores
      const productsWithVendor = [];
      vendorsList.forEach(vendor => {
        const vendorProducts = JSON.parse(localStorage.getItem(`products_${vendor._id || vendor.id}`) || '[]');
        vendorProducts
          .filter(p => p.isActive && p.stock > 0)
          .forEach(product => {
            productsWithVendor.push({
              ...product,
              vendor: {
                id: vendor._id || vendor.id,
                username: vendor.username,
                photo: vendor.profilePhoto,
                userType: vendor.userType,
                rating: vendor.vendorProfile?.rating || 0
              }
            });
          });
      });

      setAllProducts(productsWithVendor);
      setFilteredProducts(productsWithVendor);
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...allProducts];

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.vendor.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

  const addToCart = (product) => {
    const existing = cart.find(item => 
      item.id === product.id && item.vendor.id === product.vendor.id
    );

    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id && item.vendor.id === product.vendor.id
          ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: product.type === 'weight' ? 1 : 1 }]);
    }
  };

  const updateCartQuantity = (productId, vendorId, newQuantity) => {
    const product = allProducts.find(p => p.id === productId && p.vendor.id === vendorId);
    
    if (newQuantity <= 0) {
      removeFromCart(productId, vendorId);
    } else if (newQuantity <= product.stock) {
      setCart(cart.map(item => 
        item.id === productId && item.vendor.id === vendorId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const removeFromCart = (productId, vendorId) => {
    setCart(cart.filter(item => !(item.id === productId && item.vendor.id === vendorId)));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const completePurchase = () => {
    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    // Agrupar compras por vendedor
    const purchasesByVendor = {};
    cart.forEach(item => {
      if (!purchasesByVendor[item.vendor.id]) {
        purchasesByVendor[item.vendor.id] = [];
      }
      purchasesByVendor[item.vendor.id].push(item);
    });

    // Procesar venta para cada vendedor
    Object.entries(purchasesByVendor).forEach(([vendorId, items]) => {
      // Actualizar stock del vendedor
      const vendorProducts = JSON.parse(localStorage.getItem(`products_${vendorId}`) || '[]');
      const updatedVendorProducts = vendorProducts.map(product => {
        const cartItem = items.find(item => item.id === product.id);
        if (cartItem) {
          return {
            ...product,
            stock: product.stock - cartItem.quantity
          };
        }
        return product;
      });
      localStorage.setItem(`products_${vendorId}`, JSON.stringify(updatedVendorProducts));

      // Registrar venta para el vendedor
      const sale = {
        id: Date.now() + Math.random(),
        date: new Date().toISOString(),
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          type: item.type,
          subtotal: item.price * item.quantity
        })),
        total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        client: user.username
      };

      const vendorSales = JSON.parse(localStorage.getItem(`sales_${vendorId}`) || '[]');
      localStorage.setItem(`sales_${vendorId}`, JSON.stringify([sale, ...vendorSales]));
    });

    // Registrar compra del cliente
    const purchase = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        type: item.type,
        vendor: item.vendor.username,
        subtotal: item.price * item.quantity
      })),
      total: calculateTotal()
    };

    const clientPurchases = JSON.parse(localStorage.getItem(`purchases_${user.id}`) || '[]');
    localStorage.setItem(`purchases_${user.id}`, JSON.stringify([purchase, ...clientPurchases]));

    // Limpiar y mostrar éxito
    setCart([]);
    setShowCart(false);
    setShowSuccess(true);
    loadVendorsAndProducts(); // Recargar productos

    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (loading) {
    return <div className="loading">Cargando productos...</div>;
  }

  return (
    <div className="comprar-container">
      <div className="comprar-header">
        <h1>🛍️ ¡A Comprar!</h1>
        <p>Encuentra productos frescos de vendedores locales</p>
      </div>

      {showSuccess && (
        <div className="success-message">
          ✅ ¡Compra realizada con éxito! Total: Q {calculateTotal().toFixed(2)}
        </div>
      )}

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div className="search-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Buscar productos o vendedores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filters">
          <button 
            className={selectedCategory === 'all' ? 'active' : ''}
            onClick={() => setSelectedCategory('all')}
          >
            📦 Todos
          </button>
          <button 
            className={selectedCategory === 'vegetables' ? 'active' : ''}
            onClick={() => setSelectedCategory('vegetables')}
          >
            🥬 Verduras
          </button>
          <button 
            className={selectedCategory === 'fruits' ? 'active' : ''}
            onClick={() => setSelectedCategory('fruits')}
          >
            🍎 Frutas
          </button>
          <button 
            className={selectedCategory === 'grains' ? 'active' : ''}
            onClick={() => setSelectedCategory('grains')}
          >
            🌾 Granos
          </button>
          <button 
            className={selectedCategory === 'dairy' ? 'active' : ''}
            onClick={() => setSelectedCategory('dairy')}
          >
            🥛 Lácteos
          </button>
          <button 
            className={selectedCategory === 'other' ? 'active' : ''}
            onClick={() => setSelectedCategory('other')}
          >
            📦 Otros
          </button>
        </div>

        <button 
          className="cart-button"
          onClick={() => setShowCart(!showCart)}
        >
          🛒 Carrito ({cart.length}) - Q {calculateTotal().toFixed(2)}
        </button>
      </div>

      {/* PRODUCTOS */}
      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <h3>😢 No hay productos disponibles</h3>
          <p>Intenta con otra búsqueda o categoría</p>
        </div>
      ) : (
        <div className="products-grid-buy">
          {filteredProducts.map((product, idx) => (
            <ProductCard 
              key={`${product.vendor.id}-${product.id}-${idx}`}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      )}

      {/* CARRITO LATERAL */}
      {showCart && (
        <CartSidebar
          cart={cart}
          onUpdateQuantity={updateCartQuantity}
          onRemove={removeFromCart}
          onClose={() => setShowCart(false)}
          onCheckout={completePurchase}
          total={calculateTotal()}
        />
      )}
    </div>
  );
};

// ===== TARJETA DE PRODUCTO =====
const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="product-card-buy">
      <div className="product-image-buy">
        {product.imagePreview ? (
          <img src={product.imagePreview} alt={product.name} />
        ) : (
          <div className="no-image-buy">📦</div>
        )}
      </div>

      <div className="product-details-buy">
        <h4>{product.name}</h4>
        <p className="price-buy">Q {parseFloat(product.price).toFixed(2)}</p>
        <p className="stock-buy">
          📦 Disponible: {product.stock} {product.type === 'weight' ? 'kg' : 'unid'}
        </p>
        {product.description && (
          <p className="description-buy">{product.description}</p>
        )}
      </div>

      {/* VENDEDOR */}
      <div className="vendor-info">
        <div className="vendor-avatar">
          {product.vendor.photo ? (
            <img src={product.vendor.photo} alt={product.vendor.username} />
          ) : (
            <div className="avatar-placeholder">
              {product.vendor.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="vendor-details">
          <p className="vendor-name">{product.vendor.username}</p>
          <p className="vendor-type">
            {product.vendor.userType === 'canastera' ? '🧺 Canastera' : '🚶 Ambulante'}
          </p>
          {product.vendor.rating > 0 && (
            <p className="vendor-rating">⭐ {product.vendor.rating.toFixed(1)}</p>
          )}
        </div>
      </div>

      <button 
        className="btn-add-to-cart"
        onClick={() => onAddToCart(product)}
      >
        🛒 Agregar al Carrito
      </button>
    </div>
  );
};

// ===== CARRITO LATERAL =====
const CartSidebar = ({ cart, onUpdateQuantity, onRemove, onClose, onCheckout, total }) => {
  return (
    <>
      <div className="cart-overlay" onClick={onClose}></div>
      <div className="cart-sidebar">
        <div className="cart-header">
          <h3>🛒 Tu Carrito</h3>
          <button className="btn-close-cart" onClick={onClose}>✕</button>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart-sidebar">
            <p>🛒 Carrito vacío</p>
            <p>Agrega productos para comprar</p>
          </div>
        ) : (
          <>
            <div className="cart-items-sidebar">
              {cart.map((item, idx) => (
                <div key={`${item.vendor.id}-${item.id}-${idx}`} className="cart-item-sidebar">
                  <div className="cart-item-info-sidebar">
                    <h4>{item.name}</h4>
                    <p className="vendor-label">Vendedor: {item.vendor.username}</p>
                    <p className="price-label">Q {parseFloat(item.price).toFixed(2)} c/u</p>
                  </div>

                  <div className="cart-item-controls-sidebar">
                    <button onClick={() => onUpdateQuantity(item.id, item.vendor.id, item.quantity - (item.type === 'weight' ? 0.5 : 1))}>
                      -
                    </button>
                    <span>{item.quantity} {item.type === 'weight' ? 'kg' : 'unid'}</span>
                    <button onClick={() => onUpdateQuantity(item.id, item.vendor.id, item.quantity + (item.type === 'weight' ? 0.5 : 1))}>
                      +
                    </button>
                  </div>

                  <div className="cart-item-footer-sidebar">
                    <p className="subtotal">Q {(item.price * item.quantity).toFixed(2)}</p>
                    <button 
                      className="btn-remove-sidebar"
                      onClick={() => onRemove(item.id, item.vendor.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary-sidebar">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>Q {total.toFixed(2)}</span>
              </div>
              <div className="summary-row total-row">
                <strong>TOTAL:</strong>
                <strong>Q {total.toFixed(2)}</strong>
              </div>
            </div>

            <button className="btn-checkout" onClick={onCheckout}>
              💳 Finalizar Compra
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default AComprar;