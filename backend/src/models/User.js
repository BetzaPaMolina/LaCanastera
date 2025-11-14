// backend/src/models/User.js - VERSIÓN COMPLETA
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    sparse: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  userType: {
    type: String,
    enum: ['admin', 'canastera', 'vendedor_ambulante', 'cliente'],
    required: true
  },
  profilePhoto: {
    type: String,
    default: ''
  },
  phone: {
    type: String
  },
  location: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Campos específicos para vendedores
  vendorInfo: {
    vendorType: {
      type: String,
      enum: ['canastera', 'ambulante']
    },
    age: { type: Number },
    birthDate: { type: Date },
    story: { type: String, maxlength: 500 },
    hometown: { type: String },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalSales: { type: Number, default: 0 },
    badges: [{ type: String }],
    iotDeviceId: { type: String }
  }
}, {
  timestamps: true
});

// Hash password antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);