import React, { useState, useRef } from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Datos inventados para búsqueda global (importar o copiar desde las páginas)
const clients = [
  { id: 'cliente1', name: 'AgroTrigal Ltda.', type: 'Cliente' },
  { id: 'cliente2', name: 'Viñas del Sur', type: 'Cliente' },
];
const fields = [
  { id: 'campo1', name: 'Campo El Trigal', clientId: 'cliente1', type: 'Campo' },
  { id: 'campo2', name: 'Fundo Santa Rosa', clientId: 'cliente2', type: 'Campo' },
];
const operators = [
  { id: 'op1', name: 'Juan Pérez', email: 'juan.perez@termicadron.cl', type: 'Operador' },
  { id: 'op2', name: 'María González', email: 'maria.gonzalez@termicadron.cl', type: 'Operador' },
  { id: 'op3', name: 'Pedro Soto', email: 'pedro.soto@termicadron.cl', type: 'Operador' },
];
const flights = [
  { id: 'vuelo1', fieldId: 'campo1', operator: 'Juan Pérez', type: 'Vuelo', notes: 'Patrullaje sin novedades.' },
  { id: 'vuelo2', fieldId: 'campo1', operator: 'María González', type: 'Vuelo', notes: 'Vuelo en curso.' },
  { id: 'vuelo3', fieldId: 'campo2', operator: 'Pedro Soto', type: 'Vuelo', notes: 'Revisión de frutales.' },
];
const evidence = [
  { id: 'ev1', fieldId: 'campo1', clientId: 'cliente1', type: 'Evidencia', description: 'Imagen térmica nocturna' },
  { id: 'ev2', fieldId: 'campo2', clientId: 'cliente2', type: 'Evidencia', description: 'Video de patrullaje' },
  { id: 'ev3', fieldId: 'campo1', clientId: 'cliente1', type: 'Evidencia', description: 'Foto de patrullaje diurno' },
];

const allData = [
  ...clients,
  ...fields,
  ...operators,
  ...flights,
  ...evidence,
];

const groupByType = (results) => {
  return results.reduce((acc, item) => {
    acc[item.type] = acc[item.type] || [];
    acc[item.type].push(item);
    return acc;
  }, {});
};

const Header = ({ onMenuClick, user }) => {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Buscar por nombre, email, descripción, notas, etc.
  const searchResults = query.trim()
    ? allData.filter(item => {
        const text = [item.name, item.email, item.description, item.notes, item.operator]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return text.includes(query.toLowerCase());
      })
    : [];
  const grouped = groupByType(searchResults);

  // Navegación según tipo
  const handleResultClick = (item) => {
    setShowDropdown(false);
    setQuery('');
    if (item.type === 'Cliente') navigate(`/clients`); // Mantener en /clients ya que ahora usamos modal
    if (item.type === 'Campo') navigate(`/fields/${item.id}`);
    if (item.type === 'Operador') navigate(`/users`); // Mantener en /users ya que ahora usamos modal
    if (item.type === 'Vuelo') navigate(`/flights`);
    if (item.type === 'Evidencia') navigate(`/evidence`);
  };

  // Cerrar dropdown al hacer click fuera
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Botón de menú móvil */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Título en móvil */}
        <div className="lg:hidden">
          <h1 className="text-lg font-semibold text-gray-900">Térmica Drones</h1>
        </div>

        {/* Barra de búsqueda global (siempre visible) */}
        <div className="flex flex-1 max-w-lg ml-4 lg:ml-8 relative" ref={inputRef}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Buscar clientes, campos, operadores, vuelos, evidencia..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 relative z-20"
          />
          {/* Dropdown de resultados */}
          {showDropdown && query.trim() && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-t-0 border-gray-200 rounded-b-lg shadow-lg max-h-80 overflow-auto left-0 top-full">
              {Object.keys(grouped).length === 0 && (
                <div className="p-4 text-gray-500 text-center">Sin resultados</div>
              )}
              {Object.entries(grouped).map(([type, items]) => (
                <div key={type}>
                  <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">{type}</div>
                  {items.map(item => (
                    <button
                      key={item.id}
                      className="flex w-full items-center px-4 py-2 hover:bg-blue-50 transition text-left"
                      onClick={() => handleResultClick(item)}
                    >
                      <span className="mr-3">
                        {/* Icono según tipo */}
                        {type === 'Cliente' && <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2" />}
                        {type === 'Campo' && <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full mr-2" />}
                        {type === 'Operador' && <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2" />}
                        {type === 'Vuelo' && <span className="inline-block w-2 h-2 bg-purple-400 rounded-full mr-2" />}
                        {type === 'Evidencia' && <span className="inline-block w-2 h-2 bg-pink-400 rounded-full mr-2" />}
                      </span>
                      <span className="font-medium">{item.name || item.description || item.operator}</span>
                      <span className="ml-2 text-xs text-gray-500 truncate">
                        {item.email || item.notes || item.clientId || item.fieldId || ''}
                      </span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Acciones del header */}
        <div className="flex items-center space-x-4">
          {/* Notificaciones */}
          <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg relative">
            <Bell className="h-6 w-6" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
          </button>

          {/* Información del usuario (desktop) */}
          <div className="hidden lg:flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role?.toLowerCase()}
              </p>
            </div>
            <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-700">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 