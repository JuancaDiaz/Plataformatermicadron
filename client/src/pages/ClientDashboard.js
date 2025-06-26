import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  Shield, 
  MapPin, 
  Eye, 
  FileText, 
  AlertTriangle,
  Clock,
  CheckCircle,
  Calendar,
  Users
} from 'lucide-react';

// Datos de ejemplo para el cliente actual
const clientData = {
  id: 'cliente1',
  name: 'AgroTrigal Ltda.',
  fields: [
    {
      id: 'campo1',
      name: 'Campo El Trigal',
      location: 'Rancagua',
      hectares: 80,
      lastFlight: '2024-03-14T15:30:00',
      status: 'protected', // protected, alert, warning
      operators: ['Juan Pérez', 'María González']
    },
    {
      id: 'campo2',
      name: 'Campo Los Olivos',
      location: 'Rancagua',
      hectares: 120,
      lastFlight: '2024-03-14T18:45:00',
      status: 'alert',
      operators: ['Pedro Soto']
    }
  ],
  recentEvidence: [
    {
      id: 'ev1',
      type: 'Alerta',
      field: 'Campo Los Olivos',
      description: 'Movimiento sospechoso detectado en sector norte',
      date: '2024-03-14T19:30:00',
      status: 'urgent',
      thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=120&h=120'
    },
    {
      id: 'ev2',
      type: 'Registro',
      field: 'Campo El Trigal',
      description: 'Patrullaje nocturno completado sin novedades',
      date: '2024-03-14T16:00:00',
      status: 'completed',
      thumbnail: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=120&h=120'
    }
  ],
  activeFlights: [
    {
      id: 'vuelo1',
      field: 'Campo El Trigal',
      operator: 'Juan Pérez',
      startTime: '2024-03-14T15:30:00',
      status: 'in-progress'
    }
  ],
  statistics: {
    totalFlights: 145,
    incidentsPrevented: 12,
    coveragePercent: 98,
    responseTime: '< 15 min'
  }
};

const ClientDashboard = () => {
  const { user } = useAuth();

  const getStatusColor = (status) => {
    const colors = {
      'protected': 'bg-green-100 text-green-800',
      'alert': 'bg-red-100 text-red-800',
      'warning': 'bg-yellow-100 text-yellow-800',
      'urgent': 'bg-red-100 text-red-800',
      'completed': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      {/* Encabezado con estadísticas clave */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Bienvenido, {clientData.name}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cobertura Total</p>
                <p className="text-2xl font-semibold text-gray-900">{clientData.statistics.coveragePercent}%</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vuelos Realizados</p>
                <p className="text-2xl font-semibold text-gray-900">{clientData.statistics.totalFlights}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Incidentes Prevenidos</p>
                <p className="text-2xl font-semibold text-gray-900">{clientData.statistics.incidentsPrevented}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tiempo de Respuesta</p>
                <p className="text-2xl font-semibold text-gray-900">{clientData.statistics.responseTime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estado actual de campos */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Estado de sus campos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clientData.fields.map(field => (
            <div key={field.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{field.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {field.location}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(field.status)}`}>
                    {field.status === 'protected' ? 'Protegido' : 
                     field.status === 'alert' ? 'Alerta' : 'Precaución'}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Hectáreas:</span>
                    <span className="text-gray-900">{field.hectares} ha</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Último vuelo:</span>
                    <span className="text-gray-900">
                      {new Date(field.lastFlight).toLocaleString('es-CL', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Operadores:</span>
                    <span className="text-gray-900">{field.operators.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evidencias recientes y vuelos activos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Evidencias recientes */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Evidencias Recientes</h2>
            <div className="space-y-4">
              {clientData.recentEvidence.map(evidence => (
                <div key={evidence.id} className="flex items-start space-x-4">
                  <img
                    src={evidence.thumbnail}
                    alt=""
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {evidence.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {evidence.field} - {new Date(evidence.date).toLocaleString('es-CL')}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(evidence.status)}`}>
                    {evidence.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vuelos activos */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Vuelos en Curso</h2>
            {clientData.activeFlights.length === 0 ? (
              <p className="text-sm text-gray-500">No hay vuelos activos en este momento.</p>
            ) : (
              <div className="space-y-4">
                {clientData.activeFlights.map(flight => (
                  <div key={flight.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{flight.field}</p>
                      <p className="text-sm text-gray-500">
                        Operador: {flight.operator}
                      </p>
                      <p className="text-xs text-gray-400">
                        Inicio: {new Date(flight.startTime).toLocaleString('es-CL')}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(flight.status)}`}>
                      En curso
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard; 