import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';

const Header = ({ onMenuClick, user }) => {
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

        {/* Barra de búsqueda (desktop) */}
        <div className="hidden lg:flex flex-1 max-w-lg ml-8">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar vuelos, evidencia..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
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