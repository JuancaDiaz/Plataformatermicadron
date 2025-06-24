const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requireOperator } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/flights - Obtener todos los vuelos
router.get('/', requireOperator, async (req, res) => {
  try {
    const flights = await prisma.flight.findMany({
      include: {
        field: {
          include: { client: true }
        },
        operator: {
          select: { firstName: true, lastName: true, email: true }
        },
        evidence: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { startTime: 'desc' }
    });

    res.json({ flights, count: flights.length });
  } catch (error) {
    console.error('Error obteniendo vuelos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/flights - Crear nuevo vuelo (check-in)
router.post('/', requireOperator, async (req, res) => {
  try {
    const { fieldId, weather, notes } = req.body;
    
    const flight = await prisma.flight.create({
      data: {
        startTime: new Date(),
        fieldId,
        operatorId: req.user.id,
        weather,
        notes,
        status: 'ACTIVE'
      },
      include: {
        field: {
          include: { client: true }
        },
        operator: {
          select: { firstName: true, lastName: true, email: true }
        }
      }
    });

    res.status(201).json({ 
      message: 'Vuelo iniciado exitosamente (check-in)', 
      flight 
    });
  } catch (error) {
    console.error('Error creando vuelo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/flights/:id/end - Finalizar vuelo (check-out)
router.put('/:id/end', requireOperator, async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    
    const flight = await prisma.flight.update({
      where: { id },
      data: {
        endTime: new Date(),
        status: 'COMPLETED',
        notes: notes || undefined
      },
      include: {
        field: {
          include: { client: true }
        },
        operator: {
          select: { firstName: true, lastName: true, email: true }
        },
        evidence: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    res.json({ 
      message: 'Vuelo finalizado exitosamente (check-out)', 
      flight 
    });
  } catch (error) {
    console.error('Error finalizando vuelo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/flights/:id - Obtener vuelo específico
router.get('/:id', requireOperator, async (req, res) => {
  try {
    const { id } = req.params;
    
    const flight = await prisma.flight.findUnique({
      where: { id },
      include: {
        field: {
          include: { client: true }
        },
        operator: {
          select: { firstName: true, lastName: true, email: true }
        },
        evidence: {
          orderBy: { createdAt: 'desc' },
          include: {
            reportedBy: {
              select: { firstName: true, lastName: true }
            }
          }
        }
      }
    });

    if (!flight) {
      return res.status(404).json({ error: 'Vuelo no encontrado' });
    }

    res.json({ flight });
  } catch (error) {
    console.error('Error obteniendo vuelo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/flights/:id - Actualizar vuelo
router.put('/:id', requireOperator, async (req, res) => {
  try {
    const { id } = req.params;
    const { weather, notes, status } = req.body;
    
    const flight = await prisma.flight.update({
      where: { id },
      data: { weather, notes, status },
      include: {
        field: {
          include: { client: true }
        },
        operator: {
          select: { firstName: true, lastName: true, email: true }
        }
      }
    });

    res.json({ message: 'Vuelo actualizado exitosamente', flight });
  } catch (error) {
    console.error('Error actualizando vuelo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/flights/active - Obtener vuelos activos
router.get('/active/current', requireOperator, async (req, res) => {
  try {
    const activeFlights = await prisma.flight.findMany({
      where: { 
        status: 'ACTIVE',
        operatorId: req.user.id
      },
      include: {
        field: {
          include: { client: true }
        },
        evidence: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { startTime: 'desc' }
    });

    res.json({ 
      activeFlights, 
      count: activeFlights.length 
    });
  } catch (error) {
    console.error('Error obteniendo vuelos activos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router; 