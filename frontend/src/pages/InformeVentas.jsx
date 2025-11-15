// frontend/src/pages/InformeVentas.jsx - COMPLETO
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './InformeVentas.css';

const InformeVentas = () => {
  const { user } = useAuth();
  const [sales, setSales] = useState([]);
  const [filter, setFilter] = useState('all'); // all, today, week, month

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = () => {
    const saved = localStorage.getItem(`sales_${user.id}`);
    if (saved) {
      setSales(JSON.parse(saved));
    }
  };

  // Filtrar ventas por período
  const getFilteredSales = () => {
    const now = new Date();
    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      if (filter === 'today') {
        return saleDate.toDateString() === now.toDateString();
      } else if (filter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return saleDate >= weekAgo;
      } else if (filter === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return saleDate >= monthAgo;
      }
      return true;
    });
  };

  const filteredSales = getFilteredSales();

  // Calcular estadísticas
  const stats = {
    total: filteredSales.reduce((sum, sale) => sum + sale.total, 0),
    count: filteredSales.length,
    average: filteredSales.length > 0 
      ? filteredSales.reduce((sum, sale) => sum + sale.total, 0) / filteredSales.length 
      : 0,
    topProduct: getTopProduct(filteredSales)
  };

  return (
    <div className="sales-container">
      <div className="sales-header">
        <h1>💰 Informe de Ventas</h1>
        <p>Resumen de tus transacciones</p>
      </div>

      {/* Filtros */}
      <div className="filter-tabs">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          📊 Todas
        </button>
        <button 
          className={filter === 'today' ? 'active' : ''}
          onClick={() => setFilter('today')}
        >
          📅 Hoy
        </button>
        <button 
          className={filter === 'week' ? 'active' : ''}
          onClick={() => setFilter('week')}
        >
          📆 Esta Semana
        </button>
        <button 
          className={filter === 'month' ? 'active' : ''}
          onClick={() => setFilter('month')}
        >
          📈 Este Mes
        </button>
      </div>

      {/* Estadísticas */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">💵</div>
          <div className="stat-info">
            <p className="stat-label">Total Vendido</p>
            <p className="stat-value">Q {stats.total.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="stat-card count">
          <div className="stat-icon">🛒</div>
          <div className="stat-info">
            <p className="stat-label">Ventas Realizadas</p>
            <p className="stat-value">{stats.count}</p>
          </div>
        </div>
        
        <div className="stat-card average">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <p className="stat-label">Promedio por Venta</p>
            <p className="stat-value">Q {stats.average.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="stat-card top">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <p className="stat-label">Producto Más Vendido</p>
            <p className="stat-value">{stats.topProduct || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Lista de ventas */}
      {filteredSales.length === 0 ? (
        <div className="no-sales">
          <h3>📭 No hay ventas registradas</h3>
          <p>Las ventas que realices aparecerán aquí</p>
        </div>
      ) : (
        <div className="sales-list">
          <h3>📝 Historial de Ventas</h3>
          {filteredSales.map(sale => (
            <div key={sale.id} className="sale-item">
              <div className="sale-date">
                📅 {new Date(sale.date).toLocaleDateString('es-GT', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <div className="sale-products">
                {sale.items.map((item, idx) => (
                  <div key={idx} className="sale-product">
                    <span className="product-name">{item.name}</span>
                    <span className="product-quantity">
                      {item.quantity} {item.type === 'weight' ? 'kg' : 'unid'}
                    </span>
                    <span className="product-price">Q {item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="sale-total">
                <strong>Total: Q {sale.total.toFixed(2)}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper para obtener el producto más vendido
const getTopProduct = (sales) => {
  const productCounts = {};
  sales.forEach(sale => {
    sale.items.forEach(item => {
      productCounts[item.name] = (productCounts[item.name] || 0) + item.quantity;
    });
  });
  
  let topProduct = null;
  let maxCount = 0;
  Object.entries(productCounts).forEach(([name, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topProduct = name;
    }
  });
  
  return topProduct;
};

export default InformeVentas;