# 🛡️ Plataforma Térmica Drones

Plataforma web para vigilancia aérea inteligente con drones en el sector agrícola chileno.

## 🎯 Propósito

Sistema centralizado de operaciones para **Térmica Drones** que permite gestionar:
- Clientes y campos agrícolas
- Vuelos de patrullaje y vigilancia
- Registro de evidencia e incidentes
- Reportería automática
- Control de acceso por roles (admin, operador, cliente)

## 🚀 Tecnologías

### Frontend
- **React 18** - Framework principal
- **TailwindCSS** - Estilos y diseño
- **React Router** - Navegación
- **Axios** - Cliente HTTP
- **React Hook Form** - Formularios
- **React Query** - Gestión de estado del servidor

### Backend
- **Node.js** - Runtime
- **Express.js** - Framework web
- **PostgreSQL** - Base de datos principal
- **Prisma** - ORM
- **JWT** - Autenticación
- **bcrypt** - Encriptación de contraseñas

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- PostgreSQL 14+
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd termica-drones-platform
```

2. **Instalar dependencias**
```bash
npm run install-all
```

3. **Configurar base de datos**
```bash
# Crear base de datos PostgreSQL
createdb termica_drones_db

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
```

4. **Ejecutar migraciones**
```bash
cd server
npx prisma migrate dev
npx prisma generate
```

5. **Iniciar desarrollo**
```bash
npm run dev
```

## 🌐 Acceso

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **Base de datos**: localhost:5432

## 📁 Estructura del Proyecto

```
termica-drones-platform/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/         # Páginas principales
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # Servicios API
│   │   ├── utils/         # Utilidades
│   │   └── styles/        # Estilos globales
│   └── public/
├── server/                 # Backend Node.js
│   ├── src/
│   │   ├── controllers/   # Controladores
│   │   ├── models/        # Modelos de datos
│   │   ├── routes/        # Rutas API
│   │   ├── middleware/    # Middleware
│   │   └── utils/         # Utilidades
│   └── prisma/            # Esquemas de base de datos
└── docs/                  # Documentación
```

## 🎨 Diseño y Branding

### Colores
- **Fondo principal**: Blanco (#FFFFFF)
- **Texto principal**: Negro (#000000)
- **Texto secundario**: Gris oscuro (#374151)
- **Acento**: Turquesa (#34D1BF)

### Tipografía
- **Principal**: Inter
- **Secundaria**: Poppins

### Inspiración
- Linear, Superhuman, Notion
- Minimalista y profesional
- Enfoque en seguridad tecnológica

## 🔐 Roles de Usuario

1. **Administrador**: Acceso completo al sistema
2. **Operador**: Gestión de vuelos y evidencia
3. **Cliente** (futuro): Visualización de reportes

## 📋 Funcionalidades MVP

- [x] Autenticación simple (email + contraseña)
- [x] Dashboard inicial
- [x] Gestión de usuarios, clientes, campos
- [x] Registro de vuelos y evidencia
- [x] Navegación lateral
- [x] Diseño responsive

## 🚀 Próximas Funcionalidades

- [ ] Check-in/check-out de vuelos
- [ ] Subida de evidencia (imágenes/videos)
- [ ] Cronograma de patrullaje
- [ ] Reportería automática
- [ ] Integración con API de clima
- [ ] Notificaciones en tiempo real

## 🛠️ Desarrollo

### Comandos útiles

```bash
# Desarrollo completo
npm run dev

# Solo frontend
npm run client

# Solo backend
npm run server

# Build para producción
npm run build
```

### Base de datos

```bash
# Ver estado de migraciones
npx prisma migrate status

# Crear nueva migración
npx prisma migrate dev --name nombre_migracion

# Abrir Prisma Studio
npx prisma studio
```

## 📊 Despliegue

### Railway
El proyecto está configurado para despliegue automático en Railway.

### Variables de entorno necesarias
- `DATABASE_URL`
- `JWT_SECRET`
- `PORT`

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Soporte

Para soporte técnico o consultas sobre el proyecto, contacta al equipo de desarrollo.

---

**Térmica Drones** - Protegiendo lo que el agro construyó con esfuerzo 🛡️ 