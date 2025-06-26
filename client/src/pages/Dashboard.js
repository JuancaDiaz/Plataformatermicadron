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

// Datos inventados para demo
const fakeClients = [
  { id: 'cliente1', name: 'AgroTrigal Ltda.' },
  { id: 'cliente2', name: 'Viñas del Sur' },
];
const fakeFields = [
  { id: 'campo1', name: 'Campo El Trigal', location: 'Rancagua', clientId: 'cliente1', lastFlight: '2024-06-23' },
  { id: 'campo2', name: 'Fundo Santa Rosa', location: 'Curicó', clientId: 'cliente2', lastFlight: '2024-06-21' },
];
const fakeOperators = [
  { id: 'op1', name: 'Juan Pérez', flights: 5 },
  { id: 'op2', name: 'María González', flights: 3 },
  { id: 'op3', name: 'Pedro Soto', flights: 2 },
];
const fakeFlights = [
  { id: 'vuelo1', fieldId: 'campo1', operator: 'Juan Pérez', startTime: '2024-06-23T20:00:00', status: 'COMPLETED' },
  { id: 'vuelo2', fieldId: 'campo1', operator: 'María González', startTime: '2024-06-22T21:00:00', status: 'ACTIVE' },
  { id: 'vuelo3', fieldId: 'campo2', operator: 'Pedro Soto', startTime: '2024-06-21T19:00:00', status: 'COMPLETED' },
];
const fakeEvidence = [
  { id: 'ev1', type: 'Foto', date: '2024-06-23', fieldId: 'campo1', description: 'Imagen térmica nocturna' },
  { id: 'ev2', type: 'Video', date: '2024-06-21', fieldId: 'campo2', description: 'Video de patrullaje' },
  { id: 'ev3', type: 'Foto', date: '2024-06-24', fieldId: 'campo1', description: 'Foto de patrullaje diurno' },
];
const fakeAlerts = [
  { id: 'alert1', field: 'Campo El Trigal', date: '2024-06-23', type: 'Movimiento sospechoso', status: 'Abierta' },
];

// Simular vuelos por día para gráfica
const flightsByDay = [
  { day: 'Lun', count: 1 },
  { day: 'Mar', count: 2 },
  { day: 'Mié', count: 1 },
  { day: 'Jue', count: 0 },
  { day: 'Vie', count: 2 },
  { day: 'Sáb', count: 1 },
  { day: 'Dom', count: 1 },
];

// Simular distribución de evidencia
const evidenceTypes = [
  { type: 'Foto', count: 2 },
  { type: 'Video', count: 1 },
];

