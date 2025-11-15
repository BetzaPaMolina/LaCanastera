// backend/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    enum: ['unit', 'weight'],
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['vegetables', 'fruits', 'grains', 'dairy', 'meat', 'other']
  },
  image: {
    type: String,
    default: ""
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Datos IoT (para el futuro)
  temperature: {
    type: Number,
    default: null
  },
  humidity: {
    type: Number,
    default: null
  },
  currentWeight: {
    type: Number,
    default: null
  }
}, {
  timestamps: true // Esto crea automáticamente createdAt y updatedAt
});

module.exports = mongoose.model('Product', productSchema);