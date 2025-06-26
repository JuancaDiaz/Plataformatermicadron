import React, { useState } from 'react';

// Datos inventados de ejemplo (idénticos a los de FieldDetail.js)
const fakeClients = [
  {
    id: 'cliente1',
    name: 'AgroTrigal Ltda.',
    fields: [
      { id: 'campo1', name: 'Campo El Trigal' },
    ],
  },
  {
    id: 'cliente2',
    name: 'Viñas del Sur',
    fields: [
      { id: 'campo2', name: 'Fundo Santa Rosa' },
    ],
  },
];

const fakeOperators = [
  {
    id: 'op1',
    name: 'Juan Pérez',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    email: 'juan.perez@termicadron.cl',
    phone: '+56 9 1234 5678',
  },
  {
    id: 'op2',
    name: 'María González',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    email: 'maria.gonzalez@termicadron.cl',
    phone: '+56 9 8765 4321',
  },
];

const fakeEvidence = [
  {
    id: 'ev1',
    fieldId: 'campo1',
    clientId: 'cliente1',
    flight: 'vuelo1',
    date: '2024-06-23T21:00:00',
    type: 'Foto',
    description: 'Imagen térmica nocturna',
    file: '#',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=80&h=80',
    operatorId: 'op1',
    location: 'Rancagua, -34.1701, -70.7406',
    measures: ['Se avisó a carabineros', 'Se notificó al cliente'],
    status: 'Pendiente',
    notes: 'Se observó movimiento sospechoso cerca del cerco norte.',
    history: [
      { action: 'Registrado', by: 'Juan Pérez', date: '2024-06-23T21:05:00' },
      { action: 'Notificado cliente', by: 'Juan Pérez', date: '2024-06-23T21:10:00' },
    ],
  },
  {
    id: 'ev2',
    fieldId: 'campo2',
    clientId: 'cliente2',
    flight: 'vuelo3',
    date: '2024-06-21T19:30:00',
    type: 'Video',
    description: 'Video de patrullaje',
    file: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=80&h=80',
    operatorId: 'op2',
    location: 'Curicó, -34.9850, -71.2322',
    measures: ['Se patrulló el área'],
    status: 'Resuelta',
    notes: '',
    history: [
      { action: 'Registrado', by: 'María González', date: '2024-06-21T19:35:00' },
    ],
  },
  {
    id: 'ev3',
    fieldId: 'campo1',
    clientId: 'cliente1',
    flight: 'vuelo2',
    date: '2024-06-24T10:00:00',
    type: 'Foto',
    description: 'Foto de patrullaje diurno',
    file: '#',
    thumbnail: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=80&h=80',
    operatorId: 'op1',
    location: 'Rancagua, -34.1701, -70.7406',
    measures: [],
    status: 'Pendiente',
    notes: '',
    history: [
      { action: 'Registrado', by: 'Juan Pérez', date: '2024-06-24T10:05:00' },
    ],
  },
];

const uniqueTypes = Array.from(new Set(fakeEvidence.map(ev => ev.type)));
const allMeasures = [
  'Se avisó a carabineros',
  'Se notificó al cliente',
  'Se patrulló el área',
  'Se registró evidencia fotográfica',
  'Se registró evidencia en video',
];

