const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * POST /api/auth/login
 * Iniciar sesión con email y contraseña
 */
router.post('/login', [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], async (req, res) => {
  try {
    // Validar datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Datos inválidos',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      });
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      return res.status(401).json({ 
        error: 'Cuenta desactivada',
        message: 'Tu cuenta ha sido desactivada. Contacta al administrador.'
      });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Enviar respuesta sin la contraseña
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Inicio de sesión exitoso',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: 'Error durante el inicio de sesión'
    });
  }
});

/**
 * POST /api/auth/register
 * Registrar nuevo usuario (solo administradores pueden crear usuarios)
 */
router.post('/register', [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('firstName').notEmpty().withMessage('El nombre es requerido'),
  body('lastName').notEmpty().withMessage('El apellido es requerido'),
  body('role').isIn(['ADMIN', 'OPERATOR']).withMessage('Rol inválido')
], async (req, res) => {
  try {
    // Validar datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Datos inválidos',
        details: errors.array()
      });
    }

    const { email, password, firstName, lastName, role } = req.body;

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: 'Email ya registrado',
        message: 'Ya existe un usuario con este email'
      });
    }

    // Encriptar contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear nuevo usuario
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        role: role || 'OPERATOR'
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: newUser
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: 'Error durante el registro del usuario'
    });
  }
});

/**
 * GET /api/auth/me
 * Obtener información del usuario actual
 */
router.get('/me', async (req, res) => {
  try {
    // El middleware de autenticación ya verificó el token
    // y agregó req.user con la información del usuario
    res.json({
      user: req.user
    });

  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: 'Error obteniendo información del usuario'
    });
  }
});

/**
 * POST /api/auth/logout
 * Cerrar sesión (en el frontend se elimina el token)
 */
router.post('/logout', (req, res) => {
  res.json({
    message: 'Sesión cerrada exitosamente'
  });
});

module.exports = router; 