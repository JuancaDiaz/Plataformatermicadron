import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const fakeFields = [
  { id: 'campo1', name: 'Campo El Trigal' },
  { id: 'campo2', name: 'Fundo Santa Rosa' },
];

const initialOperators = [
  {
    id: 'op1',
    name: 'Juan Pérez',
    email: 'juan.perez@termicadron.cl',
    phone: '+56 9 1234 5678',
    rut: '12.345.678-9',
    role: 'Operador de Dron',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    fields: [fakeFields[0]],
    flights: 2,
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
    flights: 1,
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
    flights: 1,
  },
];

const emptyOperator = {
  name: '', email: '', phone: '', rut: '', role: '', photo: '', fields: [], flights: 0
};

const Users = () => {
  const navigate = useNavigate();
  const [operators, setOperators] = useState(initialOperators);
  const [showModal, setShowModal] = useState(false);
  const [editIdx, setEditIdx] = useState(null); // null = nuevo
  const [form, setForm] = useState({ ...emptyOperator });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [viewIdx, setViewIdx] = useState(null); // índice del operador a mostrar en modal de vista

  const openNewModal = () => {
    setForm({ ...emptyOperator });
    setEditIdx(null);
    setShowModal(true);
  };
  const openEditModal = (idx) => {
    setForm({ ...operators[idx], fields: operators[idx].fields.map(f => f.id) });
    setEditIdx(idx);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditIdx(null);
    setForm({ ...emptyOperator });
  };
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };
  const handleFieldToggle = (fieldId) => {
    setForm(f => ({
      ...f,
      fields: f.fields.includes(fieldId)
        ? f.fields.filter(id => id !== fieldId)
        : [...f.fields, fieldId]
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedFields = fakeFields.filter(f => form.fields.includes(f.id));
    if (editIdx !== null) {
      const updated = [...operators];
      updated[editIdx] = { ...form, fields: selectedFields };
      setOperators(updated);
    } else {
      setOperators([...operators, { ...form, id: 'op' + (operators.length + 1), fields: selectedFields }]);
    }
    closeModal();
  };
  const handleDelete = (idx) => {
    setOperators(ops => ops.filter((_, i) => i !== idx));
    setConfirmDelete(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Operadores</h1>
        <button className="btn btn-primary" onClick={openNewModal}>Agregar operador</button>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {operators.map((op, idx) => (
          <div key={op.id} className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow flex items-center relative cursor-pointer hover:bg-blue-50 transition"
            onClick={() => setViewIdx(idx)}
          >
            <img
              src={op.photo}
              alt={op.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-200 mr-4"
            />
            <div className="flex-1">
              <span className="block text-lg font-semibold mb-1">{op.name}</span>
              <span className="block text-gray-700 mb-1">{op.email}</span>
              <span className="block text-sm text-gray-600">
                <strong>Campos asignados:</strong> {op.fields.map(f => f.name || fakeFields.find(ff => ff.id === f)?.name).join(', ')}
              </span>
            </div>
          </div>
        ))}
      </div>
      {/* Modal ver operador */}
      {viewIdx !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setViewIdx(null)}
              aria-label="Cerrar"
            >
              ×
            </button>
            <div className="flex items-center mb-4">
              <img
                src={operators[viewIdx].photo}
                alt={operators[viewIdx].name}
                className="w-20 h-20 rounded-full object-cover border-2 border-blue-200 mr-6"
              />
              <div>
                <h2 className="text-xl font-bold mb-1">{operators[viewIdx].name}</h2>
                <p className="text-gray-700 mb-1"><strong>Email:</strong> {operators[viewIdx].email}</p>
                <p className="text-gray-700 mb-1"><strong>Teléfono:</strong> {operators[viewIdx].phone}</p>
                <p className="text-gray-700 mb-1"><strong>RUT:</strong> {operators[viewIdx].rut}</p>
                <p className="text-gray-700 mb-1"><strong>Rol:</strong> {operators[viewIdx].role}</p>
              </div>
            </div>
            <div className="mb-4">
              <span className="block text-gray-700 font-semibold mb-1">Campos asignados:</span>
              <div className="flex flex-wrap gap-2 mb-2">
                {operators[viewIdx].fields.map(f => (
                  <span key={f.id || f} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {f.name || fakeFields.find(ff => ff.id === f)?.name}
                  </span>
                ))}
              </div>
              {/* Asignar/quitar campos */}
              <div className="mt-2">
                <span className="block text-xs text-gray-500 mb-1">Editar asignación de campos:</span>
                <div className="flex flex-wrap gap-3">
                  {fakeFields.map(field => (
                    <label key={field.id} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={operators[viewIdx].fields.some(f => (f.id || f) === field.id)}
                        onChange={e => {
                          const updated = [...operators];
                          if (e.target.checked) {
                            updated[viewIdx].fields = [...updated[viewIdx].fields, field];
                          } else {
                            updated[viewIdx].fields = updated[viewIdx].fields.filter(f => (f.id || f) !== field.id);
                          }
                          setOperators(updated);
                        }}
                      />
                      <span className="text-xs">{field.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button className="btn btn-secondary" onClick={() => { setForm({ ...operators[viewIdx], fields: operators[viewIdx].fields.map(f => f.id) }); setEditIdx(viewIdx); setShowModal(true); setViewIdx(null); }}>
                Editar información
              </button>
              <button className="btn btn-danger" onClick={() => setConfirmDelete(viewIdx)}>
                Eliminar operador
              </button>
            </div>
            {/* Confirmación de borrado en el modal */}
            {confirmDelete === viewIdx && (
              <div className="absolute top-10 right-10 bg-white border border-red-300 rounded shadow p-4 z-50">
                <div className="mb-2 text-sm">¿Eliminar operador?</div>
                <div className="flex gap-2">
                  <button className="btn btn-xs btn-danger" onClick={() => { handleDelete(viewIdx); setViewIdx(null); }}>
                    Sí, eliminar
                  </button>
                  <button className="btn btn-xs" onClick={() => setConfirmDelete(null)}>Cancelar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Modal agregar/editar operador */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={closeModal}
              aria-label="Cerrar"
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-4">{editIdx !== null ? 'Editar operador' : 'Agregar operador'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  className="form-input w-full border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleFormChange}
                  className="form-input w-full border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block font-medium mb-1">Teléfono</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleFormChange}
                  className="form-input w-full border-gray-300 rounded"
                />
              </div>
              <div className="mb-3">
                <label className="block font-medium mb-1">RUT</label>
                <input
                  type="text"
                  name="rut"
                  value={form.rut}
                  onChange={handleFormChange}
                  className="form-input w-full border-gray-300 rounded"
                />
              </div>
              <div className="mb-3">
                <label className="block font-medium mb-1">Rol</label>
                <input
                  type="text"
                  name="role"
                  value={form.role}
                  onChange={handleFormChange}
                  className="form-input w-full border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block font-medium mb-1">Foto (URL)</label>
                <input
                  type="text"
                  name="photo"
                  value={form.photo}
                  onChange={handleFormChange}
                  className="form-input w-full border-gray-300 rounded"
                />
              </div>
              <div className="mb-3">
                <label className="block font-medium mb-1">Campos asignados</label>
                <div className="flex flex-wrap gap-2">
                  {fakeFields.map(field => (
                    <label key={field.id} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={form.fields.includes(field.id)}
                        onChange={() => handleFieldToggle(field.id)}
                      />
                      <span className="text-xs">{field.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users; 