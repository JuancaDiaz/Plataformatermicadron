import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const fakeFields = [
  { id: 'campo1', name: 'Campo El Trigal' },
  { id: 'campo2', name: 'Fundo Santa Rosa' },
];

const fakeOperators = [
  {
    id: 'op1',
    name: 'Juan Pérez',
    email: 'juan.perez@termicadron.cl',
    phone: '+56 9 1234 5678',
    rut: '12.345.678-9',
    role: 'Operador de Dron',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    fields: [fakeFields[0]],
    flights: [
      {
        id: 'vuelo1',
        field: fakeFields[0],
        startTime: '2024-06-23T20:00:00',
        endTime: '2024-06-23T22:00:00',
        status: 'COMPLETED',
        notes: 'Patrullaje sin novedades.'
      },
      {
        id: 'vuelo2',
        field: fakeFields[0],
        startTime: '2024-06-22T21:00:00',
        endTime: null,
        status: 'ACTIVE',
        notes: 'Vuelo en curso.'
      }
    ]
  },
  {
    id: 'op2',
    name: 'María González',
    email: 'maria.gonzalez@termicadron.cl',
    phone: '+56 9 8765 4321',
    rut: '23.456.789-0',
    role: 'Operadora de Dron',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    fields: [fakeFields[0]],
    flights: [
      {
        id: 'vuelo2',
        field: fakeFields[0],
        startTime: '2024-06-22T21:00:00',
        endTime: null,
        status: 'ACTIVE',
        notes: 'Vuelo en curso.'
      }
    ]
  },
  {
    id: 'op3',
    name: 'Pedro Soto',
    email: 'pedro.soto@termicadron.cl',
    phone: '+56 9 1122 3344',
    rut: '11.223.344-5',
    role: 'Operador de Dron',
    photo: 'https://randomuser.me/api/portraits/men/65.jpg',
    fields: [fakeFields[1]],
    flights: [
      {
        id: 'vuelo3',
        field: fakeFields[1],
        startTime: '2024-06-21T19:00:00',
        endTime: '2024-06-21T20:30:00',
        status: 'COMPLETED',
        notes: 'Revisión de frutales.'
      }
    ]
  },
];

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const operatorData = fakeOperators.find(op => op.id === id);
  const [operator, setOperator] = useState(operatorData);
  const [showModal, setShowModal] = useState(false);
  const [selectedFields, setSelectedFields] = useState(operator.fields.map(f => f.id));
  // Estado de check-in/out por campo (objeto: { campoId: true/false })
  const [checkInStatus, setCheckInStatus] = useState(() => {
    const status = {};
    operator.fields.forEach(f => { status[f.id] = false; });
    return status;
  });
  // Estado para modal de registrar vuelo
  const [showFlightModal, setShowFlightModal] = useState(null); // campoId o null
  const [flightForm, setFlightForm] = useState({
    startTime: '',
    endTime: '',
    status: 'COMPLETED',
    notes: '',
  });

  if (!operator) {
    return <div className="text-red-500">Operador no encontrado</div>;
  }

  const handleFieldChange = (fieldId) => {
    setSelectedFields((prev) =>
      prev.includes(fieldId)
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const handleSaveFields = () => {
    const newFields = fakeFields.filter(f => selectedFields.includes(f.id));
    setOperator({ ...operator, fields: newFields });
    // Actualizar estado de check-in para nuevos campos
    setCheckInStatus(prev => {
      const updated = { ...prev };
      newFields.forEach(f => { if (!(f.id in updated)) updated[f.id] = false; });
      Object.keys(updated).forEach(fid => {
        if (!newFields.find(f => f.id === fid)) delete updated[fid];
      });
      return updated;
    });
    setShowModal(false);
  };

  const handleCheckIn = (fieldId) => {
    setCheckInStatus(prev => ({ ...prev, [fieldId]: true }));
  };
  const handleCheckOut = (fieldId) => {
    setCheckInStatus(prev => ({ ...prev, [fieldId]: false }));
  };

  // Modal para registrar vuelo
  const openFlightModal = (fieldId) => {
    setShowFlightModal(fieldId);
    setFlightForm({
      startTime: '',
      endTime: '',
      status: 'COMPLETED',
      notes: '',
    });
  };
  const closeFlightModal = () => setShowFlightModal(null);
  const handleFlightFormChange = (e) => {
    const { name, value } = e.target;
    setFlightForm(f => ({ ...f, [name]: value }));
  };
  const handleFlightSubmit = (e) => {
    e.preventDefault();
    const field = operator.fields.find(f => f.id === showFlightModal);
    const newFlight = {
      id: 'vuelo' + (operator.flights.length + 1),
      field,
      startTime: flightForm.startTime,
      endTime: flightForm.endTime,
      status: flightForm.status,
      notes: flightForm.notes,
    };
    setOperator(op => ({ ...op, flights: [...op.flights, newFlight] }));
    setShowFlightModal(null);
  };

  return (
    <div>
      <button
        className="mb-4 flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition font-semibold shadow-sm"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-5 h-5" />
        Volver
      </button>
      <div className="flex items-center mb-4">
        <img
          src={operator.photo}
          alt={operator.name}
          className="w-24 h-24 rounded-full object-cover border-2 border-blue-200 mr-6"
        />
        <div>
          <h1 className="text-2xl font-bold mb-1">{operator.name}</h1>
          <p className="text-gray-700 mb-1"><strong>Email:</strong> {operator.email}</p>
          <p className="text-gray-700 mb-1"><strong>Teléfono:</strong> {operator.phone}</p>
          <p className="text-gray-700 mb-1"><strong>RUT:</strong> {operator.rut}</p>
          <p className="text-gray-700 mb-1"><strong>Cargo:</strong> {operator.role}</p>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="block text-gray-700"><strong>Campos asignados:</strong></span>
          <button
            className="btn btn-sm btn-primary ml-2"
            onClick={() => setShowModal(true)}
          >
            Asignar campos
          </button>
        </div>
        {operator.fields.map(f => (
          <div key={f.id} className="flex items-center mb-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 mb-1">{f.name}</span>
            {checkInStatus[f.id] ? (
              <>
                <button
                  className="btn btn-xs btn-secondary mr-2"
                  onClick={() => handleCheckOut(f.id)}
                >
                  Check-out
                </button>
                <button
                  className="btn btn-xs btn-primary"
                  onClick={() => openFlightModal(f.id)}
                >
                  Registrar vuelo
                </button>
                <span className="ml-2 text-green-600 font-semibold">En campo</span>
              </>
            ) : (
              <button
                className="btn btn-xs btn-primary"
                onClick={() => handleCheckIn(f.id)}
              >
                Check-in
              </button>
            )}
          </div>
        ))}
      </div>
      {/* Modal de asignación de campos */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <h3 className="text-lg font-bold mb-4">Asignar campos a {operator.name}</h3>
            <div className="mb-4">
              {fakeFields.map(field => (
                <label key={field.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectedFields.includes(field.id)}
                    onChange={() => handleFieldChange(field.id)}
                    className="form-checkbox h-5 w-5 text-blue-600 mr-2"
                  />
                  <span>{field.name}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSaveFields}
              >
                Guardar
              </button>
            </div>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setShowModal(false)}
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>
        </div>
      )}
      {/* Modal para registrar vuelo */}
      {showFlightModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <h3 className="text-lg font-bold mb-4">Registrar vuelo en {operator.fields.find(f => f.id === showFlightModal)?.name}</h3>
            <form onSubmit={handleFlightSubmit}>
              <div className="mb-2">
                <label className="block font-medium mb-1">Inicio</label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={flightForm.startTime}
                  onChange={handleFlightFormChange}
                  className="form-input w-full border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block font-medium mb-1">Fin</label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={flightForm.endTime}
                  onChange={handleFlightFormChange}
                  className="form-input w-full border-gray-300 rounded"
                />
              </div>
              <div className="mb-2">
                <label className="block font-medium mb-1">Estado</label>
                <select
                  name="status"
                  value={flightForm.status}
                  onChange={handleFlightFormChange}
                  className="form-select w-full border-gray-300 rounded"
                >
                  <option value="COMPLETED">Completado</option>
                  <option value="ACTIVE">En curso</option>
                  <option value="CANCELLED">Cancelado</option>
                </select>
              </div>
              <div className="mb-2">
                <label className="block font-medium mb-1">Notas</label>
                <textarea
                  name="notes"
                  value={flightForm.notes}
                  onChange={handleFlightFormChange}
                  className="form-input w-full border-gray-300 rounded"
                  rows={2}
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeFlightModal}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Guardar vuelo
                </button>
              </div>
            </form>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={closeFlightModal}
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>
        </div>
      )}
      <h2 className="text-lg font-semibold mb-2">Vuelos realizados</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Campo</th>
              <th className="px-4 py-2 border-b">Inicio</th>
              <th className="px-4 py-2 border-b">Fin</th>
              <th className="px-4 py-2 border-b">Estado</th>
              <th className="px-4 py-2 border-b">Notas</th>
            </tr>
          </thead>
          <tbody>
            {operator.flights.length === 0 ? (
              <tr><td colSpan={5} className="text-center text-gray-400 py-2">Sin vuelos registrados</td></tr>
            ) : operator.flights.map((flight) => (
              <tr key={flight.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{flight.field.name}</td>
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
  );
};

export default UserDetail; 