// backend/src/server.js - VERSIÓN CORREGIDA
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configuración CORS MEJORADA
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://falsifiable-stephany-blackly.ngrok-free.dev',
    /\.ngrok-free\.dev$/
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('uploads'));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/la-canastera', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('✅ Conectado a MongoDB');
});

// Importar rutas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    status: '✅ Servidor funcionando', 
    project: 'La Canastera',
    timestamp: new Date().toISOString(),
    client: req.headers.origin || 'Origen no especificado'
  });
});

// ✅ CORRECCIÓN: Manejar rutas no encontradas - FORMA CORRECTA
// Opción 1: Usar app.all para capturar todas las rutas no definidas
app.all('*', (req, res) => {
  res.status(404).json({ 
    message: 'Ruta no encontrada',
    path: req.originalUrl,
    method: req.method,
    availableRoutes: ['/api/health', '/api/auth', '/api/users']
  });
});

// Opción 2: O usar un middleware sin patrón (más simple)
// app.use((req, res) => {
//   res.status(404).json({ 
//     message: 'Ruta no encontrada',
//     path: req.originalUrl,
//     method: req.method
//   });
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📱 Listo para conexiones desde ngrok`);
});