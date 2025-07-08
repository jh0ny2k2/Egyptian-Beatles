import React, { useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { Navigate } from 'react-router-dom';
import ProductManagement from './ProductManagement';
import UserManagement from './UserManagement';
import StatsManagement from './StatsManagement';

function Admin() {
  const { user, isLoggedIn } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  if (!isLoggedIn || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <svg className="w-8 h-8 mr-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Panel de Administración
        </h1>

        {/* Navbar superior horizontal */}
        <nav className="bg-gray-200 rounded-md mb-6 overflow-x-auto">
          <div className="flex flex-wrap sm:flex-nowrap">
            {[
              { key: 'dashboard', label: 'Dashboard' },
              { key: 'products', label: 'Productos' },
              { key: 'users', label: 'Usuarios' },
              { key: 'stats', label: 'Estadísticas' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`flex items-center px-5 py-3 text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                  activeSection === key
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:bg-gray-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </nav>

        {/* Contenido principal */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          {activeSection === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Bienvenido al panel de administración</h2>
              <p className="text-gray-600 mb-8">Desde aquí podrás gestionar todos los aspectos de la tienda.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Cards del dashboard... (igual que antes) */}
                {/* Puedes dejar los mismos tres bloques de tarjetas que ya tienes para Productos, Usuarios y Estadísticas */}
              </div>
            </div>
          )}

          {activeSection === 'products' && <ProductManagement />}
          {activeSection === 'users' && <UserManagement />}
          {activeSection === 'stats' && <StatsManagement />}
        </div>
      </div>
    </div>
  );
}

export default Admin;
