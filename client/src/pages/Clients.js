import React, { useState } from 'react';
import { Plus, Edit2, Download, X } from 'lucide-react';

const initialClients = [
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

const emptyContact = { name: '', email: '', phone: '', rut: '', notes: '' };
const emptyField = { name: '', location: '', hectares: '', description: '' };

const formatChileanPhone = (input) => {
  // Elimina todo lo que no sea número
  let digits = input.replace(/\D/g, '');
  // Si empieza con 56, quítalo
  if (digits.startsWith('56')) digits = digits.slice(2);
  // Si empieza con 9 y tiene 9 dígitos, está bien
  if (digits.length === 9 && digits.startsWith('9')) {
    return '+56' + digits;
  }
  // Si tiene 8 dígitos, agrégale el 9
  if (digits.length === 8) {
    return '+569' + digits;
  }
  // Si ya está en formato internacional
  if (digits.length === 11 && digits.startsWith('569')) {
    return '+56' + digits.slice(2);
  }
  // Si ya tiene el +
  if (input.startsWith('+56') && digits.length === 11) {
    return '+56' + digits.slice(2);
  }
  // Si no es válido, retorna el input original
  return input;
};

const formatRut = (input) => {
  // Elimina todo lo que no sea número o k/K
  let clean = input.replace(/[^0-9kK]/g, '').toUpperCase();
  if (clean.length < 2) return input;
  let body = clean.slice(0, -1);
  let dv = clean.slice(-1);
  // Formatea con puntos y guion
  let formatted = '';
  while (body.length > 3) {
    formatted = '.' + body.slice(-3) + formatted;
    body = body.slice(0, -3);
  }
  formatted = body + formatted + '-' + dv;
  return formatted;
};

const tabList = [
  { key: 'datos', label: 'Datos' },
  { key: 'campos', label: 'Campos' },
  { key: 'vuelos', label: 'Vuelos' },
  { key: 'evidencia', label: 'Evidencia' },
];

const fakeOperators = [
  { id: 'op1', name: 'Juan Pérez', photo: 'https://randomuser.me/api/portraits/men/32.jpg', email: 'juan.perez@termicadron.cl', phone: '+56 9 1234 5678' },
  { id: 'op2', name: 'María González', photo: 'https://randomuser.me/api/portraits/women/44.jpg', email: 'maria.gonzalez@termicadron.cl', phone: '+56 9 8765 4321' },
];
const fakeFlights = [
  { id: 'vuelo1', fieldId: 'campo1', operator: 'Juan Pérez', startTime: '2024-06-23T20:00:00', endTime: '2024-06-23T22:00:00', status: 'COMPLETED', notes: 'Patrullaje sin novedades.' },
  { id: 'vuelo2', fieldId: 'campo1', operator: 'María González', startTime: '2024-06-22T21:00:00', endTime: null, status: 'ACTIVE', notes: 'Vuelo en curso.' },
  { id: 'vuelo3', fieldId: 'campo2', operator: 'Pedro Soto', startTime: '2024-06-21T19:00:00', endTime: '2024-06-21T20:30:00', status: 'COMPLETED', notes: 'Revisión de frutales.' },
];
const fakeEvidence = [
  {
    id: 'ev1', fieldId: 'campo1', clientId: 'cliente1', flight: 'vuelo1', date: '2024-06-23T21:00:00', type: 'Foto', description: 'Imagen térmica nocturna', file: '#', thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=80&h=80', operatorId: 'op1', location: 'Rancagua, -34.1701, -70.7406', measures: ['Se avisó a carabineros', 'Se notificó al cliente'], status: 'Pendiente', notes: 'Se observó movimiento sospechoso cerca del cerco norte.', history: [ { action: 'Registrado', by: 'Juan Pérez', date: '2024-06-23T21:05:00' }, { action: 'Notificado cliente', by: 'Juan Pérez', date: '2024-06-23T21:10:00' }, ], },
  {
    id: 'ev2', fieldId: 'campo2', clientId: 'cliente2', flight: 'vuelo3', date: '2024-06-21T19:30:00', type: 'Video', description: 'Video de patrullaje', file: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=80&h=80', operatorId: 'op2', location: 'Curicó, -34.9850, -71.2322', measures: ['Se patrulló el área'], status: 'Resuelta', notes: '', history: [ { action: 'Registrado', by: 'María González', date: '2024-06-21T19:35:00' }, ], },
  {
    id: 'ev3', fieldId: 'campo1', clientId: 'cliente1', flight: 'vuelo2', date: '2024-06-24T10:00:00', type: 'Foto', description: 'Foto de patrullaje diurno', file: '#', thumbnail: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=80&h=80', operatorId: 'op1', location: 'Rancagua, -34.1701, -70.7406', measures: [], status: 'Pendiente', notes: '', history: [ { action: 'Registrado', by: 'Juan Pérez', date: '2024-06-24T10:05:00' }, ], },
];
const allMeasures = [
  'Se avisó a carabineros',
  'Se notificó al cliente',
  'Se patrulló el área',
  'Se registró evidencia fotográfica',
  'Se registró evidencia en video',
];

const Clients = () => {
  const [clients, setClients] = useState(initialClients);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({
    name: '',
    contact: { ...emptyContact },
    fields: [{ ...emptyField }],
  });
  const [errors, setErrors] = useState({});
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedTab, setSelectedTab] = useState('datos');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalClientIdx, setModalClientIdx] = useState(null);
  const [modalEvidence, setModalEvidence] = useState(null);
  const [selectedField, setSelectedField] = useState(null);

  const handleFieldChange = (idx, e) => {
    const { name, value } = e.target;
    setForm(f => {
      const fields = [...f.fields];
      fields[idx][name] = value;
      return { ...f, fields };
    });
  };

  const addField = () => {
    setForm(f => ({ ...f, fields: [...f.fields, { ...emptyField }] }));
  };

  const removeField = (idx) => {
    setForm(f => ({ ...f, fields: f.fields.filter((_, i) => i !== idx) }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, contact: { ...f.contact, [name]: value } }));
  };

  const handleContactPhoneBlur = (e) => {
    const value = e.target.value;
    if (!value) return; // No formatear si está vacío
    const formatted = formatChileanPhone(value);
    setForm(f => ({ ...f, contact: { ...f.contact, phone: formatted } }));
  };

  const handleContactRutBlur = (e) => {
    const value = e.target.value;
    if (!value) return;
    const formatted = formatRut(value);
    setForm(f => ({ ...f, contact: { ...f.contact, rut: formatted } }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'El nombre del cliente es obligatorio';
    if (form.contact.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.contact.email)) errs.email = 'Email inválido';
    if (form.contact.phone && !/^\+?\d{8,15}$/.test(form.contact.phone.replace(/\s/g, ''))) errs.phone = 'Teléfono inválido';
    if (form.contact.rut && !/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/.test(form.contact.rut)) errs.rut = 'RUT inválido';
    form.fields.forEach((field, idx) => {
      if (!field.name.trim()) errs['field_name_' + idx] = 'Nombre del campo obligatorio';
      if (!field.location.trim()) errs['field_location_' + idx] = 'Ubicación obligatoria';
      if (!field.hectares || isNaN(field.hectares) || Number(field.hectares) <= 0) errs['field_hectares_' + idx] = 'Hectáreas debe ser un número positivo';
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const newClient = {
      id: editIndex !== null ? clients[editIndex].id : 'cliente' + (clients.length + 1),
      name: form.name,
      contact: { ...form.contact },
      fields: form.fields.map((field, idx) => ({
        id: editIndex !== null && clients[editIndex].fields[idx] ? clients[editIndex].fields[idx].id : 'campo' + (clients.reduce((acc, c) => acc + c.fields.length, 0) + idx + 1),
        ...field,
      })),
    };
    if (editIndex !== null) {
      const updated = [...clients];
      updated[editIndex] = newClient;
      setClients(updated);
    } else {
      setClients([...clients, newClient]);
    }
    setShowModal(false);
    setEditIndex(null);
    setForm({ name: '', contact: { ...emptyContact }, fields: [{ ...emptyField }] });
    setErrors({});
  };

  const openNewModal = () => {
    setForm({ name: '', contact: { ...emptyContact }, fields: [{ ...emptyField }] });
    setEditIndex(null);
    setShowModal(true);
    setErrors({});
  };

  const openEditModal = (idx) => {
    const client = clients[idx];
    setForm({
      name: client.name,
      contact: { ...emptyContact, ...client.contact },
      fields: client.fields.map(f => ({ ...emptyField, ...f })),
    });
    setEditIndex(idx);
    setShowModal(true);
    setErrors({});
  };

  const openClientModal = (idx) => {
    setModalClientIdx(idx);
    setSelectedTab('datos');
    setModalOpen(true);
  };
  const closeClientModal = () => {
    setModalOpen(false);
    setModalClientIdx(null);
  };
  const selectedClient = modalClientIdx !== null ? clients[modalClientIdx] : null;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
        <button
          onClick={openNewModal}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </button>
      </div>

      {/* Grid de clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((client, idx) => (
          <button
            key={client.id}
            onClick={() => openClientModal(idx)}
            className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-primary-500 hover:shadow-md transition-all text-center"
          >
            <h3 className="text-lg font-medium text-gray-900">{client.name}</h3>
          </button>
        ))}
      </div>

      {/* Modal de cliente */}
      {modalOpen && modalClientIdx !== null && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white">
                {/* Header del modal */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    {clients[modalClientIdx].name}
                  </h3>
                  <button
                    onClick={closeClientModal}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Selector de campos */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex space-x-2 overflow-x-auto">
                    {clients[modalClientIdx].fields.map((field) => (
                      <button
                        key={field.id}
                        onClick={() => setSelectedField(field.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                          selectedField === field.id
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {field.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tabs */}
                <div className="px-6 border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    {tabList.map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setSelectedTab(tab.key)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                          selectedTab === tab.key
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Contenido de las tabs */}
                <div className="px-6 py-4">
                  {selectedTab === 'datos' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-lg font-medium text-gray-900">Datos del Cliente</h4>
                        <button
                          onClick={() => openEditModal(modalClientIdx)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Editar
                        </button>
                      </div>
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Contacto</dt>
                          <dd className="mt-1 text-sm text-gray-900">{clients[modalClientIdx].contact.name}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Email</dt>
                          <dd className="mt-1 text-sm text-gray-900">{clients[modalClientIdx].contact.email}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
                          <dd className="mt-1 text-sm text-gray-900">{clients[modalClientIdx].contact.phone}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">RUT</dt>
                          <dd className="mt-1 text-sm text-gray-900">{clients[modalClientIdx].contact.rut}</dd>
                        </div>
                        {clients[modalClientIdx].contact.notes && (
                          <div className="col-span-2">
                            <dt className="text-sm font-medium text-gray-500">Notas</dt>
                            <dd className="mt-1 text-sm text-gray-900">{clients[modalClientIdx].contact.notes}</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  )}

                  {selectedTab === 'campos' && (
                    <div className="space-y-4">
                      {clients[modalClientIdx].fields.map((field) => (
                        <div
                          key={field.id}
                          className="p-4 bg-gray-50 rounded-lg"
                        >
                          <h5 className="font-medium text-gray-900">{field.name}</h5>
                          <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Ubicación</dt>
                              <dd className="text-sm text-gray-900">{field.location}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Hectáreas</dt>
                              <dd className="text-sm text-gray-900">{field.hectares}</dd>
                            </div>
                            {field.description && (
                              <div className="col-span-2">
                                <dt className="text-sm font-medium text-gray-500">Descripción</dt>
                                <dd className="text-sm text-gray-900">{field.description}</dd>
                              </div>
                            )}
                          </dl>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedTab === 'vuelos' && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campo</th>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operador</th>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inicio</th>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fin</th>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {fakeFlights
                            .filter(flight => clients[modalClientIdx].fields.some(field => field.id === flight.fieldId))
                            .map((flight) => (
                              <tr key={flight.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {clients[modalClientIdx].fields.find(f => f.id === flight.fieldId)?.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{flight.operator}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {new Date(flight.startTime).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {flight.endTime ? new Date(flight.endTime).toLocaleString() : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    flight.status === 'COMPLETED'
                                      ? 'bg-green-100 text-green-800'
                                      : flight.status === 'ACTIVE'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {flight.status === 'COMPLETED' ? 'Completado' : flight.status === 'ACTIVE' ? 'Activo' : flight.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {selectedTab === 'evidencia' && (
                    <div className="space-y-4">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                              <th className="px-6 py-3 bg-gray-50"></th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {fakeEvidence
                              .filter(ev => ev.clientId === clients[modalClientIdx].id)
                              .map((evidence) => (
                                <tr
                                  key={evidence.id}
                                  className="cursor-pointer hover:bg-gray-50"
                                  onClick={() => setModalEvidence(evidence)}
                                >
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {new Date(evidence.date).toLocaleString()}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{evidence.type}</td>
                                  <td className="px-6 py-4 text-sm text-gray-900">{evidence.description}</td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      evidence.status === 'Resuelta'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {evidence.status}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Aquí iría la lógica de descarga
                                      }}
                                      className="text-primary-600 hover:text-primary-900"
                                    >
                                      <Download className="h-5 w-5" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de evidencia */}
      {modalEvidence && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
              <div className="bg-white">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Detalle de Evidencia</h3>
                  <button
                    onClick={() => setModalEvidence(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                  {/* Lado izquierdo - Preview */}
                  <div className="space-y-4">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                      {modalEvidence.type === 'Video' ? (
                        <video
                          src={modalEvidence.file}
                          controls
                          className="object-contain w-full h-full"
                        />
                      ) : (
                        <img
                          src={modalEvidence.thumbnail}
                          alt={modalEvidence.description}
                          className="object-contain w-full h-full"
                        />
                      )}
                    </div>
                    <button
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar {modalEvidence.type}
                    </button>
                  </div>

                  {/* Lado derecho - Metadata */}
                  <div className="space-y-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div className="col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Descripción</dt>
                        <dd className="mt-1 text-sm text-gray-900">{modalEvidence.description}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Fecha</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {new Date(modalEvidence.date).toLocaleString()}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Estado</dt>
                        <dd className="mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            modalEvidence.status === 'Resuelta'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {modalEvidence.status}
                          </span>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Campo</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {clients[modalClientIdx].fields.find(f => f.id === modalEvidence.fieldId)?.name}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Operador</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {fakeOperators.find(op => op.id === modalEvidence.operatorId)?.name}
                        </dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Ubicación</dt>
                        <dd className="mt-1 text-sm text-gray-900">{modalEvidence.location}</dd>
                      </div>
                      {modalEvidence.measures.length > 0 && (
                        <div className="col-span-2">
                          <dt className="text-sm font-medium text-gray-500">Medidas Tomadas</dt>
                          <dd className="mt-1">
                            <ul className="space-y-1">
                              {modalEvidence.measures.map((measure, idx) => (
                                <li key={idx} className="text-sm text-gray-900">• {measure}</li>
                              ))}
                            </ul>
                          </dd>
                        </div>
                      )}
                      {modalEvidence.notes && (
                        <div className="col-span-2">
                          <dt className="text-sm font-medium text-gray-500">Notas</dt>
                          <dd className="mt-1 text-sm text-gray-900">{modalEvidence.notes}</dd>
                        </div>
                      )}
                      <div className="col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Historial</dt>
                        <dd className="mt-1">
                          <ul className="space-y-2">
                            {modalEvidence.history.map((item, idx) => (
                              <li key={idx} className="text-sm">
                                <span className="text-gray-900">{item.action}</span>
                                <span className="text-gray-500"> por </span>
                                <span className="text-gray-900">{item.by}</span>
                                <span className="text-gray-500"> el </span>
                                <span className="text-gray-900">{new Date(item.date).toLocaleString()}</span>
                              </li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edición/creación */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg">
              <div className="bg-white">
                <h3 className="text-lg font-bold mb-4">{editIndex !== null ? 'Editar cliente' : 'Agregar nuevo cliente y campos'}</h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="block font-medium mb-1">Nombre del cliente <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleFormChange}
                      className={`form-input w-full border-gray-300 rounded ${errors.name ? 'border-red-500' : ''}`}
                      required
                      autoFocus
                    />
                    {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                  </div>
                  <div className="mb-3">
                    <label className="block font-medium mb-1">Datos de contacto (opcionales)</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Nombre del responsable"
                      value={form.contact.name}
                      onChange={handleContactChange}
                      className="form-input w-full border-gray-300 rounded mb-1"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={form.contact.email}
                      onChange={handleContactChange}
                      className={`form-input w-full border-gray-300 rounded mb-1 ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Teléfono (Ej: +56 9 1234 5678)"
                      value={form.contact.phone}
                      onChange={handleContactChange}
                      onBlur={handleContactPhoneBlur}
                      className={`form-input w-full border-gray-300 rounded mb-1 ${errors.phone ? 'border-red-500' : ''}`}
                      pattern="^\+?\d{8,15}$"
                    />
                    {errors.phone && <div className="text-red-500 text-sm">{errors.phone}</div>}
                    <input
                      type="text"
                      name="rut"
                      placeholder="RUT (Ej: 12.345.678-9)"
                      value={form.contact.rut}
                      onChange={handleContactChange}
                      onBlur={handleContactRutBlur}
                      className={`form-input w-full border-gray-300 rounded mb-1 ${errors.rut ? 'border-red-500' : ''}`}
                    />
                    {errors.rut && <div className="text-red-500 text-sm">{errors.rut}</div>}
                    <textarea
                      name="notes"
                      placeholder="Notas"
                      value={form.contact.notes}
                      onChange={handleContactChange}
                      className="form-input w-full border-gray-300 rounded"
                      rows={2}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block font-medium mb-1">Campos</label>
                    {form.fields.map((field, idx) => (
                      <div key={idx} className="mb-2 p-2 border rounded bg-gray-50">
                        <div className="flex gap-2 mb-1">
                          <input
                            type="text"
                            name="name"
                            placeholder="Nombre del campo"
                            value={field.name}
                            onChange={e => handleFieldChange(idx, e)}
                            className={`form-input w-full border-gray-300 rounded ${errors['field_name_' + idx] ? 'border-red-500' : ''}`}
                            required
                          />
                          <button type="button" className="text-red-500 font-bold" onClick={() => removeField(idx)} disabled={form.fields.length === 1}>×</button>
                        </div>
                        {errors['field_name_' + idx] && <div className="text-red-500 text-sm">{errors['field_name_' + idx]}</div>}
                        <input
                          type="text"
                          name="location"
                          placeholder="Ubicación"
                          value={field.location}
                          onChange={e => handleFieldChange(idx, e)}
                          className={`form-input w-full border-gray-300 rounded mb-1 ${errors['field_location_' + idx] ? 'border-red-500' : ''}`}
                          required
                        />
                        {errors['field_location_' + idx] && <div className="text-red-500 text-sm">{errors['field_location_' + idx]}</div>}
                        <input
                          type="number"
                          name="hectares"
                          placeholder="Hectáreas"
                          value={field.hectares}
                          onChange={e => handleFieldChange(idx, e)}
                          className={`form-input w-full border-gray-300 rounded mb-1 ${errors['field_hectares_' + idx] ? 'border-red-500' : ''}`}
                          required
                          min={1}
                        />
                        {errors['field_hectares_' + idx] && <div className="text-red-500 text-sm">{errors['field_hectares_' + idx]}</div>}
                        <textarea
                          name="description"
                          placeholder="Descripción"
                          value={field.description}
                          onChange={e => handleFieldChange(idx, e)}
                          className="form-input w-full border-gray-300 rounded"
                          rows={2}
                        />
                      </div>
                    ))}
                    <button type="button" className="btn btn-sm btn-secondary mt-2" onClick={addField}>
                      + Agregar otro campo
                    </button>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); setEditIndex(null); }}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Guardar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients; 