import React from 'react';

const fields = [
  {
    id: 'campo1',
    name: 'Campo Principal',
    lat: -33.4489,
    lng: -70.6693,
    incidents: [
      { id: 'inc1', type: 'alerta', description: 'Movimiento sospechoso', lat: -33.4485, lng: -70.6690 }
    ]
  }
];

const Map = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Mapa Interactivo</h1>
    <div className="bg-gray-100 rounded-lg shadow p-4 flex flex-col items-center">
      <div className="w-full h-96 bg-gray-300 rounded-lg flex items-center justify-center">
        {/* Aquí iría el mapa real, por ahora es un placeholder */}
        <span className="text-gray-500">[Mapa interactivo con marcadores de campos e incidentes]</span>
      </div>
      <div className="mt-6 w-full">
        <h2 className="text-lg font-semibold mb-2">Campos y Alertas</h2>
        {fields.map(field => (
          <div key={field.id} className="mb-4">
            <div className="font-bold">{field.name}</div>
            <ul className="ml-4 text-sm text-gray-700">
              {field.incidents.map(inc => (
                <li key={inc.id}>🔴 {inc.type}: {inc.description}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Map; 