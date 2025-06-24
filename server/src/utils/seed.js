const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  try {
    // Crear usuario administrador
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@termicadrones.cl' },
      update: {},
      create: {
        email: 'admin@termicadrones.cl',
        password: adminPassword,
        firstName: 'Administrador',
        lastName: 'Sistema',
        role: 'ADMIN'
      }
    });

    // Crear usuario operador
    const operatorPassword = await bcrypt.hash('operador123', 12);
    const operator = await prisma.user.upsert({
      where: { email: 'operador@termicadrones.cl' },
      update: {},
      create: {
        email: 'operador@termicadrones.cl',
        password: operatorPassword,
        firstName: 'Juan',
        lastName: 'Pérez',
        role: 'OPERATOR'
      }
    });

    // Crear cliente de ejemplo
    const client = await prisma.client.upsert({
      where: { email: 'cliente@agricola.cl' },
      update: {},
      create: {
        name: 'Agricola del Valle SPA',
        email: 'cliente@agricola.cl',
        phone: '+56 9 1234 5678',
        address: 'Camino Rural 123, Valle del Maipo',
        company: 'Agricola del Valle SPA',
        managerId: admin.id
      }
    });

    // Crear campo de ejemplo
    const field = await prisma.field.upsert({
      where: { 
        name_clientId: {
          name: 'Campo Principal',
          clientId: client.id
        }
      },
      update: {},
      create: {
        name: 'Campo Principal',
        location: 'Valle del Maipo, Región Metropolitana',
        hectares: 150.5,
        description: 'Campo principal de cultivo de uvas para vino',
        coordinates: '-33.4489,-70.6693',
        clientId: client.id,
        managerId: admin.id
      }
    });

    // Crear vuelo de ejemplo
    const flight = await prisma.flight.create({
      data: {
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
        endTime: new Date(Date.now() - 1 * 60 * 60 * 1000),   // 1 hora atrás
        status: 'COMPLETED',
        weather: 'Despejado, sin viento',
        notes: 'Patrullaje nocturno rutinario. Sin incidentes detectados.',
        fieldId: field.id,
        operatorId: operator.id
      }
    });

    // Crear evidencia de ejemplo
    const evidence = await prisma.evidence.create({
      data: {
        type: 'TEXT',
        title: 'Reporte de patrullaje nocturno',
        description: 'Observaciones generales del vuelo',
        textContent: 'Durante el patrullaje se verificó la integridad del perímetro. No se detectaron intrusiones ni anomalías térmicas. Todas las instalaciones se encuentran en buen estado.',
        priority: 'LOW',
        flightId: flight.id,
        reportedById: operator.id
      }
    });

    console.log('✅ Seed completado exitosamente!');
    console.log('📊 Datos creados:');
    console.log(`   - Usuario Admin: ${admin.email} (admin123)`);
    console.log(`   - Usuario Operador: ${operator.email} (operador123)`);
    console.log(`   - Cliente: ${client.name}`);
    console.log(`   - Campo: ${field.name}`);
    console.log(`   - Vuelo: ${flight.id}`);
    console.log(`   - Evidencia: ${evidence.id}`);

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
 