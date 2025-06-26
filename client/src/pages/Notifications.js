import React from 'react';
import { Bell, AlertTriangle, CheckCircle } from 'lucide-react';

const notifications = [
  {
    id: 1,
    type: 'alert',
    title: 'Alerta de intrusión',
    description: 'Se detectó movimiento sospechoso en Campo Principal.',
    date: '2024-06-24 08:30',
    read: false
  },
  {
    id: 2,
    type: 'info',
    title: 'Vuelo completado',
    description: 'El patrullaje nocturno finalizó sin novedades.',
    date: '2024-06-23 22:00',
    read: true
  }
];

const iconByType = {
  alert: <AlertTriangle className="text-red-500 w-6 h-6" />,
  info: <CheckCircle className="text-green-500 w-6 h-6" />
};

const Notifications = () => (
  <div className="p-6 max-w-2xl mx-auto">
    <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
      <Bell className="w-7 h-7 text-primary-500" /> Notificaciones y Alertas
    </h1>
    <div className="space-y-4">
      {notifications.map(n => (
        <div key={n.id} className={`flex items-start gap-4 p-4 rounded-lg shadow bg-white border-l-4 ${n.type === 'alert' ? 'border-red-500' : 'border-green-500'} ${n.read ? 'opacity-70' : ''}`}>
          <div>{iconByType[n.type]}</div>
          <div className="flex-1">
            <div className="font-semibold">{n.title}</div>
            <div className="text-sm text-gray-600">{n.description}</div>
            <div className="text-xs text-gray-400 mt-1">{n.date}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Notifications; 