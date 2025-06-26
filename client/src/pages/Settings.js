import React, { useState } from 'react';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Configuración</h1>
      <div className="max-w-lg bg-white border border-gray-200 rounded-lg p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-medium">Notificaciones por email</span>
          <input type="checkbox" checked={notifications} onChange={() => setNotifications(n => !n)} className="form-checkbox h-5 w-5 text-blue-600" />
        </div>
        <div className="mb-4 flex items-center justify-between">
          <span className="font-medium">Modo oscuro</span>
          <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(d => !d)} className="form-checkbox h-5 w-5 text-blue-600" />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Zona horaria</label>
          <select className="form-select w-full border-gray-300 rounded">
            <option>America/Santiago</option>
            <option>America/Argentina/Buenos_Aires</option>
            <option>UTC</option>
          </select>
        </div>
        <button className="btn btn-primary mt-2">Guardar cambios</button>
      </div>
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Alertas por WhatsApp/Email</h2>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="form-checkbox" disabled />
            WhatsApp (próximamente)
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="form-checkbox" disabled />
            Email (próximamente)
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-2">Recibe alertas críticas directamente en tu WhatsApp o correo electrónico. Disponible próximamente.</p>
      </div>
    </div>
  );
};

export default Settings; 