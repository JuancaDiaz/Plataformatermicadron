const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Middleware para autenticar tokens JWT
 * Verifica que el token sea válido y que el usuario exista en la base de datos
 */
const authenticateToken = async (req, res, next) => {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Token de acceso requerido',
        message: 'Debes incluir un token de autenticación en el header Authorization'
      });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar que el usuario existe y está activo
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ 
        error: 'Usuario no válido',
        message: 'El usuario no existe o está inactivo'
      });
    }

    // Agregar información del usuario al request
    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Token inválido',
        message: 'El token de autenticación no es válido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expirado',
        message: 'El token de autenticación ha expirado'
      });
    }

    console.error('Error en autenticación:', error);
    return res.status(500).json({ 
      error: 'Error de autenticación',
      message: 'Error interno del servidor durante la autenticación'
    });
  }
};

/**
 * Middleware para verificar roles específicos
 * @param {string[]} allowedRoles - Array de roles permitidos
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'No autenticado',
        message: 'Debes estar autenticado para acceder a este recurso'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Acceso denegado',
        message: 'No tienes permisos para acceder a este recurso'
      });
    }

    next();
  };
};

/**
 * Middleware para verificar si el usuario es administrador
 */
const requireAdmin = requireRole(['ADMIN']);

/**
 * Middleware para verificar si el usuario es operador o administrador
 */
const requireOperator = requireRole(['ADMIN', 'OPERATOR']);

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireOperator
}; 