import React from 'react';
import { useNavigate } from 'react-router-dom';

// Datos inventados de ejemplo
const fakeFields = [
  {
    id: 'campo1',
    name: 'Campo El Trigal',
    location: 'Rancagua',
    hectares: 80,
    description: 'Trigo y maíz',
    client: { name: 'AgroTrigal Ltda.' },
  },
  {
    id: 'campo2',
    name: 'Fundo Santa Rosa',
    location: 'Curicó',
    hectares: 120,
    description: 'Viñedos y frutales',
    client: { name: 'Viñas del Sur' },
  },
];

const fakeFlights = [
  {
    id: 'vuelo1',
    fieldId: 'campo1',
    startTime: '2024-06-23T20:00:00',
    endTime: '2024-06-23T22:00:00',
    operator: { firstName: 'Juan', lastName: 'Pérez' },
    status: 'COMPLETED',
    notes: 'Patrullaje sin novedades.'
  },
  {
    id: 'vuelo2',
    fieldId: 'campo1',
    startTime: '2024-06-22T21:00:00',
    endTime: null,
    operator: { firstName: 'María', lastName: 'González' },
    status: 'ACTIVE',
    notes: 'Vuelo en curso.'
  },
  {
    id: 'vuelo3',
    fieldId: 'campo2',
    startTime: '2024-06-21T19:00:00',
    endTime: '2024-06-21T20:30:00',
    operator: { firstName: 'Pedro', lastName: 'Soto' },
    status: 'COMPLETED',
    notes: 'Revisión de frutales.'
  }
];

function groupByField(fields, flights) {
  return fields.map(field => ({
    field,
    flights: flights.filter(flight => flight.fieldId === field.id)
  }));
}

const Flights = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Vuelos</h1>
      <p className="text-gray-600 mb-6">Selecciona un campo para ver sus vuelos.</p>
      {fakeFields.length === 0 && (
        <div className="text-gray-500">No hay campos registrados.</div>
      )}
      <div className="grid gap-6 md:grid-cols-2">
        {fakeFields.map((field) => (
          <div key={field.id} className="p-6 bg-white border border-gray-200 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{field.name}</h2>
            <div className="mb-2 text-gray-700">
              <span className="block"><strong>Ubicación:</strong> {field.location}</span>
              <span className="block"><strong>Hectáreas:</strong> {field.hectares}</span>
              <span className="block"><strong>Cliente:</strong> {field.client.name}</span>
              <span className="block"><strong>Descripción:</strong> {field.description}</span>
            </div>
            <button
              className="btn btn-primary mt-2 text-lg font-semibold px-6 py-2"
              onClick={() => navigate(`/fields/${field.id}`)}
            >
              Ver vuelos de este campo
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Flights; 