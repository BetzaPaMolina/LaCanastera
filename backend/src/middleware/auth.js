// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    console.log('🔐 Verificando autenticación...');
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('❌ No hay token');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    console.log('✅ Token decodificado:', decoded);
    
    // Buscar usuario
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      console.log('❌ Usuario no encontrado');
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    console.log('✅ Usuario autenticado:', user.username);
    next();
  } catch (error) {
    console.error('❌ Error en auth middleware:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;