const Evidence = () => {
  const [selectedType, setSelectedType] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [modalEvidence, setModalEvidence] = useState(null);

  // Filtro por tipo y fecha
  const filterEvidence = (evidence) => {
    return evidence.filter(ev => {
      const matchType = selectedType ? ev.type === selectedType : true;
      const matchDate = selectedDate ? ev.date.slice(0, 10) === selectedDate : true;
      return matchType && matchDate;
    });
  };

  // Obtener campos del cliente seleccionado
  const clientFields = selectedClient
    ? fakeClients.find(c => c.id === selectedClient)?.fields || []
    : [];

  // Evidencia filtrada para el campo seleccionado
  const fieldEvidence = selectedField
    ? filterEvidence(fakeEvidence.filter(ev => ev.fieldId === selectedField && ev.clientId === selectedClient))
    : [];

  // Obtener operador por id
  const getOperator = (id) => fakeOperators.find(op => op.id === id);

  // Descargar archivo (simulado)
  const handleDownload = (ev) => {
    if (ev.file && ev.file !== '#') {
      window.open(ev.file, '_blank');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Evidencia</h1>
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Filtrar por tipo</label>
          <select
            className="form-select border-gray-300 rounded"
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
          >
            <option value="">Todos</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Filtrar por fecha</label>
          <input
            type="date"
            className="form-input border-gray-300 rounded"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
          />
        </div>
      </div>
      {/* Lista de clientes como botones */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        {fakeClients.map(client => (
          <button
            key={client.id}
            className={`btn w-full text-left p-4 border rounded-lg shadow ${selectedClient === client.id ? 'bg-blue-100 border-blue-400' : 'bg-white border-gray-200'}`}
            onClick={() => {
              setSelectedClient(client.id);
              setSelectedField(null);
            }}
          >
            <span className="text-lg font-semibold">{client.name}</span>
          </button>
        ))}
      </div>
      {/* Lista de campos del cliente seleccionado */}
      {selectedClient && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Campos de {fakeClients.find(c => c.id === selectedClient)?.name}</h2>
          <div className="flex flex-wrap gap-4">
            {clientFields.map(field => (
              <button
                key={field.id}
                className={`btn px-6 py-2 rounded border ${selectedField === field.id ? 'bg-blue-100 border-blue-400' : 'bg-white border-gray-200'}`}
                onClick={() => setSelectedField(field.id)}
              >
                {field.name}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Tabla de evidencia del campo seleccionado */}
      {selectedField && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Evidencia de {clientFields.find(f => f.id === selectedField)?.name}</h3>
          {fieldEvidence.length === 0 ? (
            <div className="text-gray-500">No hay evidencia registrada con los filtros seleccionados.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b">Miniatura</th>
                    <th className="px-4 py-2 border-b">Tipo</th>
                    <th className="px-4 py-2 border-b">Descripción</th>
                    <th className="px-4 py-2 border-b">Fecha</th>
                    <th className="px-4 py-2 border-b">Archivo</th>
                  </tr>
                </thead>
                <tbody>
                  {fieldEvidence.map(ev => (
                    <tr
                      key={ev.id}
                      className="hover:bg-blue-50 cursor-pointer"
                      onClick={() => setModalEvidence(ev)}
                    >
                      <td className="px-4 py-2 border-b">
                        <img
                          src={ev.thumbnail}
                          alt={ev.type}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-2 border-b">{ev.type}</td>
                      <td className="px-4 py-2 border-b">{ev.description}</td>
                      <td className="px-4 py-2 border-b">{new Date(ev.date).toLocaleDateString('es-CL')}<br /><span className="text-xs text-gray-400">{new Date(ev.date).toLocaleTimeString('es-CL')}</span></td>
                      <td className="px-4 py-2 border-b">
                        <button className="text-blue-600 underline" onClick={e => { e.stopPropagation(); handleDownload(ev); }}>Descargar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {/* Modal de detalle de evidencia */}
      {modalEvidence && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-0 w-full max-w-4xl relative flex flex-col md:flex-row overflow-hidden border-2 border-blue-600">
            <button
              className="absolute top-3 right-4 text-gray-400 hover:text-blue-600 text-3xl font-bold"
              onClick={() => setModalEvidence(null)}
              aria-label="Cerrar"
            >
              ×
            </button>
            {/* Contenido visual: imagen o video, ocupa más espacio horizontal */}
            <div className="flex-shrink-0 flex flex-col items-center bg-blue-50 p-6 md:w-2/3 w-full justify-center">
              {modalEvidence.type === 'Video' ? (
                <video controls className="w-full max-w-2xl h-[340px] rounded mb-4 shadow bg-black">
                  <source src={modalEvidence.file} type="video/mp4" />
                  Tu navegador no soporta video.
                </video>
              ) : (
                <img src={modalEvidence.file !== '#' ? modalEvidence.file : modalEvidence.thumbnail} alt={modalEvidence.type} className="w-full max-w-2xl h-[340px] object-contain rounded mb-4 shadow bg-white" />
              )}
              <button className="btn btn-primary w-full" onClick={() => handleDownload(modalEvidence)}>
                Descargar evidencia
              </button>
            </div>
            {/* Info textual, scrollable si es necesario */}
            <div className="flex-1 p-6 flex flex-col gap-6 max-h-[80vh] overflow-y-auto bg-white">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Detalle de evidencia</h2>
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-1">Fecha y hora</h3>
                <div className="text-gray-800">{new Date(modalEvidence.date).toLocaleString('es-CL')}</div>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-1">Estado de denuncia</h3>
                <div className="text-gray-800">{modalEvidence.status}</div>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-1">Campo</h3>
                <div className="text-gray-800">{clientFields.find(f => f.id === modalEvidence.fieldId)?.name}</div>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-1">Cliente</h3>
                <div className="text-gray-800">{fakeClients.find(c => c.id === modalEvidence.clientId)?.name}</div>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-1">Tipo</h3>
                <div className="text-gray-800">{modalEvidence.type}</div>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-1">Descripción</h3>
                <div className="text-gray-800">{modalEvidence.description}</div>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-1">Operador</h3>
                <div className="flex items-center gap-3 mt-1">
                  <img src={getOperator(modalEvidence.operatorId)?.photo} alt={getOperator(modalEvidence.operatorId)?.name} className="w-8 h-8 rounded-full object-cover border-2 border-gray-200" />
                  <span className="text-gray-800">{getOperator(modalEvidence.operatorId)?.name}</span>
                  <span className="text-xs text-gray-500 ml-2">{getOperator(modalEvidence.operatorId)?.email}</span>
                </div>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-1">Ubicación</h3>
                <div className="text-gray-800">{modalEvidence.location} <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(modalEvidence.location)}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-1">Ver mapa</a></div>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-1">Medidas tomadas</h3>
                <div className="flex flex-wrap gap-3 mt-2">
                  {allMeasures.map(measure => (
                    <label key={measure} className="flex items-center gap-1">
                      <input type="checkbox" checked={modalEvidence.measures.includes(measure)} readOnly />
                      <span className="text-xs text-gray-800">{measure}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-1">Notas adicionales</h3>
                <div className="text-gray-800">{modalEvidence.notes || <span className="text-gray-400">Sin notas</span>}</div>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-1">Historial de acciones</h3>
                <ul className="list-disc ml-6 text-sm mt-2 text-gray-800">
                  {modalEvidence.history.map((h, idx) => (
                    <li key={idx}>{h.action} por {h.by} el {new Date(h.date).toLocaleString('es-CL')}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Evidence; 