// backend/src/routes/authRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// REGISTRO
router.post('/register', async (req, res) => {
  try {
    const { username, password, userType, email, phone } = req.body;

    // Verificar si usuario existe
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Usuario o email ya existen' 
      });
    }

    // Crear usuario
    const user = new User({
      username,
      password,
      userType,
      email: email || '',
      phone: phone || ''
    });

    await user.save();

    // Generar token
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        userType: user.userType,
        profilePhoto: user.profilePhoto
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error del servidor',
      error: error.message 
    });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Verificar password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Generar token
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        userType: user.userType,
        profilePhoto: user.profilePhoto
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error del servidor',
      error: error.message 
    });
  }
});

// VERIFICAR TOKEN
router.get('/verify', auth, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      userType: req.user.userType,
      profilePhoto: req.user.profilePhoto
    }
  });
});

module.exports = router;