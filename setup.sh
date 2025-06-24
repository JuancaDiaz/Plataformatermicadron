#!/bin/bash

echo "🛡️ Configurando Plataforma Térmica Drones..."
echo "=============================================="

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 18+ primero."
    exit 1
fi

# Verificar si PostgreSQL está instalado
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL no está instalado. Por favor instala PostgreSQL 14+ primero."
    exit 1
fi

echo "✅ Node.js y PostgreSQL detectados"

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm run install-all

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "🔧 Creando archivo .env..."
    cp env.example .env
    echo "⚠️  Por favor edita el archivo .env con tus credenciales de base de datos"
fi

# Crear base de datos
echo "🗄️  Creando base de datos..."
createdb termica_drones_db 2>/dev/null || echo "Base de datos ya existe"

# Ejecutar migraciones
echo "🔄 Ejecutando migraciones..."
cd server
npx prisma migrate dev --name init
npx prisma generate

# Ejecutar seed
echo "🌱 Poblando base de datos con datos iniciales..."
npm run seed

cd ..

echo ""
echo "🎉 ¡Configuración completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Edita el archivo .env con tus credenciales"
echo "2. Ejecuta 'npm run dev' para iniciar el desarrollo"
echo "3. Accede a http://localhost:3000"
echo ""
echo "🔑 Credenciales de prueba:"
echo "   Admin: admin@termicadrones.cl / admin123"
echo "   Operador: operador@termicadrones.cl / operador123"
echo ""
echo "🛡️ Protegiendo lo que el agro construyó con esfuerzo" 