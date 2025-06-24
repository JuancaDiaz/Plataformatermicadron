const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const clientRoutes = require('./routes/clients');
const fieldRoutes = require('./routes/fields');
const flightRoutes = require('./routes/flights');
const evidenceRoutes = require('./routes/evidence');

// Importar middleware
const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: 'Demasiadas requests desde esta IP, intenta de nuevo más tarde.'
});

// Middleware de seguridad y optimización
app.use(helmet());
app.use(compression());
app.use(limiter);
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Middleware para parsing de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Térmica Drones API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/clients', authenticateToken, clientRoutes);
app.use('/api/fields', authenticateToken, fieldRoutes);
app.use('/api/flights', authenticateToken, flightRoutes);
app.use('/api/evidence', authenticateToken, evidenceRoutes);

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Algo salió mal en el servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor'
  });
});

// Ruta para manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    message: 'La ruta solicitada no existe en la API'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🛡️ Servidor Térmica Drones ejecutándose en puerto ${PORT}`);
  console.log(`📊 Health check disponible en: http://localhost:${PORT}/health`);
  console.log(`🌐 API disponible en: http://localhost:${PORT}/api`);
});

module.exports = app; 