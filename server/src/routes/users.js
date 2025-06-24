const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/users
 * Obtener lista de usuarios (solo administradores)
 */
router.get('/', requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      users,
      count: users.length
    });

  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: 'Error obteniendo lista de usuarios'
    });
  }
});

/**
 * GET /api/users/:id
 * Obtener usuario específico
 */
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado',
        message: 'El usuario especificado no existe'
      });
    }

    res.json({ user });

  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: 'Error obteniendo información del usuario'
    });
  }
});

/**
 * PUT /api/users/:id
 * Actualizar usuario
 */
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, role, isActive } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        role,
        isActive
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      message: 'Usuario actualizado exitosamente',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: 'Error actualizando usuario'
    });
  }
});

/**
 * DELETE /api/users/:id
 * Desactivar usuario (soft delete)
 */
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // No permitir desactivar el propio usuario
    if (id === req.user.id) {
      return res.status(400).json({ 
        error: 'Operación no permitida',
        message: 'No puedes desactivar tu propia cuenta'
      });
    }

    await prisma.user.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({
      message: 'Usuario desactivado exitosamente'
    });

  } catch (error) {
    console.error('Error desactivando usuario:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: 'Error desactivando usuario'
    });
  }
});

module.exports = router; 