const Dashboard = () => {
  const { user } = useAuth();

  // KPIs
  const kpis = [
    { label: 'Clientes', value: fakeClients.length },
    { label: 'Campos', value: fakeFields.length },
    { label: 'Vuelos (semana)', value: fakeFlights.length },
    { label: 'Evidencia (semana)', value: fakeEvidence.length },
    { label: 'Operadores activos', value: fakeOperators.length },
  ];

  // Últimos vuelos
  const lastFlights = fakeFlights.slice(0, 5);
  // Última evidencia
  const lastEvidence = fakeEvidence.slice(0, 5);
  // Campos sin vuelos recientes (simulado: >2 días sin vuelo)
  const camposSinVuelos = fakeFields.filter(f => {
    const last = new Date(f.lastFlight);
    const now = new Date('2024-06-24');
    return (now - last) / (1000 * 60 * 60 * 24) > 2;
  });

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
    <div className="space-y-8">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {kpis.map(kpi => (
          <div key={kpi.label} className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <div className="text-3xl font-bold text-primary-700 mb-1">{kpi.value}</div>
            <div className="text-gray-600 text-sm font-semibold">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Gráfica de vuelos y distribución de evidencia */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Gráfica de vuelos */}
        <div className="bg-white rounded-xl shadow p-6 col-span-2">
          <div className="font-bold text-lg mb-2">Vuelos por día (semana)</div>
          <div className="flex items-end h-40 gap-4">
            {flightsByDay.map(d => (
              <div key={d.day} className="flex flex-col items-center flex-1">
                <div className="w-8 bg-primary-500 rounded-t transition-all" style={{ height: `${d.count * 30 + 8}px` }}></div>
                <div className="text-xs mt-2 text-gray-500">{d.day}</div>
                <div className="text-xs text-gray-700 font-bold">{d.count}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Distribución de evidencia */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center">
          <div className="font-bold text-lg mb-4">Evidencia por tipo</div>
          <div className="w-32 h-32 relative flex items-center justify-center">
            {/* Pie chart fake */}
            <svg viewBox="0 0 32 32" className="w-full h-full">
              <circle r="16" cx="16" cy="16" fill="#e5e7eb" />
              <circle r="16" cx="16" cy="16" fill="none" stroke="#3b82f6" strokeWidth="32" strokeDasharray="66 34" strokeDashoffset="0" />
              <circle r="16" cx="16" cy="16" fill="none" stroke="#f472b6" strokeWidth="32" strokeDasharray="34 66" strokeDashoffset="66" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold">{fakeEvidence.length}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>Foto</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-pink-400 inline-block"></span>Video</div>
          </div>
        </div>
      </div>

      {/* Mapa simulado y ranking operadores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Mapa simulado */}
        <div className="bg-white rounded-xl shadow p-6 col-span-2">
          <div className="font-bold text-lg mb-2">Mapa de campos monitoreados</div>
          <div className="w-full h-56 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center relative">
            {/* Simulación de campos como puntos */}
            {fakeFields.map((f, i) => (
              <div key={f.id} className="absolute" style={{ left: `${30 + i * 40}%`, top: `${40 + i * 10}%` }}>
                <div className="w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-xs text-white font-bold">
                  {i + 1}
                </div>
                <div className="text-xs text-gray-700 mt-1 text-center whitespace-nowrap">{f.name}</div>
              </div>
            ))}
            <span className="text-gray-400">(Mapa ilustrativo)</span>
          </div>
        </div>
        {/* Ranking operadores */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="font-bold text-lg mb-4">Ranking de operadores</div>
          <ol className="space-y-2">
            {fakeOperators.sort((a, b) => b.flights - a.flights).map((op, idx) => (
              <li key={op.id} className="flex items-center gap-3">
                <span className="text-lg font-bold text-primary-700">#{idx + 1}</span>
                <span className="font-semibold">{op.name}</span>
                <span className="ml-auto text-gray-500">{op.flights} vuelos</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Listados rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Últimos vuelos */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="font-bold text-lg mb-4">Últimos vuelos</div>
          <ul className="divide-y">
            {lastFlights.map(f => (
              <li key={f.id} className="py-2 flex items-center gap-3">
                <span className="font-semibold text-primary-700">{fakeFields.find(field => field.id === f.fieldId)?.name}</span>
                <span className="text-gray-500 text-sm">{f.operator}</span>
                <span className="ml-auto text-xs text-gray-400">{new Date(f.startTime).toLocaleDateString('es-CL')}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Última evidencia */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="font-bold text-lg mb-4">Última evidencia</div>
          <ul className="divide-y">
            {lastEvidence.map(ev => (
              <li key={ev.id} className="py-2 flex items-center gap-3">
                <span className="font-semibold text-pink-600">{ev.type}</span>
                <span className="text-gray-700">{ev.description}</span>
                <span className="ml-auto text-xs text-gray-400">{ev.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Campos sin vuelos recientes y alertas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Campos sin vuelos recientes */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="font-bold text-lg mb-4">Campos sin vuelos recientes</div>
          {camposSinVuelos.length === 0 ? (
            <div className="text-gray-400">Todos los campos tienen vuelos recientes.</div>
          ) : (
            <ul className="list-disc ml-6 text-gray-700">
              {camposSinVuelos.map(f => (
                <li key={f.id}>{f.name} ({f.location})</li>
              ))}
            </ul>
          )}
        </div>
        {/* Alertas */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="font-bold text-lg mb-4">Alertas recientes</div>
          {fakeAlerts.length === 0 ? (
            <div className="text-gray-400">Sin alertas abiertas.</div>
          ) : (
            <ul className="divide-y">
              {fakeAlerts.map(alert => (
                <li key={alert.id} className="py-2 flex items-center gap-3">
                  <span className="font-semibold text-red-600">{alert.type}</span>
                  <span className="text-gray-700">{alert.field}</span>
                  <span className="ml-auto text-xs text-gray-400">{alert.date}</span>
                  <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded">{alert.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 