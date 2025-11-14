// frontend/src/pages/MisProductos.jsx
import React from 'react';

const MisProductos = () => {
  return (
    <div className="page-container">
      <h1>📦 Mis Productos</h1>
      <div className="page-content">
        <p>Aquí podrás gestionar tu inventario de productos.</p>
        <div className="coming-soon">
          <h3>🚧 En Desarrollo</h3>
          <p>Próximamente: CRUD de productos, categorías, precios y stock.</p>
        </div>
      </div>
    </div>
  );
};

export default MisProductos;