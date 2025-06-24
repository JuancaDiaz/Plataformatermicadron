const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/fields - Obtener todos los campos
router.get('/', requireAdmin, async (req, res) => {
  try {
    const fields = await prisma.field.findMany({
      include: {
        client: true,
        flights: {
          orderBy: { startTime: 'desc' },
          take: 5 // Últimos 5 vuelos
        },
        managedBy: {
          select: { firstName: true, lastName: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ fields, count: fields.length });
  } catch (error) {
    console.error('Error obteniendo campos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/fields - Crear nuevo campo
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, location, hectares, description, coordinates, clientId } = req.body;
    
    const field = await prisma.field.create({
      data: {
        name,
        location,
        hectares: parseFloat(hectares),
        description,
        coordinates,
        clientId,
        managerId: req.user.id
      },
      include: {
        client: true
      }
    });

    res.status(201).json({ message: 'Campo creado exitosamente', field });
  } catch (error) {
    console.error('Error creando campo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/fields/:id - Obtener campo específico
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const field = await prisma.field.findUnique({
      where: { id },
      include: {
        client: true,
        flights: {
          orderBy: { startTime: 'desc' },
          include: {
            operator: {
              select: { firstName: true, lastName: true }
            },
            evidence: {
              orderBy: { createdAt: 'desc' }
            }
          }
        },
        managedBy: {
          select: { firstName: true, lastName: true, email: true }
        }
      }
    });

    if (!field) {
      return res.status(404).json({ error: 'Campo no encontrado' });
    }

    res.json({ field });
  } catch (error) {
    console.error('Error obteniendo campo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/fields/:id - Actualizar campo
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, hectares, description, coordinates } = req.body;
    
    const field = await prisma.field.update({
      where: { id },
      data: {
        name,
        location,
        hectares: parseFloat(hectares),
        description,
        coordinates
      },
      include: {
        client: true
      }
    });

    res.json({ message: 'Campo actualizado exitosamente', field });
  } catch (error) {
    console.error('Error actualizando campo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/fields/:id - Desactivar campo
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.field.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({ message: 'Campo desactivado exitosamente' });
  } catch (error) {
    console.error('Error desactivando campo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router; 