// backend/src/models/User.js - CONFIRMAR QUE ESTÉ ASÍ
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
  contactInfo: {
    email: { type: String, default: '' },
    phone: { type: String, default: '' }
  },
  vendorProfile: {
    age: { type: Number },
    birthDate: { type: Date },
    story: { type: String, maxlength: 500, default: '' },
    hometown: { type: String, default: '' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalSales: { type: Number, default: 0 }
  },
  location: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

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

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);