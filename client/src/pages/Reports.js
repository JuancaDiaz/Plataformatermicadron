import React from 'react';
import { BarChart2, Download } from 'lucide-react';

const Reports = () => (
  <div className="p-6 max-w-2xl mx-auto">
    <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
      <BarChart2 className="w-7 h-7 text-primary-500" /> Reportes y Estadísticas
    </h1>
    <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
      <p className="mb-4">Descarga reportes mensuales de actividad, vuelos y evidencias.</p>
      <button className="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600">
        <Download className="w-5 h-5" /> Descargar reporte de junio 2024
      </button>
    </div>
  </div>
);

export default Reports; 