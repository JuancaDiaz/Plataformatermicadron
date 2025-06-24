const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requireOperator } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/evidence - Obtener toda la evidencia
router.get('/', requireOperator, async (req, res) => {
  try {
    const evidence = await prisma.evidence.findMany({
      include: {
        flight: {
          include: {
            field: {
              include: { client: true }
            },
            operator: {
              select: { firstName: true, lastName: true }
            }
          }
        },
        reportedBy: {
          select: { firstName: true, lastName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ evidence, count: evidence.length });
  } catch (error) {
    console.error('Error obteniendo evidencia:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/evidence - Crear nueva evidencia
router.post('/', requireOperator, async (req, res) => {
  try {
    const { flightId, type, title, description, fileUrl, textContent, priority } = req.body;
    
    const evidence = await prisma.evidence.create({
      data: {
        flightId,
        type,
        title,
        description,
        fileUrl,
        textContent,
        priority: priority || 'MEDIUM',
        reportedById: req.user.id
      },
      include: {
        flight: {
          include: {
            field: {
              include: { client: true }
            }
          }
        },
        reportedBy: {
          select: { firstName: true, lastName: true }
        }
      }
    });

    res.status(201).json({ 
      message: 'Evidencia registrada exitosamente', 
      evidence 
    });
  } catch (error) {
    console.error('Error creando evidencia:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/evidence/:id - Obtener evidencia específica
router.get('/:id', requireOperator, async (req, res) => {
  try {
    const { id } = req.params;
    
    const evidence = await prisma.evidence.findUnique({
      where: { id },
      include: {
        flight: {
          include: {
            field: {
              include: { client: true }
            },
            operator: {
              select: { firstName: true, lastName: true }
            }
          }
        },
        reportedBy: {
          select: { firstName: true, lastName: true }
        }
      }
    });

    if (!evidence) {
      return res.status(404).json({ error: 'Evidencia no encontrada' });
    }

    res.json({ evidence });
  } catch (error) {
    console.error('Error obteniendo evidencia:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/evidence/:id - Actualizar evidencia
router.put('/:id', requireOperator, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority } = req.body;
    
    const evidence = await prisma.evidence.update({
      where: { id },
      data: { title, description, priority },
      include: {
        flight: {
          include: {
            field: {
              include: { client: true }
            }
          }
        },
        reportedBy: {
          select: { firstName: true, lastName: true }
        }
      }
    });

    res.json({ message: 'Evidencia actualizada exitosamente', evidence });
  } catch (error) {
    console.error('Error actualizando evidencia:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/evidence/:id - Eliminar evidencia
router.delete('/:id', requireOperator, async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.evidence.delete({
      where: { id }
    });

    res.json({ message: 'Evidencia eliminada exitosamente' });
  } catch (error) {
    console.error('Error eliminando evidencia:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/evidence/flight/:flightId - Obtener evidencia por vuelo
router.get('/flight/:flightId', requireOperator, async (req, res) => {
  try {
    const { flightId } = req.params;
    
    const evidence = await prisma.evidence.findMany({
      where: { flightId },
      include: {
        reportedBy: {
          select: { firstName: true, lastName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ evidence, count: evidence.length });
  } catch (error) {
    console.error('Error obteniendo evidencia del vuelo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/evidence/priority/:priority - Obtener evidencia por prioridad
router.get('/priority/:priority', requireOperator, async (req, res) => {
  try {
    const { priority } = req.params;
    
    const evidence = await prisma.evidence.findMany({
      where: { priority },
      include: {
        flight: {
          include: {
            field: {
              include: { client: true }
            }
          }
        },
        reportedBy: {
          select: { firstName: true, lastName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ evidence, count: evidence.length });
  } catch (error) {
    console.error('Error obteniendo evidencia por prioridad:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router; 