import React, { useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { Navigate } from 'react-router-dom';
import ProductManagement from './ProductManagement';
import UserManagement from './UserManagement';
import StatsManagement from './StatsManagement';
import OrderManagement from './OrderManagement';

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
              { key: 'orders', label: 'Pedidos' },
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div 
                  onClick={() => setActiveSection('orders')}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Pedidos</h3>
                      <p className="text-blue-100">Gestionar pedidos</p>
                    </div>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                
                <div 
                  onClick={() => setActiveSection('products')}
                  className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white cursor-pointer hover:from-green-600 hover:to-green-700 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Productos</h3>
                      <p className="text-green-100">Gestionar inventario</p>
                    </div>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                </div>
                
                <div 
                  onClick={() => setActiveSection('users')}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white cursor-pointer hover:from-purple-600 hover:to-purple-700 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Usuarios</h3>
                      <p className="text-purple-100">Gestionar clientes</p>
                    </div>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                </div>
                
                <div 
                  onClick={() => setActiveSection('stats')}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg text-white cursor-pointer hover:from-orange-600 hover:to-orange-700 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Estadísticas</h3>
                      <p className="text-orange-100">Ver métricas</p>
                    </div>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'orders' && <OrderManagement />}
          {activeSection === 'products' && <ProductManagement />}
          {activeSection === 'users' && <UserManagement />}
          {activeSection === 'stats' && <StatsManagement />}
        </div>
      </div>
    </div>
  );
}

export default Admin;
