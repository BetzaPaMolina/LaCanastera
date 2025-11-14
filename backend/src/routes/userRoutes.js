// backend/src/routes/userRoutes.js
const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Obtener perfil del usuario actual
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener perfil', error: error.message });
  }
});

// Actualizar perfil de usuario
router.put('/profile', auth, async (req, res) => {
  try {
    const { email, phone, vendorInfo } = req.body;
    
    const updateData = {};
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (vendorInfo && (req.user.userType === 'canastera' || req.user.userType === 'vendedor_ambulante')) {
      updateData.vendorInfo = { ...req.user.vendorInfo, ...vendorInfo };
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar perfil', error: error.message });
  }
});

// Obtener todos los vendedores (para el mapa)
router.get('/vendedores', async (req, res) => {
  try {
    const vendedores = await User.find({
      userType: { $in: ['canastera', 'vendedor_ambulante'] },
      isActive: true
    }).select('username userType location vendorInfo profilePhoto');
    
    res.json(vendedores);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener vendedores', error: error.message });
  }
});

// Obtener usuario por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
  }
});

// Ruta de administrador para obtener todos los usuarios
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
});

module.exports = router;