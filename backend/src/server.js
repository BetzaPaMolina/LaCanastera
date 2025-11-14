// backend/src/server.js - VERSIÓN DEFINITIVA SIN ERRORES
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ==================== CONFIGURACIÓN INICIAL ====================

// CORS simple para desarrollo
app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());

// Conexión a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/la-canastera')
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error MongoDB:', err));

// ==================== RUTAS DE LA API ====================

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    status: '✅ BACKEND FUNCIONANDO', 
    project: 'La Canastera',
    timestamp: new Date().toISOString()
  });
});

// Ruta de registro - SOLO username, password, userType
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('📝 Registro recibido:', req.body);
    
    const User = require('./models/User');
    const jwt = require('jsonwebtoken');
    const { username, password, userType } = req.body;
    
    // Validación básica
    if (!username || !password || !userType) {
      return res.status(400).json({ 
        success: false, 
        message: 'Usuario, contraseña y tipo son requeridos' 
      });
    }

    if (username.length < 3) {
      return res.status(400).json({ 
        success: false, 
        message: 'El usuario debe tener al menos 3 caracteres' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    // Verificar si usuario existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Este usuario ya está registrado' 
      });
    }

    // Crear usuario
    const user = new User({ 
      username, 
      password, 
      userType 
    });

    await user.save();

    // Generar token
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: `¡Bienvenido a La Canastera! Cuenta de ${userType} creada exitosamente`,
      token,
      user: {
        id: user._id,
        username: user.username,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error('❌ Error en registro:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error del servidor: ' + error.message 
    });
  }
});

// Ruta de login
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('🔐 Login recibido:', req.body);
    
    const User = require('./models/User');
    const jwt = require('jsonwebtoken');
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Usuario y contraseña requeridos' 
      });
    }

    // Buscar usuario
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }

    // Generar token
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        username: user.username,
        userType: user.userType,
        profilePhoto: user.profilePhoto
      }
    });
  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error del servidor: ' + error.message 
    });
  }
});

// Ruta para obtener vendedores
app.get('/api/users/vendedores', async (req, res) => {
  try {
    const User = require('./models/User');
    
    const vendedores = await User.find({
      userType: { $in: ['canastera', 'vendedor_ambulante'] }
    }).select('username userType profilePhoto vendorProfile');
    
    res.json(vendedores);
  } catch (error) {
    console.error('❌ Error obteniendo vendedores:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error obteniendo vendedores' 
    });
  }
});

// ==================== MANEJO DE RUTAS NO ENCONTRADAS ====================

// ✅ SOLUCIÓN: Middleware simple sin patrón problemático
app.use((req, res, next) => {
  if (!req.route) {
    return res.status(404).json({ 
      success: false,
      message: 'Ruta no encontrada: ' + req.originalUrl,
      availableRoutes: [
        'GET /api/health',
        'POST /api/auth/register', 
        'POST /api/auth/login',
        'GET /api/users/vendedores'
      ]
    });
  }
  next();
});

// ==================== INICIAR SERVIDOR ====================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 LA CANASTERA - BACKEND FUNCIONANDO');
  console.log('='.repeat(50));
  console.log(`📍 Puerto: ${PORT}`);
  console.log(`🌐 Health: http://localhost:${PORT}/api/health`);
  console.log(`👤 Registro: POST http://localhost:${PORT}/api/auth/register`);
  console.log(`🔐 Login: POST http://localhost:${PORT}/api/auth/login`);
  console.log(`🗺️  Frontend: http://localhost:5173`);
  console.log('='.repeat(50));
  console.log('💡 Backend listo para recibir peticiones');
  console.log('='.repeat(50));
});