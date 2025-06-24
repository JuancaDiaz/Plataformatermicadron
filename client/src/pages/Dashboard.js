import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  Plane, 
  MapPin, 
  Users, 
  FileText, 
  TrendingUp, 
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  // Datos de ejemplo - en el futuro vendrán de la API
  const stats = [
    {
      name: 'Vuelos Activos',
      value: '3',
      change: '+12%',
      changeType: 'positive',
      icon: Plane,
      color: 'bg-blue-500'
    },
    {
      name: 'Campos Monitoreados',
      value: '8',
      change: '+2',
      changeType: 'positive',
      icon: MapPin,
      color: 'bg-green-500'
    },
    {
      name: 'Evidencia Registrada',
      value: '24',
      change: '+8',
      changeType: 'positive',
      icon: FileText,
      color: 'bg-purple-500'
    },
    {
      name: 'Operadores Activos',
      value: '5',
      change: '0',
      changeType: 'neutral',
      icon: Users,
      color: 'bg-orange-500'
    }
  ];

  const recentFlights = [
    {
      id: 1,
      field: 'Campo Principal - Agricola del Valle',
      operator: 'Juan Pérez',
      startTime: '2024-01-15T20:00:00',
      status: 'ACTIVE',
      duration: '2h 15m'
    },
    {
      id: 2,
      field: 'Campo Norte - Viña Santa Rita',
      operator: 'María González',
      startTime: '2024-01-15T18:30:00',
      status: 'COMPLETED',
      duration: '1h 45m'
    },
    {
      id: 3,
      field: 'Campo Sur - Fundo Los Olivos',
      operator: 'Carlos Rodríguez',
      startTime: '2024-01-15T16:00:00',
      status: 'COMPLETED',
      duration: '2h 30m'
    }
  ];

  const recentEvidence = [
    {
      id: 1,
      title: 'Intrusión detectada en perímetro norte',
      type: 'ALERT',
      priority: 'HIGH',
      field: 'Campo Principal',
      time: '2024-01-15T21:15:00'
    },
    {
      id: 2,
      title: 'Anomalía térmica en sector 3',
      type: 'IMAGE',
      priority: 'MEDIUM',
      field: 'Campo Norte',
      time: '2024-01-15T19:45:00'
    },
    {
      id: 3,
      title: 'Reporte de patrullaje rutinario',
      type: 'TEXT',
      priority: 'LOW',
      field: 'Campo Sur',
      time: '2024-01-15T18:30:00'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      ACTIVE: { class: 'status-active', text: 'Activo' },
      COMPLETED: { class: 'status-completed', text: 'Completado' },
      CANCELLED: { class: 'status-cancelled', text: 'Cancelado' },
      INTERRUPTED: { class: 'status-interrupted', text: 'Interrumpido' }
    };
    
    const config = statusConfig[status] || statusConfig.COMPLETED;
    return <span className={config.class}>{config.text}</span>;
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      LOW: <CheckCircle className="h-4 w-4 text-green-500" />,
      MEDIUM: <Clock className="h-4 w-4 text-yellow-500" />,
      HIGH: <AlertTriangle className="h-4 w-4 text-orange-500" />,
      CRITICAL: <AlertTriangle className="h-4 w-4 text-red-500" />
    };
    return icons[priority] || icons.MEDIUM;
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header del Dashboard */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-display">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Bienvenido de vuelta, {user?.firstName}. Aquí tienes un resumen de las operaciones.
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 
                  stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vuelos Recientes */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Vuelos Recientes</h2>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Ver todos
            </button>
          </div>
          <div className="space-y-4">
            {recentFlights.map((flight) => (
              <div key={flight.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{flight.field}</p>
                  <p className="text-xs text-gray-500">Operador: {flight.operator}</p>
                  <p className="text-xs text-gray-500">
                    Inicio: {formatTime(flight.startTime)} • Duración: {flight.duration}
                  </p>
                </div>
                <div className="ml-4">
                  {getStatusBadge(flight.status)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Evidencia Reciente */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Evidencia Reciente</h2>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Ver todas
            </button>
          </div>
          <div className="space-y-4">
            {recentEvidence.map((evidence) => (
              <div key={evidence.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  {getPriorityIcon(evidence.priority)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{evidence.title}</p>
                  <p className="text-xs text-gray-500">{evidence.field}</p>
                  <p className="text-xs text-gray-500">{formatTime(evidence.time)}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className={`priority-${evidence.priority.toLowerCase()}`}>
                    {evidence.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <Plane className="h-6 w-6 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-700">Nuevo Vuelo</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <FileText className="h-6 w-6 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-700">Registrar Evidencia</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <MapPin className="h-6 w-6 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-700">Ver Campos</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <TrendingUp className="h-6 w-6 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-700">Reportes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 