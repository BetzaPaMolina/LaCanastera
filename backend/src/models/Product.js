// backend/src/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  priceType: {
    type: String,
    enum: ['unit', 'weight', 'dozen'],
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    enum: ['unidades', 'libras', 'docenas'],
    default: 'unidades'
  },
  photo: {
    type: String,
    required: true
  },
  // Datos de sensores IoT
  sensorData: {
    temperature: { type: Number },
    humidity: { type: Number },
    weight: { type: Number },
    lastUpdated: { type: Date }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    maxlength: 200
  }
}, {
  timestamps: true
});

// Índice para búsquedas rápidas
productSchema.index({ vendorId: 1, isActive: 1 });
productSchema.index({ name: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);