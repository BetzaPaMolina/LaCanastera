// backend/src/server.js - VERSIÓN CON HTTPS

const express = require('express');
const https = require('https');
const fs = require('fs');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS
app.use(cors({
  origin: 'https://localhost:5173', // ✅ Ahora usa HTTPS
  credentials: true
}));

app.use(express.json());

// Conexión a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/la-canastera')
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error MongoDB:', err));

// ==================== RUTAS ====================
const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

const auth = require('./middleware/auth');

// Rutas de autenticación
app.post('/api/auth/register', async (req, res) => {
  try {
    const User = require('./models/User');
    const jwt = require('jsonwebtoken');
    const { username, password, userType } = req.body;
    
    if (!username || !password || !userType) {
      return res.status(400).json({ 
        success: false, 
        message: 'Usuario, contraseña y tipo son requeridos' 
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Este usuario ya está registrado' 
      });
    }

    const user = new User({ username, password, userType });
    await user.save();

    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: `¡Bienvenido a La Canastera!`,
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

app.post('/api/auth/login', async (req, res) => {
  try {
    const User = require('./models/User');
    const jwt = require('jsonwebtoken');
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }

    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET,
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

// Rutas de usuarios
app.get('/api/users/profile', auth, async (req, res) => {
  try {
    const User = require('./models/User');
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error del servidor: ' + error.message 
    });
  }
});

app.put('/api/users/profile', auth, async (req, res) => {
  try {
    const User = require('./models/User');
    const updateData = {};

    if (req.body.username) updateData.username = req.body.username;
    
    if (req.body.email || req.body.phone) {
      updateData.contactInfo = {
        email: req.body.email || req.user.contactInfo?.email || '',
        phone: req.body.phone || req.user.contactInfo?.phone || ''
      };
    }

    if (req.body.age || req.body.birthDate || req.body.story || req.body.hometown) {
      updateData.vendorProfile = {
        age: req.body.age || req.user.vendorProfile?.age,
        birthDate: req.body.birthDate || req.user.vendorProfile?.birthDate,
        story: req.body.story || req.user.vendorProfile?.story || '',
        hometown: req.body.hometown || req.user.vendorProfile?.hometown || ''
      };
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error del servidor: ' + error.message 
    });
  }
});

app.get('/api/users/active', async (req, res) => {
  try {
    const User = require('./models/User');
    const activeUsers = await User.find({
      isActive: true
    }).select('username userType profilePhoto vendorProfile location');
    
    res.json(activeUsers);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error obteniendo usuarios activos' 
    });
  }
});

app.get('/api/users/vendedores', async (req, res) => {
  try {
    const User = require('./models/User');
    const vendedores = await User.find({
      userType: { $in: ['canastera', 'vendedor_ambulante'] }
    }).select('username userType profilePhoto vendorProfile');
    
    res.json(vendedores);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error obteniendo vendedores' 
    });
  }
});

// ==================== CONFIGURACIÓN HTTPS ====================

// 1. Opción con certificados autofirmados (desarrollo)
const httpsOptions = {
  key: fs.readFileSync('./cert/key.pem'),
  cert: fs.readFileSync('./cert/cert.pem')
};

// 2. Para producción, usa certificados reales (Let's Encrypt)
/*
const httpsOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/tudominio.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/tudominio.com/fullchain.pem')
};
*/

const PORT = process.env.PORT || 5000;

// Crear servidor HTTPS
https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 LA CANASTERA - BACKEND HTTPS FUNCIONANDO');
  console.log('='.repeat(50));
  console.log(`📍 Puerto: ${PORT}`);
  console.log(`🔒 HTTPS: https://localhost:${PORT}/api/health`);
  console.log('='.repeat(50));
});

// Opcional: Redirigir HTTP a HTTPS
const http = require('http');
http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
  res.end();
}).listen(80);