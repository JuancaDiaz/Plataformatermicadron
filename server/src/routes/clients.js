const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/clients - Obtener todos los clientes
router.get('/', requireAdmin, async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      include: {
        fields: true,
        managedBy: {
          select: { firstName: true, lastName: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ clients, count: clients.length });
  } catch (error) {
    console.error('Error obteniendo clientes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/clients - Crear nuevo cliente
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, email, phone, address, company } = req.body;
    
    const client = await prisma.client.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone,
        address,
        company,
        managerId: req.user.id
      }
    });

    res.status(201).json({ message: 'Cliente creado exitosamente', client });
  } catch (error) {
    console.error('Error creando cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/clients/:id - Obtener cliente específico
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        fields: true,
        managedBy: {
          select: { firstName: true, lastName: true, email: true }
        }
      }
    });

    if (!client) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json({ client });
  } catch (error) {
    console.error('Error obteniendo cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/clients/:id - Actualizar cliente
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, company } = req.body;
    
    const client = await prisma.client.update({
      where: { id },
      data: { name, email: email.toLowerCase(), phone, address, company }
    });

    res.json({ message: 'Cliente actualizado exitosamente', client });
  } catch (error) {
    console.error('Error actualizando cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/clients/:id - Desactivar cliente
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.client.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({ message: 'Cliente desactivado exitosamente' });
  } catch (error) {
    console.error('Error desactivando cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router; 