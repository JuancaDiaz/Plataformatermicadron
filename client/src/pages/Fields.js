import React from 'react';
import { useNavigate } from 'react-router-dom';

// Datos inventados de ejemplo (idénticos a los de FieldDetail.js)
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
    fields: ['campo1'],
  },
  {
    id: 'op2',
    name: 'María González',
    fields: ['campo1'],
  },
  {
    id: 'op3',
    name: 'Pedro Soto',
    fields: ['campo2'],
  },
];

const getAllFields = () => {
  // Devuelve todos los campos con referencia al cliente
  return fakeClients.flatMap(client =>
    client.fields.map(field => ({
      ...field,
      clientName: client.name,
      clientId: client.id,
    }))
  );
};

const getOperatorsForField = (fieldId) => {
  return fakeOperators.filter(op => op.fields.includes(fieldId));
};

const Fields = () => {
  const navigate = useNavigate();
  const fields = getAllFields();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Campos</h1>
      {fields.length === 0 ? (
        <div className="text-gray-500">No hay campos registrados.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {fields.map(field => (
            <div key={field.id} className="p-6 bg-white border border-gray-200 rounded-lg shadow flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-1">{field.name}</h2>
                <div className="text-gray-700 mb-1"><strong>Ubicación:</strong> {field.location}</div>
                <div className="text-gray-700 mb-1"><strong>Hectáreas:</strong> {field.hectares}</div>
                <div className="text-gray-700 mb-1"><strong>Cliente:</strong> {field.clientName}</div>
                <div className="text-gray-700 mb-1">
                  <strong>Operadores:</strong> {getOperatorsForField(field.id).map(op => op.name).join(', ') || 'Sin asignar'}
                </div>
                <div className="text-gray-600 text-sm mb-2">{field.description}</div>
              </div>
              <button
                className="btn btn-primary mt-2"
                onClick={() => navigate(`/fields/${field.id}`)}
              >
                Ver detalle
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Fields; 