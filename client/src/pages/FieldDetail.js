import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Datos inventados de ejemplo (simulan la estructura real)
const fakeClients = [
  {
    id: 'cliente1',
    name: 'AgroTrigal Ltda.',
    contact: {
      name: 'Carlos Díaz',
      email: 'carlos@agrotrigal.cl',
      phone: '+56 9 1234 5678',
      rut: '12.345.678-9',
      notes: 'Gerente general',
    },
    fields: [
      {
        id: 'campo1',
        name: 'Campo El Trigal',
        location: 'Rancagua',
        hectares: 80,
        description: 'Trigo y maíz',
      },
    ],
  },
  {
    id: 'cliente2',
    name: 'Viñas del Sur',
    contact: {
      name: 'María Torres',
      email: 'maria@vinasdelsur.cl',
      phone: '+56 9 8765 4321',
      rut: '23.456.789-0',
      notes: '',
    },
    fields: [
      {
        id: 'campo2',
        name: 'Fundo Santa Rosa',
        location: 'Curicó',
        hectares: 120,
        description: 'Viñedos y frutales',
      },
    ],
  },
];

const fakeOperators = [
  {
    id: 'op1',
    name: 'Juan Pérez',
    email: 'juan.perez@termicadron.cl',
    phone: '+56 9 1234 5678',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    fields: ['campo1'],
  },
  {
    id: 'op2',
    name: 'María González',
    email: 'maria.gonzalez@termicadron.cl',
    phone: '+56 9 8765 4321',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    fields: ['campo1'],
  },
  {
    id: 'op3',
    name: 'Pedro Soto',
    email: 'pedro.soto@termicadron.cl',
    phone: '+56 9 1122 3344',
    photo: 'https://randomuser.me/api/portraits/men/65.jpg',
    fields: ['campo2'],
  },
];

const fakeFlights = [
  {
    id: 'vuelo1',
    fieldId: 'campo1',
    operator: fakeOperators[0],
    startTime: '2024-06-23T20:00:00',
    endTime: '2024-06-23T22:00:00',
    status: 'COMPLETED',
    notes: 'Patrullaje sin novedades.'
  },
  {
    id: 'vuelo2',
    fieldId: 'campo1',
    operator: fakeOperators[1],
    startTime: '2024-06-22T21:00:00',
    endTime: null,
    status: 'ACTIVE',
    notes: 'Vuelo en curso.'
  },
  {
    id: 'vuelo3',
    fieldId: 'campo2',
    operator: fakeOperators[2],
    startTime: '2024-06-21T19:00:00',
    endTime: '2024-06-21T20:30:00',
    status: 'COMPLETED',
    notes: 'Revisión de frutales.'
  }
];

const fakeEvidence = [
  {
    id: 'ev1',
    fieldId: 'campo1',
    flightId: 'vuelo1',
    type: 'Foto',
    description: 'Imagen térmica nocturna',
    file: '#',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=80&h=80',
  },
  {
    id: 'ev2',
    fieldId: 'campo2',
    flightId: 'vuelo3',
    type: 'Video',
    description: 'Video de patrullaje',
    file: '#',
    thumbnail: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=80&h=80',
  },
];

const FieldDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Buscar campo, cliente y operadores
  const client = fakeClients.find(c => c.fields.some(f => f.id === id));
  const field = client?.fields.find(f => f.id === id);
  const operators = fakeOperators.filter(op => op.fields.includes(id));
  const flights = fakeFlights.filter(f => f.fieldId === id);
  const evidence = fakeEvidence.filter(ev => ev.fieldId === id);

  if (!field) {
    return <div className="text-red-500">Campo no encontrado</div>;
  }

  return (
    <div>
      <button className="mb-4 text-blue-600 underline" onClick={() => navigate(-1)}>&larr; Volver</button>
      <h1 className="text-2xl font-bold mb-2">{field.name}</h1>
      <div className="mb-4 grid md:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-700"><strong>Ubicación:</strong> {field.location}</p>
          <p className="text-gray-700"><strong>Hectáreas:</strong> {field.hectares}</p>
          <p className="text-gray-700"><strong>Descripción:</strong> {field.description}</p>
        </div>
        <div className="bg-gray-50 rounded p-3">
          <h2 className="font-semibold mb-1">Cliente propietario</h2>
          <p className="text-gray-700 mb-1"><strong>Nombre:</strong> {client.name}</p>
          {client.contact.name && <p className="text-gray-700 mb-1"><strong>Responsable:</strong> {client.contact.name}</p>}
          {client.contact.email && <p className="text-gray-700 mb-1"><strong>Email:</strong> {client.contact.email}</p>}
          {client.contact.phone && <p className="text-gray-700 mb-1"><strong>Teléfono:</strong> {client.contact.phone}</p>}
          {client.contact.rut && <p className="text-gray-700 mb-1"><strong>RUT:</strong> {client.contact.rut}</p>}
          {client.contact.notes && <p className="text-gray-700 mb-1"><strong>Notas:</strong> {client.contact.notes}</p>}
        </div>
      </div>
      <div className="mb-4">
        <h2 className="font-semibold mb-2">Operadores encargados</h2>
        <div className="flex flex-wrap gap-4">
          {operators.map(op => (
            <div key={op.id} className="flex items-center bg-white border rounded p-2 shadow-sm">
              <img src={op.photo} alt={op.name} className="w-12 h-12 rounded-full object-cover mr-3" />
              <div>
                <div className="font-medium">{op.name}</div>
                <div className="text-xs text-gray-600">{op.email}</div>
                <div className="text-xs text-gray-600">{op.phone}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h2 className="font-semibold mb-2">Vuelos realizados</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Operador</th>
                <th className="px-4 py-2 border-b">Inicio</th>
                <th className="px-4 py-2 border-b">Fin</th>
                <th className="px-4 py-2 border-b">Estado</th>
                <th className="px-4 py-2 border-b">Notas</th>
              </tr>
            </thead>
            <tbody>
              {flights.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-gray-400 py-2">Sin vuelos registrados</td></tr>
              ) : flights.map((flight) => (
                <tr key={flight.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{flight.operator.name}</td>
                  <td className="px-4 py-2 border-b">{new Date(flight.startTime).toLocaleString('es-CL')}</td>
                  <td className="px-4 py-2 border-b">{flight.endTime ? new Date(flight.endTime).toLocaleString('es-CL') : '-'}</td>
                  <td className="px-4 py-2 border-b capitalize">{flight.status.toLowerCase()}</td>
                  <td className="px-4 py-2 border-b">{flight.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mb-4">
        <h2 className="font-semibold mb-2">Evidencia asociada</h2>
        <div className="flex flex-wrap gap-4">
          {evidence.length === 0 ? (
            <span className="text-gray-400">Sin evidencia registrada</span>
          ) : evidence.map(ev => (
            <a key={ev.id} href={ev.file} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center bg-white border rounded p-2 shadow-sm w-24">
              <img src={ev.thumbnail} alt={ev.type} className="w-16 h-16 object-cover rounded mb-1" />
              <span className="text-xs font-medium text-gray-700">{ev.type}</span>
              <span className="text-xs text-gray-500">{ev.description}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FieldDetail; 