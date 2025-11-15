// frontend/src/pages/AVender.jsx - COMPLETO
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AVender.css';

const AVender = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const saved = localStorage.getItem(`products_${user.id}`);
    if (saved) {
      const allProducts = JSON.parse(saved);
      // Solo productos activos con stock
      setProducts(allProducts.filter(p => p.isActive && p.stock > 0));
    }
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
          : item
      ));
    } else {
      setCart([...cart, {
        ...product,
        quantity: product.type === 'weight' ? 1 : 1
      }]);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    const product = products.find(p => p.id === productId);
    const maxQuantity = product.stock;
    
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else if (newQuantity <= maxQuantity) {
      setCart(cart.map(item => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const completeSale = () => {
    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    // Actualizar stock de productos
    const updatedProducts = products.map(product => {
      const cartItem = cart.find(item => item.id === product.id);
      if (cartItem) {
        return {
          ...product,
          stock: product.stock - cartItem.quantity
        };
      }
      return product;
    });

    // Guardar productos actualizados
    const allProducts = JSON.parse(localStorage.getItem(`products_${user.id}`) || '[]');
    const finalProducts = allProducts.map(p => {
      const updated = updatedProducts.find(up => up.id === p.id);
      return updated || p;
    });
    localStorage.setItem(`products_${user.id}`, JSON.stringify(finalProducts));

    // Guardar venta
    const sale = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        type: item.type,
        subtotal: item.price * item.quantity
      })),
      total: calculateTotal()
    };

    const sales = JSON.parse(localStorage.getItem(`sales_${user.id}`) || '[]');
    localStorage.setItem(`sales_${user.id}`, JSON.stringify([sale, ...sales]));

    // Limpiar carrito y mostrar éxito
    setCart([]);
    setShowSuccess(true);
    loadProducts(); // Recargar productos con stock actualizado

    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="vender-container">
      <div className="vender-header">
        <h1>🛒 Realizar Venta</h1>
        <p>Selecciona productos y completa la transacción</p>
      </div>

      {showSuccess && (
        <div className="success-message">
          ✅ ¡Venta registrada exitosamente! Q {calculateTotal().toFixed(2)}
        </div>
      )}

      <div className="vender-layout">
        {/* PRODUCTOS DISPONIBLES */}
        <div className="products-panel">
          <h3>📦 Productos Disponibles</h3>
          {products.length === 0 ? (
            <div className="no-products-sell">
              <p>No hay productos disponibles para vender</p>
              <p>Agrega productos en la sección "Mis Productos"</p>
            </div>
          ) : (
            <div className="products-list-sell">
              {products.map(product => (
                <div key={product.id} className="product-sell-item">
                  <div className="product-sell-info">
                    <h4>{product.name}</h4>
                    <p className="product-price">Q {parseFloat(product.price).toFixed(2)}</p>
                    <p className="product-stock">
                      Stock: {product.stock} {product.type === 'weight' ? 'kg' : 'unid'}
                    </p>
                  </div>
                  <button 
                    className="btn-add-product"
                    onClick={() => addToCart(product)}
                  >
                    ➕ Agregar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CARRITO DE VENTA */}
        <div className="cart-panel">
          <h3>🛍️ Carrito de Venta</h3>
          
          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>🛒 Carrito vacío</p>
              <p>Agrega productos para iniciar la venta</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <p>Q {parseFloat(item.price).toFixed(2)} c/u</p>
                    </div>
                    
                    <div className="cart-item-controls">
                      <button 
                        className="btn-quantity"
                        onClick={() => updateQuantity(item.id, item.quantity - (item.type === 'weight' ? 0.5 : 1))}
                      >
                        -
                      </button>
                      <input 
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseFloat(e.target.value))}
                        step={item.type === 'weight' ? 0.1 : 1}
                        min={item.type === 'weight' ? 0.1 : 1}
                        max={item.stock}
                      />
                      <button 
                        className="btn-quantity"
                        onClick={() => updateQuantity(item.id, item.quantity + (item.type === 'weight' ? 0.5 : 1))}
                      >
                        +
                      </button>
                      <span className="unit-label">
                        {item.type === 'weight' ? 'kg' : 'unid'}
                      </span>
                    </div>
                    
                    <div className="cart-item-total">
                      <p>Q {(item.price * item.quantity).toFixed(2)}</p>
                      <button 
                        className="btn-remove"
                        onClick={() => removeFromCart(item.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>Q {calculateTotal().toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <strong>TOTAL:</strong>
                  <strong>Q {calculateTotal().toFixed(2)}</strong>
                </div>
              </div>

              <div className="cart-actions">
                <button 
                  className="btn-clear-cart"
                  onClick={() => setCart([])}
                >
                  🗑️ Limpiar Carrito
                </button>
                <button 
                  className="btn-complete-sale"
                  onClick={completeSale}
                >
                  💰 Completar Venta
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AVender;